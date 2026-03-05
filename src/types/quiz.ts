export type QuestionType = 'likert' | 'text' | 'matrix' | 'demographic'

export type Gender = 'male' | 'female'

export interface LikertQuestion {
  id: string
  type: 'likert'
  statement: string
  category: 'personality' | 'cognitive' | 'behavioral'
}

export interface TextQuestion {
  id: string
  type: 'text'
  question: string
  options: string[]
  correctAnswer: string
  category: 'logic' | 'memory' | 'verbal'
}

export interface MatrixQuestion {
  id: string
  type: 'matrix'
  gridSvgs: string[] // 8 SVGs for the grid (last one is the "?" position)
  correctAnswer: string // SVG of correct answer
  distractors: string[] // 5 distractor SVGs
  difficulty: 1 | 2 | 3 | 4 | 5
  patternCategory: string
}

export interface DemographicQuestion {
  id: string
  type: 'demographic'
  question: string
  options: string[]
  field: 'age' | 'education' | 'occupation' | 'country'
}

export type Question = LikertQuestion | TextQuestion | MatrixQuestion | DemographicQuestion

export interface QuizAnswer {
  questionId: string
  questionType: QuestionType
  answerValue: string
  isCorrect?: boolean
  timeTakenMs: number
}

export interface QuizSession {
  id: string
  sessionToken: string
  gender: Gender
  questionIds: string[]
  currentQuestionIndex: number
  answers: QuizAnswer[]
  startedAt: string
  completedAt?: string
  totalTimeSeconds?: number
}

export interface QuizScores {
  rawScore: number
  iqScore: number
  percentile: number
  memoryScore: number
  speedScore: number
  reactionScore: number
  concentrationScore: number
  logicScore: number
  strongestSkill: 'memory' | 'speed' | 'reaction' | 'concentration' | 'logic'
}

export interface QuizState {
  session: QuizSession | null
  currentQuestion: Question | null
  answers: Map<string, QuizAnswer>
  isLoading: boolean
  error: string | null
}

export interface InterstitialContent {
  id: string
  illustration: string
  stat: string
  statDescription: string
  afterQuestionIndex: number
}

export interface MicroQuestion {
  id: string
  question: string
  options: [string, string]
  progressPercent: number
}
