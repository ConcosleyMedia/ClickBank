'use client'

import type { ReactNode } from 'react'

interface InterstitialScreenProps {
  stat: string
  statDescription: string
  illustration: string
  onContinue: () => void
}

const illustrations: Record<string, ReactNode> = {
  'brain-power': (
    <svg className="w-20 h-20 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'global-users': (
    <svg className="w-20 h-20 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  certificate: (
    <svg className="w-20 h-20 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
}

export function InterstitialScreen({
  stat,
  statDescription,
  illustration,
  onContinue,
}: InterstitialScreenProps) {
  return (
    <div className="w-full max-w-lg mx-auto text-center py-8 relative">
      {/* Decorative sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-8 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        <div className="absolute top-12 right-12 w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-16 w-2 h-2 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-8 w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Illustration with glow */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-36 h-36 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-300">
            {illustrations[illustration] || illustrations['brain-power']}
          </div>
        </div>
      </div>

      {/* Stat with gradient */}
      <div className="mb-4">
        <span className="text-5xl font-black bg-gradient-to-r from-teal-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
          {stat}
        </span>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-md">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Exceptional Performance
      </div>

      {/* Description */}
      <p className="text-lg text-gray-700 mb-10 max-w-md mx-auto leading-relaxed">
        {statDescription}
      </p>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Continue Test
      </button>

      {/* Progress reminder */}
      <p className="mt-6 text-sm text-gray-500">
        Keep going to unlock your full IQ analysis
      </p>
    </div>
  )
}
