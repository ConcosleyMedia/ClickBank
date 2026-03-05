import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomizeQuestionSet } from '@/lib/quiz/questions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gender } = body

    if (!gender || !['male', 'female'].includes(gender)) {
      return NextResponse.json(
        { data: null, error: 'Invalid gender value' },
        { status: 400 }
      )
    }

    // Generate session token
    const sessionToken = crypto.randomUUID()

    // Get randomized question set
    const { questionIds, interstitialPositions } = randomizeQuestionSet()

    // Get affiliate ID from cookie if present
    const cookieStore = await cookies()
    const affiliateId = cookieStore.get('affiliate_id')?.value

    // TODO: Store session in database via Supabase
    // For now, we'll handle state client-side

    // Set session cookie
    cookieStore.set('brainrank_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      data: {
        sessionToken,
        gender,
        questionIds,
        interstitialPositions,
        affiliateId: affiliateId || null,
        startedAt: new Date().toISOString(),
      },
      error: null,
    })
  } catch (error) {
    console.error('Quiz start error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to start quiz session' },
      { status: 500 }
    )
  }
}
