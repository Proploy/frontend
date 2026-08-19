import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authUserPayload, syncSessionToServiceApis } from '@/lib/auth/server-session'

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null)
  const name = body && typeof body === 'object' ? (body as { name?: unknown }).name : null
  const email = body && typeof body === 'object' ? (body as { email?: unknown }).email : null
  const password = body && typeof body === 'object' ? (body as { password?: unknown }).password : null

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  const [firstName, ...rest] = name.trim().split(/\s+/)
  const lastName = rest.join(' ')
  // Use explicit environment variable first, then fallback to headers/nextUrl
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || request.nextUrl.origin

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: name,
        first_name: firstName || '',
        last_name: lastName || '',
      },
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const profile = await syncSessionToServiceApis(data.session?.access_token)

  return NextResponse.json(
    { user: data.user ? authUserPayload(data.user, profile?.role ?? null) : null },
    { headers: { 'cache-control': 'no-store' } },
  )
}
