'use client'

import Link from 'next/link'
import { useTrainingProgress } from '@/lib/training/hooks'

const exercises = [
  {
    id: 'sequence-recall',
    name: 'Sequence Recall',
    description: 'Remember and repeat sequences',
    icon: '🔢',
  },
  {
    id: 'spatial-grid',
    name: 'Spatial Grid',
    description: 'Memorize grid patterns',
    icon: '⬛',
  },
  {
    id: 'word-pairs',
    name: 'Word Pairs',
    description: 'Learn and recall word associations',
    icon: '📝',
  },
]

export default function MemoryPage() {
  const { progress, isLoading } = useTrainingProgress()
  const memoryProgress = progress?.memory

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
            🧠
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Memory Training</h1>
            <p className="text-gray-500">Enhance your short and long-term memory</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!isLoading && memoryProgress && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Your Memory Level</span>
            <span className="font-semibold text-purple-600">Level {memoryProgress.currentLevel}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${(memoryProgress.currentLevel / 5) * 100}%` }}
            />
          </div>
          {memoryProgress.bestScore > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Best score this week: <span className="font-semibold text-gray-900">{memoryProgress.bestScore}</span>
            </p>
          )}
        </div>
      )}

      {/* Exercises */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Exercises</h2>
      <div className="space-y-4">
        {exercises.map(exercise => (
          <Link key={exercise.id} href={`/dashboard/train/memory/${exercise.id}`}>
            <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl">
                    {exercise.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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
