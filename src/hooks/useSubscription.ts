'use client'

import { useState, useEffect } from 'react'

interface SubscriptionState {
  isLoading: boolean
  isSubscribed: boolean
  email: string | null
}

export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    isSubscribed: false,
    email: null,
  })

  useEffect(() => {
    async function checkSubscription() {
      const email = localStorage.getItem('user_email')

      if (!email) {
        setState({ isLoading: false, isSubscribed: false, email: null })
        return
      }

      try {
        const response = await fetch(`/api/user/subscription?email=${encodeURIComponent(email)}`)
        const data = await response.json()

        setState({
          isLoading: false,
          isSubscribed: data.isSubscribed === true,
          email,
        })
      } catch (error) {
        console.error('Failed to check subscription:', error)
        setState({ isLoading: false, isSubscribed: false, email })
      }
    }

    checkSubscription()
  }, [])

  return state
}
