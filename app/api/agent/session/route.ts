import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('UNAUTHORIZED', 'Missing or invalid authorization header', 401)
    }

    const token = authHeader.replace('Bearer ', '')

    if (token !== process.env.AGENT_API_KEY) {
      return createErrorResponse('UNAUTHORIZED', 'Invalid API key', 401)
    }

    const agentClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { session }, error } = await agentClient.auth.getSession()

    if (error || !session) {
      return createErrorResponse('NO_SESSION', 'No active session found', 404)
    }

    return Response.json({
      access_token: session.access_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      refresh_token: session.refresh_token,
      token_type: session.token_type,
    })
  } catch (error) {
    return handleApiError(error)
  }
}