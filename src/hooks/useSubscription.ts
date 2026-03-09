'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface SubscriptionState {
  isLoading: boolean
  isSubscribed: boolean
  email: string | null
  isPolling: boolean
}

const MAX_POLL_ATTEMPTS = 15
const POLL_INTERVAL_MS = 2000
const PAYMENT_PENDING_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export function useSubscription(): SubscriptionState {
  const searchParams = useSearchParams()
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

  const verifyMembership = useCallback(async (membershipId: string): Promise<boolean> => {
    const sessionId = localStorage.getItem('brainrank_session')

    try {
      const response = await fetch('/api/user/verify-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId, sessionId }),
      })
      const data = await response.json()
      return data.success === true
    } catch (error) {
      console.error('Failed to verify membership:', error)
      return false
    }
  }, [])

  useEffect(() => {
    async function init() {
      const sessionId = localStorage.getItem('brainrank_session')
      const email = localStorage.getItem('user_email')

      // Check URL for Whop redirect params (membership_id, id, etc)
      const membershipId = searchParams.get('membership_id') ||
                          searchParams.get('membership') ||
                          searchParams.get('id')

      console.log('useSubscription init - sessionId:', sessionId, 'email:', email, 'membershipId:', membershipId)

      // If we have a membership_id from URL, verify it directly
      if (membershipId) {
        console.log('Verifying membership from URL:', membershipId)
        setState(prev => ({ ...prev, isLoading: true }))

        const verified = await verifyMembership(membershipId)
        if (verified) {
          localStorage.removeItem('payment_pending')
          // Clean URL params
          window.history.replaceState({}, '', window.location.pathname)
          setState({ isLoading: false, isSubscribed: true, email, isPolling: false })
          return
        }
      }

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
          console.log(`Polling attempt ${attempts}/${MAX_POLL_ATTEMPTS}`)

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
            console.log('Polling exhausted, giving up')
            setState({ isLoading: false, isSubscribed: false, email, isPolling: false })
          }
        }

        setTimeout(poll, POLL_INTERVAL_MS)
      } else {
        setState({ isLoading: false, isSubscribed: false, email, isPolling: false })
      }
    }

    init()
  }, [checkSubscription, verifyMembership, searchParams])

  return state
}
