'use client'

import { Container } from './primitives'

/**
 * Continuous logo marquee (text wordmarks — no asset deps for the mock).
 * Uses the `marquee` keyframe in globals.css. The track is duplicated so the
 * loop is seamless; reduced-motion users get a static, wrapped row instead.
 */
export function LogoMarquee({
  label = 'Trusted by software teams rolling out new tools',
  logos,
}: {
  label?: string
  logos: string[]
}) {
  return (
    <section className="py-[64px] border-y border-[#e9eaeb]">
      <Container className="flex flex-col gap-[32px]">
        <p className="text-center font-medium text-[14px] leading-[20px] text-[#717680]">{label}</p>

        {/* Animated track (hidden when reduced motion is preferred) */}
        <div className="relative overflow-hidden motion-reduce:hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max items-center gap-[64px] animate-[marquee_28s_linear_infinite]">
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="shrink-0 font-semibold text-[20px] leading-[30px] text-[#a4a7ae] whitespace-nowrap"
                aria-hidden={i >= logos.length}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* Static fallback for reduced motion */}
        <div className="hidden motion-reduce:flex flex-wrap items-center justify-center gap-x-[48px] gap-y-[16px]">
          {logos.map((logo) => (
            <span key={logo} className="font-semibold text-[20px] leading-[30px] text-[#a4a7ae]">
              {logo}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}
