import { createHmac, timingSafeEqual } from 'crypto'
import type { WhopWebhookPayload, WhopEventType } from '@/types'

const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET || ''

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
  if (!WEBHOOK_SECRET) {
    return { valid: false, error: 'Webhook secret not configured' }
  }

  try {
    const expectedSignature = createHmac('sha256', WEBHOOK_SECRET)
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
export const webhookHandlers = {
  'payment.succeeded': async (data: WhopWebhookPayload['data']) => {
    // Handle successful payment
    // 1. Look up quiz session from metadata
    // 2. Create user profile if doesn't exist
    // 3. Link quiz session to profile
    // 4. Grant access
    console.log('Payment succeeded:', data)
    return { success: true }
  },

  'payment.failed': async (data: WhopWebhookPayload['data']) => {
    // Handle failed payment
    console.log('Payment failed:', data)
    return { success: true }
  },

  'membership.activated': async (data: WhopWebhookPayload['data']) => {
    // Handle membership activation
    // Update user profile subscription status
    console.log('Membership activated:', data)
    return { success: true }
  },

  'membership.deactivated': async (data: WhopWebhookPayload['data']) => {
    // Handle membership deactivation
    // Update user profile subscription status
    console.log('Membership deactivated:', data)
    return { success: true }
  },

  'membership.cancelled': async (data: WhopWebhookPayload['data']) => {
    // Handle membership cancellation
    console.log('Membership cancelled:', data)
    return { success: true }
  },

  'subscription.renewed': async (data: WhopWebhookPayload['data']) => {
    // Handle subscription renewal
    console.log('Subscription renewed:', data)
    return { success: true }
  },
}
