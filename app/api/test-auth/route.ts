import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SERVICE_APIS_URL = process.env.NEXT_PUBLIC_SERVICE_APIS_URL

async function testEndpoint(path: string, method = 'GET', body?: object) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return { path, error: 'No session' }

  const res = await fetch(`${SERVICE_APIS_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  let json: unknown
  try { json = JSON.parse(text) } catch { json = text }
  return { path, status: res.status, ok: res.ok, response: json }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }

  const results = await Promise.all([
    testEndpoint('/api/v1/users/me'),
    testEndpoint('/api/v1/experts/me/application'),
    testEndpoint('/api/v1/experts'),
    testEndpoint('/api/v1/favorites'),
  ])

  return NextResponse.json({ hasSession: true, results })
}
