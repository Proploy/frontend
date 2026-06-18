import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Handshake,
  Headset,
  LifeBuoy,
  Mail,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Container, SectionHeading, btnPrimary } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Contact · Proploy',
  description:
    'Talk to the Proploy team — sales for scoping an implementation, support for live projects, and partnerships for consulting firms and software vendors.',
}

interface Channel {
  icon: React.ReactNode
  title: string
  body: string
  linkLabel: string
  href: string
}

const channels: Channel[] = [
  {
    icon: <Building2 size={20} className="text-[#155eef]" />,
    title: 'Talk to sales',
    body: 'Scoping a rollout or vetting vendors? Tell us the software and the timeline and we will match you to qualified experts.',
    linkLabel: 'sales@proploy.com',
    href: 'mailto:sales@proploy.com',
  },
  {
    icon: <Headset size={20} className="text-[#155eef]" />,
    title: 'Customer support',
    body: 'Already running a project on Proploy? Reach our support team for help with contracts, milestones, invoices, or payouts.',
    linkLabel: 'support@proploy.com',
    href: 'mailto:support@proploy.com',
  },
  {
    icon: <Handshake size={20} className="text-[#155eef]" />,
    title: 'Partnerships',
    body: 'Consulting firms and software vendors building referral or co-delivery programs — start a partnership conversation here.',
    linkLabel: 'partners@proploy.com',
    href: 'mailto:partners@proploy.com',
  },
]

const topics = [
  'I need help scoping an implementation',
  'I want to hire a vetted expert or firm',
  'I am an expert applying to the network',
  'Partnerships (consulting firm / vendor)',
  'Support for an active project',
  'Press or something else',
]

interface HelpLink {
  icon: React.ReactNode
  title: string
  body: string
  href: string
}

const helpLinks: HelpLink[] = [
  {
    icon: <LifeBuoy size={18} className="text-[#155eef]" />,
    title: 'Help center',
    body: 'Guides for buyers and experts on contracts, payments, and matching.',
    href: '/customers',
  },
  {
    icon: <Briefcase size={18} className="text-[#155eef]" />,
    title: 'Become an expert',
    body: 'Apply to join the vetted network and start receiving qualified projects.',
    href: '/network',
  },
  {
    icon: <MessageSquare size={18} className="text-[#155eef]" />,
    title: 'How it works',
    body: 'See how businesses and experts run an implementation end to end.',
    href: '/manage-projects',
  },
]

const labelClass = 'block font-medium text-[14px] leading-[20px] text-[#414651]'
const inputClass =
  'mt-[6px] w-full rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none transition-colors focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20'

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-[#e9eaeb] bg-[#fafafa] py-[96px]">
        <Container>
          <div className="grid grid-cols-1 gap-[64px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[80px]">
            {/* left: heading + channels */}
            <div className="flex flex-col">
              <SectionHeading
                title="Talk to the Proploy team"
                body="Whether you are scoping an implementation, running a live project, or building a partnership, you are talking to people who know software delivery — not a generic inbox."
              />

              <div className="mt-[40px] flex flex-col gap-[12px]">
                {channels.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]"
                  >
                    <div className="flex items-start gap-[14px]">
                      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] border border-[#e9eaeb] bg-[#fafafa]">
                        {c.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                          {c.title}
                        </h3>
                        <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                          {c.body}
                        </p>
                        <a
                          href={c.href}
                          className="mt-[12px] inline-flex items-center gap-[6px] text-[14px] font-semibold leading-[20px] text-[#155eef] transition-colors hover:text-[#004eeb]"
                        >
                          <Mail size={15} />
                          {c.linkLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-[24px] flex items-start gap-[10px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
                <ShieldCheck size={18} className="mt-[1px] shrink-0 text-[#17b26a]" />
                <p className="text-[13px] leading-[19px] text-[#535862]">
                  Typical first response within one business day. Project details you share stay
                  confidential and are only used to route your request.
                </p>
              </div>
            </div>

            {/* right: contact form */}
            <div className="rounded-[16px] border border-[#e9eaeb] bg-white p-[28px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] sm:p-[36px]">
              <h2 className="font-semibold text-[24px] leading-[32px] text-[#181d27] tracking-[-0.24px]">
                Send us a message
              </h2>
              <p className="mt-[6px] text-[15px] leading-[22px] text-[#535862]">
                Tell us what you are working on and we will point you to the right team.
              </p>

              <form className="mt-[28px] flex flex-col gap-[18px]" action="#" method="post">
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jordan Avery"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Work email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className={labelClass}>
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Northwind Logistics"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="topic" className={labelClass}>
                    What can we help with?
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    defaultValue=""
                    className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23717680%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat pr-[40px]`}
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="What software are you implementing, and where are you in the process?"
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div className="flex items-start gap-[10px]">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    className="mt-[3px] size-[16px] shrink-0 rounded-[4px] border border-[#d5d7da] accent-[#155eef]"
                  />
                  <label htmlFor="consent" className="text-[13px] leading-[19px] text-[#535862]">
                    I agree to be contacted about my request and have read the{' '}
                    <Link href="/customers" className="font-medium text-[#155eef] hover:text-[#004eeb]">
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>

                <button type="submit" className={`${btnPrimary} mt-[2px] w-full`}>
                  Send message
                </button>

                <p className="text-center text-[13px] leading-[19px] text-[#717680]">
                  Prefer email? Reach us directly at{' '}
                  <a href="mailto:hello@proploy.com" className="font-medium text-[#155eef] hover:text-[#004eeb]">
                    hello@proploy.com
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* office / help links row */}
      <section className="py-[96px]">
        <Container>
          <div className="flex flex-col gap-[40px]">
            <div className="flex flex-col gap-[24px] sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                title="Other ways to get unblocked"
                body="Answers, applications, and walkthroughs — often faster than waiting on a reply."
              />
              <Link
                href="/network"
                className="inline-flex items-center gap-[6px] text-[15px] font-semibold leading-[22px] text-[#155eef] transition-colors hover:text-[#004eeb]"
              >
                Browse the expert network
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
              {helpLinks.map((l) => (
                <Link
                  key={l.title}
                  href={l.href}
                  className="group flex flex-col rounded-[12px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:border-[#d5d7da] hover:bg-[#fafafa]"
                >
                  <span className="flex size-[40px] items-center justify-center rounded-[10px] border border-[#e9eaeb] bg-[#fafafa]">
                    {l.icon}
                  </span>
                  <h3 className="mt-[16px] flex items-center gap-[6px] font-semibold text-[16px] leading-[24px] text-[#181d27]">
                    {l.title}
                    <ArrowUpRight
                      size={16}
                      className="text-[#717680] transition-colors group-hover:text-[#155eef]"
                    />
                  </h3>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">{l.body}</p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-[#fafafa] p-[28px] sm:grid-cols-2">
              <div>
                <p className="font-medium text-[13px] leading-[19px] text-[#717680]">Headquarters</p>
                <p className="mt-[6px] text-[15px] leading-[22px] text-[#181d27]">
                  Proploy, Inc.
                  <br />
                  548 Market Street, Suite 35410
                  <br />
                  San Francisco, CA 94104
                </p>
              </div>
              <div>
                <p className="font-medium text-[13px] leading-[19px] text-[#717680]">General inquiries</p>
                <p className="mt-[6px] text-[15px] leading-[22px] text-[#181d27]">
                  <a href="mailto:hello@proploy.com" className="font-medium text-[#155eef] hover:text-[#004eeb]">
                    hello@proploy.com
                  </a>
                  <br />
                  Monday to Friday, 9am–6pm PT
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
