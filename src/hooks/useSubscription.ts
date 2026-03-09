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

  const checkSubscription = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/user/subscription?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      return data.isSubscribed === true
    } catch (error) {
      console.error('Failed to check subscription:', error)
      return false
    }
  }, [])

  useEffect(() => {
    async function init() {
      const email = localStorage.getItem('user_email')

      if (!email) {
        setState({ isLoading: false, isSubscribed: false, email: null, isPolling: false })
        return
      }

      // Check if we're returning from payment
      const paymentPending = localStorage.getItem('payment_pending')
      const isRecentPayment = paymentPending &&
        (Date.now() - parseInt(paymentPending, 10)) < PAYMENT_PENDING_TIMEOUT_MS

      // First check
      const isSubscribed = await checkSubscription(email)

      if (isSubscribed) {
        localStorage.removeItem('payment_pending')
        setState({ isLoading: false, isSubscribed: true, email, isPolling: false })
        return
      }

      // If returning from payment and not subscribed yet, poll
      if (isRecentPayment) {
        setState({ isLoading: false, isSubscribed: false, email, isPolling: true })

        let attempts = 0
        const poll = async () => {
          attempts++
          const subscribed = await checkSubscription(email)

          if (subscribed) {
            localStorage.removeItem('payment_pending')
            setState({ isLoading: false, isSubscribed: true, email, isPolling: false })
            return
          }

          if (attempts < MAX_POLL_ATTEMPTS) {
            setTimeout(poll, POLL_INTERVAL_MS)
          } else {
            // Give up polling, but keep the pending flag for retry on refresh
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
