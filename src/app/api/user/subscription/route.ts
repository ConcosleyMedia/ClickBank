import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWhopClient } from '@/lib/whop/client'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { isSubscribed: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Checking subscription for:', email)

    const supabase = await createClient()

    // First check database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('email', email)
      .single()

    if (!error && profile?.subscription_status === 'active') {
      console.log('Found active subscription in database for:', email)
      return NextResponse.json({
        isSubscribed: true,
        source: 'database',
        error: null,
      })
    }

    console.log('No active subscription in database, checking Whop API...')

    // Fallback: Check Whop directly
    try {
      const whop = getWhopClient()
      const { data: memberships, error: whopError } = await whop.getMembershipByEmail(email)

      console.log('Whop API response:', JSON.stringify({ memberships, whopError }))

      if (!whopError && memberships && memberships.length > 0) {
        // Check if any membership is valid/active
        const activeMembership = memberships.find(
          (m: { status?: string; valid?: boolean }) =>
            m.status === 'active' || m.status === 'completed' || m.valid === true
        )

        if (activeMembership) {
          console.log('Found active membership in Whop for:', email)

          // Update database with this info
          await supabase
            .from('profiles')
            .upsert({
              email,
              subscription_status: 'active',
              whop_membership_id: activeMembership.id,
              subscription_started_at: new Date().toISOString(),
            }, {
              onConflict: 'email',
            })

          return NextResponse.json({
            isSubscribed: true,
            source: 'whop_api',
            error: null,
          })
        }
      }
    } catch (whopError) {
      console.error('Whop API check failed:', whopError)
      // Continue - don't fail if Whop check fails
    }

    console.log('No active subscription found for:', email)
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
