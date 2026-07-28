import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

/**
 * Reusable loading skeleton primitives.
 *
 * Every variant resolves to a `div` styled with theme tokens
 * (see `app/globals.css` `--color-gray-100`) and respects
 * `prefers-reduced-motion` via Tailwind's `motion-safe:` modifier —
 * when the user has reduced motion enabled, blocks render as solid
 * (non-pulsing) placeholders.
 *
 * Variants:
 *   <Skeleton />            — basic block (custom width/height via className)
 *   <Skeleton.Text />       — N stacked text lines, last line 70% width
 *   <Skeleton.Circle />     — round avatar / icon placeholder
 *   <Skeleton.Card />       — bordered card chrome with optional body
 *   <Skeleton.Row />        — list row with circle + text
 *
 * All variants are `aria-hidden="true"` so they do not interrupt screen
 * readers; parents should expose the loading state via `role="status"` /
 * `aria-busy` on a wrapper element.
 */

type SkeletonOwnProps = {
  /** Override the default rounded-md shape (e.g. for square/circle avatars). */
  shape?: 'block' | 'circle'
}

export type SkeletonProps = SkeletonOwnProps & HTMLAttributes<HTMLDivElement>

const BASE_CLASSES =
  'motion-safe:animate-pulse rounded-md bg-[var(--color-gray-100,#f5f5f5)]'

const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', shape = 'block', ...rest }, ref) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : ''
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`${BASE_CLASSES} ${shapeClass} ${className}`}
        {...rest}
      />
    )
  },
)
SkeletonRoot.displayName = 'SkeletonRoot'

// ─── Compound variants ────────────────────────────────────────────────────

type SkeletonTextProps = {
  /** Number of stacked text lines. Clamped to [1, 10]. Default 3. */
  lines?: number
  /** Width of the last line as a CSS length or percentage. Default "70%". */
  lastLineWidth?: string
  /** Spacing between lines. Default "gap-2" (8px). */
  gap?: string
  className?: string
}

function SkeletonText({
  lines = 3,
  lastLineWidth = '70%',
  gap = 'gap-2',
  className = '',
  ...rest
}: SkeletonTextProps & HTMLAttributes<HTMLDivElement>) {
  const safeLines = Math.max(1, Math.min(10, Math.floor(lines)))
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col ${gap} ${className}`}
      {...rest}
    >
      {Array.from({ length: safeLines }).map((_, i) => {
        const isLast = i === safeLines - 1
        const style: CSSProperties = isLast ? { width: lastLineWidth } : {}
        return <SkeletonRoot key={i} className="h-3 w-full" style={style} />
      })}
    </div>
  )
}

type SkeletonCircleProps = {
  /** Diameter in pixels. Default 40. */
  size?: number
  className?: string
}

function SkeletonCircle({
  size = 40,
  className = '',
  ...rest
}: SkeletonCircleProps & HTMLAttributes<HTMLDivElement>) {
  const style: CSSProperties = { width: size, height: size }
  return (
    <SkeletonRoot
      shape="circle"
      style={style}
      className={className}
      {...rest}
    />
  )
}

type SkeletonCardProps = {
  /** Optional skeleton body. Defaults to one heading line + text block. */
  children?: ReactNode
  className?: string
}

function SkeletonCard({
  children,
  className = '',
  ...rest
}: SkeletonCardProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`rounded-xl border border-[var(--color-gray-200,#e9eaeb)] bg-[var(--color-bg-primary,#fff)] p-5 ${className}`}
      {...rest}
    >
      {children ?? (
        <div className="flex flex-col gap-3">
          <SkeletonRoot className="h-4 w-1/3" />
          <SkeletonText lines={3} />
        </div>
      )}
    </div>
  )
}

type SkeletonRowProps = {
  /** Circle diameter in pixels. Default 32. */
  avatarSize?: number
  className?: string
}

function SkeletonRow({
  avatarSize = 32,
  className = '',
  ...rest
}: SkeletonRowProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`flex items-center gap-3 ${className}`}
      {...rest}
    >
      <SkeletonCircle size={avatarSize} />
      <div className="flex-1">
        <SkeletonRoot className="h-3 w-full" />
      </div>
    </div>
  )
}

// Attach compound variants to the base component for ergonomic use:
//   <Skeleton.Text lines={3} />
//   <Skeleton.Circle size={40} />
//   <Skeleton.Card />
//   <Skeleton.Row avatarSize={32} />
export const Skeleton = Object.assign(SkeletonRoot, {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
  Row: SkeletonRow,
})
