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

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return NextResponse.json(
        { data: null, error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: profile,
      error: null,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}
