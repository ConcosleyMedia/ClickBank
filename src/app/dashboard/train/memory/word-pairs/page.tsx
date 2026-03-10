'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

const WORD_PAIRS = [
  ['OCEAN', 'WAVE'], ['FOREST', 'TREE'], ['MOUNTAIN', 'PEAK'], ['DESERT', 'SAND'],
  ['RIVER', 'FLOW'], ['CITY', 'STREET'], ['GARDEN', 'FLOWER'], ['KITCHEN', 'STOVE'],
  ['LIBRARY', 'BOOK'], ['HOSPITAL', 'NURSE'], ['SCHOOL', 'STUDENT'], ['OFFICE', 'DESK'],
  ['MUSIC', 'MELODY'], ['PAINTING', 'BRUSH'], ['THEATER', 'STAGE'], ['MOVIE', 'SCREEN'],
  ['SUMMER', 'HEAT'], ['WINTER', 'SNOW'], ['SPRING', 'BLOOM'], ['AUTUMN', 'LEAF'],
  ['MORNING', 'SUNRISE'], ['EVENING', 'SUNSET'], ['NIGHT', 'STARS'], ['DAY', 'LIGHT'],
  ['BIRD', 'NEST'], ['FISH', 'WATER'], ['HORSE', 'STABLE'], ['DOG', 'BARK'],
  ['COFFEE', 'MUG'], ['TEA', 'CUP'], ['BREAD', 'BUTTER'], ['CHEESE', 'WINE'],
]

const STUDY_TIMES = [5000, 4000, 3000, 2500, 2000] // ms per level
const PAIR_COUNTS = [4, 4, 5, 6, 6]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateDistractors(correct: string, allWords: string[]): string[] {
  const distractors = shuffleArray(
    allWords.filter(w => w !== correct)
  ).slice(0, 3)
  return shuffleArray([correct, ...distractors])
}

interface WordPairsGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
  difficultyLevel: number
}

function WordPairsGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
  difficultyLevel,
}: WordPairsGameProps) {
  const [phase, setPhase] = useState<'study' | 'test'>('study')
  const [pairs, setPairs] = useState<string[][]>([])
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null)

  const pairCount = PAIR_COUNTS[Math.min(difficultyLevel - 1, 4)]
  const studyTime = STUDY_TIMES[Math.min(difficultyLevel - 1, 4)]

  // Generate new pairs for each trial set
  useEffect(() => {
    if (isComplete) return

    const shuffledPairs = shuffleArray([...WORD_PAIRS]).slice(0, pairCount)
    setPairs(shuffledPairs)
    setCurrentPairIndex(0)
    setPhase('study')
    setFeedback(null)
  }, [Math.floor(currentTrial / pairCount), pairCount, isComplete])

  // Auto-transition from study to test
  useEffect(() => {
    if (phase !== 'study' || isComplete) return

    const timer = setTimeout(() => {
      setPhase('test')
      setCurrentPairIndex(0)
      const allSecondWords = WORD_PAIRS.map(p => p[1])
      setOptions(generateDistractors(pairs[0][1], allSecondWords))
      setTrialStartTime(Date.now())
    }, studyTime)

    return () => clearTimeout(timer)
  }, [phase, studyTime, pairs, isComplete])

  const handleAnswer = useCallback((answer: string) => {
    if (phase !== 'test' || feedback) return

    const responseTime = Date.now() - trialStartTime
    const correctAnswer = pairs[currentPairIndex][1]
    const isCorrect = answer === correctAnswer

    setFeedback({ correct: isCorrect, answer: correctAnswer })

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)

      // Move to next pair or reset
      const nextIndex = currentPairIndex + 1
      if (nextIndex < pairs.length) {
        setCurrentPairIndex(nextIndex)
        const allSecondWords = WORD_PAIRS.map(p => p[1])
        setOptions(generateDistractors(pairs[nextIndex][1], allSecondWords))
        setTrialStartTime(Date.now())
        setFeedback(null)
      }
    }, 1000)
  }, [phase, feedback, pairs, currentPairIndex, trialStartTime, onTrialComplete])

  if (isComplete) return null

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Study phase */}
      {phase === 'study' && (
        <>
          <p className="text-center text-gray-600 mb-6">
            Memorize these word pairs...
          </p>

          <div className="space-y-3 mb-6">
            {pairs.map(([word1, word2], idx) => (
              <div
                key={idx}
                className="bg-purple-50 rounded-xl p-4 flex items-center justify-center gap-4"
              >
                <span className="font-semibold text-purple-900">{word1}</span>
                <span className="text-purple-400">—</span>
                <span className="font-semibold text-purple-900">{word2}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Studying...
            </div>
          </div>
        </>
      )}

      {/* Test phase */}
      {phase === 'test' && pairs[currentPairIndex] && (
        <>
          <p className="text-center text-gray-600 mb-6">
            What word was paired with...
          </p>

          <div className="bg-purple-100 rounded-xl p-6 mb-6 text-center">
            <span className="text-2xl font-bold text-purple-900">
              {pairs[currentPairIndex][0]}
            </span>
            <span className="text-2xl text-purple-400 ml-2">— ?</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {options.map((option, idx) => {
              const isCorrectAnswer = feedback && option === feedback.answer
              const isWrongChoice = feedback && option !== feedback.answer && feedback.correct === false

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  className={`p-4 rounded-xl font-medium transition-all ${
                    isCorrectAnswer
                      ? 'bg-green-500 text-white'
                      : isWrongChoice
                      ? 'bg-gray-200 text-gray-400'
                      : feedback
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-900'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className={`mt-4 text-center py-2 rounded-xl font-medium ${
              feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {feedback.correct ? 'Correct!' : `The answer was: ${feedback.answer}`}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function WordPairsPage() {
  const [difficultyLevel] = useState(1)

  return (
    <ExerciseShell
      exerciseId="memory/word-pairs"
      exerciseName="Word Pairs"
      description="Study word pairs, then recall which words go together"
      category="memory"
      categoryColor="#7C3AED"
      difficultyLevel={difficultyLevel}
      totalTrials={8}
    >
      {(props) => <WordPairsGame {...props} difficultyLevel={difficultyLevel} />}
    </ExerciseShell>
  )
}
