'use client'

import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Check your email for a link to access your IQ results. The email should arrive within a few minutes.
        </p>

        {/* Spam folder warning - prominent */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium text-amber-800">Check your spam/junk folder!</p>
            <p className="text-sm text-amber-700">
              The access link email sometimes gets filtered. Look for an email from BrainRank.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-500 mb-2">Still can&apos;t find it?</p>
          <p className="text-sm text-gray-600">
            Use the{' '}
            <Link href="/sign-in" className="text-teal-600 hover:text-teal-700 font-medium">
              sign-in page
            </Link>{' '}
            to access your results with the email you used at checkout.
          </p>
        </div>

        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Return to home
        </Link>
      </div>
    </div>
  )
}
