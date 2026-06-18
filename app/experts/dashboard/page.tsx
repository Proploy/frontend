'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle,
  ExternalLink,
  FileText,
  MessageSquare,
  Phone,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardFailureState,
  DashboardLoading,
  DashboardShell,
  useExpertDashboardData,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { MOCK_EXPERT_WORKSPACE } from '@/lib/service-apis/expert-workspace-mock'
import type {
  ExpertWorkspaceSummary,
  WorkspaceProjectStatus,
} from '@/lib/service-apis/expert-workspace-mock'
import { EXPERT_REVIEWS, ratingSummary } from '@/lib/service-apis/reviews-mock'
import type { Review } from '@/lib/service-apis/reviews-mock'
import { StarRating } from '@/components/business/dashboard/ReviewModal'
import { useDemo } from '@/lib/demo/demo-store'
import { Sparkles } from 'lucide-react'
import type { ExpertMe } from '@/hooks/types/expert-contracts'

/* --------------------------------------------------------------- helpers */

function usd(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function pctDelta(now: number, prev: number): { label: string; up: boolean } {
  if (prev <= 0) return { label: '—', up: true }
  const change = ((now - prev) / prev) * 100
  const up = change >= 0
  return { label: `${up ? '+' : ''}${change.toFixed(0)}%`, up }
}

const STATUS_STYLES: Record<WorkspaceProjectStatus, { dot: string; text: string; bg: string }> = {
  'On track': { dot: '#17b26a', text: '#067647', bg: '#ecfdf3' },
  'At risk': { dot: '#f79009', text: '#b54708', bg: '#fffaeb' },
  Blocked: { dot: '#f04438', text: '#b42318', bg: '#fef3f2' },
  Review: { dot: '#155eef', text: '#004eeb', bg: '#eff4ff' },
  Launched: { dot: '#7f56d9', text: '#6941c6', bg: '#f4f3ff' },
}

function buildProfileCompleteness(expert: ExpertMe, fallback: ExpertWorkspaceSummary['profileCompleteness']) {
  const items = [
    { label: 'Headline & bio', done: Boolean(expert.headline) },
    { label: 'Expertise tags', done: expert.tags.length > 0 },
    { label: 'Portfolio projects', done: expert.projects.length > 0 },
    { label: 'Profile photo', done: Boolean(expert.profilePictureUrl) },
    { label: 'Intro video', done: Boolean(expert.introVideoLink) },
    { label: 'Scheduling link', done: Boolean(expert.schedulingLink && expert.schedulingLinkEnabled) },
  ]
  const done = items.filter((i) => i.done).length
  const percent = Math.round((done / items.length) * 100)
  // If the profile is essentially empty (real account with no data), prefer the
  // illustrative fallback so the card still demonstrates the feature.
  if (done === 0) return fallback
  return { percent, items }
}

/* ------------------------------------------------------------------- page */

export default function ExpertsDashboardPage() {
  const state = useExpertDashboardData()
  const reduce = useReducedMotion()
  const demo = useDemo()

  if (state.isPending) return <DashboardLoading />
  if (!state.user || state.dashboardError || !state.dashboard) return <DashboardFailureState state={state} />

  const expert = state.dashboard.expert
  const ws = MOCK_EXPERT_WORKSPACE
  const firstName = (expert.displayName ?? 'there').split(' ')[0]
  const completeness = buildProfileCompleteness(expert, ws.profileCompleteness)

  // Demo overlays: payouts released by the business move money out of escrow
  // into earnings; briefs posted by the business appear as new opportunities.
  const releasedCents = demo.payouts.reduce((s, p) => s + p.amountCents, 0)
  const earnedThisMonth = ws.earnings.thisMonthCents + releasedCents
  const inEscrow = Math.max(0, ws.earnings.inEscrowCents - releasedCents)

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
  }
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  }

  const earnDelta = pctDelta(ws.earnings.thisMonthCents, ws.earnings.lastMonthCents)

  return (
    <DashboardShell expert={expert}>
      <div className="mx-auto w-full max-w-[1200px] px-[20px] py-[24px] md:px-[32px] md:py-[32px]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h1 className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">
                Welcome back, {firstName}
              </h1>
              <span className="inline-flex items-center gap-[4px] rounded-full border border-[#abefc6] bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                <CheckCircle size={14} />
                {expert.status}
              </span>
            </div>
            <p className="text-[15px] leading-[22px] text-[#535862]">
              {expert.headline || 'Here’s what’s moving across your workspace today.'}
            </p>
          </div>
          <div className="flex items-center gap-[10px]">
            <Link
              href="/become-expert"
              className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Edit profile
            </Link>
            {expert.schedulingLink && expert.schedulingLinkEnabled ? (
              <a
                href={expert.schedulingLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-[#155eef] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <ExternalLink size={16} />
                Scheduling link
              </a>
            ) : (
              <Link
                href="/experts/dashboard/leads"
                className={`bg-[#155eef] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                View leads
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* KPI row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-[24px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div variants={item}>
            <KpiCard
              icon={<Wallet size={18} />}
              label="Earned this month"
              value={usd(earnedThisMonth)}
              delta={earnDelta.label}
              deltaUp={earnDelta.up}
              sub={releasedCents > 0 ? `incl. ${usd(releasedCents)} just released` : 'vs last month'}
              href="/experts/dashboard/earnings"
            />
          </motion.div>
          <motion.div variants={item}>
            <KpiCard
              icon={<Wallet size={18} />}
              label="Held in escrow"
              value={usd(inEscrow)}
              sub={`${usd(ws.earnings.pendingPayoutCents)} pending payout`}
              href="/experts/dashboard/earnings"
            />
          </motion.div>
          <motion.div variants={item}>
            <KpiCard
              icon={<FileText size={18} />}
              label="Active projects"
              value={String(ws.projects.length)}
              sub={`${ws.projects.filter((p) => p.status === 'At risk' || p.status === 'Blocked').length} need attention`}
              href="/experts/dashboard/projects"
            />
          </motion.div>
          <motion.div variants={item}>
            <KpiCard
              icon={<TrendingUp size={18} />}
              label="Proposal win rate"
              value={`${ws.pipeline.winRatePct}%`}
              sub={`${ws.pipeline.proposalsOut} proposals out`}
              href="/experts/dashboard/proposals"
            />
          </motion.div>
        </motion.div>

        {/* Main grid */}
        <div className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-[24px]">
            {demo.leads.length > 0 && <NewOpportunities leads={demo.leads} />}
            <ActiveProjects ws={ws} />
            <Pipeline ws={ws} />
          </div>
          <div className="flex flex-col gap-[24px]">
            <ProfileCompleteness completeness={completeness} />
            <Reputation />
            <Upcoming ws={ws} />
            <Messages ws={ws} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------- components */

function KpiCard({
  icon,
  label,
  value,
  delta,
  deltaUp,
  sub,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  delta?: string
  deltaUp?: boolean
  sub: string
  href: string
}) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] transition-colors hover:border-[#d5d7da] ${CARD_SHADOW}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-[36px] items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
          {icon}
        </span>
        <ArrowUpRight size={16} className="text-[#a4a7ae] transition-colors group-hover:text-[#155eef]" />
      </div>
      <div className="flex flex-col gap-[2px]">
        <p className="text-[14px] font-medium leading-[20px] text-[#535862]">{label}</p>
        <div className="flex items-baseline gap-[8px]">
          <p className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">{value}</p>
          {delta && (
            <span
              className={`text-[13px] font-semibold leading-[18px] ${deltaUp ? 'text-[#067647]' : 'text-[#b42318]'}`}
            >
              {delta}
            </span>
          )}
        </div>
        <p className="text-[12px] leading-[18px] text-[#717680]">{sub}</p>
      </div>
    </Link>
  )
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: { label: string; href: string }
  children: React.ReactNode
}) {
  return (
    <section className={`rounded-[12px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
      <div className="flex items-center justify-between gap-[12px] border-b border-[#f0f0f1] px-[20px] py-[16px]">
        <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-[4px] text-[13px] font-semibold leading-[18px] text-[#004eeb] hover:text-[#155eef]"
          >
            {action.label}
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function ActiveProjects({ ws }: { ws: ExpertWorkspaceSummary }) {
  return (
    <SectionCard title="Active projects" action={{ label: 'All projects', href: '/experts/dashboard/projects' }}>
      <ul className="divide-y divide-[#f0f0f1]">
        {ws.projects.map((p) => {
          const s = STATUS_STYLES[p.status]
          return (
            <li key={p.id} className="flex flex-col gap-[12px] px-[20px] py-[16px]">
              <div className="flex flex-wrap items-start justify-between gap-[8px]">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[15px] leading-[22px] text-[#181d27]">{p.name}</p>
                  <p className="text-[13px] leading-[18px] text-[#717680]">{p.client}</p>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px]"
                  style={{ background: s.bg, color: s.text }}
                >
                  <span className="size-[6px] rounded-full" style={{ background: s.dot }} />
                  {p.status}
                </span>
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#f0f0f1]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.progress}%`, background: s.dot }}
                  />
                </div>
                <div className="flex items-center justify-between text-[12px] leading-[18px] text-[#717680]">
                  <span>
                    Next: <span className="font-medium text-[#414651]">{p.nextMilestone}</span>
                  </span>
                  <span>{p.progress}% · due {formatDate(p.dueDate)}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}

function Pipeline({ ws }: { ws: ExpertWorkspaceSummary }) {
  const stats = [
    { label: 'New leads', value: ws.pipeline.newLeads, href: '/experts/dashboard/leads' },
    { label: 'Awaiting response', value: ws.pipeline.awaitingResponse, href: '/experts/dashboard/proposals' },
    { label: 'Proposals out', value: ws.pipeline.proposalsOut, href: '/experts/dashboard/proposals' },
    { label: 'Win rate', value: `${ws.pipeline.winRatePct}%`, href: '/experts/dashboard/sales' },
  ]
  return (
    <SectionCard title="Sales pipeline" action={{ label: 'View leads', href: '/experts/dashboard/leads' }}>
      <div className="grid grid-cols-2 gap-px bg-[#f0f0f1] sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex flex-col gap-[4px] bg-white px-[20px] py-[16px] transition-colors hover:bg-[#fafafa]"
          >
            <span className="font-semibold text-[24px] leading-[32px] text-[#181d27]">{s.value}</span>
            <span className="text-[13px] leading-[18px] text-[#717680]">{s.label}</span>
          </Link>
        ))}
      </div>
    </SectionCard>
  )
}

function ProfileCompleteness({
  completeness,
}: {
  completeness: ExpertWorkspaceSummary['profileCompleteness']
}) {
  const { percent, items } = completeness
  return (
    <SectionCard title="Profile strength" action={{ label: 'Improve', href: '/become-expert' }}>
      <div className="flex flex-col gap-[16px] p-[20px]">
        <div className="flex items-center gap-[16px]">
          <Ring percent={percent} />
          <div>
            <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">
              {percent === 100 ? 'Profile complete' : 'Stronger profiles win more work'}
            </p>
            <p className="text-[13px] leading-[18px] text-[#717680]">
              {items.filter((i) => !i.done).length} step{items.filter((i) => !i.done).length === 1 ? '' : 's'} left to a standout profile.
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-[8px]">
          {items.map((i) => (
            <li key={i.label} className="flex items-center gap-[10px] text-[14px] leading-[20px]">
              <span
                className={`flex size-[18px] shrink-0 items-center justify-center rounded-full ${
                  i.done ? 'bg-[#dcfae6] text-[#067647]' : 'border border-[#d5d7da] text-transparent'
                }`}
              >
                <CheckCircle size={12} />
              </span>
              <span className={i.done ? 'text-[#535862] line-through' : 'text-[#414651]'}>{i.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  )
}

function Ring({ percent }: { percent: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <div className="relative size-[64px] shrink-0">
      <svg viewBox="0 0 64 64" className="size-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f0f0f1" strokeWidth="8" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#155eef"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-[15px] text-[#181d27]">
        {percent}%
      </span>
    </div>
  )
}

function Upcoming({ ws }: { ws: ExpertWorkspaceSummary }) {
  const iconFor = (kind: ExpertWorkspaceSummary['upcoming'][number]['kind']) => {
    if (kind === 'call') return <Phone size={15} />
    if (kind === 'invoice') return <Wallet size={15} />
    return <CalendarClock size={15} />
  }
  return (
    <SectionCard title="Upcoming">
      <ul className="divide-y divide-[#f0f0f1]">
        {ws.upcoming.map((u) => (
          <li key={u.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
            <span className="mt-[2px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
              {iconFor(u.kind)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{u.title}</p>
              <p className="text-[13px] leading-[18px] text-[#717680]">
                {u.when} · {u.meta}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function Messages({ ws }: { ws: ExpertWorkspaceSummary }) {
  const unread = ws.messages.filter((m) => m.unread).length
  return (
    <SectionCard
      title={unread ? `Messages · ${unread} new` : 'Messages'}
      action={{ label: 'Open inbox', href: '/experts/chat' }}
    >
      <ul className="divide-y divide-[#f0f0f1]">
        {ws.messages.map((m) => (
          <li key={m.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
            <span
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
              style={{ background: m.brand }}
            >
              {m.from.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-[8px]">
                <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{m.from}</p>
                <span className="shrink-0 text-[12px] leading-[18px] text-[#717680]">{m.when}</span>
              </div>
              <p className="truncate text-[13px] leading-[18px] text-[#717680]">{m.preview}</p>
            </div>
            {m.unread && <span className="mt-[7px] size-[8px] shrink-0 rounded-full bg-[#155eef]" />}
          </li>
        ))}
      </ul>
      <Link
        href="/experts/chat"
        className="flex items-center justify-center gap-[6px] border-t border-[#f0f0f1] px-[20px] py-[12px] text-[13px] font-semibold text-[#004eeb] hover:bg-[#fafafa]"
      >
        <MessageSquare size={14} />
        Open inbox
      </Link>
    </SectionCard>
  )
}

function NewOpportunities({ leads }: { leads: ReturnType<typeof useDemo>['leads'] }) {
  return (
    <SectionCard title={`New opportunities · ${leads.length}`} action={{ label: 'All leads', href: '/experts/dashboard/leads' }}>
      <ul className="divide-y divide-[#f0f0f1]">
        {leads.map((l) => (
          <li key={l.id} className="flex items-start gap-[12px] px-[20px] py-[16px]">
            <span className="mt-[1px] flex size-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
              <Sparkles size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">{l.title}</p>
              <p className="text-[13px] leading-[18px] text-[#717680]">
                {l.category} · {l.scope} · {l.timeline}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-semibold text-[#067647]">
              {l.budget}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function Reputation() {
  const { reviews: demoReviews } = useDemo()
  const merged: Review[] = [
    ...demoReviews.map((r) => ({
      id: r.id, author: r.author, company: r.company, project: r.project,
      rating: r.rating, title: r.title, body: r.body, date: '', reply: null,
    })),
    ...EXPERT_REVIEWS,
  ]
  const { count, avg, dist } = ratingSummary(merged)
  const top = merged[0]
  const maxN = Math.max(1, ...dist.map((d) => d.n))
  return (
    <SectionCard title="Reputation">
      <div className="flex flex-col gap-[16px] p-[20px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-[32px] leading-[40px] text-[#181d27]">{avg}</span>
            <StarRating value={Math.round(avg)} readOnly size={14} />
            <span className="mt-[2px] text-[12px] text-[#717680]">{count} reviews</span>
          </div>
          <div className="flex-1">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-[8px]">
                <span className="w-[10px] text-[12px] text-[#717680]">{d.star}</span>
                <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#f0f0f1]">
                  <div className="h-full rounded-full bg-[#f79009]" style={{ width: `${(d.n / maxN) * 100}%` }} />
                </div>
                <span className="w-[14px] text-right text-[12px] text-[#717680]">{d.n}</span>
              </div>
            ))}
          </div>
        </div>
        {top && (
          <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
            <div className="flex items-center gap-[8px]">
              <StarRating value={top.rating} readOnly size={13} />
              <span className="font-semibold text-[13px] leading-[18px] text-[#181d27]">{top.title}</span>
            </div>
            <p className="mt-[4px] line-clamp-2 text-[13px] leading-[18px] text-[#535862]">“{top.body}”</p>
            <p className="mt-[6px] text-[12px] text-[#717680]">{top.author}, {top.company}</p>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}
