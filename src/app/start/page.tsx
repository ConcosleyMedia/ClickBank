'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Gender } from '@/types'

export default function StartPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGenderSelect = async (gender: Gender) => {
    setIsLoading(true)

    if (typeof window !== 'undefined') {
      // Clear any previous session
      sessionStorage.removeItem('quiz_session')
      sessionStorage.setItem('quiz_gender', gender)
    }

    router.push('/quiz')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Get ready to start the IQ test!
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
          <ul className="space-y-4 text-left">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-teal-600 font-semibold">1</span>
              </div>
              <p className="text-gray-700 pt-1">
                The test starts <span className="font-semibold text-green-600">easy</span> and gets <span className="font-semibold text-orange-600">progressively harder</span>
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-teal-600 font-semibold">2</span>
              </div>
              <p className="text-gray-700 pt-1">
                You&apos;ll solve <span className="font-semibold">30 questions</span> including pattern puzzles and logic problems
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-teal-600 font-semibold">3</span>
              </div>
              <p className="text-gray-700 pt-1">
                Take your time — <span className="font-semibold">accuracy matters more than speed</span>
              </p>
            </li>
          </ul>
        </div>

        <p className="text-gray-600 mb-6">Select your gender to begin</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => handleGenderSelect('male')}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 bg-white hover:bg-teal-50 border-2 border-gray-200 hover:border-teal-500 px-8 py-4 rounded-xl font-semibold text-gray-700 hover:text-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Male
          </button>

          <button
            onClick={() => handleGenderSelect('female')}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 bg-white hover:bg-teal-50 border-2 border-gray-200 hover:border-teal-500 px-8 py-4 rounded-xl font-semibold text-gray-700 hover:text-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Female
          </button>
        </div>

        <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-teal-700 font-medium">Takes about 15 minutes</span>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Methodology inspired by leading institutions</p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm font-semibold">
            <span>HARVARD</span>
            <span>STANFORD</span>
            <span>CAMBRIDGE</span>
            <span>OXFORD</span>
          </div>
        </div>
      </div>
    </div>
  )
}
