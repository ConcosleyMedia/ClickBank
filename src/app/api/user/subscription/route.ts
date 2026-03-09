import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { isSubscribed: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('email', email)
      .single()

    if (error || !profile) {
      return NextResponse.json({
        isSubscribed: false,
        error: null,
      })
    }

    return NextResponse.json({
      isSubscribed: profile.subscription_status === 'active',
      error: null,
    })
  } catch (error) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { isSubscribed: false, error: 'Failed to check subscription' },
      { status: 500 }
    )
  }
}
