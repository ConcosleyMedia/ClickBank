import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

    // TODO: Store email in database via Supabase
    // const supabase = await createServiceClient()
    // await supabase.from('email_captures').insert({
    //   email,
    //   session_id: sessionToken ? /* lookup session id */ : null,
    //   affiliate_id: affiliateId,
    // })

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
