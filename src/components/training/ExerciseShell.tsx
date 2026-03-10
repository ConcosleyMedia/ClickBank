'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useExerciseSession } from '@/lib/training/hooks'

interface ExerciseResult {
  trialsCompleted: number
  trialsCorrect: number
  avgResponseMs: number
}

interface CompletionData {
  score: number
  accuracy: number
  avgResponseMs: number
  newLevel?: number
  newBest: boolean
  streakDays: number
}

interface ExerciseShellProps {
  exerciseId: string
  exerciseName: string
  description: string
  category: string
  categoryColor: string
  difficultyLevel?: number
  totalTrials?: number
  timeLimit?: number // in seconds, if timed
  children: (props: {
    onTrialComplete: (correct: boolean, responseTimeMs: number) => void
    currentTrial: number
    totalTrials: number
    isComplete: boolean
  }) => React.ReactNode
}

type ExerciseState = 'idle' | 'countdown' | 'playing' | 'completed'

export function ExerciseShell({
  exerciseId,
  exerciseName,
  description,
  category,
  categoryColor,
  difficultyLevel = 1,
  totalTrials = 10,
  timeLimit,
  children,
}: ExerciseShellProps) {
  const router = useRouter()
  const [state, setState] = useState<ExerciseState>('idle')
  const [countdownValue, setCountdownValue] = useState(3)
  const [currentTrial, setCurrentTrial] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [responseTimes, setResponseTimes] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0)
  const [completionData, setCompletionData] = useState<CompletionData | null>(null)

  const session = useExerciseSession(exerciseId, category, difficultyLevel)

  // Start countdown
  const handleStart = useCallback(async () => {
    await session.start()
    setState('countdown')
    setCountdownValue(3)
  }, [session])

  // Countdown effect
  useEffect(() => {
    if (state !== 'countdown') return

    if (countdownValue > 0) {
      const timer = setTimeout(() => {
        setCountdownValue(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setState('playing')
      if (timeLimit) setTimeRemaining(timeLimit)
    }
  }, [state, countdownValue, timeLimit])

  // Timer countdown for timed exercises
  useEffect(() => {
    if (state !== 'playing' || !timeLimit) return

    if (timeRemaining <= 0) {
      handleExerciseComplete()
      return
    }

    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [state, timeRemaining, timeLimit])

  const handleTrialComplete = useCallback((correct: boolean, responseTimeMs: number) => {
    setResponseTimes(prev => [...prev, responseTimeMs])
    if (correct) {
      setCorrectCount(prev => prev + 1)
    }

    const newTrial = currentTrial + 1
    setCurrentTrial(newTrial)

    if (newTrial >= totalTrials) {
      handleExerciseComplete()
    }
  }, [currentTrial, totalTrials])

  const handleExerciseComplete = useCallback(async () => {
    const avgResponseMs = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

    const result = await session.complete({
      trialsCompleted: currentTrial || totalTrials,
      trialsCorrect: correctCount,
      avgResponseMs,
    })

    if (result) {
      setCompletionData(result)
    }
    setState('completed')
  }, [session, currentTrial, totalTrials, correctCount, responseTimes])

  const handlePlayAgain = () => {
    setCurrentTrial(0)
    setCorrectCount(0)
    setResponseTimes([])
    setCompletionData(null)
    setState('idle')
  }

  const handleTryAnother = () => {
    router.push(`/dashboard/train/${category}`)
  }

  // Idle state
  if (state === 'idle') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: categoryColor }}
          >
            <span className="text-4xl">🧠</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{exerciseName}</h1>
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-sm text-gray-500">Difficulty:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full ${
                    level <= difficultyLevel ? 'bg-teal-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={session.isStarting}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {session.isStarting ? 'Starting...' : 'Start Exercise'}
          </button>
        </div>
      </div>
    )
  }

  // Countdown state
  if (state === 'countdown') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-600 mb-8">{exerciseName}</h2>
          <div
            className="text-9xl font-bold animate-pulse"
            style={{ color: categoryColor }}
          >
            {countdownValue || 'GO!'}
          </div>
          <p className="text-gray-500 mt-8">
            {countdownValue > 0 ? 'Get ready...' : 'Start now!'}
          </p>
        </div>
      </div>
    )
  }

  // Playing state
  if (state === 'playing') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Progress bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {Array.from({ length: totalTrials }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < currentTrial
                        ? 'bg-teal-500'
                        : i === currentTrial
                        ? 'bg-teal-300'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Timer */}
              {timeLimit && (
                <div className="text-lg font-mono font-semibold text-gray-700">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exercise content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {children({
            onTrialComplete: handleTrialComplete,
            currentTrial,
            totalTrials,
            isComplete: currentTrial >= totalTrials,
          })}
        </div>
      </div>
    )
  }

  // Completed state
  if (state === 'completed' && completionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete!</h1>

          <div className="text-6xl font-bold text-teal-600 my-6">
            {completionData.score}
          </div>
          <p className="text-gray-500 mb-8">Your Score</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(star => (
              <svg
                key={star}
                className={`w-10 h-10 ${
                  completionData.score >= star * 30 ? 'text-yellow-400' : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-gray-500">Accuracy</p>
              <p className="text-xl font-semibold text-gray-900">{completionData.accuracy}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-gray-500">Avg Speed</p>
              <p className="text-xl font-semibold text-gray-900">{completionData.avgResponseMs}ms</p>
            </div>
          </div>

          {/* Badges */}
          {completionData.newBest && (
            <div className="bg-amber-50 text-amber-700 rounded-xl px-4 py-2 inline-block mb-4">
              🎉 New Personal Best!
            </div>
          )}

          {completionData.newLevel && (
            <div className="bg-purple-50 text-purple-700 rounded-xl px-4 py-2 inline-block mb-4 ml-2">
              🚀 Level {completionData.newLevel} Unlocked!
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={handleTryAnother}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Try Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
