'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DailyChallenge {
  exerciseId: string
  exerciseName: string
  category: string
  icon: string
  color: string
}

const DAILY_EXERCISES: DailyChallenge[] = [
  { exerciseId: 'memory/sequence-recall', exerciseName: 'Sequence Recall', category: 'Memory', icon: '🧠', color: '#7C3AED' },
  { exerciseId: 'logic/number-series', exerciseName: 'Number Series', category: 'Logic', icon: '🔢', color: '#2563EB' },
  { exerciseId: 'speed/reaction-tap', exerciseName: 'Reaction Tap', category: 'Speed', icon: '⚡', color: '#DC2626' },
  { exerciseId: 'focus/stroop-color', exerciseName: 'Stroop Color', category: 'Focus', icon: '🎯', color: '#059669' },
]

export default function DailyChallengePage() {
  const [streakDays, setStreakDays] = useState(0)
  const [completedToday, setCompletedToday] = useState<string[]>([])

  useEffect(() => {
    // Load from API in production
    const email = localStorage.getItem('user_email')
    if (email) {
      fetch(`/api/training/daily?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setStreakDays(data.data.streakDays || 0)
          }
        })
        .catch(console.error)
    }
  }, [])

  const allCompleted = completedToday.length === DAILY_EXERCISES.length

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4">
          <span className="text-xl">🔥</span>
          <span className="font-semibold">
            {streakDays > 0 ? `${streakDays} day streak!` : 'Start your streak!'}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Challenge</h1>
        <p className="text-gray-600">
          Complete all exercises to maintain your streak
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Today&apos;s Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {completedToday.length} / {DAILY_EXERCISES.length}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all"
            style={{ width: `${(completedToday.length / DAILY_EXERCISES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {DAILY_EXERCISES.map((exercise, idx) => {
          const isCompleted = completedToday.includes(exercise.exerciseId)

          return (
            <Link
              key={exercise.exerciseId}
              href={`/dashboard/train/${exercise.exerciseId}`}
            >
              <div className={`bg-white rounded-xl p-4 border transition-all cursor-pointer ${
                isCompleted
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${exercise.color}20` }}
                    >
                      {exercise.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {exercise.category}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">Challenge {idx + 1}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{exercise.exerciseName}</h3>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                      style={{ backgroundColor: exercise.color }}
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Completion message */}
      {allCompleted && (
        <div className="mt-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-center text-white">
          <span className="text-4xl mb-4 block">🎉</span>
          <h2 className="text-xl font-bold mb-2">Daily Challenge Complete!</h2>
          <p className="text-teal-100">
            Great job! Come back tomorrow for new challenges.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          💡 Complete the daily challenge every day to build your streak and unlock achievements!
        </p>
      </div>
    </div>
  )
}
