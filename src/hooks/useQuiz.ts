'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { Question, QuizAnswer, Gender } from '@/types'
import { getQuestionById, randomizeQuestionSet, getInterstitialAfterQuestion, generatePersonalizedInterstitial } from '@/lib/quiz/questions'

interface InterstitialData {
  stat: string
  statDescription: string
  illustration: string
}

interface UseQuizState {
  sessionToken: string | null
  gender: Gender | null
  questionIds: string[]
  currentIndex: number
  answers: Map<string, QuizAnswer>
  startedAt: number | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  showInterstitial: boolean
  interstitialData: InterstitialData | null
}

interface UseQuizReturn extends UseQuizState {
  currentQuestion: Question | null
  totalQuestions: number
  progress: number
  isFirstQuestion: boolean
  isLastQuestion: boolean
  timeSpentMs: number
  initialize: (gender: Gender) => void
  submitAnswer: (answerValue: string, isCorrect?: boolean) => void
  goToNext: () => void
  goToPrevious: () => void
  skipQuestion: () => void
  dismissInterstitial: () => void
  completeQuiz: () => Promise<{ sessionToken: string; totalTimeSeconds: number; answers: QuizAnswer[] }>
}

export function useQuiz(): UseQuizReturn {
  const [state, setState] = useState<UseQuizState>({
    sessionToken: null,
    gender: null,
    questionIds: [],
    currentIndex: 0,
    answers: new Map(),
    startedAt: null,
    isLoading: true,
    isInitialized: false,
    error: null,
    showInterstitial: false,
    interstitialData: null,
  })

  const questionStartTimeRef = useRef<number>(Date.now())
  const hasInitializedRef = useRef(false)

  const initializeQuiz = useCallback((gender: Gender) => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    try {
      const sessionToken = crypto.randomUUID()
      const { questionIds } = randomizeQuestionSet()

      setState({
        sessionToken,
        gender,
        questionIds,
        currentIndex: 0,
        answers: new Map(),
        startedAt: Date.now(),
        isLoading: false,
        isInitialized: true,
        error: null,
        showInterstitial: false,
        interstitialData: null,
      })

      sessionStorage.removeItem('quiz_gender')

      const toSave = {
        sessionToken,
        gender,
        questionIds,
        currentIndex: 0,
        answers: [],
        startedAt: Date.now(),
      }
      sessionStorage.setItem('quiz_session', JSON.stringify(toSave))

      // Store in localStorage too (persists after leaving for Whop checkout)
      localStorage.setItem('brainrank_session', sessionToken)

      document.cookie = `brainrank_session=${sessionToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Failed to initialize quiz',
      }))
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hasInitializedRef.current) return

    const savedSession = sessionStorage.getItem('quiz_session')
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession)
        if (parsed.sessionToken && parsed.questionIds?.length > 0) {
          hasInitializedRef.current = true
          // Ensure localStorage also has the session token
          localStorage.setItem('brainrank_session', parsed.sessionToken)
          setState({
            sessionToken: parsed.sessionToken,
            gender: parsed.gender,
            questionIds: parsed.questionIds,
            currentIndex: parsed.currentIndex || 0,
            answers: new Map(parsed.answers || []),
            startedAt: parsed.startedAt,
            isLoading: false,
            isInitialized: true,
            error: null,
            showInterstitial: false,
            interstitialData: null,
          })
          return
        }
      } catch {
        // Invalid saved session
      }
    }

    const savedGender = sessionStorage.getItem('quiz_gender')
    if (savedGender) {
      initializeQuiz(savedGender as Gender)
      return
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      isInitialized: true,
    }))
  }, [initializeQuiz])

  useEffect(() => {
    if (typeof window === 'undefined' || !state.sessionToken) return

    const toSave = {
      sessionToken: state.sessionToken,
      gender: state.gender,
      questionIds: state.questionIds,
      currentIndex: state.currentIndex,
      answers: Array.from(state.answers.entries()),
      startedAt: state.startedAt,
    }
    sessionStorage.setItem('quiz_session', JSON.stringify(toSave))
  }, [state.sessionToken, state.gender, state.questionIds, state.currentIndex, state.answers, state.startedAt])

  useEffect(() => {
    questionStartTimeRef.current = Date.now()
  }, [state.currentIndex])

  const submitAnswer = useCallback((answerValue: string, isCorrect?: boolean) => {
    setState((prev) => {
      const questionId = prev.questionIds[prev.currentIndex]
      if (!questionId) return prev

      const question = getQuestionById(questionId)
      if (!question) return prev

      const timeTakenMs = Date.now() - questionStartTimeRef.current

      const answer: QuizAnswer = {
        questionId,
        questionType: question.type,
        answerValue,
        isCorrect,
        timeTakenMs,
      }

      const newAnswers = new Map(prev.answers)
      newAnswers.set(questionId, answer)

      return {
        ...prev,
        answers: newAnswers,
      }
    })
  }, [])

  const goToNext = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= prev.questionIds.length - 1) return prev

      const newIndex = prev.currentIndex + 1
      const questionNumber = prev.currentIndex + 1 // 1-based

      // Check for interstitial
      const interstitial = getInterstitialAfterQuestion(questionNumber)

      if (interstitial) {
        // Calculate personalized stats
        const answersArray = Array.from(prev.answers.values())
        const correctCount = answersArray.filter(a => a.isCorrect === true).length
        const totalAnswered = answersArray.length
        const avgTimeMs = totalAnswered > 0
          ? answersArray.reduce((sum, a) => sum + (a.timeTakenMs || 0), 0) / totalAnswered
          : 10000

        const personalizedData = generatePersonalizedInterstitial(
          questionNumber,
          correctCount,
          totalAnswered,
          avgTimeMs
        )

        return {
          ...prev,
          showInterstitial: true,
          interstitialData: personalizedData,
        }
      }

      return {
        ...prev,
        currentIndex: newIndex,
      }
    })
  }, [])

  const goToPrevious = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev
      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
      }
    })
  }, [])

  const skipQuestion = useCallback(() => {
    goToNext()
  }, [goToNext])

  const dismissInterstitial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showInterstitial: false,
      interstitialData: null,
      currentIndex: prev.currentIndex + 1,
    }))
  }, [])

  const completeQuiz = useCallback(async () => {
    const totalTimeSeconds = state.startedAt
      ? Math.round((Date.now() - state.startedAt) / 1000)
      : 0

    return {
      sessionToken: state.sessionToken!,
      totalTimeSeconds,
      answers: Array.from(state.answers.values()),
    }
  }, [state.sessionToken, state.startedAt, state.answers])

  const currentQuestion = state.questionIds[state.currentIndex]
    ? getQuestionById(state.questionIds[state.currentIndex]) ?? null
    : null

  const totalQuestions = state.questionIds.length
  const progress = totalQuestions > 0 ? ((state.currentIndex + 1) / totalQuestions) * 100 : 0
  const isFirstQuestion = state.currentIndex === 0
  const isLastQuestion = state.currentIndex === totalQuestions - 1
  const timeSpentMs = state.startedAt ? Date.now() - state.startedAt : 0

  return {
    ...state,
    currentQuestion,
    totalQuestions,
    progress,
    isFirstQuestion,
    isLastQuestion,
    timeSpentMs,
    initialize: initializeQuiz,
    submitAnswer,
    goToNext,
    goToPrevious,
    skipQuestion,
    dismissInterstitial,
    completeQuiz,
  }
}
