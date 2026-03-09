import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { data: null, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { data: null, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get session token and affiliate ID from cookies
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('brainrank_session')?.value
    const affiliateId = cookieStore.get('affiliate_id')?.value

    // Get IP and user agent
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || null
    const userAgent = headersList.get('user-agent') || null

    // Store email in Supabase
    try {
      const supabase = await createClient()

      // Find the quiz session if we have a token
      let sessionId = null
      if (sessionToken) {
        const { data: session } = await supabase
          .from('quiz_sessions')
          .select('id')
          .eq('session_token', sessionToken)
          .single()
        sessionId = session?.id || null
      }

      await supabase.from('email_captures').insert({
        email,
        session_id: sessionId,
        affiliate_id: affiliateId || null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
    } catch (dbError) {
      console.error('Failed to save email:', dbError)
      // Don't fail the request if DB save fails
    }

    return NextResponse.json({
      data: {
        email,
        sessionToken: sessionToken || null,
        affiliateId: affiliateId || null,
        capturedAt: new Date().toISOString(),
      },
      error: null,
    })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}
