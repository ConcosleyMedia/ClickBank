'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

interface Syllogism {
  premise1: string
  premise2: string
  conclusion: string
  isValid: boolean
  explanation: string
}

const SYLLOGISMS: Syllogism[] = [
  // Valid syllogisms
  {
    premise1: 'All mammals are warm-blooded.',
    premise2: 'All dogs are mammals.',
    conclusion: 'All dogs are warm-blooded.',
    isValid: true,
    explanation: 'Valid: Dogs ⊂ Mammals ⊂ Warm-blooded',
  },
  {
    premise1: 'All birds have feathers.',
    premise2: 'All sparrows are birds.',
    conclusion: 'All sparrows have feathers.',
    isValid: true,
    explanation: 'Valid: Sparrows ⊂ Birds → Feathers',
  },
  {
    premise1: 'No reptiles are mammals.',
    premise2: 'All snakes are reptiles.',
    conclusion: 'No snakes are mammals.',
    isValid: true,
    explanation: 'Valid: Snakes ⊂ Reptiles, Reptiles ∩ Mammals = ∅',
  },
  {
    premise1: 'All fruits contain seeds.',
    premise2: 'All apples are fruits.',
    conclusion: 'All apples contain seeds.',
    isValid: true,
    explanation: 'Valid: Apples ⊂ Fruits ⊂ Contains seeds',
  },
  {
    premise1: 'All squares are rectangles.',
    premise2: 'All rectangles have four sides.',
    conclusion: 'All squares have four sides.',
    isValid: true,
    explanation: 'Valid: Squares ⊂ Rectangles ⊂ Four-sided shapes',
  },
  {
    premise1: 'No fish are mammals.',
    premise2: 'All sharks are fish.',
    conclusion: 'No sharks are mammals.',
    isValid: true,
    explanation: 'Valid: Sharks ⊂ Fish, Fish ∩ Mammals = ∅',
  },
  // Invalid syllogisms
  {
    premise1: 'All cats are animals.',
    premise2: 'All dogs are animals.',
    conclusion: 'All cats are dogs.',
    isValid: false,
    explanation: 'Invalid: Shared category does not imply identity',
  },
  {
    premise1: 'Some birds can fly.',
    premise2: 'Penguins are birds.',
    conclusion: 'Penguins can fly.',
    isValid: false,
    explanation: 'Invalid: "Some" does not apply to all members',
  },
  {
    premise1: 'All roses are flowers.',
    premise2: 'All flowers are plants.',
    conclusion: 'All plants are roses.',
    isValid: false,
    explanation: 'Invalid: Subset relation does not reverse',
  },
  {
    premise1: 'Some students study hard.',
    premise2: 'All who study hard succeed.',
    conclusion: 'All students succeed.',
    isValid: false,
    explanation: 'Invalid: "Some" does not extend to all',
  },
  {
    premise1: 'All politicians make speeches.',
    premise2: 'John makes speeches.',
    conclusion: 'John is a politician.',
    isValid: false,
    explanation: 'Invalid: Affirming the consequent fallacy',
  },
  {
    premise1: 'All cars have wheels.',
    premise2: 'Bicycles have wheels.',
    conclusion: 'Bicycles are cars.',
    isValid: false,
    explanation: 'Invalid: Shared property does not imply category',
  },
  {
    premise1: 'No vegetables are fruits.',
    premise2: 'Carrots are vegetables.',
    conclusion: 'Carrots are not fruits.',
    isValid: true,
    explanation: 'Valid: Carrots ⊂ Vegetables, Vegetables ∩ Fruits = ∅',
  },
  {
    premise1: 'All prime numbers greater than 2 are odd.',
    premise2: '7 is a prime number greater than 2.',
    conclusion: '7 is odd.',
    isValid: true,
    explanation: 'Valid: Direct application of the rule',
  },
  {
    premise1: 'Some teachers are strict.',
    premise2: 'Ms. Smith is a teacher.',
    conclusion: 'Ms. Smith is strict.',
    isValid: false,
    explanation: 'Invalid: "Some" does not apply to all members',
  },
  {
    premise1: 'All metals conduct electricity.',
    premise2: 'Copper is a metal.',
    conclusion: 'Copper conducts electricity.',
    isValid: true,
    explanation: 'Valid: Copper ⊂ Metals → Conducts electricity',
  },
]

interface SyllogismGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
}

function SyllogismGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
}: SyllogismGameProps) {
  const [syllogism, setSyllogism] = useState<Syllogism | null>(null)
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null)

  useEffect(() => {
    if (isComplete) return

    const randomSyllogism = SYLLOGISMS[Math.floor(Math.random() * SYLLOGISMS.length)]
    setSyllogism(randomSyllogism)
    setTrialStartTime(Date.now())
    setFeedback(null)
  }, [currentTrial, isComplete])

  const handleAnswer = useCallback((userSaysValid: boolean) => {
    if (!syllogism || feedback) return

    const responseTime = Date.now() - trialStartTime
    const isCorrect = userSaysValid === syllogism.isValid

    setFeedback({ correct: isCorrect, explanation: syllogism.explanation })

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)
    }, 2000)
  }, [syllogism, feedback, trialStartTime, onTrialComplete])

  if (isComplete || !syllogism) return null

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="text-center text-gray-600 mb-6">
        Is this logical argument valid?
      </p>

      {/* Syllogism display */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">P1</span>
            <p className="text-gray-900">{syllogism.premise1}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">P2</span>
            <p className="text-gray-900">{syllogism.premise2}</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start gap-3">
              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">∴</span>
              <p className="text-gray-900 font-medium">{syllogism.conclusion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={!!feedback}
          className={`py-4 rounded-xl font-bold text-lg transition-all ${
            feedback
              ? syllogism.isValid
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-400'
              : 'bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-200'
          }`}
        >
          Valid
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={!!feedback}
          className={`py-4 rounded-xl font-bold text-lg transition-all ${
            feedback
              ? !syllogism.isValid
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-400'
              : 'bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-200'
          }`}
        >
          Invalid
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 p-4 rounded-xl text-center ${
          feedback.correct ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <p className={`font-semibold ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
            {feedback.correct ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-sm text-gray-600 mt-2">{feedback.explanation}</p>
        </div>
      )}

      <p className="text-sm text-gray-400 mt-6 text-center">
        Trial {currentTrial + 1} of {totalTrials}
      </p>
    </div>
  )
}

export default function SyllogismsPage() {
  return (
    <ExerciseShell
      exerciseId="logic/syllogisms"
      exerciseName="Syllogisms"
      description="Evaluate whether logical arguments are valid or invalid"
      category="logic"
      categoryColor="#2563EB"
      totalTrials={10}
    >
      {(props) => <SyllogismGame {...props} />}
    </ExerciseShell>
  )
}
