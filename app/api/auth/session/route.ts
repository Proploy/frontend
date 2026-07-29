import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authUserPayload, syncSessionToServiceApis } from '@/lib/auth/server-session'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null }, { headers: { 'cache-control': 'no-store' } })
  }

  const { data: { session } } = await supabase.auth.getSession()
  const profile = await syncSessionToServiceApis(session?.access_token)

  return NextResponse.json(
    { user: authUserPayload(user, profile?.role ?? null) },
    { headers: { 'cache-control': 'no-store' } },
  )
}
