'use client'

import Link from 'next/link'
import { useTrainingProgress } from '@/lib/training/hooks'

const exercises = [
  {
    id: 'reaction-tap',
    name: 'Reaction Tap',
    description: 'Test your reaction speed',
    icon: '👆',
  },
  {
    id: 'rapid-classification',
    name: 'Rapid Classification',
    description: 'Classify items as fast as possible',
    icon: '⚡',
  },
]

export default function SpeedPage() {
  const { progress, isLoading } = useTrainingProgress()
  const speedProgress = progress?.speed

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Processing Speed</h1>
            <p className="text-gray-500">Boost your mental processing speed</p>
          </div>
        </div>
      </div>

      {!isLoading && speedProgress && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Your Speed Level</span>
            <span className="font-semibold text-red-600">Level {speedProgress.currentLevel}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: `${(speedProgress.currentLevel / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Exercises</h2>
      <div className="space-y-4">
        {exercises.map(exercise => (
          <Link key={exercise.id} href={`/dashboard/train/speed/${exercise.id}`}>
            <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl">
                    {exercise.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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
