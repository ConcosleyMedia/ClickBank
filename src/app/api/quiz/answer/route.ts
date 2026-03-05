import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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
    const { questionId, questionType, answerValue, isCorrect, timeTakenMs } = body

    // Validate required fields
    if (!questionId || !questionType || answerValue === undefined) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Store answer in database via Supabase
    // For now, answers are stored client-side

    return NextResponse.json({
      data: {
        questionId,
        questionType,
        answerValue,
        isCorrect: isCorrect ?? null,
        timeTakenMs: timeTakenMs ?? null,
        recordedAt: new Date().toISOString(),
      },
      error: null,
    })
  } catch (error) {
    console.error('Quiz answer error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to record answer' },
      { status: 500 }
    )
  }
}
