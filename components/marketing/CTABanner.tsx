import type { ReactNode } from 'react'
import { Container, CtaButtons, type CtaLink } from './primitives'

/**
 * Closing call-to-action band. Two variants:
 *  - default: centered copy on the surface tint.
 *  - `dark`: brand-blue full-bleed band for high-emphasis page ends.
 */
export function CTABanner({
  title,
  body,
  primary,
  secondary,
  variant = 'default',
}: {
  title: ReactNode
  body?: ReactNode
  primary?: CtaLink
  secondary?: CtaLink
  variant?: 'default' | 'dark'
}) {
  const dark = variant === 'dark'
  return (
    <section className="py-[96px]">
      <Container>
        <div
          className={`rounded-[24px] px-[32px] py-[64px] flex flex-col items-center gap-[32px] text-center ${
            dark ? 'bg-[#155eef]' : 'bg-[#fafafa] border border-[#e9eaeb]'
          }`}
        >
          <div className="max-w-[768px] flex flex-col gap-[16px]">
            <h2
              className={`font-semibold text-[36px] leading-[44px] tracking-[-0.72px] ${
                dark ? 'text-white' : 'text-[#181d27]'
              }`}
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h2>
            {body && (
              <p className={`font-normal text-[20px] leading-[30px] ${dark ? 'text-[#d1e0ff]' : 'text-[#535862]'}`}>
                {body}
              </p>
            )}
          </div>
          <CtaButtons primary={primary} secondary={secondary} className="justify-center" />
        </div>
      </Container>
    </section>
  )
}
