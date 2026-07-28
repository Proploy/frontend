import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Page-level loading fallback switcher.
 *
 * Designed for the common pattern:
 *   - `loading` is true → render fallback (skeleton, spinner, or nothing)
 *   - `error` is set → render error fallback if provided
 *   - otherwise → render children
 *
 * Use `variant="skeleton"` with a `skeleton` slot for in-page fetches that
 * should mimic final content shape; `variant="spinner"` for short waits;
 * `variant="silent"` when a parent or upstream layer is already showing a
 * loader (e.g. inside `WorkspaceLoading` or `AuthBootstrapSplash`).
 *
 * The component does not own data fetching — pair with `useFetch` or your
 * feature hooks' `loading`/`error` returns.
 */
type LoadingStateProps = {
  loading: boolean
  error?: { message?: string } | Error | null
  /** Visual treatment while `loading` is true. Default "silent". */
  variant?: 'skeleton' | 'spinner' | 'silent'
  /** Skeleton content for `variant="skeleton"`. Falls back to a basic card. */
  skeleton?: ReactNode
  /** Optional content rendered when `error` is set. If omitted, children render. */
  errorFallback?: ReactNode
  /** Spinner size for `variant="spinner"`. Default 32. */
  spinnerSize?: number
  /** Extra classes applied to the wrapper that holds the spinner fallback. */
  className?: string
  children: ReactNode
}

export function LoadingState({
  loading,
  error,
  variant = 'silent',
  skeleton,
  errorFallback,
  spinnerSize = 32,
  className = '',
  children,
}: LoadingStateProps) {
  if (error && errorFallback !== undefined) return <>{errorFallback}</>
  if (loading) {
    if (variant === 'skeleton') return <>{skeleton ?? <Skeleton.Card />}</>
    if (variant === 'spinner') {
      return (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center justify-center p-8 ${className}`}
        >
          <Loader2
            size={spinnerSize}
            className="animate-spin text-[var(--color-brand-600,#155eef)] motion-reduce:animate-none"
          />
        </div>
      )
    }
    // silent: stay mounted but render nothing while loading
    return null
  }
  return <>{children}</>
}
