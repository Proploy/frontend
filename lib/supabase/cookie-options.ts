/**
 * Cookie options applied to every Supabase auth cookie AND to our own
 * `auth_intent` cookie. Centralized so a single change hardens them all.
 *
 * Why these values:
 *  - httpOnly: true  — JS (XSS payloads) cannot read the cookie value.
 *  - secure: prod    — browser refuses to send over plain HTTP in production.
 *  - sameSite: lax   — mitigates CSRF while still allowing top-level navigations
 *                      (e.g. Supabase OAuth callback / email link click-through).
 *  - path: /         — cookie applies to the whole app.
 *
 * `@supabase/ssr@0.5.2` defaults to `httpOnly: false` and no `secure` flag —
 * see node_modules/@supabase/ssr/dist/module/utils/constants.js — so we must
 * override explicitly on every createServerClient / createBrowserClient call.
 *
 * Note: when the browser client writes a cookie via `document.cookie`, the
 * `httpOnly` flag is silently ignored by the browser. That is fine — the
 * server (proxy.ts + sign-in/sign-out route handlers) is the only writer we
 * trust, and it does honor `httpOnly`.
 */
export const supabaseAuthCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}
