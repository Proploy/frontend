'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  Check,
  CreditCard,
  Info,
  Plus,
  Rocket,
  Wallet,
  X,
} from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import {
  Avatar,
  KpiCard,
  ProgressBar,
  SectionCard,
  STATUS_STYLES,
  StatusPill,
  formatDate,
  usd,
} from '@/components/business/dashboard/ui'
import { MOCK_ACTIVATION, MOCK_BUSINESS_DASHBOARD, MOCK_BUSINESS_USER } from '@/lib/service-apis/business-dashboard-mock'
import type { AttentionItem } from '@/lib/service-apis/business-dashboard-mock'

const SEVERITY: Record<AttentionItem['severity'], { icon: React.ReactNode; bg: string; fg: string }> = {
  blocked: { icon: <Ban size={16} />, bg: '#fef3f2', fg: '#b42318' },
  risk: { icon: <AlertTriangle size={16} />, bg: '#fffaeb', fg: '#b54708' },
  info: { icon: <Info size={16} />, bg: '#eff4ff', fg: '#004eeb' },
}

const CAPACITY_COLOR: Record<string, string> = {
  'Has room': '#067647',
  Balanced: '#004eeb',
  'At capacity': '#b54708',
}

export default function BusinessOverviewPage() {
  const d = MOCK_BUSINESS_DASHBOARD
  const reduce = useReducedMotion()
  const firstName = MOCK_BUSINESS_USER.name.split(' ')[0]
  const [showActivation, setShowActivation] = useState(true)

  const container = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  }

  const latestInvoice = d.invoices[0]

  return (
    <BusinessPage>
      <BusinessPageHeader
        title={`Welcome back, ${firstName}`}
        subtitle={`Here’s how ${MOCK_BUSINESS_USER.company}’s implementations are tracking across experts, spend, and compliance.`}
        actions={
          <>
            <Link
              href="/business/dashboard/payments"
              className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Review invoices
            </Link>
            <Link
              href="/business/dashboard/hire"
              className={`flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
            >
              <Plus size={16} />
              Hire an expert
            </Link>
          </>
        }
      />

      {showActivation && <ActivationChecklist onDismiss={() => setShowActivation(false)} />}

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
            label="Active engagements"
            value={String(d.kpis.activeEngagements)}
            sub={`${d.projects.filter((p) => p.status === 'At risk' || p.status === 'Blocked').length} need attention`}
            href="/business/dashboard/projects"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            icon={<Wallet size={18} />}
            label="Held in escrow"
            value={usd(d.kpis.inEscrowCents)}
            sub="Across funded milestones"
            href="/business/dashboard/payments"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            icon={<CreditCard size={18} />}
            label="Spend this month"
            value={usd(d.kpis.spendThisMonthCents)}
            sub={`${latestInvoice.period} statement`}
            href="/business/dashboard/payments"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            icon={<Info size={18} />}
            label="Pending approvals"
            value={String(d.kpis.pendingApprovals)}
            sub="Invoices & milestones"
            href="/business/dashboard/payments"
          />
        </motion.div>
      </motion.div>

      <div className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-[24px]">
          {/* Active engagements */}
          <SectionCard title="Active engagements" action={{ label: 'All projects', href: '/business/dashboard/projects' }}>
            <ul className="divide-y divide-[#f0f0f1]">
              {d.projects.map((p) => (
                <li key={p.id} className="flex flex-col gap-[12px] px-[20px] py-[16px]">
                  <div className="flex flex-wrap items-start justify-between gap-[8px]">
                    <div className="flex min-w-0 items-center gap-[12px]">
                      <Avatar initial={p.expertInitial} color={STATUS_STYLES[p.status].dot} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[15px] leading-[22px] text-[#181d27]">{p.name}</p>
                        <p className="text-[13px] leading-[18px] text-[#717680]">
                          {p.expert} · owned by {p.owner}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  <ProgressBar value={p.progress} color={STATUS_STYLES[p.status].dot} />
                  <div className="flex items-center justify-between text-[12px] leading-[18px] text-[#717680]">
                    <span>
                      Next: <span className="font-medium text-[#414651]">{p.nextMilestone}</span>
                    </span>
                    <span>
                      {usd(p.spentCents)} / {usd(p.budgetCents)} · due {formatDate(p.dueDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Needs attention */}
          <SectionCard title="Needs attention">
            <ul className="divide-y divide-[#f0f0f1]">
              {d.attention.map((a) => {
                const s = SEVERITY[a.severity]
                return (
                  <li key={a.id} className="flex items-start gap-[12px] px-[20px] py-[16px]">
                    <span
                      className="mt-[1px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px]"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      {s.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{a.title}</p>
                      <p className="text-[13px] leading-[18px] text-[#717680]">{a.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-[24px]">
          {/* Team workload */}
          <SectionCard title="Team workload" action={{ label: 'Team', href: '/business/dashboard/team' }}>
            <ul className="flex flex-col gap-[16px] p-[20px]">
              {d.workload.map((w) => (
                <li key={w.name} className="flex items-center justify-between gap-[12px]">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{w.name}</p>
                    <p className="text-[12px] leading-[18px] text-[#717680]">{w.role}</p>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <span className="text-[13px] font-medium text-[#414651]">{w.activeProjects} active</span>
                    <span
                      className="rounded-full px-[8px] py-[2px] text-[12px] font-semibold leading-[18px]"
                      style={{ color: CAPACITY_COLOR[w.capacity], background: `${CAPACITY_COLOR[w.capacity]}14` }}
                    >
                      {w.capacity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Current statement */}
          <SectionCard title="Current statement" action={{ label: 'Payments', href: '/business/dashboard/payments' }}>
            <div className="flex flex-col gap-[12px] p-[20px]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[13px] leading-[18px] text-[#717680]">{latestInvoice.period} · {latestInvoice.number}</p>
                  <p className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">
                    {usd(latestInvoice.totalUsdCents)}
                  </p>
                </div>
                <span className="rounded-full bg-[#fffaeb] px-[10px] py-[3px] text-[12px] font-semibold text-[#b54708]">
                  {latestInvoice.status}
                </span>
              </div>
              <p className="text-[13px] leading-[18px] text-[#717680]">
                {latestInvoice.lines.length} experts across {new Set(latestInvoice.lines.map((l) => l.country)).size} countries,
                consolidated into one statement.
              </p>
              <Link
                href="/business/dashboard/payments"
                className="inline-flex items-center gap-[4px] text-[13px] font-semibold text-[#004eeb] hover:text-[#155eef]"
              >
                Review & approve
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </SectionCard>

          {/* Messages */}
          <SectionCard
            title={`Messages · ${d.messages.filter((m) => m.unread).length} new`}
            action={{ label: 'Open inbox', href: '/business/dashboard/messages' }}
          >
            <ul className="divide-y divide-[#f0f0f1]">
              {d.messages.map((m) => (
                <li key={m.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
                  <Avatar initial={m.from.charAt(0)} color={m.brand} />
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
          </SectionCard>
        </div>
      </div>
    </BusinessPage>
  )
}

function ActivationChecklist({ onDismiss }: { onDismiss: () => void }) {
  const steps = MOCK_ACTIVATION
  const done = steps.filter((s) => s.done).length
  const pct = Math.round((done / steps.length) * 100)
  if (done === steps.length) return null
  return (
    <div className="mt-[24px] overflow-hidden rounded-[12px] border border-[#b2ccff] bg-[#f5f8ff]">
      <div className="flex items-start justify-between gap-[12px] px-[20px] pt-[18px]">
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#155eef] text-white">
            <Rocket size={20} />
          </span>
          <div>
            <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Finish setting up {MOCK_BUSINESS_USER.company}</p>
            <p className="text-[13px] leading-[18px] text-[#535862]">{done} of {steps.length} done · {pct}% complete</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-white/60"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-[20px] pt-[12px]">
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#d1e0ff]">
          <div className="h-full rounded-full bg-[#155eef]" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-px p-[20px] sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className={`flex items-center gap-[10px] rounded-[8px] px-[10px] py-[8px] text-[14px] leading-[20px] transition-colors ${
                s.done ? 'text-[#535862]' : 'text-[#181d27] hover:bg-white'
              }`}
            >
              <span
                className={`flex size-[20px] shrink-0 items-center justify-center rounded-full ${
                  s.done ? 'bg-[#155eef] text-white' : 'border border-[#84adff] bg-white text-transparent'
                }`}
              >
                <Check size={12} />
              </span>
              <span className={s.done ? 'line-through' : 'font-medium'}>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
