import type { QuizAnswer, QuizScores, Question } from '@/types'
import { getQuestionById } from './questions'

interface ScoringInput {
  answers: QuizAnswer[]
  totalTimeSeconds: number
}

/**
 * Calculate all quiz scores based on answers and timing
 * Implements the scoring algorithm from TECH_DESIGN.md Section 5.3
 */
export function calculateScores({ answers, totalTimeSeconds }: ScoringInput): QuizScores {
  // Count correct answers by category
  let matrixCorrect = 0
  let textCorrect = 0
  let likertTotal = 0
  let totalCorrect = 0
  let totalAnswered = 0

  // Track timing for speed bonus
  const avgTimePerQuestion = totalTimeSeconds / Math.max(answers.length, 1)

  // Calculate category-specific scores
  const categoryScores = {
    memory: 0,
    speed: 0,
    reaction: 0,
    concentration: 0,
    logic: 0,
  }

  for (const answer of answers) {
    const question = getQuestionById(answer.questionId)
    if (!question) continue

    totalAnswered++

    if (question.type === 'matrix') {
      if (answer.isCorrect) {
        matrixCorrect++
        totalCorrect++
        // Matrix questions contribute to logic and concentration
        categoryScores.logic += 2
        categoryScores.concentration += 1
      }
    } else if (question.type === 'text') {
      if (answer.isCorrect) {
        textCorrect++
        totalCorrect++
        // Text questions contribute to logic and memory
        categoryScores.logic += 1
        categoryScores.memory += 1
      }
    } else if (question.type === 'likert') {
      // Likert answers (1-5 scale) contribute to behavioral scores
      const likertValue = parseInt(answer.answerValue) || 3
      likertTotal += likertValue
      // Higher agreement = higher cognitive confidence
      categoryScores.concentration += likertValue * 0.2
    }

    // Reaction time scoring based on individual question timing
    if (answer.timeTakenMs) {
      const questionTimeSeconds = answer.timeTakenMs / 1000
      if (questionTimeSeconds < 10) {
        categoryScores.reaction += 2
        categoryScores.speed += 2
      } else if (questionTimeSeconds < 20) {
        categoryScores.reaction += 1
        categoryScores.speed += 1
      }
    }
  }

  // Normalize category scores to 0-100 range
  const maxPossibleLogic = 40 * 2 + 10 * 1 // matrix * 2 + text * 1
  const maxPossibleMemory = 10 * 1 // text questions
  const maxPossibleSpeed = totalAnswered * 2
  const maxPossibleReaction = totalAnswered * 2
  const maxPossibleConcentration = 40 + 10 * 5 * 0.2 // matrix + likert

  const normalizedScores = {
    logic: Math.round((categoryScores.logic / maxPossibleLogic) * 100),
    memory: Math.round((categoryScores.memory / Math.max(maxPossibleMemory, 1)) * 100),
    speed: Math.round((categoryScores.speed / Math.max(maxPossibleSpeed, 1)) * 100),
    reaction: Math.round((categoryScores.reaction / Math.max(maxPossibleReaction, 1)) * 100),
    concentration: Math.round((categoryScores.concentration / Math.max(maxPossibleConcentration, 1)) * 100),
  }

  // Calculate raw score (0-100)
  const maxCorrect = 40 + 10 // matrix + text questions
  const rawScore = Math.round((totalCorrect / maxCorrect) * 100)

  // Convert raw score to IQ scale (75-145 range)
  // Using a normal distribution mapping
  const iqScore = calculateIQFromRawScore(rawScore, avgTimePerQuestion)

  // Calculate percentile based on IQ score
  const percentile = calculatePercentileFromIQ(iqScore)

  // Determine strongest skill
  const strongestSkill = determineStrongestSkill(normalizedScores)

  return {
    rawScore,
    iqScore,
    percentile,
    memoryScore: normalizedScores.memory,
    speedScore: normalizedScores.speed,
    reactionScore: normalizedScores.reaction,
    concentrationScore: normalizedScores.concentration,
    logicScore: normalizedScores.logic,
    strongestSkill,
  }
}

/**
 * Convert raw score (0-100) to IQ score (75-145)
 * Applies speed bonus for faster completion
 */
function calculateIQFromRawScore(rawScore: number, avgTimePerQuestion: number): number {
  // Base IQ mapping: raw 0 = IQ 75, raw 100 = IQ 145
  const baseIQ = 75 + (rawScore / 100) * 70

  // Speed bonus: faster answers get up to +5 IQ points
  // Average of 15 seconds per question = no bonus
  // Less than 10 seconds average = +5 points
  // More than 30 seconds average = -3 points
  let speedBonus = 0
  if (avgTimePerQuestion < 10) {
    speedBonus = 5
  } else if (avgTimePerQuestion < 15) {
    speedBonus = 3
  } else if (avgTimePerQuestion < 20) {
    speedBonus = 1
  } else if (avgTimePerQuestion > 30) {
    speedBonus = -3
  }

  // Clamp final IQ to valid range
  const finalIQ = Math.round(Math.max(75, Math.min(145, baseIQ + speedBonus)))

  return finalIQ
}

/**
 * Calculate percentile from IQ score
 * Based on standard IQ distribution (mean=100, SD=15)
 */
function calculatePercentileFromIQ(iqScore: number): number {
  // Z-score calculation
  const zScore = (iqScore - 100) / 15

  // Approximate percentile using error function approximation
  const percentile = Math.round((1 + erf(zScore / Math.sqrt(2))) / 2 * 100)

  return Math.max(1, Math.min(99, percentile))
}

/**
 * Error function approximation for percentile calculation
 */
function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

/**
 * Determine the user's strongest skill based on normalized scores
 */
function determineStrongestSkill(
  scores: Record<string, number>
): 'memory' | 'speed' | 'reaction' | 'concentration' | 'logic' {
  const entries = Object.entries(scores) as [keyof typeof scores, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])
  return sorted[0][0] as 'memory' | 'speed' | 'reaction' | 'concentration' | 'logic'
}

/**
 * Generate a summary message based on scores
 */
export function generateScoreSummary(scores: QuizScores): string {
  if (scores.iqScore >= 130) {
    return 'Exceptional! Your cognitive abilities are significantly above average.'
  } else if (scores.iqScore >= 115) {
    return 'Impressive! You demonstrate above-average intelligence across multiple dimensions.'
  } else if (scores.iqScore >= 100) {
    return "Great work! Your results show solid cognitive abilities that align with the majority of test takers."
  } else if (scores.iqScore >= 85) {
    return 'Your results indicate room for growth. Our training program can help enhance your cognitive skills.'
  } else {
    return 'Your results provide a starting point for your cognitive development journey.'
  }
}
