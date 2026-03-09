'use client'

import { useState, useEffect, useCallback } from 'react'

interface SubscriptionState {
  isLoading: boolean
  isSubscribed: boolean
  email: string | null
  isPolling: boolean
}

const MAX_POLL_ATTEMPTS = 10
const POLL_INTERVAL_MS = 2000
const PAYMENT_PENDING_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    isSubscribed: false,
    email: null,
    isPolling: false,
  })

  const checkSubscription = useCallback(async (): Promise<{ isSubscribed: boolean; email?: string }> => {
    const sessionId = localStorage.getItem('brainrank_session')
    const email = localStorage.getItem('user_email')

    if (!sessionId && !email) {
      return { isSubscribed: false }
    }

    try {
      const params = new URLSearchParams()
      if (sessionId) params.set('session_id', sessionId)
      if (email) params.set('email', email)

      const response = await fetch(`/api/user/subscription?${params.toString()}`)
      const data = await response.json()
      return {
        isSubscribed: data.isSubscribed === true,
        email: data.email || email,
      }
    } catch (error) {
      console.error('Failed to check subscription:', error)
      return { isSubscribed: false }
    }
  }, [])

  useEffect(() => {
    async function init() {
      const sessionId = localStorage.getItem('brainrank_session')
      const email = localStorage.getItem('user_email')

      if (!sessionId && !email) {
        setState({ isLoading: false, isSubscribed: false, email: null, isPolling: false })
        return
      }

      // Check if we're returning from payment
      const paymentPending = localStorage.getItem('payment_pending')
      const isRecentPayment = paymentPending &&
        (Date.now() - parseInt(paymentPending, 10)) < PAYMENT_PENDING_TIMEOUT_MS

      // First check
      const result = await checkSubscription()

      if (result.isSubscribed) {
        localStorage.removeItem('payment_pending')
        // Update email if we got it from Whop
        if (result.email) {
          localStorage.setItem('user_email', result.email)
        }
        setState({ isLoading: false, isSubscribed: true, email: result.email || email, isPolling: false })
        return
      }

      // If returning from payment and not subscribed yet, poll
      if (isRecentPayment) {
        setState({ isLoading: false, isSubscribed: false, email, isPolling: true })

        let attempts = 0
        const poll = async () => {
          attempts++
          const pollResult = await checkSubscription()

          if (pollResult.isSubscribed) {
            localStorage.removeItem('payment_pending')
            if (pollResult.email) {
              localStorage.setItem('user_email', pollResult.email)
            }
            setState({ isLoading: false, isSubscribed: true, email: pollResult.email || email, isPolling: false })
            return
          }

          if (attempts < MAX_POLL_ATTEMPTS) {
            setTimeout(poll, POLL_INTERVAL_MS)
          } else {
            // Give up polling
            setState({ isLoading: false, isSubscribed: false, email, isPolling: false })
          }
        }

        setTimeout(poll, POLL_INTERVAL_MS)
      } else {
        setState({ isLoading: false, isSubscribed: false, email, isPolling: false })
      }
    }

    init()
  }, [checkSubscription])

  return state
}
