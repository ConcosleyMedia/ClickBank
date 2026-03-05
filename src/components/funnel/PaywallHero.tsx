'use client'

interface PaywallHeroProps {
  onGetScore: () => void
}

export function PaywallHero({ onGetScore }: PaywallHeroProps) {
  return (
    <div className="text-center py-8">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Congratulations! Your Score Is Ready!
      </h1>

      <p className="text-gray-600 mb-8 max-w-xl mx-auto">
        Your comprehensive IQ analysis has been calculated. Unlock your full report to discover your cognitive strengths.
      </p>

      {/* Comparison cards */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {/* Low IQ card */}
        <div className="bg-gray-100 rounded-xl p-4 w-28">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-500">113</p>
          <p className="text-xs text-gray-400">Average</p>
        </div>

        {/* Your score card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 w-36 transform scale-110 shadow-xl">
          <div className="w-14 h-14 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-4xl font-bold text-white">???</p>
          <p className="text-sm text-white/80">Your IQ</p>
        </div>

        {/* High IQ card */}
        <div className="bg-gray-100 rounded-xl p-4 w-28">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-500">160</p>
          <p className="text-xs text-gray-400">Genius</p>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onGetScore}
        className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
      >
        Get My IQ Score Now
      </button>
    </div>
  )
}
