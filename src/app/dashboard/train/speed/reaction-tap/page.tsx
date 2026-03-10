'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

type TargetState = 'waiting' | 'ready' | 'tooEarly'

interface ReactionTapGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
}

function ReactionTapGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
}: ReactionTapGameProps) {
  const [targetState, setTargetState] = useState<TargetState>('waiting')
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const targetTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Start new trial
  useEffect(() => {
    if (isComplete) return

    setTargetState('waiting')
    setReactionTime(null)
    setShowResult(false)

    // Random delay between 1-4 seconds
    const delay = 1000 + Math.random() * 3000
    timeoutRef.current = setTimeout(() => {
      setTargetState('ready')
      targetTimeRef.current = Date.now()
    }, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [currentTrial, isComplete])

  const handleTap = useCallback(() => {
    if (showResult) return

    if (targetState === 'waiting') {
      // Tapped too early!
      setTargetState('tooEarly')
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setTimeout(() => {
        onTrialComplete(false, 9999) // Penalty
      }, 1500)
      return
    }

    if (targetState === 'ready') {
      const rt = Date.now() - targetTimeRef.current
      setReactionTime(rt)
      setShowResult(true)

      setTimeout(() => {
        // Consider it "correct" if they reacted (even if slow)
        onTrialComplete(true, rt)
      }, 1500)
    }
  }, [targetState, showResult, onTrialComplete])

  if (isComplete) return null

  const getBackgroundColor = () => {
    if (targetState === 'ready' && !showResult) return 'bg-green-500'
    if (targetState === 'tooEarly') return 'bg-red-500'
    if (showResult) return reactionTime && reactionTime < 300 ? 'bg-green-400' : 'bg-yellow-400'
    return 'bg-gray-200'
  }

  const getReactionRating = (ms: number) => {
    if (ms < 200) return { text: 'Incredible!', emoji: '🚀' }
    if (ms < 250) return { text: 'Excellent!', emoji: '⚡' }
    if (ms < 300) return { text: 'Great!', emoji: '👍' }
    if (ms < 400) return { text: 'Good', emoji: '😊' }
    if (ms < 500) return { text: 'Average', emoji: '🙂' }
    return { text: 'Keep practicing', emoji: '💪' }
  }

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <p className="text-gray-600 mb-6">
        {targetState === 'waiting' && 'Wait for green...'}
        {targetState === 'ready' && !showResult && 'TAP NOW!'}
        {targetState === 'tooEarly' && 'Too early! Wait for green.'}
        {showResult && reactionTime && `${reactionTime}ms`}
      </p>

      <button
        onClick={handleTap}
        className={`w-64 h-64 rounded-full mx-auto flex items-center justify-center transition-colors ${getBackgroundColor()}`}
      >
        {targetState === 'waiting' && (
          <div className="text-center">
            <p className="text-gray-500 text-lg font-medium">Wait...</p>
          </div>
        )}

        {targetState === 'ready' && !showResult && (
          <div className="text-center">
            <p className="text-white text-2xl font-bold">TAP!</p>
          </div>
        )}

        {targetState === 'tooEarly' && (
          <div className="text-center">
            <p className="text-white text-xl font-bold">Too Early!</p>
            <p className="text-white/80 text-sm mt-1">Wait for green</p>
          </div>
        )}

        {showResult && reactionTime && (
          <div className="text-center">
            <p className="text-4xl mb-2">{getReactionRating(reactionTime).emoji}</p>
            <p className="text-white text-3xl font-bold">{reactionTime}ms</p>
            <p className="text-white/80 text-sm mt-1">{getReactionRating(reactionTime).text}</p>
          </div>
        )}
      </button>

      <p className="text-sm text-gray-400 mt-8">
        Trial {currentTrial + 1} of {totalTrials}
      </p>
    </div>
  )
}

export default function ReactionTapPage() {
  return (
    <ExerciseShell
      exerciseId="speed/reaction-tap"
      exerciseName="Reaction Tap"
      description="Tap as fast as you can when the circle turns green"
      category="speed"
      categoryColor="#DC2626"
      totalTrials={10}
    >
      {(props) => <ReactionTapGame {...props} />}
    </ExerciseShell>
  )
}
