import { NextRequest, NextResponse } from 'next/server'
import {
  renderNewsletterWelcomeEmail,
  renderProductInquiryEmail,
} from '@/lib/email-templates/contact-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { email, firstName, lastName, phone, message, type = 'general' } = body as {
      email?: string
      firstName?: string
      lastName?: string
      phone?: string
      message?: string
      type?: string
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_ADDRESS || 'onboarding@resend.dev'

    if (!resendApiKey) {
      console.warn('[Contact API] RESEND_API_KEY is not defined in environment variables.')
      return NextResponse.json(
        { ok: false, error: 'RESEND_API_KEY is missing from environment configuration.' },
        { status: 500 }
      )
    }

    const emailContent =
      type === 'newsletter'
        ? renderNewsletterWelcomeEmail({ email })
        : renderProductInquiryEmail({ firstName, lastName, email, phone, message })

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      })

      const resData = await res.json().catch(() => null)
      if (!res.ok) {
        console.error('[Resend API Error]:', res.status, resData)
        return NextResponse.json(
          {
            ok: false,
            error: resData?.message || `Resend API returned status ${res.status}`,
            details: resData,
          },
          { status: res.status >= 400 && res.status < 600 ? res.status : 500 }
        )
      }

      console.log('[Resend Email Sent Successfully]:', resData)
    } catch (err) {
      console.error('[Contact API] Exception calling Resend API:', err)
      return NextResponse.json({ ok: false, error: 'Failed to communicate with Resend email server' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Message submitted successfully' })
  } catch (err: unknown) {
    console.error('Contact submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
