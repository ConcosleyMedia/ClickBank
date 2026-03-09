import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')
    const email = request.nextUrl.searchParams.get('email')

    if (!sessionId && !email) {
      return NextResponse.json(
        { isSubscribed: false, error: 'session_id or email is required' },
        { status: 400 }
      )
    }

    console.log('Checking subscription - session_id:', sessionId, 'email:', email)

    const supabase = await createClient()

    // Try session_id first (most reliable after payment)
    if (sessionId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, email, whop_email')
        .eq('session_id', sessionId)
        .single()

      if (!error && profile?.subscription_status === 'active') {
        console.log('Found active subscription by session_id')
        return NextResponse.json({
          isSubscribed: true,
          email: profile.whop_email || profile.email,
          source: 'session_id',
          error: null,
        })
      }
    }

    // Fallback to email check
    if (email) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('email', email)
        .single()

      if (!error && profile?.subscription_status === 'active') {
        console.log('Found active subscription by email')
        return NextResponse.json({
          isSubscribed: true,
          source: 'email',
          error: null,
        })
      }

      // Also check whop_email field
      const { data: whopProfile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('whop_email', email)
        .single()

      if (whopProfile?.subscription_status === 'active') {
        console.log('Found active subscription by whop_email')
        return NextResponse.json({
          isSubscribed: true,
          source: 'whop_email',
          error: null,
        })
      }
    }

    console.log('No active subscription found')
    return NextResponse.json({
      isSubscribed: false,
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
