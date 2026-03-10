'use client'

import Link from 'next/link'

interface CategoryCardProps {
  id: string
  name: string
  icon: string
  color: string
  tagline: string
  exerciseCount: number
  currentLevel: number
  totalSessions: number
  bestScore: number
  lastPlayedAt: string | null
}

export function CategoryCard({
  id,
  name,
  icon,
  color,
  tagline,
  exerciseCount,
  currentLevel,
  totalSessions,
  bestScore,
  lastPlayedAt,
}: CategoryCardProps) {
  const isNew = totalSessions === 0
  const playedToday = lastPlayedAt &&
    new Date(lastPlayedAt).toDateString() === new Date().toDateString()

  return (
    <Link href={`/dashboard/train/${id}`}>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>

          {/* Badge */}
          {isNew ? (
            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          ) : playedToday ? (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              Today
            </span>
          ) : null}
        </div>

        {/* Name & Tagline */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{tagline}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <span>{exerciseCount} exercises</span>
          </div>

          {!isNew && (
            <div className="flex items-center gap-2">
              <span
                className="font-medium"
                style={{ color }}
              >
                Level {currentLevel}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(level => (
                  <div
                    key={level}
                    className="w-1.5 h-4 rounded-sm"
                    style={{
                      backgroundColor: level <= currentLevel ? color : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Best score */}
        {bestScore > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Best score</span>
              <span className="font-semibold text-gray-900">{bestScore}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
