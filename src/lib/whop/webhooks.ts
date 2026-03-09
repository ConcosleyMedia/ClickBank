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
 * Whop may use "action" or "event" for the event type
 */
export function parseWebhookPayload(body: string): WhopWebhookPayload | null {
  try {
    const parsed = JSON.parse(body)

    // Whop uses "action" field, not "event"
    const eventType = parsed.action || parsed.event || parsed.type

    // Data might be at top level or in a "data" field
    const data = parsed.data || parsed

    return {
      id: parsed.id || crypto.randomUUID(),
      event: eventType as WhopEventType,
      data: {
        membershipId: data.membership_id || data.id || data.membershipId,
        userId: data.user_id || data.userId,
        email: data.email || data.user?.email,
        planId: data.plan_id || data.planId,
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
        user: data.user,
        name: data.user?.name || data.name,
        username: data.user?.username || data.username,
      },
      created_at: parsed.created_at || new Date().toISOString(),
    }
  } catch (e) {
    console.error('parseWebhookPayload error:', e)
    return null
  }
}

/**
 * Handle membership activation (shared logic)
 */
async function handleMembershipActive(data: WhopWebhookPayload['data']): Promise<{ success: boolean }> {
  console.log('Processing membership activation:', JSON.stringify(data, null, 2))

  try {
    const supabase = await createClient()
    const email = data.email || data.user?.email
    const membershipId = data.membershipId
    const fullName = data.name || data.user?.name || data.username || data.user?.username || null

    // Extract session_id from metadata (passed via checkout URL d[session_id]=xxx)
    // Whop may nest it differently depending on webhook version
    const metadata = data.metadata as Record<string, unknown> | undefined
    const sessionId = (
      metadata?.session_id ||
      (metadata?.d as Record<string, unknown>)?.session_id ||
      null
    ) as string | null

    console.log('Extracted - Email:', email, 'MembershipId:', membershipId, 'Name:', fullName, 'SessionId:', sessionId)

    if (!email && !sessionId) {
      console.error('No email or session_id found in membership data')
      return { success: false }
    }

    // If we have a session_id, update by session_id (most reliable)
    if (sessionId) {
      const { error: sessionError } = await supabase
        .from('profiles')
        .update({
          whop_email: email,
          full_name: fullName,
          whop_membership_id: membershipId,
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId)

      if (!sessionError) {
        console.log('Profile updated by session_id:', sessionId)
        return { success: true }
      }
      console.log('No profile found with session_id, falling back to email')
    }

    // Fallback: Create or update profile by email
    if (email) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          email,
          full_name: fullName,
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

      console.log('Profile saved successfully for:', email)
      return { success: true }
    }

    return { success: false }
  } catch (error) {
    console.error('handleMembershipActive error:', error)
    return { success: false }
  }
}

/**
 * Event handlers for different webhook types
 * Whop uses various event names - we handle all variations
 */
export const webhookHandlers: Record<string, (data: WhopWebhookPayload['data']) => Promise<{ success: boolean }>> = {
  // Membership activation events
  'membership.went_valid': (data) => handleMembershipActive(data),
  'membership.activated': (data) => handleMembershipActive(data),
  'membership.created': (data) => handleMembershipActive(data),
  'membership_went_valid': (data) => handleMembershipActive(data),

  // Payment events - also activate membership
  'payment.succeeded': (data) => handleMembershipActive(data),
  'payment_succeeded': (data) => handleMembershipActive(data),

  // Membership deactivation
  'membership.went_invalid': async (data) => {
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
      console.error('membership.went_invalid error:', error)
      return { success: false }
    }
  },

  'payment.failed': async (data) => {
    console.log('Payment failed:', data)
    return { success: true }
  },
}
