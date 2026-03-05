import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { calculateScores } from '@/lib/quiz/scoring'
import type { QuizAnswer } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('brainrank_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { data: null, error: 'No active quiz session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { answers, totalTimeSeconds } = body as {
      answers: QuizAnswer[]
      totalTimeSeconds: number
    }

    // Validate
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { data: null, error: 'Invalid answers data' },
        { status: 400 }
      )
    }

    // Calculate scores
    const scores = calculateScores({
      answers,
      totalTimeSeconds: totalTimeSeconds || 0,
    })

    // TODO: Store scores in database via Supabase

    return NextResponse.json({
      data: {
        sessionToken,
        scores,
        completedAt: new Date().toISOString(),
        totalTimeSeconds,
        totalAnswered: answers.length,
      },
      error: null,
    })
  } catch (error) {
    console.error('Quiz complete error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to complete quiz' },
      { status: 500 }
    )
  }
}
