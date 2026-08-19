import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null)
  const email = body && typeof body === 'object' ? (body as { email?: unknown }).email : null

  if (typeof email !== 'string' || !email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 },
    )
  }

  // Use explicit environment variable first, then fallback to headers/nextUrl
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || request.nextUrl.origin
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ sent: true }, { headers: { 'cache-control': 'no-store' } })
}