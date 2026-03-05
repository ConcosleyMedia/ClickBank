export function BenefitBoxes() {
  const benefits = [
    'Discover your exact IQ score',
    'Understand your cognitive strengths',
    'Get a personalized improvement plan',
    'Compare with global averages',
    'Download your IQ certificate',
  ]

  const learnings = [
    'Enhance memory retention',
    'Improve problem-solving skills',
    'Boost concentration abilities',
    'Develop logical thinking',
    'Increase mental processing speed',
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* How you'll benefit */}
      <div className="bg-teal-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How you&apos;ll benefit
        </h3>
        <ul className="space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-gray-700">
              <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Learn how to */}
      <div className="bg-purple-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Learn How To
        </h3>
        <ul className="space-y-3">
          {learnings.map((learning) => (
            <li key={learning} className="flex items-center gap-3 text-gray-700">
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {learning}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
