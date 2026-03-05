import type { Question, LikertQuestion, TextQuestion, MatrixQuestion, DemographicQuestion } from '@/types'

// Import question bank
import questionBank from '@/../public/puzzles/bank.json'

interface QuestionBank {
  questions: Question[]
  metadata: {
    generatedAt: string
    totalQuestions: number
    categories: Record<string, number>
  }
}

const bank = questionBank as QuestionBank

export function getAllQuestions(): Question[] {
  return bank.questions
}

export function getQuestionsByType<T extends Question['type']>(type: T): Question[] {
  return bank.questions.filter((q) => q.type === type)
}

export function getQuestionById(id: string): Question | undefined {
  return bank.questions.find((q) => q.id === id)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate a 30-question quiz sequence
 * Structure:
 * - 3 Likert questions (warm-up, easy)
 * - 5 Text logic questions (getting harder)
 * - 20 Matrix puzzles (main IQ section, progressively harder)
 * - 2 Demographic questions at the end
 *
 * Total: 30 questions
 * Interstitials after questions 8, 18, 25 (showing personalized teasers)
 */
export function randomizeQuestionSet(): { questionIds: string[]; interstitialPositions: number[] } {
  const likertQuestions = shuffleArray(getQuestionsByType('likert') as LikertQuestion[]).slice(0, 3)

  const textQuestions = shuffleArray(
    bank.questions.filter((q) => q.type === 'text')
  ).slice(0, 5)

  // Get matrix questions sorted by difficulty for progression
  const allMatrix = getQuestionsByType('matrix') as MatrixQuestion[]
  const easyMatrix = shuffleArray(allMatrix.filter(q => q.difficulty <= 2)).slice(0, 6)
  const mediumMatrix = shuffleArray(allMatrix.filter(q => q.difficulty === 3)).slice(0, 7)
  const hardMatrix = shuffleArray(allMatrix.filter(q => q.difficulty >= 4)).slice(0, 7)

  const demographicQuestions = getQuestionsByType('demographic') as DemographicQuestion[]

  // Build the question sequence (easy → hard)
  const sequence: Question[] = [
    ...likertQuestions,      // 1-3: Warm-up (easy behavioral)
    ...textQuestions,        // 4-8: Text logic
    ...easyMatrix,           // 9-14: Easy patterns
    ...mediumMatrix,         // 15-21: Medium patterns
    ...hardMatrix,           // 22-28: Hard patterns
    ...demographicQuestions, // 29-30: Demographics
  ]

  // Interstitials: after question 8, 18, 25 (showing score teasers)
  const interstitialPositions = [8, 18, 25]

  return {
    questionIds: sequence.map((q) => q.id),
    interstitialPositions,
  }
}

export function getQuestionsForSession(questionIds: string[]): Question[] {
  return questionIds.map((id) => getQuestionById(id)).filter((q): q is Question => q !== undefined)
}

/**
 * Personalized interstitial content based on current performance
 */
export interface PersonalizedInterstitial {
  id: string
  afterQuestionIndex: number
}

export const interstitialPositions = [8, 18, 25]

/**
 * Generate personalized interstitial message based on answers so far
 * Always shows impressive, flattering stats to build excitement for results
 */
export function generatePersonalizedInterstitial(
  questionIndex: number,
  _correctCount: number,
  _totalAnswered: number,
  avgTimeMs: number
): { stat: string; statDescription: string; illustration: string } {
  const avgTimeSec = avgTimeMs / 1000

  // Generate slightly randomized high percentiles to feel personalized
  const getHighPercentile = () => 87 + Math.floor(Math.random() * 10) // 87-96%

  if (questionIndex === 8) {
    // After warm-up - hype their speed/reasoning
    const speedPercentile = avgTimeSec < 15 ? 94 : 89
    return {
      stat: `Top ${100 - speedPercentile}%`,
      statDescription: `Your cognitive processing speed is faster than ${speedPercentile}% of test takers. This correlates with higher IQ scores.`,
      illustration: 'brain-power',
    }
  } else if (questionIndex === 18) {
    // Mid-quiz - hype their pattern recognition
    const patternPercentile = getHighPercentile()
    return {
      stat: `Outperforming ${patternPercentile}%`,
      statDescription: `Your pattern recognition abilities are in the top tier. You're solving puzzles faster than ${patternPercentile}% of participants.`,
      illustration: 'global-users',
    }
  } else {
    // Near end - build anticipation for results
    const overallPercentile = getHighPercentile()
    return {
      stat: `Top ${100 - overallPercentile}% So Far`,
      statDescription: `You're demonstrating exceptional logical reasoning skills. Your preliminary score suggests you're outperforming ${overallPercentile}% of test takers. Complete the test to see your full IQ analysis.`,
      illustration: 'certificate',
    }
  }
}

export function getInterstitialAfterQuestion(questionIndex: number) {
  if (interstitialPositions.includes(questionIndex)) {
    return { afterQuestionIndex: questionIndex }
  }
  return undefined
}
