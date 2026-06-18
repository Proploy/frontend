import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  FileSignature,
  Lock,
  Rocket,
  Search,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { CTABanner, Container, SectionHeading } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Help center · Proploy',
  description:
    'Guides and answers for running software implementations on Proploy — getting started, billing, contracts, and account security for experts and businesses.',
}

/* ------------------------------------------------------------------- data */

interface HelpCategory {
  icon: typeof Rocket
  title: string
  body: string
  count: number
  href: string
}

const categories: HelpCategory[] = [
  {
    icon: Rocket,
    title: 'Getting started',
    body: 'Set up your profile, post a project, and understand how a Proploy engagement works end to end.',
    count: 18,
    href: '/help/getting-started',
  },
  {
    icon: Users,
    title: 'For experts',
    body: 'Build a vetted profile, respond to briefs, scope statements of work, and deliver implementations.',
    count: 31,
    href: '/help/for-experts',
  },
  {
    icon: BookOpen,
    title: 'For businesses',
    body: 'Write a clear brief, compare matched experts, and manage milestones from kickoff to go-live.',
    count: 24,
    href: '/help/for-businesses',
  },
  {
    icon: CreditCard,
    title: 'Billing & payments',
    body: 'Invoices, payouts, milestone releases, fees, and how funds move between businesses and experts.',
    count: 22,
    href: '/help/billing',
  },
  {
    icon: FileSignature,
    title: 'Contracts',
    body: 'Statements of work, e-signature, change orders, deal protection, and acceptance criteria.',
    count: 16,
    href: '/help/contracts',
  },
  {
    icon: Lock,
    title: 'Account & security',
    body: 'Two-factor authentication, team roles, data handling, and keeping your workspace protected.',
    count: 14,
    href: '/help/account-security',
  },
]

interface PopularArticle {
  title: string
  category: string
  readTime: string
  href: string
}

const popularArticles: PopularArticle[] = [
  {
    title: 'How experts are vetted before they join the network',
    category: 'For businesses',
    readTime: '4 min read',
    href: '/help/for-businesses/vetting',
  },
  {
    title: 'Writing a brief that gets you matched in 48 hours',
    category: 'Getting started',
    readTime: '6 min read',
    href: '/help/getting-started/writing-a-brief',
  },
  {
    title: 'How milestone payments and escrow releases work',
    category: 'Billing & payments',
    readTime: '5 min read',
    href: '/help/billing/milestone-payments',
  },
  {
    title: 'Sending a statement of work for e-signature',
    category: 'Contracts',
    readTime: '3 min read',
    href: '/help/contracts/send-for-signature',
  },
  {
    title: 'Raising a change order when scope shifts mid-project',
    category: 'Contracts',
    readTime: '4 min read',
    href: '/help/contracts/change-orders',
  },
  {
    title: 'Adding teammates and setting workspace roles',
    category: 'Account & security',
    readTime: '3 min read',
    href: '/help/account-security/team-roles',
  },
]

/* ------------------------------------------------------------------- page */

