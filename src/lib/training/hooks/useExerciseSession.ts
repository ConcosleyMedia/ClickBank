'use client'

import { useState, useCallback } from 'react'

interface SessionResult {
  trialsCompleted: number
  trialsCorrect: number
  avgResponseMs: number
}

interface CompletionResult {
  score: number
  accuracy: number
  avgResponseMs: number
  newLevel?: number
  newBest: boolean
  streakDays: number
}

interface UseExerciseSessionReturn {
  sessionId: string | null
  isStarting: boolean
  isSaving: boolean
  error: string | null
  start: () => Promise<string | null>
  complete: (result: SessionResult) => Promise<CompletionResult | null>
}

export function useExerciseSession(
  exerciseId: string,
  category: string,
  difficultyLevel: number = 1
): UseExerciseSessionReturn {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const start = useCallback(async (): Promise<string | null> => {
    setIsStarting(true)
    setError(null)

    try {
      const email = localStorage.getItem('user_email')
      if (!email) {
        throw new Error('No user email found')
      }

      const response = await fetch('/api/training/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          exerciseId,
          category,
          difficultyLevel,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setSessionId(data.data.sessionId)
      return data.data.sessionId
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start session'
      setError(message)
      return null
    } finally {
      setIsStarting(false)
    }
  }, [exerciseId, category, difficultyLevel])

  const complete = useCallback(async (result: SessionResult): Promise<CompletionResult | null> => {
    if (!sessionId) {
      setError('No active session')
      return null
    }

    setIsSaving(true)
    setError(null)

    try {
      const email = localStorage.getItem('user_email')
      if (!email) {
        throw new Error('No user email found')
      }

      const response = await fetch('/api/training/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email,
          exerciseId,
          category,
          difficultyLevel,
          ...result,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.data as CompletionResult
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save session'
      setError(message)
      return null
    } finally {
      setIsSaving(false)
    }
  }, [sessionId, exerciseId, category, difficultyLevel])

  return {
    sessionId,
    isStarting,
    isSaving,
    error,
    start,
    complete,
  }
}
