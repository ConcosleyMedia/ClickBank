import { createHmac, timingSafeEqual, randomBytes } from 'crypto'
import type { WhopWebhookPayload, WhopEventType } from '@/types'
import { createClient } from '@/lib/supabase/server'
import { sendMagicLink } from '@/lib/email/send'

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
 * Generate a secure magic link token
 */
function generateMagicToken(): string {
  return randomBytes(32).toString('hex')
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

    console.log('Extracted - Email:', email, 'MembershipId:', membershipId, 'Name:', fullName)

    if (!email) {
      console.error('No email found in membership data')
      return { success: false }
    }

    // Generate magic link token
    const magicToken = generateMagicToken()
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

    // Create or update profile with magic token
    const { error } = await supabase
      .from('profiles')
      .upsert({
        email,
        full_name: fullName,
        whop_membership_id: membershipId,
        subscription_status: 'active',
        subscription_started_at: new Date().toISOString(),
        magic_token: magicToken,
        magic_token_expires_at: tokenExpiresAt,
      }, {
        onConflict: 'email',
      })

    if (error) {
      console.error('Failed to upsert profile:', error)
      return { success: false }
    }

    console.log('Profile saved successfully for:', email)

    // Send magic link email
    const emailSent = await sendMagicLink({
      to: email,
      token: magicToken,
      name: fullName || undefined,
    })

    if (!emailSent) {
      console.error('Failed to send magic link email')
      // Don't fail the webhook - profile is saved, they can use sign-in page
    }

    return { success: true }
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
