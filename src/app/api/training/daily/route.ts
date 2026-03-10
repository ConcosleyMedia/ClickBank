import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const today = new Date().toISOString().split('T')[0]

    const supabase = await createClient()

    // Get today's challenge
    let { data: challenge } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', today)
      .single()

    // If no challenge exists for today, create one
    if (!challenge) {
      const exercises = [
        'memory/sequence-recall',
        'logic/number-series',
        'speed/reaction-tap',
        'focus/stroop-color',
        'puzzles/matrix',
      ]

      const dayOfWeek = new Date().getDay()
      const exerciseId = exercises[dayOfWeek % exercises.length]

      const { data: newChallenge, error: createError } = await supabase
        .from('daily_challenges')
        .insert({
          challenge_date: today,
          exercise_id: exerciseId,
          config: {
            difficulty: ((dayOfWeek % 3) + 1), // Rotate 1-3
            seed: Date.now(),
          },
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create daily challenge:', createError)
      } else {
        challenge = newChallenge
      }
    }

    // Check if user has completed today's challenge
    let isCompleted = false
    let completedAt = null
    let completionScore = null

    if (email && challenge) {
      const { data: completion } = await supabase
        .from('daily_challenge_completions')
        .select('*')
        .eq('user_email', email)
        .eq('challenge_id', challenge.id)
        .single()

      if (completion) {
        isCompleted = true
        completedAt = completion.completed_at
        completionScore = completion.score
      }
    }

    // Get user's streak
    let streakDays = 0
    if (email) {
      const { data: progress } = await supabase
        .from('training_progress')
        .select('streak_days')
        .eq('user_email', email)
        .limit(1)
        .single()

      streakDays = progress?.streak_days || 0
    }

    return NextResponse.json({
      data: {
        challenge,
        isCompleted,
        completedAt,
        completionScore,
        streakDays,
      },
      error: null,
    })
  } catch (error) {
    console.error('Daily challenge error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch daily challenge' },
      { status: 500 }
    )
  }
}
