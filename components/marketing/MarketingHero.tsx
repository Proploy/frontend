import type { ReactNode } from 'react'
import { Container, CtaButtons, type CtaLink } from './primitives'

/**
 * Standard marketing hero: centered eyebrow (optional) + display title + subtitle + CTA pair,
 * with an optional visual slot below (UISnippetFrame, image, etc.).
 */
export function MarketingHero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  primary?: CtaLink
  secondary?: CtaLink
  /** Optional visual rendered beneath the hero copy (e.g. a UISnippetFrame). */
  children?: ReactNode
}) {
  return (
    <section className="pt-[96px] pb-[64px]">
      <Container className="flex flex-col items-center gap-[48px]">
        <div className="flex flex-col items-center gap-[32px]">
          <div className="max-w-[768px] flex flex-col gap-[24px] text-center">
            {eyebrow && <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">{eyebrow}</p>}
            <h1
              className="font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h1>
            {subtitle && <p className="font-normal text-[20px] leading-[30px] text-[#535862]">{subtitle}</p>}
          </div>
          <CtaButtons primary={primary} secondary={secondary} className="justify-center" />
        </div>
        {children && <div className="w-full">{children}</div>}
      </Container>
    </section>
  )
}
