import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWhopClient } from '@/lib/whop/client'

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

    console.log('=== SUBSCRIPTION CHECK ===')
    console.log('session_id:', sessionId)
    console.log('email:', email)

    const supabase = await createClient()

    // Try session_id first (most reliable after payment)
    if (sessionId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, email, whop_email')
        .eq('session_id', sessionId)
        .single()

      console.log('Profile by session_id:', profile, 'error:', error?.message)

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

    // Fallback to email check in database
    if (email) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('email', email)
        .single()

      console.log('Profile by email:', profile, 'error:', error?.message)

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

    // Final fallback: Check Whop API directly
    if (email) {
      console.log('Checking Whop API directly for:', email)
      try {
        const whop = getWhopClient()
        const { data: memberships, error: whopError } = await whop.getMembershipByEmail(email)

        console.log('Whop API response:', JSON.stringify({ count: memberships?.length, error: whopError }))

        if (!whopError && memberships && memberships.length > 0) {
          const activeMembership = memberships.find(
            (m: { status?: string; valid?: boolean }) =>
              m.status === 'active' || m.status === 'completed' || m.valid === true
          )

          if (activeMembership) {
            console.log('Found active membership in Whop:', activeMembership.id)

            // Update database - try by session_id first, then by email
            if (sessionId) {
              await supabase
                .from('profiles')
                .update({
                  whop_email: email,
                  whop_membership_id: activeMembership.id,
                  subscription_status: 'active',
                  subscription_started_at: new Date().toISOString(),
                })
                .eq('session_id', sessionId)
            } else {
              await supabase
                .from('profiles')
                .upsert({
                  email,
                  whop_membership_id: activeMembership.id,
                  subscription_status: 'active',
                  subscription_started_at: new Date().toISOString(),
                }, {
                  onConflict: 'email',
                })
            }

            return NextResponse.json({
              isSubscribed: true,
              source: 'whop_api',
              error: null,
            })
          }
        }
      } catch (whopError) {
        console.error('Whop API check failed:', whopError)
      }
    }

    console.log('No active subscription found anywhere')
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
