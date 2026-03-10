'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

const COLORS = [
  { name: 'RED', hex: '#EF4444' },
  { name: 'BLUE', hex: '#3B82F6' },
  { name: 'GREEN', hex: '#10B981' },
  { name: 'YELLOW', hex: '#F59E0B' },
]

interface StroopTrial {
  word: string
  inkColor: typeof COLORS[0]
  isCongruent: boolean
}

function generateTrial(): StroopTrial {
  const isCongruent = Math.random() > 0.5
  const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)]

  if (isCongruent) {
    return {
      word: wordColor.name,
      inkColor: wordColor,
      isCongruent: true,
    }
  } else {
    const otherColors = COLORS.filter(c => c.name !== wordColor.name)
    const inkColor = otherColors[Math.floor(Math.random() * otherColors.length)]
    return {
      word: wordColor.name,
      inkColor,
      isCongruent: false,
    }
  }
}

interface StroopColorGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
}

function StroopColorGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
}: StroopColorGameProps) {
  const [trial, setTrial] = useState<StroopTrial | null>(null)
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null)

  useEffect(() => {
    if (isComplete) return

    const newTrial = generateTrial()
    setTrial(newTrial)
    setTrialStartTime(Date.now())
    setFeedback(null)
  }, [currentTrial, isComplete])

  const handleColorSelect = useCallback((colorName: string) => {
    if (!trial || feedback) return

    const responseTime = Date.now() - trialStartTime
    const isCorrect = colorName === trial.inkColor.name

    setFeedback({ correct: isCorrect })

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)
    }, 500)
  }, [trial, feedback, trialStartTime, onTrialComplete])

  if (isComplete || !trial) return null

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <p className="text-gray-600 mb-4">
        What color is the INK? (Not the word!)
      </p>

      {/* Word display */}
      <div className="mb-8 py-8">
        <span
          className="text-6xl font-bold"
          style={{ color: trial.inkColor.hex }}
        >
          {trial.word}
        </span>
      </div>

      {/* Color buttons */}
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map(color => {
          const isCorrect = feedback && color.name === trial.inkColor.name
          const isWrong = feedback && color.name !== trial.inkColor.name

          return (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color.name)}
              disabled={!!feedback}
              className={`py-4 rounded-xl font-bold text-white text-lg transition-all ${
                isCorrect
                  ? 'ring-4 ring-green-400 ring-offset-2'
                  : isWrong
                  ? 'opacity-50'
                  : ''
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {color.name}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 py-3 rounded-xl font-semibold ${
          feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.correct ? 'Correct!' : 'Wrong! Focus on the INK color.'}
        </div>
      )}

      <p className="text-sm text-gray-400 mt-6">
        Trial {currentTrial + 1} of {totalTrials}
      </p>
    </div>
  )
}

export default function StroopColorPage() {
  return (
    <ExerciseShell
      exerciseId="focus/stroop-color"
      exerciseName="Stroop Color"
      description="Name the color of the ink, ignoring what the word says"
      category="focus"
      categoryColor="#059669"
      totalTrials={20}
    >
      {(props) => <StroopColorGame {...props} />}
    </ExerciseShell>
  )
}
