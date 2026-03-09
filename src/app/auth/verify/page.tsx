'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    async function verify() {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setError('No verification token found')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (data.success && data.email) {
          // Store email and redirect to dashboard
          localStorage.setItem('user_email', data.email)
          localStorage.removeItem('payment_pending')
          setStatus('success')

          // Redirect after brief delay to show success
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          setStatus('error')
          setError(data.error || 'Verification failed')
        }
      } catch (err) {
        setStatus('error')
        setError('Failed to verify. Please try again.')
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying...</h1>
            <p className="text-gray-600">Please wait while we verify your access.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h1>
            <p className="text-gray-600">Redirecting to your results...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/sign-in"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Go to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
