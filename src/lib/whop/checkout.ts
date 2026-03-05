import type { CreateCheckoutOptions, WhopCheckoutSession, WhopApiResponse } from '@/types'

const WHOP_CHECKOUT_BASE = 'https://whop.com/checkout'

// Get plan ID from env (lazy to avoid build-time issues)
function getPlanId() {
  return process.env.NEXT_PUBLIC_WHOP_PLAN_ID || 'plan_standard'
}

export async function createCheckoutSession(
  options: CreateCheckoutOptions
): Promise<WhopApiResponse<WhopCheckoutSession>> {
  try {
    const { planId, sessionId, affiliateId, successUrl, cancelUrl } = options

    // Build checkout URL with parameters
    const checkoutUrl = new URL(WHOP_CHECKOUT_BASE)
    checkoutUrl.searchParams.set('plan', planId)
    checkoutUrl.searchParams.set('redirect_url', successUrl)
    checkoutUrl.searchParams.set('cancel_url', cancelUrl)

    // Add metadata
    const metadata = {
      session_id: sessionId,
      ...(affiliateId && { affiliate_id: affiliateId }),
    }
    checkoutUrl.searchParams.set('metadata', JSON.stringify(metadata))

    // For Whop, we typically redirect to their hosted checkout
    // The session is created when the user lands on the checkout page
    return {
      data: {
        id: `checkout_${Date.now()}`,
        url: checkoutUrl.toString(),
        metadata: {
          sessionId,
          affiliateId,
        },
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    }
  }
}

export function getCheckoutUrl(
  sessionId: string,
  affiliateId?: string
): string {
  const planId = getPlanId()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const params = new URLSearchParams({
    plan: planId,
    redirect_url: `${baseUrl}/dashboard`,
    cancel_url: `${baseUrl}/results`,
    metadata: JSON.stringify({
      session_id: sessionId,
      ...(affiliateId && { affiliate_id: affiliateId }),
    }),
  })

  return `${WHOP_CHECKOUT_BASE}?${params.toString()}`
}
