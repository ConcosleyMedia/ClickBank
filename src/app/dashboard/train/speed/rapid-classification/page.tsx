'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

interface ClassificationItem {
  word: string
  category: 'living' | 'nonliving'
}

const ITEMS: ClassificationItem[] = [
  // Living things
  { word: 'Dog', category: 'living' },
  { word: 'Cat', category: 'living' },
  { word: 'Tree', category: 'living' },
  { word: 'Bird', category: 'living' },
  { word: 'Fish', category: 'living' },
  { word: 'Flower', category: 'living' },
  { word: 'Grass', category: 'living' },
  { word: 'Butterfly', category: 'living' },
  { word: 'Mushroom', category: 'living' },
  { word: 'Bacteria', category: 'living' },
  { word: 'Elephant', category: 'living' },
  { word: 'Spider', category: 'living' },
  { word: 'Whale', category: 'living' },
  { word: 'Fern', category: 'living' },
  { word: 'Ant', category: 'living' },
  { word: 'Eagle', category: 'living' },
  { word: 'Shark', category: 'living' },
  { word: 'Rose', category: 'living' },
  { word: 'Oak', category: 'living' },
  { word: 'Coral', category: 'living' },
  // Non-living things
  { word: 'Rock', category: 'nonliving' },
  { word: 'Chair', category: 'nonliving' },
  { word: 'Car', category: 'nonliving' },
  { word: 'Book', category: 'nonliving' },
  { word: 'Water', category: 'nonliving' },
  { word: 'Cloud', category: 'nonliving' },
  { word: 'Phone', category: 'nonliving' },
  { word: 'Mountain', category: 'nonliving' },
  { word: 'Computer', category: 'nonliving' },
  { word: 'Diamond', category: 'nonliving' },
  { word: 'Glass', category: 'nonliving' },
  { word: 'Metal', category: 'nonliving' },
  { word: 'Plastic', category: 'nonliving' },
  { word: 'Sand', category: 'nonliving' },
  { word: 'Ice', category: 'nonliving' },
  { word: 'Fire', category: 'nonliving' },
  { word: 'Wind', category: 'nonliving' },
  { word: 'Statue', category: 'nonliving' },
  { word: 'Bridge', category: 'nonliving' },
  { word: 'Coin', category: 'nonliving' },
]

interface RapidClassificationGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
}

function RapidClassificationGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
}: RapidClassificationGameProps) {
  const [item, setItem] = useState<ClassificationItem | null>(null)
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null)

  useEffect(() => {
    if (isComplete) return

    const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)]
    setItem(randomItem)
    setTrialStartTime(Date.now())
    setFeedback(null)
  }, [currentTrial, isComplete])

  const handleClassify = useCallback((category: 'living' | 'nonliving') => {
    if (!item || feedback) return

    const responseTime = Date.now() - trialStartTime
    const isCorrect = category === item.category

    setFeedback({ correct: isCorrect })

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)
    }, 400) // Fast transition for speed exercise
  }, [item, feedback, trialStartTime, onTrialComplete])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback || !item) return

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleClassify('living')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleClassify('nonliving')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [feedback, item, handleClassify])

  if (isComplete || !item) return null

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <p className="text-gray-600 mb-4">
        Classify as fast as possible!
      </p>

      {/* Word display */}
      <div className="mb-8 py-8">
        <span
          className={`text-5xl font-bold transition-colors ${
            feedback === null
              ? 'text-gray-900'
              : feedback.correct
              ? 'text-green-500'
              : 'text-red-500'
          }`}
        >
          {item.word}
        </span>
      </div>

      {/* Category buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleClassify('living')}
          disabled={!!feedback}
          className={`py-6 rounded-xl font-bold text-xl transition-all ${
            feedback
              ? item.category === 'living'
                ? 'bg-green-500 text-white ring-4 ring-green-300'
                : 'bg-gray-200 text-gray-400'
              : 'bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-200'
          }`}
        >
          <div className="text-3xl mb-2">🌱</div>
          Living
          <div className="text-sm font-normal mt-1 opacity-70">← or A</div>
        </button>
        <button
          onClick={() => handleClassify('nonliving')}
          disabled={!!feedback}
          className={`py-6 rounded-xl font-bold text-xl transition-all ${
            feedback
              ? item.category === 'nonliving'
                ? 'bg-blue-500 text-white ring-4 ring-blue-300'
                : 'bg-gray-200 text-gray-400'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-2 border-blue-200'
          }`}
        >
          <div className="text-3xl mb-2">🪨</div>
          Non-Living
          <div className="text-sm font-normal mt-1 opacity-70">→ or D</div>
        </button>
      </div>

      {/* Quick feedback indicator */}
      {feedback && (
        <div className={`mt-6 text-2xl font-bold ${
          feedback.correct ? 'text-green-500' : 'text-red-500'
        }`}>
          {feedback.correct ? '✓' : '✗'}
        </div>
      )}

      <p className="text-sm text-gray-400 mt-8">
        Trial {currentTrial + 1} of {totalTrials}
      </p>
    </div>
  )
}

export default function RapidClassificationPage() {
  return (
    <ExerciseShell
      exerciseId="speed/rapid-classification"
      exerciseName="Rapid Classification"
      description="Classify items as living or non-living as quickly as possible"
      category="speed"
      categoryColor="#DC2626"
      totalTrials={20}
    >
      {(props) => <RapidClassificationGame {...props} />}
    </ExerciseShell>
  )
}
