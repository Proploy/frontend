import { createServiceApisClient } from '@/lib/service-apis/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const client = await createServiceApisClient(true)
  const body = await request.json()
  const res = await fetch(`${client.baseUrl}/api/v1/experts/me/profile-picture-url`, {
    method: 'POST',
    headers: client.headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}