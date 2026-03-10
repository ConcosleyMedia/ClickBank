'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

interface NumberPattern {
  sequence: number[]
  answer: number
  options: number[]
  rule: string
}

const PATTERNS: NumberPattern[] = [
  // Arithmetic +N
  { sequence: [2, 4, 6, 8], answer: 10, options: [10, 12, 9, 11], rule: '+2 each step' },
  { sequence: [5, 10, 15, 20], answer: 25, options: [25, 30, 22, 24], rule: '+5 each step' },
  { sequence: [3, 6, 9, 12], answer: 15, options: [15, 14, 18, 13], rule: '+3 each step' },
  { sequence: [7, 14, 21, 28], answer: 35, options: [35, 32, 42, 30], rule: '+7 each step' },

  // Geometric ×N
  { sequence: [2, 4, 8, 16], answer: 32, options: [32, 24, 30, 64], rule: '×2 each step' },
  { sequence: [3, 9, 27, 81], answer: 243, options: [243, 162, 108, 324], rule: '×3 each step' },
  { sequence: [1, 5, 25, 125], answer: 625, options: [625, 500, 250, 750], rule: '×5 each step' },

  // Squares
  { sequence: [1, 4, 9, 16], answer: 25, options: [25, 20, 36, 24], rule: 'Square numbers: n²' },
  { sequence: [4, 9, 16, 25], answer: 36, options: [36, 30, 49, 32], rule: 'Square numbers: n²' },

  // Cubes
  { sequence: [1, 8, 27, 64], answer: 125, options: [125, 100, 216, 81], rule: 'Cube numbers: n³' },

  // Fibonacci-like
  { sequence: [1, 1, 2, 3, 5], answer: 8, options: [8, 7, 6, 9], rule: 'Add previous two numbers' },
  { sequence: [2, 2, 4, 6, 10], answer: 16, options: [16, 14, 18, 12], rule: 'Add previous two numbers' },

  // Alternating
  { sequence: [1, 3, 2, 4, 3], answer: 5, options: [5, 4, 6, 7], rule: '+2, -1 alternating' },
  { sequence: [5, 10, 8, 16, 14], answer: 28, options: [28, 24, 22, 30], rule: '×2, -2 alternating' },

  // Subtract
  { sequence: [100, 90, 80, 70], answer: 60, options: [60, 50, 65, 55], rule: '-10 each step' },
  { sequence: [50, 45, 40, 35], answer: 30, options: [30, 25, 32, 28], rule: '-5 each step' },

  // Mixed
  { sequence: [1, 2, 4, 7, 11], answer: 16, options: [16, 15, 17, 14], rule: '+1, +2, +3, +4, +5...' },
  { sequence: [2, 3, 5, 8, 12], answer: 17, options: [17, 16, 18, 15], rule: '+1, +2, +3, +4, +5...' },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface NumberSeriesGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
}

function NumberSeriesGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
}: NumberSeriesGameProps) {
  const [pattern, setPattern] = useState<NumberPattern | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([])
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: number; rule: string } | null>(null)

  useEffect(() => {
    if (isComplete) return

    const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
    setPattern(randomPattern)
    setShuffledOptions(shuffleArray(randomPattern.options))
    setTrialStartTime(Date.now())
    setFeedback(null)
  }, [currentTrial, isComplete])

  const handleAnswer = useCallback((answer: number) => {
    if (!pattern || feedback) return

    const responseTime = Date.now() - trialStartTime
    const isCorrect = answer === pattern.answer

    setFeedback({ correct: isCorrect, answer: pattern.answer, rule: pattern.rule })

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)
    }, 1500)
  }, [pattern, feedback, trialStartTime, onTrialComplete])

  if (isComplete || !pattern) return null

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="text-center text-gray-600 mb-6">
        What number comes next?
      </p>

      {/* Sequence display */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {pattern.sequence.map((num, idx) => (
          <div
            key={idx}
            className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-xl font-bold text-blue-900"
          >
            {num}
          </div>
        ))}
        <div className="w-14 h-14 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-xl font-bold text-blue-400">
          ?
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map((option, idx) => {
          const isCorrectAnswer = feedback && option === feedback.answer
          const isSelected = feedback && option !== feedback.answer

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={!!feedback}
              className={`p-4 rounded-xl text-xl font-bold transition-all ${
                isCorrectAnswer
                  ? 'bg-green-500 text-white'
                  : isSelected
                  ? 'bg-gray-200 text-gray-400'
                  : feedback
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-900'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 p-4 rounded-xl text-center ${
          feedback.correct ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <p className={`font-semibold ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
            {feedback.correct ? 'Correct!' : `The answer was ${feedback.answer}`}
          </p>
          <p className="text-sm text-gray-600 mt-1">Rule: {feedback.rule}</p>
        </div>
      )}
    </div>
  )
}

export default function NumberSeriesPage() {
  return (
    <ExerciseShell
      exerciseId="logic/number-series"
      exerciseName="Number Series"
      description="Find the pattern and predict the next number in the sequence"
      category="logic"
      categoryColor="#2563EB"
      totalTrials={10}
    >
      {(props) => <NumberSeriesGame {...props} />}
    </ExerciseShell>
  )
}
