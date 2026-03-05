'use client'

import type { DemographicQuestion as DemographicQuestionType } from '@/types'

interface DemographicQuestionProps {
  question: DemographicQuestionType
  selectedValue: string | null
  onSelect: (value: string) => void
  isLastQuestion: boolean
}

export function DemographicQuestion({
  question,
  selectedValue,
  onSelect,
  isLastQuestion,
}: DemographicQuestionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-10">
        {question.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {question.options.map((option) => {
          const isSelected = selectedValue === option
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`py-4 px-4 rounded-xl font-medium text-center transition-all ${
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

      {/* Special CTA for last question */}
      {isLastQuestion && selectedValue && (
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Click the button below to see your results
          </p>
        </div>
      )}
    </div>
  )
}
