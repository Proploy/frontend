'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { isPortalRoute } from '@/lib/site-chrome'

/**
 * First-paint splash shown while `AuthProvider` resolves the Supabase session.
 *
 * Mounted inside `app/(site)/layout.tsx` between `AuthProvider` and the page
 * tree, this blocks `children` on portal routes until
 * `useAuth().isLoading === false`. That removes the unstyled flash that would
 * otherwise appear during the first `getUser()` round-trip on a hard refresh.
 *
 * Public routes are never blocked. `isLoading` starts true and only a browser
 * effect clears it, so on the server it is always true: gating every route
 * made the server HTML of the whole site a spinner, and crawlers indexed the
 * homepage as one word with no headings or links. Public pages render
 * straight away and handle a still-loading session themselves.
 *
 * The progress bar at the top of the page (`<NextTopLoader />`) sits above
 * this splash (its z-index is 1600; ours is 40), so the bar remains visible
 * during the auth check.
 *
 * Accessibility:
 *   - `role="status"` + `aria-live="polite"` announces "Loading…" to screen
 *     readers when the splash mounts.
 *   - `aria-busy="true"` on the wrapper signals to assistive tech that the
 *     surrounding region is still loading.
 */
export function AuthBootstrapSplash({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth()
  const pathname = usePathname()

  if (!isLoading || !isPortalRoute(pathname)) return <>{children}</>

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--color-bg-primary,#ffffff)]"
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/PROPLOY.svg"
          alt="Proploy"
          width={140}
          height={40}
          priority
          className="opacity-90"
        />
        <Loader2
          size={28}
          className="animate-spin text-[var(--color-brand-600,#155eef)] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-[var(--color-text-tertiary,#535862)]">
          Loading…
        </p>
      </div>
    </div>
  )
}
