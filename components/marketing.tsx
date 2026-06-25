'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1280px] px-[32px]">{children}</div>
}

export function SectionHeading({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <h2 className="font-semibold text-[36px] leading-[44px] tracking-[-0.02em] text-[#181d27]">{title}</h2>
      <p className="max-w-[720px] text-[16px] leading-[24px] text-[#535862]">{body}</p>
    </div>
  )
}

export const btnPrimary =
  'inline-flex items-center justify-center rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb]'

export const btnSecondary =
  'inline-flex items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa]'

export function CTABanner({
  variant = 'light',
  title,
  body,
  primary,
  secondary,
}: {
  variant?: 'light' | 'dark'
  title: string
  body: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  const dark = variant === 'dark'
  return (
    <section className={dark ? 'bg-[#0040c1] py-[72px]' : 'bg-[#fafafa] py-[72px]'}>
      <Container>
        <div className={`flex flex-col gap-[24px] rounded-[18px] px-[24px] py-[28px] md:px-[32px] ${dark ? '' : 'border border-[#e9eaeb] bg-white'}`}>
          <div className="max-w-[760px]">
            <h3 className={`text-[28px] font-semibold leading-[36px] tracking-[-0.02em] ${dark ? 'text-white' : 'text-[#181d27]'}`}>
              {title}
            </h3>
            <p className={`mt-[8px] text-[16px] leading-[24px] ${dark ? 'text-[#b2ccff]' : 'text-[#535862]'}`}>{body}</p>
          </div>
          <div className="flex flex-wrap gap-[12px]">
            <Link href={primary.href} className={dark ? btnPrimary : btnPrimary}>
              {primary.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className={dark ? btnSecondary : btnSecondary}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
