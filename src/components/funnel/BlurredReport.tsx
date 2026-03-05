'use client'

export function BlurredReport() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Your Personalized IQ Report</h3>
      </div>

      {/* Visible preview */}
      <div className="p-6">
        <p className="text-gray-700 mb-4">
          Based on your responses, you demonstrate strong analytical thinking and pattern recognition abilities.
          Your cognitive profile suggests above-average processing speed in...
        </p>

        {/* Blurred section */}
        <div className="relative">
          <div className="blur-md select-none pointer-events-none">
            <p className="text-gray-700 mb-4">
              Your detailed breakdown reveals exceptional performance in logical reasoning,
              placing you in the top 15% of test takers. Your memory retention scores indicate
              a strong capacity for learning new information quickly. The analysis shows particular
              strength in spatial awareness, suggesting aptitude for fields requiring...
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Memory Score</p>
                <p className="text-2xl font-bold text-teal-600">87</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Logic Score</p>
                <p className="text-2xl font-bold text-teal-600">92</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Speed Score</p>
                <p className="text-2xl font-bold text-teal-600">85</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Focus Score</p>
                <p className="text-2xl font-bold text-teal-600">89</p>
              </div>
            </div>
            <p className="text-gray-700">
              Your comprehensive cognitive analysis reveals key insights into your mental
              capabilities and areas for potential growth...
            </p>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">
                To read the full report, you need full access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
