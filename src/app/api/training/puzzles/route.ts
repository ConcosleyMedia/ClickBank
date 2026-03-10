import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const category = request.nextUrl.searchParams.get('category')
    const difficulty = request.nextUrl.searchParams.get('difficulty')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    const supabase = await createClient()

    let query = supabase
      .from('puzzle_bank')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', parseInt(difficulty))
    }

    const { data: puzzles, error } = await query

    if (error) {
      console.error('Failed to fetch puzzles:', error)
      return NextResponse.json(
        { data: null, error: 'Failed to fetch puzzles' },
        { status: 500 }
      )
    }

    // Get user's completed puzzles if email provided
    let completedIds: string[] = []
    if (email) {
      const { data: completions } = await supabase
        .from('puzzle_completions')
        .select('puzzle_id')
        .eq('user_email', email)
        .eq('is_correct', true)

      completedIds = completions?.map(c => c.puzzle_id) || []
    }

    // Add completion status to puzzles
    const puzzlesWithStatus = puzzles?.map(puzzle => ({
      ...puzzle,
      isCompleted: completedIds.includes(puzzle.id),
    })) || []

    return NextResponse.json({
      data: {
        puzzles: puzzlesWithStatus,
        total: puzzles?.length || 0,
      },
      error: null,
    })
  } catch (error) {
    console.error('Puzzles error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch puzzles' },
      { status: 500 }
    )
  }
}
