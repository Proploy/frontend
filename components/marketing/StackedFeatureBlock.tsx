import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Container } from './primitives'

/**
 * Alternating text/visual feature block (Contra's "Get paid / Send invoices / Cash out" stack).
 * Pair 2–3 of these per page, alternating `imagePosition` for rhythm. The `visual`
 * slot is where a UISnippetFrame / mini product mock goes.
 */
export function StackedFeatureBlock({
  eyebrow,
  title,
  body,
  bullets,
  link,
  visual,
  imagePosition = 'right',
  tint = false,
}: {
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  bullets?: string[]
  link?: { label: string; href: string }
  visual: ReactNode
  imagePosition?: 'left' | 'right'
  /** Subtle surface tint behind the whole block. */
  tint?: boolean
}) {
  return (
    <section className={`py-[96px] ${tint ? 'bg-[#fafafa]' : ''}`}>
      <Container className="flex flex-col lg:flex-row items-center gap-[64px]">
        <div className={`flex-1 min-w-0 ${imagePosition === 'left' ? 'lg:order-2' : ''}`}>
          <div className="flex flex-col gap-[24px] max-w-[560px]">
            {eyebrow && <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">{eyebrow}</p>}
            <h3
              className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h3>
            {body && <p className="font-normal text-[20px] leading-[30px] text-[#535862]">{body}</p>}
            {bullets && bullets.length > 0 && (
              <ul className="flex flex-col gap-[16px]">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-[12px]">
                    <span className="mt-[2px] size-[24px] shrink-0 rounded-full bg-[#eff4ff] flex items-center justify-center">
                      <Check size={14} className="text-[#155eef]" />
                    </span>
                    <span className="font-normal text-[16px] leading-[24px] text-[#535862]">{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {link && (
              <Link
                href={link.href}
                className="inline-flex items-center gap-[8px] font-semibold text-[16px] leading-[24px] text-[#155eef] hover:text-[#004eeb] transition-colors"
              >
                {link.label}
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
        <div className={`flex-1 min-w-0 w-full ${imagePosition === 'left' ? 'lg:order-1' : ''}`}>{visual}</div>
      </Container>
    </section>
  )
}
