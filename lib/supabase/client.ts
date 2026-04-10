'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client for use in Client Components
 * This client is used for client-side interactions like real-time subscriptions,
 * login forms, and other browser-based operations
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

