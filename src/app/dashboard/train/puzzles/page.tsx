'use client'

import { useState } from 'react'
import Link from 'next/link'

// Placeholder puzzles - in production these would come from the database
const SAMPLE_PUZZLES = Array.from({ length: 20 }).map((_, i) => ({
  id: `puzzle-${i + 1}`,
  category: ['pattern', 'strategic', 'analytical'][i % 3],
  difficulty: (i % 5) + 1,
  isCompleted: i < 5, // First 5 marked as completed for demo
}))

export default function PuzzlesPage() {
  const [filter, setFilter] = useState<'all' | 'pattern' | 'strategic' | 'analytical'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null)

  const filteredPuzzles = SAMPLE_PUZZLES.filter(p => {
    if (filter !== 'all' && p.category !== filter) return false
    if (difficultyFilter && p.difficulty !== difficultyFilter) return false
    return true
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
            🧩
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brain Puzzles</h1>
            <p className="text-gray-500">150+ intelligence puzzles to solve</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['all', 'pattern', 'strategic', 'analytical'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDifficultyFilter(null)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !difficultyFilter
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Levels
          </button>
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                difficultyFilter === level
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Puzzle Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPuzzles.map(puzzle => (
          <Link key={puzzle.id} href={`/dashboard/train/puzzles/${puzzle.id}`}>
            <div className="bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer overflow-hidden">
              {/* Puzzle preview placeholder */}
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative">
                <div className="grid grid-cols-3 gap-1 p-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded ${
                        i === 8 ? 'bg-amber-300' : 'bg-amber-200'
                      }`}
                    />
                  ))}
                </div>

                {puzzle.isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{puzzle.category}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(d => (
                      <div
                        key={d}
                        className={`w-1.5 h-3 rounded-sm ${
                          d <= puzzle.difficulty ? 'bg-amber-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Coming soon note */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        More puzzles added daily! Check back tomorrow for new challenges.
      </div>
    </div>
  )
}
