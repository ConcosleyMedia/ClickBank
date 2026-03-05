'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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

export function Hero() {
  const [testCount, setTestCount] = useState(17645)

  useEffect(() => {
    setTestCount(generateTestCount())
  }, [])

  return (
    <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Want to Know Your{' '}
            <span className="text-teal-600">Real IQ Score?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Take our IQ test and unlock your path to self-discovery and development
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/start"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              Start IQ Test Now
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-teal-600 font-medium text-lg transition-colors flex items-center gap-2"
            >
              How It Works
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center justify-center gap-4">
            {/* Avatar stack */}
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

            <div className="text-left">
              <p className="text-sm text-gray-500">Excellent user reviews</p>
              <p className="font-semibold text-gray-900">
                <span className="text-teal-600">{testCount.toLocaleString()}</span> IQ tests taken today!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-30 blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-300 rounded-full opacity-20 blur-3xl" />
    </section>
  )
}
