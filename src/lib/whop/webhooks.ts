import { createHmac, timingSafeEqual } from 'crypto'
import type { WhopWebhookPayload, WhopEventType } from '@/types'
import { createClient } from '@/lib/supabase/server'

function getWebhookSecret() {
  return process.env.WHOP_WEBHOOK_SECRET || ''
}

interface WebhookVerificationResult {
  valid: boolean
  error?: string
}

/**
 * Verify Whop webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): WebhookVerificationResult {
  const secret = getWebhookSecret()
  if (!secret) {
    return { valid: false, error: 'Webhook secret not configured' }
  }

  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const signatureBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, error: 'Invalid signature length' }
    }

    const isValid = timingSafeEqual(signatureBuffer, expectedBuffer)
    return { valid: isValid, error: isValid ? undefined : 'Signature mismatch' }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    }
  }
}

/**
 * Parse webhook payload
 */
export function parseWebhookPayload(body: string): WhopWebhookPayload | null {
  try {
    const parsed = JSON.parse(body)
    return {
      id: parsed.id,
      event: parsed.event as WhopEventType,
      data: parsed.data,
      created_at: parsed.created_at,
    }
  } catch {
    return null
  }
}

/**
 * Event handlers for different webhook types
 */
export const webhookHandlers: Record<string, (data: WhopWebhookPayload['data']) => Promise<{ success: boolean }>> = {
  'membership.went_valid': async (data: WhopWebhookPayload['data']) => {
    // Membership is now active (payment succeeded, trial started, etc.)
    console.log('Membership went valid:', data)

    try {
      const supabase = await createClient()
      const email = data.email
      const membershipId = data.membershipId

      if (!email) {
        console.error('No email in membership data')
        return { success: false }
      }

      // Create or update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          email,
          whop_membership_id: membershipId,
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
        }, {
          onConflict: 'email',
        })

      if (error) {
        console.error('Failed to upsert profile:', error)
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      console.error('membership.went_valid handler error:', error)
      return { success: false }
    }
  },

  'membership.went_invalid': async (data: WhopWebhookPayload['data']) => {
    // Membership is no longer active (cancelled, expired, payment failed)
    console.log('Membership went invalid:', data)

    try {
      const supabase = await createClient()
      const membershipId = data.membershipId

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'inactive',
          subscription_ends_at: new Date().toISOString(),
        })
        .eq('whop_membership_id', membershipId)

      if (error) {
        console.error('Failed to update profile:', error)
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      console.error('membership.went_invalid handler error:', error)
      return { success: false }
    }
  },

  'payment.succeeded': async (data: WhopWebhookPayload['data']) => {
    console.log('Payment succeeded:', data)
    // Payment succeeded - membership.went_valid handles the actual access grant
    return { success: true }
  },

  'payment.failed': async (data: WhopWebhookPayload['data']) => {
    console.log('Payment failed:', data)
    return { success: true }
  },
}
