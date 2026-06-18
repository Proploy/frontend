import { Container, SectionHeading } from './primitives'

export interface Testimonial {
  quote: string
  name: string
  role: string
  /** Solid avatar fill (no external images needed for the mock). */
  color?: string
}

/**
 * Masonry-ish testimonial grid. Uses CSS columns so cards of varying height pack
 * naturally without a fixed row grid. Quotes are the trust signal — keep them
 * specific and software-implementation flavored.
 */
export function TestimonialWall({
  eyebrow,
  heading = 'Why teams choose Proploy',
  testimonials,
}: {
  eyebrow?: string
  heading?: string
  testimonials: Testimonial[]
}) {
  return (
    <section className="py-[96px] bg-[#fafafa]">
      <Container className="flex flex-col gap-[64px]">
        <SectionHeading eyebrow={eyebrow} title={heading} align="center" />
        <div className="columns-1 md:columns-2 lg:columns-3 gap-[24px] [column-fill:balance]">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="mb-[24px] break-inside-avoid rounded-[12px] border border-[#e9eaeb] bg-white p-[24px] flex flex-col gap-[20px]"
            >
              <blockquote className="font-normal text-[16px] leading-[24px] text-[#252b37]">“{t.quote}”</blockquote>
              <figcaption className="flex items-center gap-[12px]">
                <span
                  className="size-[40px] rounded-full shrink-0"
                  style={{ background: t.color ?? '#c6d0e0' }}
                  aria-hidden
                />
                <span className="flex flex-col">
                  <span className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{t.name}</span>
                  <span className="font-normal text-[14px] leading-[20px] text-[#535862]">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