export default function HelpPage() {
  return (
    <>
      {/* Hero + static search */}
      <section className="pt-[96px] pb-[64px]">
        <Container className="flex flex-col items-center gap-[40px]">
          <div className="max-w-[768px] flex flex-col gap-[24px] text-center">
            <h1
              className="font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]"
              style={{ textWrap: 'balance' }}
            >
              How can we help?
            </h1>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Guides and answers for running software implementations on Proploy — for the experts
              delivering the work and the businesses hiring them.
            </p>
          </div>

          <form action="/help/search" className="w-full max-w-[640px]" role="search">
            <label htmlFor="help-search" className="sr-only">
              Search the help center
            </label>
            <div className="flex items-center gap-[12px] rounded-[12px] border border-[#d5d7da] bg-white px-[18px] py-[14px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] focus-within:border-[#155eef]">
              <Search size={20} className="shrink-0 text-[#717680]" aria-hidden="true" />
              <input
                id="help-search"
                name="q"
                type="search"
                autoComplete="off"
                placeholder="Search for guides, payouts, contracts…"
                className="w-full bg-transparent text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none"
              />
            </div>
          </form>

          <p className="text-[14px] leading-[20px] text-[#717680]">
            Popular:{' '}
            <Link href="/help/billing/milestone-payments" className="font-medium text-[#155eef] hover:text-[#004eeb]">
              milestone payments
            </Link>
            ,{' '}
            <Link href="/help/getting-started/writing-a-brief" className="font-medium text-[#155eef] hover:text-[#004eeb]">
              writing a brief
            </Link>
            ,{' '}
            <Link href="/help/contracts/send-for-signature" className="font-medium text-[#155eef] hover:text-[#004eeb]">
              e-signature
            </Link>
          </p>
        </Container>
      </section>

      {/* Category grid */}
      <section className="py-[64px]">
        <Container className="flex flex-col gap-[48px]">
          <SectionHeading
            title="Browse by topic"
            body="Six collections covering every part of an engagement — from the first brief to final payout."
          />
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ icon: Icon, title, body, count, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:border-[#d5d7da] hover:bg-[#fafafa]"
              >
                <span className="flex size-[44px] items-center justify-center rounded-[10px] bg-[#155eef]">
                  <Icon size={22} className="text-white" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-[6px]">
                  <h3 className="font-semibold text-[18px] leading-[28px] text-[#181d27] tracking-[-0.18px]">
                    {title}
                  </h3>
                  <p className="text-[15px] leading-[22px] text-[#535862]">{body}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-[8px]">
                  <span className="text-[13px] font-medium leading-[18px] text-[#717680]">
                    {count} articles
                  </span>
                  <span className="inline-flex items-center gap-[4px] text-[14px] font-semibold leading-[20px] text-[#155eef] group-hover:text-[#004eeb]">
                    Explore
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular articles */}
      <section className="py-[64px]">
        <Container className="flex flex-col gap-[48px]">
          <SectionHeading
            title="Popular articles"
            body="The guides experts and businesses open most often when they get started."
          />
          <div className="overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white">
            {popularArticles.map(({ title, category, readTime, href }, i) => (
              <Link
                key={title}
                href={href}
                className={`group flex items-center gap-[16px] px-[24px] py-[20px] transition-colors hover:bg-[#fafafa] ${
                  i > 0 ? 'border-t border-[#e9eaeb]' : ''
                }`}
              >
                <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#eff4ff]">
                  <BookOpen size={18} className="text-[#155eef]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{title}</h3>
                  <p className="mt-[2px] text-[14px] leading-[20px] text-[#717680]">
                    {category} · {readTime}
                  </p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-[#717680] transition-colors group-hover:text-[#155eef]"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust note before support CTA */}
      <section className="py-[64px]">
        <Container>
          <div className="flex flex-col items-start gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-[#fafafa] p-[32px] sm:flex-row sm:items-center sm:gap-[24px]">
            <span className="flex size-[48px] shrink-0 items-center justify-center rounded-[12px] bg-white border border-[#e9eaeb]">
              <ShieldCheck size={24} className="text-[#155eef]" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-[4px]">
              <h3 className="font-semibold text-[18px] leading-[28px] text-[#181d27] tracking-[-0.18px]">
                Every answer is written by the team that runs the platform
              </h3>
              <p className="text-[15px] leading-[22px] text-[#535862]">
                Articles are reviewed against how Proploy actually works — payouts, vetting, and
                contracts included — so you can act on them with confidence.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Account help quick links */}
      <section className="py-[64px]">
        <Container className="flex flex-col gap-[32px]">
          <SectionHeading title="Manage your account" />
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
            <Link
              href="/help/account-security/team-roles"
              className="group flex items-start gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:bg-[#fafafa]"
            >
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#eff4ff]">
                <UserCog size={22} className="text-[#155eef]" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-[4px]">
                <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                  Roles & team access
                </h3>
                <p className="text-[14px] leading-[20px] text-[#535862]">
                  Invite teammates, set permissions, and control who can sign contracts or release payments.
                </p>
              </div>
            </Link>
            <Link
              href="/help/account-security/two-factor"
              className="group flex items-start gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:bg-[#fafafa]"
            >
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#eff4ff]">
                <Lock size={22} className="text-[#155eef]" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-[4px]">
                <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                  Secure your workspace
                </h3>
                <p className="text-[14px] leading-[20px] text-[#535862]">
                  Turn on two-factor authentication and review active sessions across your devices.
                </p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title="Still need a hand?"
        body="Our support team knows software implementations — not just the platform. Reach out and a human will help you move your engagement forward."
        primary={{ label: 'Contact support', href: '/contact' }}
        secondary={{ label: 'Browse all guides', href: '/help/getting-started' }}
      />
    </>
  )
}
