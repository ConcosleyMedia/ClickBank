'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  autoStart?: boolean
  onTick?: (seconds: number) => void
}

interface UseTimerReturn {
  seconds: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  formatTime: () => string
}

/**
 * Count-up timer hook for quiz timing
 */
export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { autoStart = false, onTick } = options
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onTickRef = useRef(onTick)

  // Keep onTick ref updated
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newValue = prev + 1
          onTickRef.current?.(newValue)
          return newValue
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setSeconds(0)
    setIsRunning(false)
  }, [])

  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [seconds])

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formatTime,
  }
}

/**
 * Countdown timer hook (for paywall urgency timer)
 */
export function useCountdownTimer(initialMinutes: number = 7) {
  const [seconds, setSeconds] = useState(() => {
    // Try to restore from sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('countdown_seconds')
      if (stored) {
        const parsed = parseInt(stored, 10)
        if (!isNaN(parsed) && parsed > 0) {
          return parsed
        }
      }
    }
    return initialMinutes * 60
  })
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning || seconds <= 0) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newValue = prev - 1
        // Store in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('countdown_seconds', newValue.toString())
        }
        // Reset to 2 minutes if hits 0
        if (newValue <= 0) {
          return 2 * 60
        }
        return newValue
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [seconds])

  const isUrgent = seconds < 120 // Less than 2 minutes

  return {
    seconds,
    isRunning,
    isUrgent,
    formatTime,
    pause: () => setIsRunning(false),
    resume: () => setIsRunning(true),
  }
}
