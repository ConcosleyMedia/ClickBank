import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendMagicLinkParams {
  to: string
  token: string
  name?: string
}

export async function sendMagicLink({ to, token, name }: SendMagicLinkParams): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.brainscores.org'
  const magicLink = `${baseUrl}/auth/verify?token=${token}`

  console.log('=== SENDING MAGIC LINK ===')
  console.log('To:', to)
  console.log('Link:', magicLink)

  if (!resend) {
    console.log('RESEND_API_KEY not set - magic link logged above')
    return true
  }

  try {
    const { error } = await resend.emails.send({
      from: 'BrainRank <noreply@brainscores.org>',
      to,
      subject: 'Access Your IQ Results - BrainRank',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 48px; height: 48px; background: #14b8a6; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: white; font-weight: bold; font-size: 24px;">B</span>
              </div>
            </div>

            <h1 style="color: #111827; font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 16px;">
              Your IQ Results Are Ready!
            </h1>

            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
              ${name ? `Hi ${name}, ` : ''}Click the button below to access your personalized IQ report and certificate.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${magicLink}" style="display: inline-block; background: #14b8a6; color: white; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 12px; text-decoration: none;">
                View My Results
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-bottom: 16px;">
              This link expires in 7 days.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send magic link email:', error)
      return false
    }

    console.log('Magic link email sent successfully')
    return true
  } catch (error) {
    console.error('Error sending magic link email:', error)
    return false
  }
}
