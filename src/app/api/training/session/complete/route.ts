import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface SessionCompleteBody {
  sessionId: string
  email: string
  exerciseId: string
  category: string
  difficultyLevel: number
  trialsCompleted: number
  trialsCorrect: number
  avgResponseMs: number
}

function calculateScore(
  correct: number,
  total: number,
  avgResponseMs: number,
  difficultyLevel: number
): number {
  if (total === 0) return 0

  const accuracy = correct / total
  const baseScore = Math.round(accuracy * 100 * difficultyLevel)

  // Speed bonus: faster responses = higher score (up to 50% bonus)
  const speedBonus = avgResponseMs < 500 ? 50 :
                     avgResponseMs < 1000 ? 30 :
                     avgResponseMs < 2000 ? 15 : 0

  return Math.round(baseScore * (1 + speedBonus / 100))
}

function shouldAdvanceDifficulty(accuracy: number, avgResponseMs: number): boolean {
  // Advance if accuracy >= 80% and response time is good
  return accuracy >= 0.8 && avgResponseMs < 2000
}

export async function POST(request: NextRequest) {
  try {
    const body: SessionCompleteBody = await request.json()
    const {
      sessionId,
      email,
      exerciseId,
      category,
      difficultyLevel,
      trialsCompleted,
      trialsCorrect,
      avgResponseMs,
    } = body

    if (!sessionId || !email || !category) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const accuracy = trialsCompleted > 0 ? trialsCorrect / trialsCompleted : 0
    const score = calculateScore(trialsCorrect, trialsCompleted, avgResponseMs, difficultyLevel)

    // Update session
    const { error: sessionError } = await supabase
      .from('training_sessions')
      .update({
        completed_at: new Date().toISOString(),
        score,
        accuracy,
        avg_response_ms: avgResponseMs,
        trials_completed: trialsCompleted,
        trials_correct: trialsCorrect,
      })
      .eq('id', sessionId)

    if (sessionError) {
      console.error('Failed to update session:', sessionError)
    }

    // Get current progress
    const { data: currentProgress } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_email', email)
      .eq('category', category)
      .single()

    const isNewBest = score > (currentProgress?.best_score || 0)
    const advance = shouldAdvanceDifficulty(accuracy, avgResponseMs)
    const newLevel = advance && difficultyLevel < 5 ? difficultyLevel + 1 : difficultyLevel

    // Update or create progress
    const today = new Date().toISOString().split('T')[0]
    const lastStreakDate = currentProgress?.last_streak_date
    let streakDays = currentProgress?.streak_days || 0

    // Update streak
    if (lastStreakDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (lastStreakDate === yesterdayStr) {
        streakDays += 1
      } else if (lastStreakDate !== today) {
        streakDays = 1
      }
    }

    const { data: updatedProgress, error: progressError } = await supabase
      .from('training_progress')
      .upsert({
        user_email: email,
        category,
        current_level: Math.max(currentProgress?.current_level || 1, newLevel),
        total_sessions: (currentProgress?.total_sessions || 0) + 1,
        best_score: isNewBest ? score : (currentProgress?.best_score || 0),
        last_played_at: new Date().toISOString(),
        streak_days: streakDays,
        last_streak_date: today,
      }, {
        onConflict: 'user_email,category',
      })
      .select()
      .single()

    if (progressError) {
      console.error('Failed to update progress:', progressError)
    }

    return NextResponse.json({
      data: {
        score,
        accuracy: Math.round(accuracy * 100),
        avgResponseMs,
        newLevel: advance && difficultyLevel < 5 ? newLevel : undefined,
        newBest: isNewBest,
        streakDays,
        updatedProgress,
      },
      error: null,
    })
  } catch (error) {
    console.error('Session complete error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to complete session' },
      { status: 500 }
    )
  }
}
