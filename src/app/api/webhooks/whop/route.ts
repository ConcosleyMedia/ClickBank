import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, parseWebhookPayload, webhookHandlers } from '@/lib/whop/webhooks'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Get raw body and signature
    const body = await request.text()
    const signature = request.headers.get('x-whop-signature') || ''

    // Verify signature (skip in development if no secret)
    const verification = verifyWebhookSignature(body, signature)
    if (!verification.valid && process.env.NODE_ENV === 'production') {
      console.error('Webhook verification failed:', verification.error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload = parseWebhookPayload(body)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // Store event in database for audit trail
    try {
      const supabase = await createClient()
      await supabase.from('whop_events').insert({
        event_id: payload.id,
        event_type: payload.event,
        payload: payload,
      })
    } catch (dbError) {
      console.error('Failed to store webhook event:', dbError)
      // Don't fail the webhook if DB insert fails
    }

    // Handle event
    const handler = webhookHandlers[payload.event]
    if (handler) {
      const result = await handler(payload.data)
      if (!result.success) {
        console.error('Webhook handler failed:', payload.event)
      }
    } else {
      console.log('Unhandled webhook event:', payload.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
