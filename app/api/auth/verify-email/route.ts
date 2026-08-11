import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { authUserPayload, syncSessionToServiceApis } from '@/lib/auth/server-session'

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null)
  const email = body && typeof body === 'object' ? (body as { email?: unknown }).email : null
  const code = body && typeof body === 'object' ? (body as { code?: unknown }).code : null

  if (typeof email !== 'string' || typeof code !== 'string' || !email || !code) {
    return NextResponse.json(
      { error: 'Email and verification code are required' },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email',
  })

  if (error || !data.session?.access_token) {
    return NextResponse.json(
      { error: error?.message ?? 'Invalid or expired verification code' },
      { status: 400 },
    )
  }

  // Sync the now-confirmed user to service-apis so role-aware endpoints work.
  const profile = await syncSessionToServiceApis(data.session.access_token)
  if (!profile) {
    return NextResponse.json(
      { error: 'Account verified but profile sync failed. Please sign in.' },
      { status: 502 },
    )
  }

  return NextResponse.json(
    {
      user: data.user ? authUserPayload(data.user, profile.role ?? null) : null,
    },
    { headers: { 'cache-control': 'no-store' } },
  )
}