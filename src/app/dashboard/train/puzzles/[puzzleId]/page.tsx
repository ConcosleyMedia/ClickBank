'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

// Simple pattern puzzle component
function PatternPuzzle({ onComplete }: { onComplete: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<boolean | null>(null)

  // Correct answer is option 2 (index 2)
  const correctAnswer = 2

  const handleSelect = (index: number) => {
    if (feedback !== null) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return
    const isCorrect = selected === correctAnswer
    setFeedback(isCorrect)

    setTimeout(() => {
      onComplete(isCorrect)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-center text-gray-600 mb-6">
        Which pattern completes the sequence?
      </p>

      {/* 3x3 Grid with missing piece */}
      <div className="bg-gray-100 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div
              key={i}
              className="aspect-square bg-white rounded-xl flex items-center justify-center"
            >
              <div
                className="w-12 h-12 rounded-lg"
                style={{
                  backgroundColor: `hsl(${(i * 40) % 360}, 70%, 60%)`,
                  transform: `rotate(${i * 45}deg)`,
                }}
              />
            </div>
          ))}
          <div className="aspect-square bg-amber-100 rounded-xl flex items-center justify-center border-2 border-dashed border-amber-300">
            <span className="text-3xl text-amber-400">?</span>
          </div>
        </div>
      </div>

      {/* Answer options */}
      <p className="text-sm text-gray-500 mb-3 text-center">Select your answer:</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const isSelected = selected === i
          const isCorrectAnswer = feedback !== null && i === correctAnswer
          const isWrongSelection = feedback === false && selected === i

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={feedback !== null}
              className={`aspect-square bg-white rounded-xl flex items-center justify-center border-2 transition-all ${
                isCorrectAnswer
                  ? 'border-green-500 ring-2 ring-green-500'
                  : isWrongSelection
                  ? 'border-red-500 ring-2 ring-red-500'
                  : isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg"
                style={{
                  backgroundColor: `hsl(${((i + 8) * 40) % 360}, 70%, 60%)`,
                  transform: `rotate(${(i + 8) * 45}deg)`,
                }}
              />
            </button>
          )
        })}
      </div>

      {/* Submit button */}
      {feedback === null ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <div className={`text-center py-3 rounded-xl font-semibold ${
          feedback ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback ? 'Correct! Well done.' : 'Not quite. The correct answer is highlighted.'}
        </div>
      )}
    </div>
  )
}

export default function PuzzlePage() {
  const router = useRouter()
  const params = useParams()
  const puzzleId = params.puzzleId as string

  const [isComplete, setIsComplete] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)

  const handleComplete = (correct: boolean) => {
    setIsComplete(true)
    setWasCorrect(correct)
  }

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          wasCorrect ? 'bg-green-100' : 'bg-amber-100'
        }`}>
          {wasCorrect ? (
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-3xl">🧩</span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {wasCorrect ? 'Puzzle Solved!' : 'Good Try!'}
        </h1>
        <p className="text-gray-600 mb-8">
          {wasCorrect
            ? 'Great job! Ready for another challenge?'
            : 'Keep practicing to improve your pattern recognition.'}
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard/train/puzzles"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
          >
            All Puzzles
          </Link>
          <button
            onClick={() => {
              setIsComplete(false)
              setWasCorrect(false)
            }}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/train/puzzles"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Puzzles
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Puzzle #{puzzleId.replace('puzzle-', '')}</span>
        </div>
      </div>

      <PatternPuzzle onComplete={handleComplete} />
    </div>
  )
}
