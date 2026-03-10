'use client'

import Link from 'next/link'
import { useTrainingProgress } from '@/lib/training/hooks'
import { CategoryCard } from '@/components/training/CategoryCard'

const categories = [
  {
    id: 'memory',
    name: 'Memory',
    icon: '🧠',
    color: '#7C3AED',
    tagline: 'Enhance your recall abilities',
    exerciseCount: 3,
  },
  {
    id: 'logic',
    name: 'Logic',
    icon: '🔢',
    color: '#2563EB',
    tagline: 'Sharpen your reasoning skills',
    exerciseCount: 4,
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: '⚡',
    color: '#DC2626',
    tagline: 'Boost processing speed',
    exerciseCount: 3,
  },
  {
    id: 'focus',
    name: 'Focus',
    icon: '🎯',
    color: '#059669',
    tagline: 'Improve concentration',
    exerciseCount: 2,
  },
  {
    id: 'puzzles',
    name: 'Puzzles',
    icon: '🧩',
    color: '#D97706',
    tagline: '150+ brain puzzles',
    exerciseCount: 150,
  },
]

export default function TrainingHubPage() {
  const { progress, streakDays, isLoading } = useTrainingProgress()

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Train Your Brain</h1>
          <p className="text-gray-500">Daily exercises to boost your cognitive abilities</p>
        </div>

        {/* Streak badge */}
        {streakDays > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
            <span className="text-xl">🔥</span>
            <span className="font-semibold">{streakDays} day streak</span>
          </div>
        )}
      </div>

      {/* Daily Challenge Banner */}
      <Link href="/dashboard/train/daily">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 mb-8 text-white hover:from-teal-600 hover:to-teal-700 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h2 className="text-xl font-bold">Today&apos;s Challenge</h2>
              </div>
              <p className="text-teal-100">Complete the daily challenge to maintain your streak</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <span className="font-semibold">Start Now →</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Category Grid */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Train by Skill</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <CategoryCard
            key={cat.id}
            {...cat}
            currentLevel={progress?.[cat.id as keyof typeof progress]?.currentLevel || 1}
            totalSessions={progress?.[cat.id as keyof typeof progress]?.totalSessions || 0}
            bestScore={progress?.[cat.id as keyof typeof progress]?.bestScore || 0}
            lastPlayedAt={progress?.[cat.id as keyof typeof progress]?.lastPlayedAt || null}
          />
        ))}
      </div>

      {/* Progress Summary */}
      {progress && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress This Week</h2>
          <div className="grid grid-cols-5 gap-4">
            {categories.slice(0, 5).map(cat => {
              const catProgress = progress[cat.id as keyof typeof progress]
              const percentage = Math.min((catProgress?.totalSessions || 0) * 10, 100)

              return (
                <div key={cat.id} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#E5E7EB"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={cat.color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${percentage * 1.76} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg">
                      {cat.icon}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{cat.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
