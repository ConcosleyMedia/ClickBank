'use client'

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

  useEffect(() => {
    setTestCount(generateTestCount())
    const email = localStorage.getItem('user_email')
    setIsLoggedIn(!!email)
  }, [])

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center px-4 py-12 sm:py-20">
      {/* Main content */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Want to Know Your{' '}
          <span className="text-teal-600">Real IQ Score?</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          Take our scientifically designed IQ test and discover your cognitive abilities
        </p>

        {/* CTA button - changes based on login state */}
        <button
          onClick={() => router.push(isLoggedIn ? '/dashboard/train' : '/start')}
          className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-colors shadow-lg shadow-teal-500/25 mb-12 touch-manipulation"
        >
          {isLoggedIn ? 'Continue Training' : 'Start IQ Test Now'}
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

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-300 rounded-full opacity-20 blur-3xl pointer-events-none" />
    </div>
  )
}
