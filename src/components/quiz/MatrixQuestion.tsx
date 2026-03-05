'use client'

import { useMemo } from 'react'
import type { MatrixQuestion as MatrixQuestionType } from '@/types'

interface MatrixQuestionProps {
  question: MatrixQuestionType
  selectedValue: string | null
  onSelect: (value: string, isCorrect: boolean) => void
}

export function MatrixQuestion({ question, selectedValue, onSelect }: MatrixQuestionProps) {
  // Memoize shuffled options so they don't change on re-render
  const allOptions = useMemo(() => {
    const options = [question.correctAnswer, ...question.distractors]
    // Use question ID as seed for consistent shuffle
    const seed = question.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return options
      .map((opt, i) => ({ opt, sort: Math.sin(seed + i) }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ opt }) => opt)
  }, [question.id, question.correctAnswer, question.distractors])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
        Which pattern completes the sequence?
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pattern grid (3x3 with last cell as ?) */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-3">
            {question.gridSvgs.map((svg, index) => (
              <div
                key={`grid-${question.id}-${index}`}
                className="aspect-square bg-white rounded-xl p-2 flex items-center justify-center shadow-sm"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
          </div>
        </div>

        {/* Answer options (2x3 grid) */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-4 text-center">Select your answer:</p>
          <div className="grid grid-cols-2 gap-3">
            {allOptions.map((optionSvg, index) => {
              const isSelected = selectedValue === optionSvg
              const isCorrect = optionSvg === question.correctAnswer
              return (
                <button
                  key={`option-${question.id}-${index}`}
                  onClick={() => onSelect(optionSvg, isCorrect)}
                  className={`aspect-square bg-white rounded-xl p-2 flex items-center justify-center transition-all border-2 ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500 ring-offset-2'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: optionSvg }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
