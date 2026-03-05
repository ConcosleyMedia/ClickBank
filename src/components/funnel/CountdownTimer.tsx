'use client'

import { useCountdownTimer } from '@/hooks/useTimer'

interface CountdownTimerProps {
  className?: string
}

export function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const { formatTime, isUrgent } = useCountdownTimer(7)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors ${
          isUrgent
            ? 'bg-red-100 text-red-600 animate-pulse'
            : 'bg-orange-100 text-orange-600'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{formatTime()}</span>
      </div>
      <span className="text-sm text-gray-500">
        {isUrgent ? 'Hurry! Offer expiring soon' : 'Special offer expires in'}
      </span>
    </div>
  )
}
