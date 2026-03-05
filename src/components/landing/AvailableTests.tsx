import Link from 'next/link'

const tests = [
  {
    id: 'iq',
    title: 'IQ / Intelligence Test',
    duration: '15 minutes',
    questions: '25 questions',
    description: 'Measure your cognitive abilities across multiple dimensions',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    href: '/start',
    available: true,
    color: 'teal',
  },
  {
    id: 'personality',
    title: 'Personality Type',
    duration: '20 minutes',
    questions: '90 questions',
    description: 'Discover your unique personality traits and tendencies',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: '/start/personality',
    available: true,
    color: 'purple',
  },
  {
    id: 'love',
    title: 'Love Style',
    duration: '30 minutes',
    questions: '120 questions',
    description: 'Understand your love language and relationship patterns',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    href: '/start/love',
    available: true,
    color: 'pink',
  },
  {
    id: 'career',
    title: 'Career',
    duration: '25 minutes',
    questions: '35 questions',
    description: 'Find your ideal career path based on your strengths',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    href: '#',
    available: false,
    color: 'orange',
  },
]

const colorClasses = {
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    button: 'bg-teal-500 hover:bg-teal-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    button: 'bg-purple-500 hover:bg-purple-600',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    button: 'bg-pink-500 hover:bg-pink-600',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600',
  },
}

export function AvailableTests() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Available Tests
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each test reveals a new part of you. Start with intelligence, with more tests coming soon
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test) => {
            const colors = colorClasses[test.color as keyof typeof colorClasses]
            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.text} mb-6`}>
                  {test.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {test.title}
                </h3>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.duration}
                  </span>
                  <span>•</span>
                  <span>{test.questions}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6">{test.description}</p>

                {/* CTA */}
                {test.available ? (
                  <Link
                    href={test.href}
                    className={`block w-full text-center ${colors.button} text-white py-3 rounded-xl font-semibold transition-colors`}
                  >
                    Start {test.title.split(' ')[0]} Test
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
