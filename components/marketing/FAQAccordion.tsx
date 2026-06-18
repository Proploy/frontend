'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { Container, SectionHeading, btnPrimary } from './primitives'

export interface FaqItem {
  q: string
  a: string
}

/**
 * FAQ accordion (single-open). Default content is rendered visible; only the
 * answer panels toggle, so the section never ships blank in a headless render.
 * Reduced-motion safe (height is not animated).
 */
export function FAQAccordion({
  heading = 'Frequently asked questions',
  body = 'Everything you need to know. Can’t find an answer? Talk to our team.',
  faqs,
  contact,
}: {
  heading?: string
  body?: string
  faqs: FaqItem[]
  contact?: { label: string; href: string }
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-[96px]">
      <Container className="flex flex-col gap-[64px]">
        <SectionHeading title={heading} body={body} align="center" />

        <div className="max-w-[768px] mx-auto w-full flex flex-col gap-[24px]">
          {faqs.map((faq, i) => {
            const expanded = open === i
            return (
              <div key={faq.q} className={i > 0 ? 'border-t border-[#e9eaeb] pt-[24px]' : ''}>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="flex items-start gap-[16px] w-full text-left"
                >
                  <span className="flex-1 flex flex-col gap-[8px]">
                    <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{faq.q}</span>
                    {expanded && (
                      <span className="font-normal text-[16px] leading-[24px] text-[#535862]">{faq.a}</span>
                    )}
                  </span>
                  <span className="shrink-0 pt-[2px] text-[#155eef]">
                    {expanded ? <Minus size={24} /> : <Plus size={24} />}
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        {contact && (
          <div className="max-w-[1216px] mx-auto w-full bg-[#fafafa] rounded-[16px] px-[32px] py-[40px] flex flex-col items-center gap-[24px] text-center">
            <div className="flex flex-col items-center gap-[8px]">
              <p className="font-semibold text-[20px] leading-[30px] text-[#181d27]">Still have questions?</p>
              <p className="font-normal text-[18px] leading-[28px] text-[#535862] max-w-[560px]">
                Our team is happy to walk you through how Proploy works for your rollout.
              </p>
            </div>
            <Link href={contact.href} className={btnPrimary}>
              {contact.label}
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}
