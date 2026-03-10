'use client'

import type { TextQuestion as TextQuestionType } from '@/types'

interface TextQuestionProps {
  question: TextQuestionType
  selectedValue: string | null
  onSelect: (value: string, isCorrect: boolean) => void
}

export function TextQuestion({ question, selectedValue, onSelect }: TextQuestionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question */}
      <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-10">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedValue === option
          const isCorrect = option === question.correctAnswer
          return (
            <button
              key={option}
              onClick={() => onSelect(option, isCorrect)}
              className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium text-left transition-all text-sm sm:text-base ${
                isSelected
                  ? 'bg-teal-500 text-white ring-4 ring-offset-2 ring-teal-500'
                  : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
