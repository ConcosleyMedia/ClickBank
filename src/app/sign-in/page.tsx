'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotFound(false)

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/subscription?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.isSubscribed) {
        // Save email to localStorage and redirect to dashboard
        localStorage.setItem('user_email', email)
        router.push('/dashboard')
      } else {
        // No active subscription found
        setNotFound(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify subscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BrainRank</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Your Results</h1>
          <p className="text-gray-600">Enter the email you used to purchase your subscription.</p>
        </div>

        {/* Sign in form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setNotFound(false)
                  setError('')
                }}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {notFound && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm font-medium mb-2">
                  No active subscription found for this email.
                </p>
                <p className="text-amber-700 text-sm">
                  Please make sure you&apos;re using the same email you used during checkout, or{' '}
                  <Link href="/pricing" className="text-teal-600 hover:text-teal-700 font-medium underline">
                    subscribe to get access
                  </Link>.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {isLoading ? 'Checking...' : 'Access My Results'}
            </button>
          </form>

          {/* Help text */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/start" className="text-teal-600 hover:text-teal-700 font-medium">
                Take the IQ test
              </Link>
            </p>
          </div>
        </div>

        {/* OAuth coming soon */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Google and Apple sign-in coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
