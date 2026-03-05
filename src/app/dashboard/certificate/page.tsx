'use client'

import { useRef, useState } from 'react'

export default function CertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [userName, setUserName] = useState('Test User')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    // In production, this would use html2canvas or similar
    // to generate a PNG/PDF of the certificate
    try {
      alert('Certificate download would be triggered here. In production, this generates a PNG or PDF.')
    } finally {
      setIsDownloading(false)
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your IQ Certificate</h1>
          <p className="text-gray-600">Download your personalized IQ certificate</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isDownloading ? 'Generating...' : 'Download Certificate'}
        </button>
      </div>

      {/* Certificate preview */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
        <div
          ref={certificateRef}
          className="aspect-[1.4/1] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-500/10 rounded-tl-full" />
          <div className="absolute top-4 right-4 w-24 h-24 border-4 border-teal-500/20 rounded-full" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">BrainRank</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-serif text-gray-800 mb-2">Certificate of Intelligence</h2>
            <p className="text-gray-500 mb-8">This certifies that</p>

            {/* Name */}
            <p className="text-4xl font-bold text-gray-900 mb-4 font-serif">{userName}</p>

            {/* Score */}
            <p className="text-gray-600 mb-2">has achieved an IQ score of</p>
            <div className="bg-teal-500 text-white px-8 py-3 rounded-xl mb-8">
              <span className="text-5xl font-bold">118</span>
            </div>

            {/* Percentile */}
            <p className="text-gray-500 text-sm mb-8">
              Scoring higher than 87% of test takers worldwide
            </p>

            {/* Date and signature */}
            <div className="flex items-end justify-between w-full max-w-md">
              <div className="text-left">
                <p className="text-xs text-gray-400 mb-1">Date Issued</p>
                <p className="text-sm font-medium text-gray-700">{currentDate}</p>
              </div>
              <div className="text-right">
                <div className="w-32 h-px bg-gray-300 mb-1" />
                <p className="text-xs text-gray-400">Verified by BrainRank</p>
              </div>
            </div>
          </div>

          {/* Border decoration */}
          <div className="absolute inset-4 border-2 border-teal-500/20 rounded-lg pointer-events-none" />
        </div>
      </div>

      {/* Customize name */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Customize Your Certificate</h3>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            placeholder="Enter your name"
          />
        </div>
      </div>
    </div>
  )
}
