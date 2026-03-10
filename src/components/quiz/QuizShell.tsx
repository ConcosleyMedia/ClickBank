'use client'

import Link from 'next/link'
import { ProgressBar } from './ProgressBar'
import { QuizTimer } from './QuizTimer'

interface QuizShellProps {
  children: React.ReactNode
  progress: number
  currentQuestion: number
  totalQuestions: number
  formattedTime: string
  canGoBack: boolean
  canSkip: boolean
  showSubmit: boolean
  submitLabel: string
  onBack: () => void
  onSkip: () => void
  onSubmit: () => void
}

export function QuizShell({
  children,
  progress,
  currentQuestion,
  totalQuestions,
  formattedTime,
  canGoBack,
  canSkip,
  showSubmit,
  submitLabel,
  onBack,
  onSkip,
  onSubmit,
}: QuizShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">BrainRank</span>
            </Link>

            {/* Timer */}
            <QuizTimer formattedTime={formattedTime} />
          </div>

          {/* Progress bar */}
          <ProgressBar
            progress={progress}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8 overflow-y-auto">
        <div className="w-full animate-fade-in">{children}</div>
      </main>

      {/* Footer navigation */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back button */}
            <button
              onClick={onBack}
              disabled={!canGoBack}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                canGoBack
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Skip / Submit */}
            <div className="flex items-center gap-3">
              {canSkip && (
                <button
                  onClick={onSkip}
                  className="text-gray-500 hover:text-gray-700 font-medium px-4 py-3 transition-colors"
                >
                  Skip
                </button>
              )}

              {showSubmit && (
                <button
                  onClick={onSubmit}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  {submitLabel}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
