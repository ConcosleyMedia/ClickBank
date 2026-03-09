import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWhopClient } from '@/lib/whop/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { membershipId, sessionId } = body

    if (!membershipId) {
      return NextResponse.json(
        { success: false, error: 'membership_id is required' },
        { status: 400 }
      )
    }

    console.log('=== VERIFY MEMBERSHIP ===')
    console.log('membershipId:', membershipId)
    console.log('sessionId:', sessionId)

    // Verify membership with Whop API
    const whop = getWhopClient()
    const { data: membership, error: whopError } = await whop.getMembership(membershipId)

    console.log('Whop membership:', JSON.stringify(membership))
    console.log('Whop error:', whopError)

    if (whopError || !membership) {
      return NextResponse.json({
        success: false,
        error: 'Could not verify membership with Whop',
      })
    }

    // Check if membership is active
    const status = membership.status as string
    const isActive = status === 'active' ||
                     status === 'completed' ||
                     status === 'valid' ||
                     (membership as { valid?: boolean }).valid === true

    if (!isActive) {
      return NextResponse.json({
        success: false,
        error: 'Membership is not active',
      })
    }

    // Update profile in database
    const supabase = await createClient()

    if (sessionId) {
      // Update by session_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          whop_membership_id: membershipId,
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId)

      if (updateError) {
        console.log('Update by session_id failed:', updateError.message)
        // Try inserting new profile
        await supabase.from('profiles').insert({
          session_id: sessionId,
          whop_membership_id: membershipId,
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
        })
      }
    }

    console.log('Membership verified and activated')
    return NextResponse.json({
      success: true,
      membership: {
        id: membershipId,
        status: 'active',
      },
    })
  } catch (error) {
    console.error('Verify membership error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify membership' },
      { status: 500 }
    )
  }
}
