'use client'

import type { LikertQuestion as LikertQuestionType } from '@/types'

interface LikertQuestionProps {
  question: LikertQuestionType
  selectedValue: string | null
  onSelect: (value: string) => void
}

const likertOptions = [
  { value: '5', label: 'Strongly Agree', color: 'bg-green-500 hover:bg-green-600' },
  { value: '4', label: 'Agree', color: 'bg-green-400 hover:bg-green-500' },
  { value: '3', label: 'Neutral', color: 'bg-yellow-400 hover:bg-yellow-500' },
  { value: '2', label: 'Disagree', color: 'bg-orange-400 hover:bg-orange-500' },
  { value: '1', label: 'Strongly Disagree', color: 'bg-red-400 hover:bg-red-500' },
]

export function LikertQuestion({ question, selectedValue, onSelect }: LikertQuestionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Statement */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-10">
        {question.statement}
      </h2>

      {/* Likert scale options */}
      <div className="space-y-3">
        {likertOptions.map((option) => {
          const isSelected = selectedValue === option.value
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all transform ${
                option.color
              } ${
                isSelected
                  ? 'ring-4 ring-offset-2 ring-teal-500 scale-[1.02]'
                  : 'hover:scale-[1.01]'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
