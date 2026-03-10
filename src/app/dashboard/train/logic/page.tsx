'use client'

import Link from 'next/link'
import { useTrainingProgress } from '@/lib/training/hooks'

const exercises = [
  {
    id: 'number-series',
    name: 'Number Series',
    description: 'Find the pattern and complete the sequence',
    icon: '🔢',
  },
  {
    id: 'syllogisms',
    name: 'Syllogisms',
    description: 'Evaluate logical arguments',
    icon: '💭',
  },
  {
    id: 'analogies',
    name: 'Analogies',
    description: 'Find relationships between concepts',
    icon: '🔗',
  },
]

export default function LogicPage() {
  const { progress, isLoading } = useTrainingProgress()
  const logicProgress = progress?.logic

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
            🔢
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Logic & Reasoning</h1>
            <p className="text-gray-500">Sharpen your analytical thinking</p>
          </div>
        </div>
      </div>

      {!isLoading && logicProgress && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Your Logic Level</span>
            <span className="font-semibold text-blue-600">Level {logicProgress.currentLevel}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(logicProgress.currentLevel / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Exercises</h2>
      <div className="space-y-4">
        {exercises.map(exercise => (
          <Link key={exercise.id} href={`/dashboard/train/logic/${exercise.id}`}>
            <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                    {exercise.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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
