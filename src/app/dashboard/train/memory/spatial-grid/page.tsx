'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

const GRID_CONFIG = [
  { size: 3, cells: 3, displayMs: 2000 },
  { size: 3, cells: 4, displayMs: 1500 },
  { size: 4, cells: 5, displayMs: 1500 },
  { size: 4, cells: 6, displayMs: 1000 },
  { size: 5, cells: 7, displayMs: 1000 },
]

function generatePattern(level: number): Set<number> {
  const config = GRID_CONFIG[Math.min(level - 1, 4)]
  const totalCells = config.size * config.size
  const pattern = new Set<number>()

  while (pattern.size < config.cells) {
    pattern.add(Math.floor(Math.random() * totalCells))
  }

  return pattern
}

interface SpatialGridGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
  difficultyLevel: number
}

function SpatialGridGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
  difficultyLevel,
}: SpatialGridGameProps) {
  const [phase, setPhase] = useState<'showing' | 'recall'>('showing')
  const [pattern, setPattern] = useState<Set<number>>(new Set())
  const [userSelection, setUserSelection] = useState<Set<number>>(new Set())
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const config = GRID_CONFIG[Math.min(difficultyLevel - 1, 4)]

  // Generate new pattern for each trial
  useEffect(() => {
    if (isComplete) return

    const newPattern = generatePattern(difficultyLevel)
    setPattern(newPattern)
    setUserSelection(new Set())
    setPhase('showing')
    setFeedback(null)
  }, [currentTrial, difficultyLevel, isComplete])

  // Auto-hide pattern after display time
  useEffect(() => {
    if (phase !== 'showing' || isComplete) return

    const timer = setTimeout(() => {
      setPhase('recall')
      setTrialStartTime(Date.now())
    }, config.displayMs)

    return () => clearTimeout(timer)
  }, [phase, config.displayMs, isComplete])

  const handleCellClick = useCallback((cellIndex: number) => {
    if (phase !== 'recall' || feedback) return

    const newSelection = new Set(userSelection)
    if (newSelection.has(cellIndex)) {
      newSelection.delete(cellIndex)
    } else {
      newSelection.add(cellIndex)
    }
    setUserSelection(newSelection)
  }, [phase, feedback, userSelection])

  const handleSubmit = useCallback(() => {
    if (phase !== 'recall' || feedback) return

    const responseTime = Date.now() - trialStartTime

    // Check accuracy
    const correctCells = [...pattern].filter(cell => userSelection.has(cell)).length
    const extraCells = [...userSelection].filter(cell => !pattern.has(cell)).length
    const isCorrect = correctCells === pattern.size && extraCells === 0

    setFeedback(isCorrect ? 'correct' : 'wrong')

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)
    }, 800)
  }, [phase, feedback, pattern, userSelection, trialStartTime, onTrialComplete])

  if (isComplete) return null

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-center text-gray-600 mb-6">
        {phase === 'showing'
          ? 'Memorize the highlighted cells...'
          : `Tap the ${config.cells} cells that were lit`}
      </p>

      {/* Grid */}
      <div
        className="grid gap-2 mb-6"
        style={{ gridTemplateColumns: `repeat(${config.size}, 1fr)` }}
      >
        {Array.from({ length: config.size * config.size }).map((_, idx) => {
          const isPatternCell = pattern.has(idx)
          const isSelected = userSelection.has(idx)
          const showPattern = phase === 'showing' && isPatternCell
          const showFeedbackCorrect = feedback && isPatternCell && isSelected
          const showFeedbackMissed = feedback === 'wrong' && isPatternCell && !isSelected
          const showFeedbackWrong = feedback === 'wrong' && !isPatternCell && isSelected

          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={phase === 'showing' || !!feedback}
              className={`aspect-square rounded-lg transition-all ${
                showPattern
                  ? 'bg-purple-500'
                  : showFeedbackCorrect
                  ? 'bg-green-500'
                  : showFeedbackMissed
                  ? 'bg-yellow-500'
                  : showFeedbackWrong
                  ? 'bg-red-500'
                  : isSelected
                  ? 'bg-purple-400'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            />
          )
        })}
      </div>

      {/* Submit button */}
      {phase === 'recall' && !feedback && (
        <button
          onClick={handleSubmit}
          disabled={userSelection.size === 0}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Check Answer ({userSelection.size}/{config.cells})
        </button>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`text-center py-3 rounded-xl font-semibold ${
          feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback === 'correct' ? 'Correct!' : 'Not quite - see the correct pattern above'}
        </div>
      )}
    </div>
  )
}

export default function SpatialGridPage() {
  const [difficultyLevel] = useState(1)

  return (
    <ExerciseShell
      exerciseId="memory/spatial-grid"
      exerciseName="Spatial Grid"
      description="Memorize the pattern of highlighted cells, then recreate it"
      category="memory"
      categoryColor="#7C3AED"
      difficultyLevel={difficultyLevel}
      totalTrials={10}
    >
      {(props) => <SpatialGridGame {...props} difficultyLevel={difficultyLevel} />}
    </ExerciseShell>
  )
}
