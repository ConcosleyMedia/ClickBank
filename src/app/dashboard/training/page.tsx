'use client'

const trainingCategories = [
  {
    id: 'memory',
    title: 'Memory Training',
    description: 'Enhance your short and long-term memory retention',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    games: 3,
    color: 'purple',
  },
  {
    id: 'logic',
    title: 'Logic & Reasoning',
    description: 'Sharpen your analytical and problem-solving skills',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    games: 4,
    color: 'teal',
  },
  {
    id: 'speed',
    title: 'Processing Speed',
    description: 'Improve your mental processing and reaction time',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    games: 3,
    color: 'blue',
  },
  {
    id: 'focus',
    title: 'Focus & Attention',
    description: 'Build sustained concentration and mental stamina',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    games: 2,
    color: 'green',
  },
]

const colorClasses = {
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-50',
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    hover: 'hover:bg-teal-50',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-50',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    hover: 'hover:bg-green-50',
  },
}

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brain Training</h1>
        <p className="text-gray-600">
          Boost your cognitive abilities with our training exercises
        </p>
      </div>

      {/* Training categories */}
      <div className="grid sm:grid-cols-2 gap-6">
        {trainingCategories.map((category) => {
          const colors = colorClasses[category.color as keyof typeof colorClasses]
          return (
            <div
              key={category.id}
              className={`bg-white rounded-2xl p-6 border border-gray-100 ${colors.hover} transition-colors cursor-pointer`}
            >
              <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} mb-4`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {category.games} exercises
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Puzzles section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Puzzles</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            150+ Intelligence Puzzles
          </h3>
          <p className="text-gray-600 mb-4">
            Challenge yourself with pattern recognition, strategic thinking, and analytical reasoning puzzles.
          </p>
          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Video courses section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Expert Video Courses</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            20+ Hours of Expert-Led Content
          </h3>
          <p className="text-gray-600 mb-4">
            Learn cognitive enhancement techniques from experts in psychology and neuroscience.
          </p>
          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  )
}
