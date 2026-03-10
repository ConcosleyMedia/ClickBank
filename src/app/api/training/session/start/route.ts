import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, exerciseId, category, difficultyLevel } = body

    if (!email || !exerciseId || !category) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: session, error } = await supabase
      .from('training_sessions')
      .insert({
        user_email: email,
        exercise_id: exerciseId,
        category,
        difficulty_level: difficultyLevel || 1,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to start session:', error)
      return NextResponse.json(
        { data: null, error: 'Failed to start session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { sessionId: session.id },
      error: null,
    })
  } catch (error) {
    console.error('Session start error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to start session' },
      { status: 500 }
    )
  }
}
