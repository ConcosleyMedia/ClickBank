'use client'

import { useEffect, useState } from 'react'
import { calculateIQScore } from '@/lib/quiz/scoring'

interface QuizResult {
  iqScore: number
  percentile: number
  memoryScore: number
  speedScore: number
  reactionScore: number
  concentrationScore: number
  logicScore: number
  strongestSkill: string
}

const skillColors = {
  memory: 'bg-purple-500',
  speed: 'bg-blue-500',
  reaction: 'bg-orange-500',
  concentration: 'bg-green-500',
  logic: 'bg-teal-500',
}

export default function DashboardPage() {
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    // Load quiz result from localStorage (persists across Whop redirect)
    const savedResult = localStorage.getItem('quiz_result')

    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult)
        const scores = calculateIQScore(parsed.answers || [], parsed.totalTimeSeconds || 600)

        setResult({
          iqScore: scores.iqScore,
          percentile: scores.percentile,
          memoryScore: scores.memoryScore,
          speedScore: scores.speedScore,
          reactionScore: scores.reactionScore,
          concentrationScore: scores.concentrationScore,
          logicScore: scores.logicScore,
          strongestSkill: scores.strongestSkill,
        })
      } catch {
        // Fallback to demo data if parsing fails
        setResult({
          iqScore: 118,
          percentile: 87,
          memoryScore: 82,
          speedScore: 91,
          reactionScore: 78,
          concentrationScore: 85,
          logicScore: 88,
          strongestSkill: 'speed',
        })
      }
    } else {
      // No saved result - show demo data
      setResult({
        iqScore: 118,
        percentile: 87,
        memoryScore: 82,
        speedScore: 91,
        reactionScore: 78,
        concentrationScore: 85,
        logicScore: 88,
        strongestSkill: 'speed',
      })
    }
  }, [])

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const skills = [
    { name: 'Memory', score: result.memoryScore, key: 'memory' },
    { name: 'Speed', score: result.speedScore, key: 'speed' },
    { name: 'Reaction', score: result.reactionScore, key: 'reaction' },
    { name: 'Concentration', score: result.concentrationScore, key: 'concentration' },
    { name: 'Logic', score: result.logicScore, key: 'logic' },
  ]

  return (
    <div className="space-y-8">
      {/* IQ Score hero */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white text-center">
        <p className="text-teal-100 mb-2">Your IQ Score</p>
        <p className="text-7xl font-bold mb-4">{result.iqScore}</p>
        <p className="text-teal-100">
          You scored higher than <strong className="text-white">{result.percentile}%</strong> of test takers
        </p>
      </div>

      {/* Category breakdown */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cognitive Profile</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.key}
              className={`bg-white rounded-xl p-4 border-2 ${
                skill.key === result.strongestSkill
                  ? 'border-teal-500'
                  : 'border-gray-100'
              }`}
            >
              {skill.key === result.strongestSkill && (
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                  Strongest
                </span>
              )}
              <p className="text-sm text-gray-500 mb-1">{skill.name}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{skill.score}</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${skillColors[skill.key as keyof typeof skillColors]} rounded-full transition-all duration-500`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Percentile ranking */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Ranking</h2>
        <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
            style={{ width: '100%' }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-teal-500 rounded-full shadow-lg"
            style={{ left: `calc(${result.percentile}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <p className="text-center text-gray-600 mt-4">
          You scored higher than <strong className="text-teal-600">{result.percentile}%</strong> of all test takers
        </p>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h2>
        <div className="space-y-4">
          {result.strongestSkill === 'speed' && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Exceptional Processing Speed</p>
                <p className="text-gray-600 text-sm">
                  Your speed score of {result.speedScore} shows you process information faster than most people.
                </p>
              </div>
            </div>
          )}
          {result.strongestSkill === 'memory' && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Strong Memory Retention</p>
                <p className="text-gray-600 text-sm">
                  Your memory score of {result.memoryScore} indicates excellent information retention abilities.
                </p>
              </div>
            </div>
          )}
          {result.strongestSkill === 'logic' && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Excellent Logical Reasoning</p>
                <p className="text-gray-600 text-sm">
                  Your logic score of {result.logicScore} demonstrates strong analytical thinking abilities.
                </p>
              </div>
            </div>
          )}
          {result.strongestSkill === 'concentration' && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Strong Focus & Concentration</p>
                <p className="text-gray-600 text-sm">
                  Your concentration score of {result.concentrationScore} shows excellent sustained attention.
                </p>
              </div>
            </div>
          )}
          {result.strongestSkill === 'reaction' && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Quick Reaction Time</p>
                <p className="text-gray-600 text-sm">
                  Your reaction score of {result.reactionScore} shows fast cognitive response abilities.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Overall IQ: {result.iqScore}</p>
              <p className="text-gray-600 text-sm">
                {result.iqScore >= 120 ? 'Superior intelligence - top tier cognitive abilities.' :
                 result.iqScore >= 110 ? 'Above average intelligence - strong cognitive performance.' :
                 result.iqScore >= 90 ? 'Average intelligence - solid cognitive foundation.' :
                 'Room for improvement - consider our training program.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
