import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, SectionHeading } from './primitives'

export interface FeatureCard {
  icon?: ReactNode
  title: string
  body: ReactNode
  link?: { label: string; href: string }
}

/**
 * Row of equal-weight feature cards (2–4). The icon tile uses the brand fill,
 * matching the for-businesses solution cards. Not for endless repetition — use
 * once or twice per page (identical card grids repeated are an AI-slop tell).
 */
export function ThreeUpCards({
  eyebrow,
  heading,
  body,
  cards,
  align = 'left',
}: {
  eyebrow?: string
  heading?: ReactNode
  body?: ReactNode
  cards: FeatureCard[]
  align?: 'left' | 'center'
}) {
  return (
    <section className="py-[96px]">
      <Container className="flex flex-col gap-[64px]">
        {heading && <SectionHeading eyebrow={eyebrow} title={heading} body={body} align={align} />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-[20px] rounded-[12px] border border-[#e9eaeb] bg-white p-[32px]"
            >
              {card.icon && (
                <div className="size-[48px] rounded-[10px] bg-[#155eef] flex items-center justify-center">
                  {card.icon}
                </div>
              )}
              <div className="flex flex-col gap-[8px]">
                <p className="font-semibold text-[20px] leading-[30px] text-[#181d27]">{card.title}</p>
                <p className="font-normal text-[16px] leading-[24px] text-[#535862]">{card.body}</p>
              </div>
              {card.link && (
                <Link
                  href={card.link.href}
                  className="inline-flex items-center gap-[8px] font-semibold text-[16px] leading-[24px] text-[#155eef] hover:text-[#004eeb] transition-colors mt-auto"
                >
                  {card.link.label}
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
