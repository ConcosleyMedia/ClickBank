import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { data: null, error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get progress for all categories
    const { data: progress, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_email', email)

    if (error) {
      console.error('Failed to fetch training progress:', error)
      return NextResponse.json(
        { data: null, error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    // Get recent sessions for streak calculation
    const { data: recentSessions } = await supabase
      .from('training_sessions')
      .select('completed_at')
      .eq('user_email', email)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(30)

    // Calculate current streak
    let streakDays = 0
    if (recentSessions && recentSessions.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let checkDate = new Date(today)
      for (const session of recentSessions) {
        const sessionDate = new Date(session.completed_at)
        sessionDate.setHours(0, 0, 0, 0)

        if (sessionDate.getTime() === checkDate.getTime()) {
          streakDays++
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (sessionDate.getTime() < checkDate.getTime()) {
          break
        }
      }
    }

    // Structure progress by category
    const categories = ['memory', 'logic', 'speed', 'focus', 'puzzles']
    const progressByCategory: Record<string, {
      currentLevel: number
      totalSessions: number
      bestScore: number
      lastPlayedAt: string | null
    }> = {}

    for (const cat of categories) {
      const catProgress = progress?.find(p => p.category === cat)
      progressByCategory[cat] = {
        currentLevel: catProgress?.current_level || 1,
        totalSessions: catProgress?.total_sessions || 0,
        bestScore: catProgress?.best_score || 0,
        lastPlayedAt: catProgress?.last_played_at || null,
      }
    }

    return NextResponse.json({
      data: {
        progress: progressByCategory,
        streakDays,
      },
      error: null,
    })
  } catch (error) {
    console.error('Training progress error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
