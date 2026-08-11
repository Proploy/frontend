'use client'

import { createBrowserClient } from '@supabase/ssr'
import { supabaseAuthCookieOptions } from '@/lib/supabase/cookie-options'

/**
 * Creates a Supabase browser client for use in Client Components
 * This client is used for client-side interactions like real-time subscriptions,
 * login forms, and other browser-based operations.
 *
 * NOTE: this client is currently unused in the app (all auth flows go through
 * the server route handlers). It is retained for defense-in-depth: if it is
 * ever wired up, it will inherit the hardened cookie options. The browser
 * silently drops `httpOnly` when writing via `document.cookie`, but `secure`
 * and `sameSite: 'lax'` are still enforced.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: supabaseAuthCookieOptions }
  )
}

