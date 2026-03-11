'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function generateTestCount(): number {
  const baseCount = 17000
  const now = new Date()
  const hourOfDay = now.getHours()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const timeMultiplier = hourOfDay >= 9 && hourOfDay <= 21 ? 1.3 : 0.7
  const randomOffset = Math.floor(Math.random() * 800)
  return Math.floor(baseCount + (dayOfYear % 100) * 50 + randomOffset * timeMultiplier)
}

export default function Home() {
  const router = useRouter()
  const [testCount, setTestCount] = useState(17645)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    setTestCount(generateTestCount())
    // Check if user is logged in
    const email = localStorage.getItem('user_email')
    if (email) {
      setIsLoggedIn(true)
      setUserEmail(email)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('brainrank_session')
    localStorage.removeItem('quiz_result')
    localStorage.removeItem('payment_pending')
    setIsLoggedIn(false)
    setUserEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BrainRank</span>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Want to Know Your{' '}
            <span className="text-teal-600">Real IQ Score?</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10">
            Take our scientifically designed IQ test and discover your cognitive abilities
          </p>

          {/* CTA button - larger touch target for mobile */}
          <button
            onClick={() => router.push('/start')}
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-colors shadow-lg shadow-teal-500/25 mb-12 touch-manipulation"
          >
            Start IQ Test Now
          </button>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-medium shadow-md"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">Excellent user reviews</p>
              <p className="font-semibold text-gray-900">
                <span className="text-teal-600">{testCount.toLocaleString()}</span> tests taken today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-300 rounded-full opacity-20 blur-3xl pointer-events-none" />
    </div>
  )
}
