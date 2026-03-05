'use client'

import { useState, useEffect } from 'react'

interface CalculationScreenProps {
  onComplete: () => void
  onWarningDismiss: () => void
  onMicroAnswer: (question: string, answer: string) => void
}

const checkpoints = [
  { percent: 15, label: 'Analyzing response patterns...' },
  { percent: 35, label: 'Calculating cognitive scores...' },
  { percent: 55, label: 'Comparing with global database...' },
  { percent: 75, label: 'Generating personalized insights...' },
  { percent: 95, label: 'Finalizing your IQ report...' },
]

export function CalculationScreen({ onComplete, onWarningDismiss, onMicroAnswer }: CalculationScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [showMicroQuestion, setShowMicroQuestion] = useState<1 | 2 | null>(null)
  const [warningDismissed, setWarningDismissed] = useState(false)
  const [micro1Answered, setMicro1Answered] = useState(false)
  const [micro2Answered, setMicro2Answered] = useState(false)

  useEffect(() => {
    const duration = 38000 // 38 seconds total
    const interval = 100
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment

        // Show warning at ~20%
        if (next >= 20 && next < 22 && !warningDismissed && !showWarning) {
          setShowWarning(true)
          return prev // Pause progress
        }

        // Show first micro question at ~50%
        if (next >= 50 && next < 52 && !micro1Answered && !showMicroQuestion) {
          setShowMicroQuestion(1)
          return prev
        }

        // Show second micro question at ~80%
        if (next >= 80 && next < 82 && !micro2Answered && !showMicroQuestion) {
          setShowMicroQuestion(2)
          return prev
        }

        if (next >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }

        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [warningDismissed, micro1Answered, micro2Answered, showWarning, showMicroQuestion, onComplete])

  // Update checkpoint
  useEffect(() => {
    const checkpoint = checkpoints.findIndex((cp) => progress < cp.percent)
    setCurrentCheckpoint(checkpoint === -1 ? checkpoints.length - 1 : Math.max(0, checkpoint - 1))
  }, [progress])

  const handleWarningDismiss = () => {
    setShowWarning(false)
    setWarningDismissed(true)
    onWarningDismiss()
  }

  const handleMicroAnswer = (answer: string) => {
    const question = showMicroQuestion === 1 ? 'Do you enjoy solving puzzles?' : 'Do you prefer numbers or words?'
    onMicroAnswer(question, answer)

    if (showMicroQuestion === 1) {
      setMicro1Answered(true)
    } else {
      setMicro2Answered(true)
    }
    setShowMicroQuestion(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 relative">
      {/* Background blur when modal is showing */}
      <div className={`absolute inset-0 transition-all duration-300 ${showWarning || showMicroQuestion ? 'backdrop-blur-sm' : ''}`} />

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Brain animation */}
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-ping" />
          <div className="absolute inset-2 bg-teal-500/30 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Calculating Your IQ Score
        </h2>
        <p className="text-gray-400 mb-8">
          Please wait while we analyze your responses...
        </p>

        {/* Progress bar */}
        <div className="bg-gray-700 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-lg font-semibold text-teal-400 mb-8">
          {Math.round(progress)}%
        </p>

        {/* Checkpoints */}
        <div className="space-y-3">
          {checkpoints.map((cp, index) => (
            <div
              key={cp.percent}
              className={`flex items-center gap-3 transition-all duration-300 ${
                index <= currentCheckpoint ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                progress >= cp.percent ? 'bg-teal-500' : 'bg-gray-600'
              }`}>
                {progress >= cp.percent ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </div>
              <span className={`text-sm ${progress >= cp.percent ? 'text-white' : 'text-gray-500'}`}>
                {cp.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleWarningDismiss} />
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">WARNING</h3>
            <p className="text-gray-600 mb-6">
              Your results are being calculated. Please do not close this page or your progress will be lost.
            </p>
            <button
              onClick={handleWarningDismiss}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              I UNDERSTAND
            </button>
          </div>
        </div>
      )}

      {/* Micro Question Modal */}
      {showMicroQuestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50" />
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {showMicroQuestion === 1
                ? 'Do you enjoy solving puzzles?'
                : 'Do you prefer working with numbers or words?'}
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleMicroAnswer(showMicroQuestion === 1 ? 'Yes' : 'Numbers')}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                {showMicroQuestion === 1 ? 'Yes' : 'Numbers'}
              </button>
              <button
                onClick={() => handleMicroAnswer(showMicroQuestion === 1 ? 'No' : 'Words')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                {showMicroQuestion === 1 ? 'No' : 'Words'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
