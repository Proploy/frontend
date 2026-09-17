import type { ReactNode } from 'react'

/**
 * The single person-avatar for the whole app.
 *
 * When there is no photo, it falls back to initials on a flat tint picked
 * deterministically from the person's name, so the same person is always the
 * same colour and a list of people stays visually distinguishable. Tints come
 * from the portal palette (`app/portal.css`, `.pf-ava--t*`) — no new hues.
 *
 * This replaces the yellow→purple gradient that was pasted into the workspace
 * chrome, the expert dashboard, the account settings and the public expert
 * profile, each with slightly different values.
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const TINTS = ['t1', 't2', 't3', 't4', 't5', 't6'] as const

/**
 * Stable string hash (FNV-1a). Deterministic across server and client, which
 * matters because this renders during SSR — `Math.random()` or a Map-based
 * counter would hydrate to a different colour.
 */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function avatarTint(seed: string): string {
  return TINTS[hash(seed.trim().toLowerCase()) % TINTS.length]
}

/** First letters of the first two words — "Olivia Bennett" → "OB". */
export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2)
  return `${parts[0][0]}${parts[parts.length - 1][0]}`
}

export function Avatar({
  name,
  src,
  size = 'md',
  /** Solid ink treatment — reserved for the signed-in user's own avatar. */
  self = false,
  /** Overlay rendered on top (a verification badge, a presence dot). */
  badge,
  className = '',
}: {
  name: string
  src?: string | null
  size?: AvatarSize
  self?: boolean
  badge?: ReactNode
  className?: string
}) {
  const tint = self ? 'self' : avatarTint(name)

  return (
    <span
      className={`pf-ava pf-ava--${size} pf-ava--${tint} ${className}`}
      // The initials are decorative once the name is in the DOM beside it, but
      // these avatars are often the only thing identifying a row, so label it.
      role="img"
      aria-label={name}
      title={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" />
      ) : (
        <span aria-hidden>{avatarInitials(name)}</span>
      )}
      {badge}
    </span>
  )
}
