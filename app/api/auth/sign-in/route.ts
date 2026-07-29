import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authUserPayload, syncSessionToServiceApis } from '@/lib/auth/server-session'

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null)
  const email = body && typeof body === 'object' ? (body as { email?: unknown }).email : null
  const password = body && typeof body === 'object' ? (body as { password?: unknown }).password : null

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? 'Unable to sign in' }, { status: 400 })
  }

  const profile = await syncSessionToServiceApis(data.session?.access_token)

  return NextResponse.json(
    { user: authUserPayload(data.user, profile?.role ?? null) },
    { headers: { 'cache-control': 'no-store' } },
  )
}
