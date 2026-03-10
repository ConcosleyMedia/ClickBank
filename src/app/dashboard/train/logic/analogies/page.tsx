'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExerciseShell } from '@/components/training/ExerciseShell'

interface Analogy {
  pair1: [string, string]
  pair2First: string
  answer: string
  options: string[]
  relationship: string
}

const ANALOGIES: Analogy[] = [
  // Opposites
  {
    pair1: ['Hot', 'Cold'],
    pair2First: 'Light',
    answer: 'Dark',
    options: ['Dark', 'Bright', 'Warm', 'Heavy'],
    relationship: 'Opposites',
  },
  {
    pair1: ['Up', 'Down'],
    pair2First: 'Left',
    answer: 'Right',
    options: ['Right', 'Forward', 'Back', 'Center'],
    relationship: 'Opposites',
  },
  {
    pair1: ['Day', 'Night'],
    pair2First: 'Summer',
    answer: 'Winter',
    options: ['Winter', 'Spring', 'Fall', 'Cold'],
    relationship: 'Opposites',
  },
  // Part to whole
  {
    pair1: ['Petal', 'Flower'],
    pair2First: 'Wheel',
    answer: 'Car',
    options: ['Car', 'Bicycle', 'Road', 'Tire'],
    relationship: 'Part to whole',
  },
  {
    pair1: ['Page', 'Book'],
    pair2First: 'Key',
    answer: 'Keyboard',
    options: ['Keyboard', 'Lock', 'Door', 'Piano'],
    relationship: 'Part to whole',
  },
  {
    pair1: ['Brick', 'Wall'],
    pair2First: 'Cell',
    answer: 'Body',
    options: ['Body', 'Prison', 'Battery', 'Phone'],
    relationship: 'Part to whole',
  },
  // Tool to function
  {
    pair1: ['Hammer', 'Nail'],
    pair2First: 'Screwdriver',
    answer: 'Screw',
    options: ['Screw', 'Wood', 'Bolt', 'Drill'],
    relationship: 'Tool to object',
  },
  {
    pair1: ['Pen', 'Write'],
    pair2First: 'Knife',
    answer: 'Cut',
    options: ['Cut', 'Sharp', 'Stab', 'Cook'],
    relationship: 'Tool to action',
  },
  // Category membership
  {
    pair1: ['Dog', 'Mammal'],
    pair2First: 'Eagle',
    answer: 'Bird',
    options: ['Bird', 'Animal', 'Reptile', 'Fish'],
    relationship: 'Member to category',
  },
  {
    pair1: ['Apple', 'Fruit'],
    pair2First: 'Carrot',
    answer: 'Vegetable',
    options: ['Vegetable', 'Root', 'Food', 'Orange'],
    relationship: 'Member to category',
  },
  // Synonyms
  {
    pair1: ['Big', 'Large'],
    pair2First: 'Small',
    answer: 'Tiny',
    options: ['Tiny', 'Little', 'Mini', 'Short'],
    relationship: 'Synonyms',
  },
  {
    pair1: ['Happy', 'Joyful'],
    pair2First: 'Sad',
    answer: 'Sorrowful',
    options: ['Sorrowful', 'Angry', 'Upset', 'Blue'],
    relationship: 'Synonyms',
  },
  // Degree/intensity
  {
    pair1: ['Warm', 'Hot'],
    pair2First: 'Cool',
    answer: 'Cold',
    options: ['Cold', 'Freezing', 'Chilly', 'Ice'],
    relationship: 'Degree of intensity',
  },
  {
    pair1: ['Walk', 'Run'],
    pair2First: 'Whisper',
    answer: 'Shout',
    options: ['Shout', 'Talk', 'Scream', 'Speak'],
    relationship: 'Degree of intensity',
  },
  // Worker to workplace
  {
    pair1: ['Chef', 'Kitchen'],
    pair2First: 'Teacher',
    answer: 'Classroom',
    options: ['Classroom', 'School', 'Office', 'Library'],
    relationship: 'Worker to workplace',
  },
  {
    pair1: ['Doctor', 'Hospital'],
    pair2First: 'Pilot',
    answer: 'Cockpit',
    options: ['Cockpit', 'Airport', 'Plane', 'Sky'],
    relationship: 'Worker to workplace',
  },
  // Product to source
  {
    pair1: ['Milk', 'Cow'],
    pair2First: 'Wool',
    answer: 'Sheep',
    options: ['Sheep', 'Cotton', 'Goat', 'Fabric'],
    relationship: 'Product to source',
  },
  {
    pair1: ['Paper', 'Tree'],
    pair2First: 'Glass',
    answer: 'Sand',
    options: ['Sand', 'Window', 'Silicon', 'Beach'],
    relationship: 'Product to source',
  },
  // Object to characteristic
  {
    pair1: ['Sugar', 'Sweet'],
    pair2First: 'Lemon',
    answer: 'Sour',
    options: ['Sour', 'Yellow', 'Bitter', 'Citrus'],
    relationship: 'Object to characteristic',
  },
  {
    pair1: ['Ice', 'Cold'],
    pair2First: 'Fire',
    answer: 'Hot',
    options: ['Hot', 'Red', 'Burning', 'Bright'],
    relationship: 'Object to characteristic',
  },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface AnalogyGameProps {
  onTrialComplete: (correct: boolean, responseTimeMs: number) => void
  currentTrial: number
  totalTrials: number
  isComplete: boolean
}

function AnalogyGame({
  onTrialComplete,
  currentTrial,
  totalTrials,
  isComplete,
}: AnalogyGameProps) {
  const [analogy, setAnalogy] = useState<Analogy | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string; relationship: string } | null>(null)

  useEffect(() => {
    if (isComplete) return

    const randomAnalogy = ANALOGIES[Math.floor(Math.random() * ANALOGIES.length)]
    setAnalogy(randomAnalogy)
    setShuffledOptions(shuffleArray(randomAnalogy.options))
    setTrialStartTime(Date.now())
    setFeedback(null)
  }, [currentTrial, isComplete])

  const handleAnswer = useCallback((answer: string) => {
    if (!analogy || feedback) return

    const responseTime = Date.now() - trialStartTime
    const isCorrect = answer === analogy.answer

    setFeedback({ correct: isCorrect, answer: analogy.answer, relationship: analogy.relationship })

    setTimeout(() => {
      onTrialComplete(isCorrect, responseTime)
    }, 1500)
  }, [analogy, feedback, trialStartTime, onTrialComplete])

  if (isComplete || !analogy) return null

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="text-center text-gray-600 mb-6">
        Complete the analogy
      </p>

      {/* Analogy display */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-semibold">
            {analogy.pair1[0]}
          </span>
          <span className="text-gray-400">is to</span>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-semibold">
            {analogy.pair1[1]}
          </span>
        </div>
        <div className="text-center text-2xl text-gray-300 my-4">as</div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl font-semibold">
            {analogy.pair2First}
          </span>
          <span className="text-gray-400">is to</span>
          <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-semibold border-2 border-dashed border-amber-300">
            ?
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map((option, idx) => {
          const isCorrectAnswer = feedback && option === feedback.answer
          const isWrong = feedback && option !== feedback.answer

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={!!feedback}
              className={`p-4 rounded-xl font-semibold transition-all ${
                isCorrectAnswer
                  ? 'bg-green-500 text-white'
                  : isWrong
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
            {feedback.correct ? 'Correct!' : `The answer was "${feedback.answer}"`}
          </p>
          <p className="text-sm text-gray-600 mt-1">Relationship: {feedback.relationship}</p>
        </div>
      )}

      <p className="text-sm text-gray-400 mt-6 text-center">
        Trial {currentTrial + 1} of {totalTrials}
      </p>
    </div>
  )
}

export default function AnalogiesPage() {
  return (
    <ExerciseShell
      exerciseId="logic/analogies"
      exerciseName="Analogies"
      description="Find the relationship between word pairs and complete the analogy"
      category="logic"
      categoryColor="#2563EB"
      totalTrials={10}
    >
      {(props) => <AnalogyGame {...props} />}
    </ExerciseShell>
  )
}
