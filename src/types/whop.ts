export interface WhopCheckoutSession {
  id: string
  url: string
  metadata: {
    sessionId: string
    affiliateId?: string
  }
}

export interface WhopMembership {
  id: string
  userId: string
  planId: string
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export type WhopEventType =
  | 'payment.succeeded'
  | 'payment.failed'
  | 'membership.activated'
  | 'membership.deactivated'
  | 'membership.cancelled'
  | 'subscription.renewed'

export interface WhopEvent {
  id: string
  type: WhopEventType
  data: WhopEventData
  createdAt: string
}

export interface WhopEventData {
  membershipId: string
  userId: string
  email: string
  planId: string
  amount?: number
  currency?: string
  metadata?: Record<string, string>
}

export interface WhopWebhookPayload {
  id: string
  event: WhopEventType
  data: WhopEventData
  created_at: string
}

export interface CreateCheckoutOptions {
  planId: string
  sessionId: string
  affiliateId?: string
  successUrl: string
  cancelUrl: string
}

export interface WhopApiResponse<T> {
  data: T | null
  error: string | null
}
