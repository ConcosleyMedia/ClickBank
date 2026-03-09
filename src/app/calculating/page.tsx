'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SocialProofScreen } from '@/components/funnel/SocialProofScreen'
import { CalculationScreen } from '@/components/funnel/CalculationScreen'

type Stage = 'social-proof' | 'calculating'

export default function CalculatingPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('social-proof')
  const [microAnswers, setMicroAnswers] = useState<Record<string, string>>({})

  // Check for quiz result on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const quizResult = localStorage.getItem('quiz_result')
      if (!quizResult) {
        router.replace('/start')
      }
    }
  }, [router])

  const handleSocialProofContinue = () => {
    setStage('calculating')
  }

  const handleWarningDismiss = () => {
    // Track warning acknowledgment if needed
  }

  const handleMicroAnswer = (question: string, answer: string) => {
    setMicroAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }))

    // Store in session
    if (typeof window !== 'undefined') {
      const existing = sessionStorage.getItem('micro_answers')
      const answers = existing ? JSON.parse(existing) : {}
      answers[question] = answer
      sessionStorage.setItem('micro_answers', JSON.stringify(answers))
    }
  }

  const handleCalculationComplete = () => {
    router.push('/email')
  }

  if (stage === 'social-proof') {
    return <SocialProofScreen onContinue={handleSocialProofContinue} />
  }

  return (
    <CalculationScreen
      onComplete={handleCalculationComplete}
      onWarningDismiss={handleWarningDismiss}
      onMicroAnswer={handleMicroAnswer}
    />
  )
}
