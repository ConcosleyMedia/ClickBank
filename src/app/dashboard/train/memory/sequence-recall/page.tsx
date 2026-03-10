'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']
const ITEMS_PER_LEVEL = [3, 4, 5, 6, 7]
const DISPLAY_TIME_MS = 800

interface SequenceItem {
  id: number
  color: string
}

function generateSequence(level: number): SequenceItem[] {
  const count = ITEMS_PER_LEVEL[Math.min(level - 1, 4)]
  const sequence: SequenceItem[] = []

  for (let i = 0; i < count; i++) {
    sequence.push({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }

  return sequence
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface SequenceRecallGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
  difficultyLevel: number
}

function SequenceRecallGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
  difficultyLevel,
}: SequenceRecallGameProps) {
  const [phase, setPhase] = useState<'showing' | 'recall'>('showing')
  const [sequence, setSequence] = useState<SequenceItem[]>([])
  const [shuffledOptions, setShuffledOptions] = useState<SequenceItem[]>([])
  const [currentShowIndex, setCurrentShowIndex] = useState(0)
  const [userSelection, setUserSelection] = useState<SequenceItem[]>([])
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  // Generate new sequence for each trial
  useEffect(() => {
    if (isComplete) return

    const newSequence = generateSequence(difficultyLevel)
    setSequence(newSequence)
    setShuffledOptions(shuffleArray([...newSequence]))
    setPhase('showing')
    setCurrentShowIndex(0)
    setUserSelection([])
    setFeedback(null)
  }, [currentTrial, difficultyLevel, isComplete])

  // Show sequence one item at a time
  useEffect(() => {
    if (phase !== 'showing' || isComplete) return

    if (currentShowIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentShowIndex(prev => prev + 1)
      }, DISPLAY_TIME_MS)
      return () => clearTimeout(timer)
    } else {
      // Done showing, wait a moment then switch to recall
      const timer = setTimeout(() => {
        setPhase('recall')
        setTrialStartTime(Date.now())
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, currentShowIndex, sequence.length, isComplete])

  const handleItemClick = useCallback((item: SequenceItem) => {
    if (phase !== 'recall' || feedback) return

    const newSelection = [...userSelection, item]
    setUserSelection(newSelection)

    // Check if selection is complete
    if (newSelection.length === sequence.length) {
      const responseTime = Date.now() - trialStartTime
      const isCorrect = newSelection.every((sel, idx) =>
        sel.color === sequence[idx].color
      )

      setFeedback(isCorrect ? 'correct' : 'wrong')

      setTimeout(() => {
        onTrialComplete(isCorrect, responseTime)
      }, 800)
    }
  }, [phase, feedback, userSelection, sequence, trialStartTime, onTrialComplete])

  if (isComplete) {
    return null
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Instructions */}
      <p className="text-center text-gray-600 mb-8">
        {phase === 'showing'
          ? 'Watch the sequence...'
          : 'Tap the colors in the same order'}
      </p>

      {/* Showing phase */}
      {phase === 'showing' && (
        <div className="flex justify-center items-center h-32">
          {currentShowIndex < sequence.length ? (
            <div
              className="w-24 h-24 rounded-2xl animate-pulse"
              style={{ backgroundColor: sequence[currentShowIndex].color }}
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gray-200" />
          )}
        </div>
      )}

      {/* Recall phase */}
      {phase === 'recall' && (
        <>
          {/* User's selection */}
          <div className="flex justify-center gap-2 mb-8 min-h-[3rem]">
            {userSelection.map((item, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-lg"
                style={{ backgroundColor: item.color }}
              />
            ))}
            {Array.from({ length: sequence.length - userSelection.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300"
              />
            ))}
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-3 gap-4">
            {shuffledOptions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                disabled={!!feedback}
                className="aspect-square rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: item.color }}
              />
            ))}
          </div>

          {/* Feedback overlay */}
          {feedback && (
            <div className={`fixed inset-0 flex items-center justify-center bg-black/20 z-50`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {feedback === 'correct' ? (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SequenceRecallPage() {
  const [difficultyLevel, setDifficultyLevel] = useState(1)

  // TODO: Load user's current level from progress

  return (
    <ExerciseShell
      exerciseId="memory/sequence-recall"
      exerciseName="Sequence Recall"
      description="Watch the sequence of colors, then repeat them in the same order"
      category="memory"
      categoryColor="#7C3AED"
      difficultyLevel={difficultyLevel}
      totalTrials={10}
    >
      {(props) => (
        <SequenceRecallGame
          {...props}
          difficultyLevel={difficultyLevel}
        />
      )}
    </ExerciseShell>
  )
}
