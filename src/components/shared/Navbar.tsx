'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const email = localStorage.getItem('user_email')
    setIsLoggedIn(!!email)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('brainrank_session')
    localStorage.removeItem('quiz_result')
    localStorage.removeItem('payment_pending')
    setIsLoggedIn(false)
    router.push('/')
  }

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  const renderAuthButtons = () => {
    if (!mounted) {
      // Return placeholder with same dimensions to prevent layout shift
      return (
        <div className="flex items-center gap-4">
          <div className="w-14 h-6" />
          <div className="w-24 h-10" />
        </div>
      )
    }

    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/train"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Training
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Log In
        </Link>
        <Link
          href="/start"
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
        >
          Start Test
        </Link>
      </div>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BrainRank</span>
          </Link>

          {/* Right side - Auth buttons */}
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  )
}
