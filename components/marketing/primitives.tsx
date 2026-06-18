import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Shared marketing primitives + design constants.
 * Lifted verbatim from the patterns in app/for-businesses and app/for-experts so
 * every marketing page renders with one consistent visual language.
 *
 * Tokens (see app/globals.css): brand #155eef / #004eeb, ink #181d27,
 * body #535862, muted #717680, border #e9eaeb / #d5d7da, surface tint #fafafa.
 * Type: DM Sans (display + body), Inter (nav/labels).
 */

export const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

export const btnPrimary =
  `inline-flex items-center justify-center bg-[#155eef] hover:bg-[#004eeb] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white transition-colors ${BUTTON_SKEUO_SHADOW}`

export const btnSecondary =
  `inline-flex items-center justify-center bg-white hover:bg-[#fafafa] border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] transition-colors ${BUTTON_SKEUO_SHADOW}`

export interface CtaLink {
  label: string
  href: string
}

/** Standard 1280px content container. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1280px] mx-auto px-[32px] ${className}`}>{children}</div>
}

/** Primary + secondary button pair. Primary first in source for a11y; visually primary sits right. */
export function CtaButtons({
  primary,
  secondary,
  className = '',
}: {
  primary?: CtaLink
  secondary?: CtaLink
  className?: string
}) {
  if (!primary && !secondary) return null
  return (
    <div className={`flex flex-wrap gap-[12px] ${className}`}>
      {secondary && (
        <Link href={secondary.href} className={btnSecondary}>
          {secondary.label}
        </Link>
      )}
      {primary && (
        <Link href={primary.href} className={btnPrimary}>
          {primary.label}
        </Link>
      )}
    </div>
  )
}

/**
 * Section heading block. `eyebrow` is OPTIONAL and should be used sparingly —
 * never put one above every section (AI-slop tell). Default: no eyebrow.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <div className={`flex flex-col gap-[20px] max-w-[768px] ${alignment} ${className}`}>
      {eyebrow && <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">{eyebrow}</p>}
      <h2
        className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]"
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>
      {body && <p className="font-normal text-[20px] leading-[30px] text-[#535862]">{body}</p>}
    </div>
  )
}
