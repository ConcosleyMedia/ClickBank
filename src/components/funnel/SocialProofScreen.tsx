'use client'

import { useEffect, useState } from 'react'

interface SocialProofScreenProps {
  onContinue: () => void
}

function generateTestCount(): number {
  const base = 20000000
  const randomOffset = Math.floor(Math.random() * 500000)
  return base + randomOffset
}

export function SocialProofScreen({ onContinue }: SocialProofScreenProps) {
  const [count, setCount] = useState(20000000)
  const [animatedCount, setAnimatedCount] = useState(0)

  useEffect(() => {
    setCount(generateTestCount())
  }, [])

  // Animate counter
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = count / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= count) {
        setAnimatedCount(count)
        clearInterval(timer)
      } else {
        setAnimatedCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [count])

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        {/* Counter */}
        <h1 className="text-5xl sm:text-6xl font-bold text-teal-600 mb-4">
          {animatedCount.toLocaleString()}+
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          people have already discovered their true IQ with BrainRank
        </p>

        {/* Testimonial */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Michael R.</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 italic">
            &quot;I never knew my cognitive strengths until I took this test. The detailed breakdown helped me understand why I excel at certain tasks.&quot;
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
        >
          Continue to Results
        </button>
      </div>
    </div>
  )
}
