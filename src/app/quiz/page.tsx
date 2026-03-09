'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuiz } from '@/hooks/useQuiz'
import { useTimer } from '@/hooks/useTimer'
import {
  QuizShell,
  LikertQuestion,
  TextQuestion,
  MatrixQuestion,
  DemographicQuestion,
  InterstitialScreen,
} from '@/components/quiz'
import type { LikertQuestion as LikertQ, TextQuestion as TextQ, MatrixQuestion as MatrixQ, DemographicQuestion as DemoQ } from '@/types'

export default function QuizPage() {
  const router = useRouter()
  const quiz = useQuiz()
  const timer = useTimer({ autoStart: !!quiz.sessionToken })

  useEffect(() => {
    if (quiz.sessionToken && !timer.isRunning) {
      timer.start()
    }
  }, [quiz.sessionToken, timer])

  useEffect(() => {
    if (quiz.isInitialized && !quiz.sessionToken) {
      router.replace('/start')
    }
  }, [quiz.isInitialized, quiz.sessionToken, router])

  const handleComplete = async () => {
    timer.pause()
    const result = await quiz.completeQuiz()
    localStorage.setItem('quiz_result', JSON.stringify(result))

    // Save to Supabase
    try {
      await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: result.answers,
          totalTimeSeconds: result.totalTimeSeconds,
          gender: quiz.gender,
          questionIds: quiz.questionIds,
        }),
      })
    } catch (error) {
      console.error('Failed to save quiz to database:', error)
      // Continue anyway - localStorage has the data
    }

    router.push('/calculating')
  }

  const currentAnswer = quiz.currentQuestion
    ? quiz.answers.get(quiz.currentQuestion.id)?.answerValue ?? null
    : null

  const handleSubmitAnswer = (value: string, isCorrect?: boolean) => {
    quiz.submitAnswer(value, isCorrect)
  }

  const handleNext = () => {
    if (quiz.isLastQuestion) {
      handleComplete()
    } else {
      quiz.goToNext()
    }
  }

  if (!quiz.isInitialized || quiz.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Preparing your quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz.sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // Show personalized interstitial
  if (quiz.showInterstitial && quiz.interstitialData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-4">
        <InterstitialScreen
          stat={quiz.interstitialData.stat}
          statDescription={quiz.interstitialData.statDescription}
          illustration={quiz.interstitialData.illustration}
          onContinue={quiz.dismissInterstitial}
        />
      </div>
    )
  }

  if (quiz.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{quiz.error}</p>
          <button
            onClick={() => router.push('/start')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  if (!quiz.currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading question...</p>
      </div>
    )
  }

  const renderQuestion = () => {
    const question = quiz.currentQuestion!

    switch (question.type) {
      case 'likert':
        return (
          <LikertQuestion
            question={question as LikertQ}
            selectedValue={currentAnswer}
            onSelect={(value) => handleSubmitAnswer(value)}
          />
        )

      case 'text':
        return (
          <TextQuestion
            question={question as TextQ}
            selectedValue={currentAnswer}
            onSelect={(value, isCorrect) => handleSubmitAnswer(value, isCorrect)}
          />
        )

      case 'matrix':
        return (
          <MatrixQuestion
            question={question as MatrixQ}
            selectedValue={currentAnswer}
            onSelect={(value, isCorrect) => handleSubmitAnswer(value, isCorrect)}
          />
        )

      case 'demographic':
        return (
          <DemographicQuestion
            question={question as DemoQ}
            selectedValue={currentAnswer}
            onSelect={(value) => handleSubmitAnswer(value)}
            isLastQuestion={quiz.isLastQuestion}
          />
        )

      default:
        return <p>Unknown question type</p>
    }
  }

  const submitLabel = quiz.isLastQuestion ? 'Get My Results' : 'Next'

  return (
    <QuizShell
      progress={quiz.progress}
      currentQuestion={quiz.currentIndex + 1}
      totalQuestions={quiz.totalQuestions}
      formattedTime={timer.formatTime()}
      canGoBack={!quiz.isFirstQuestion}
      canSkip={quiz.currentQuestion.type !== 'demographic'}
      showSubmit={!!currentAnswer}
      submitLabel={submitLabel}
      onBack={quiz.goToPrevious}
      onSkip={quiz.skipQuestion}
      onSubmit={handleNext}
    >
      {renderQuestion()}
    </QuizShell>
  )
}
