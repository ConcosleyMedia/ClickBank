'use client'

import { useState, useEffect, useCallback } from 'react'

interface CategoryProgress {
  currentLevel: number
  totalSessions: number
  bestScore: number
  lastPlayedAt: string | null
}

interface TrainingProgress {
  memory: CategoryProgress
  logic: CategoryProgress
  speed: CategoryProgress
  focus: CategoryProgress
  puzzles: CategoryProgress
}

interface UseTrainingProgressReturn {
  progress: TrainingProgress | null
  streakDays: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const defaultProgress: CategoryProgress = {
  currentLevel: 1,
  totalSessions: 0,
  bestScore: 0,
  lastPlayedAt: null,
}

export function useTrainingProgress(): UseTrainingProgressReturn {
  const [progress, setProgress] = useState<TrainingProgress | null>(null)
  const [streakDays, setStreakDays] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const email = localStorage.getItem('user_email')
      if (!email) {
        setProgress({
          memory: defaultProgress,
          logic: defaultProgress,
          speed: defaultProgress,
          focus: defaultProgress,
          puzzles: defaultProgress,
        })
        return
      }

      const response = await fetch(`/api/training/progress?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setProgress({
        memory: data.data.progress.memory || defaultProgress,
        logic: data.data.progress.logic || defaultProgress,
        speed: data.data.progress.speed || defaultProgress,
        focus: data.data.progress.focus || defaultProgress,
        puzzles: data.data.progress.puzzles || defaultProgress,
      })
      setStreakDays(data.data.streakDays || 0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch progress'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  return {
    progress,
    streakDays,
    isLoading,
    error,
    refetch: fetchProgress,
  }
}
