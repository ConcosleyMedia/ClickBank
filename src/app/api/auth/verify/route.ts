import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    console.log('=== VERIFY MAGIC TOKEN ===')
    console.log('Token:', token.substring(0, 8) + '...')

    const supabase = await createClient()

    // Find profile with this token
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email, subscription_status, magic_token_expires_at')
      .eq('magic_token', token)
      .single()

    if (error || !profile) {
      console.log('Token not found')
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired link',
      })
    }

    // Check if token is expired
    if (profile.magic_token_expires_at && new Date(profile.magic_token_expires_at) < new Date()) {
      console.log('Token expired')
      return NextResponse.json({
        success: false,
        error: 'This link has expired. Please use the sign-in page.',
      })
    }

    // Check if subscription is active
    if (profile.subscription_status !== 'active') {
      console.log('Subscription not active:', profile.subscription_status)
      return NextResponse.json({
        success: false,
        error: 'Subscription is not active',
      })
    }

    console.log('Token verified for:', profile.email)

    return NextResponse.json({
      success: true,
      email: profile.email,
    })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
