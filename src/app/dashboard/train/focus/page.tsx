'use client'

import Link from 'next/link'
import { useTrainingProgress } from '@/lib/training/hooks'

const exercises = [
  {
    id: 'stroop-color',
    name: 'Stroop Color',
    description: 'Name the ink color, not the word',
    icon: '🎨',
  },
]

export default function FocusPage() {
  const { progress, isLoading } = useTrainingProgress()
  const focusProgress = progress?.focus

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Focus & Attention</h1>
            <p className="text-gray-500">Improve your concentration abilities</p>
          </div>
        </div>
      </div>

      {!isLoading && focusProgress && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Your Focus Level</span>
            <span className="font-semibold text-green-600">Level {focusProgress.currentLevel}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(focusProgress.currentLevel / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Exercises</h2>
      <div className="space-y-4">
        {exercises.map(exercise => (
          <Link key={exercise.id} href={`/dashboard/train/focus/${exercise.id}`}>
            <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                    {exercise.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Play
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
