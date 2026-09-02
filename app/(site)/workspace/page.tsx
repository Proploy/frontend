'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  Bell,
  Briefcase,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  Handshake,
  Inbox,
  Info,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { KpiCard, SectionCard, usd } from '@/components/dashboard/ui'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  initials,
  engagementTitle,
  longDate,
  projectStatusClass,
  relativeDate,
  statusLabel,
  timeDate,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole } from '@/features/workspace'
import { useWorkspaceExperience } from '@/features/workspace/workspace-experience'
import { useWorkspaceHome } from '@/features/workspace/use-workspace-home'
import type { WorkspaceHomeActivity, WorkspaceHomeSnapshot } from '@/features/workspace/home-types'
import type {
  WorkspaceConversation,
  WorkspaceEngagement,
  WorkspaceMeeting,
  WorkspaceProject,
} from '@/features/workspace/types'
import { nativeSchedulingAccessForRole } from '@/features/native-scheduling/access'
import { NativeMeetingEntryCard } from '@/features/native-scheduling/components/NativeMeetingEntryCard'

const SERVICE_UNAVAILABLE_LABEL = 'service unavailable'

export default function WorkspaceHomePage() {
  const state = useCurrentUserRole()
  const home = useWorkspaceHome()
  const workspaceExperience = useWorkspaceExperience()

  const firstName = useMemo(() => {
    const source = state.user?.name ?? state.user?.email ?? 'there'
    return source.split(/[ @]/)[0] || 'there'
  }, [state.user?.name, state.user?.email])

  // Must precede the early returns below — hook order has to be stable.
  const reduce = useReducedMotion()

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace" />

  const container = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  }

  const isExpert = state.role === 'expert'
  const roleLabel = isExpert
    ? 'Expert workspace'
    : statusLabel(state.role ?? 'buyer')

  return (
    <LazyMotion features={domAnimation}>
    <WorkspaceShell role={state.role}>
      <div className="mx-auto w-full max-w-[1200px] px-[20px] py-[24px] md:px-[32px] md:py-[32px]">
        {/* Hero */}
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h1 className="font-semibold text-[28px] leading-[36px] tracking-normal text-[#181d27]">
                Welcome back, {firstName}
              </h1>
              <span className="inline-flex items-center gap-[4px] rounded-full border border-[#abefc6] bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                <CheckCircle size={14} />
                {roleLabel}
              </span>
              {home.serviceUnavailable && (
                <span className="inline-flex items-center gap-[4px] rounded-full border border-[#fda29b] bg-[#fef3f2] px-[8px] py-[2px] text-[12px] font-semibold leading-[18px] text-[#b42318]">
                  <AlertTriangle size={14} />
                  {SERVICE_UNAVAILABLE_LABEL}
                </span>
              )}
            </div>
          </div>
          <QuickActions
            isExpert={isExpert}
            unreadNotifications={workspaceExperience.unreadCount}
            onOpenNotifications={workspaceExperience.openNotifications}
          />
        </div>

        {/* Per-endpoint error banner (collapses when empty) */}
        {home.errors.length > 0 && !home.serviceUnavailable && (
          <div className="mt-[18px] rounded-[12px] border border-[#fedf89] bg-[#fffaeb] px-[16px] py-[12px] text-[13px] leading-[18px] text-[#b54708]">
            Some workspace sections could not refresh: {home.errors.slice(0, 2).map((err) => `${err.endpoint} (${err.message})`).join('; ')}
          </div>
        )}

        {home.serviceUnavailable && (
          <div className="mt-[18px] rounded-[12px] border border-[#fda29b] bg-[#fef3f2] px-[16px] py-[12px] text-[13px] leading-[18px] text-[#b42318]">
            The workspace API is currently unreachable. Counts and activity below are stale or empty until it recovers.
          </div>
        )}

        {nativeSchedulingAccessForRole(state.role) === 'test_only' && (
          <div className="mt-[24px]">
            <NativeMeetingEntryCard
              role={state.role}
              engagement={null}
              counterpartyLabel="your expert calendar"
              isCalendarOpen={false}
              onToggleCalendar={() => {}}
              onOpenChange={() => {}}
            />
          </div>
        )}

        {/* KPI row — loading skeletons per card */}
        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-[24px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4"
        >
          <m.div variants={item}>
          <KpiCard
            icon={<Users size={18} />}
            label="Open engagements"
            value={String(home.kpis.openEngagements)}
            sub={`${home.engagements.length} total`}
            isLoading={home.isLoading}
            loadingSlot={<KpiSkeleton />}
            error={findEndpointError(home, '/me/engagements')}
            href="/workspace/engagements"
          />
          </m.div>
          <m.div variants={item}>
          <KpiCard
            icon={<Briefcase size={18} />}
            label="Active projects"
            value={String(home.kpis.activeProjects)}
            sub={`${home.projects.length} in portfolio`}
            isLoading={home.isLoading}
            loadingSlot={<KpiSkeleton />}
            error={findEndpointError(home, '/me/projects')}
            href="/workspace/projects"
          />
          </m.div>
          <m.div variants={item}>
          <KpiCard
            icon={<Inbox size={18} />}
            label="Unread messages"
            value={String(home.kpis.unreadMessages)}
            sub={`across ${home.conversations.length} conversations`}
            isLoading={home.isLoading}
            loadingSlot={<KpiSkeleton />}
            error={findEndpointError(home, '/me/conversations')}
            href="/workspace/messages"
          />
          </m.div>
          <m.div variants={item}>
          <KpiCard
            icon={<Clock size={18} />}
            label="Pending decisions"
            value={String(home.kpis.pendingDecisions)}
            sub={pendingDecisionsBreakdown(home)}
            isLoading={home.isLoading}
            loadingSlot={<KpiSkeleton />}
            error={
              findEndpointError(home, '/me/proposals') ||
              findEndpointError(home, '/me/contracts') ||
              findEndpointError(home, '/me/invoices')
            }
            href="/workspace/proposals"
          />
          </m.div>
        </m.div>

        {/* Main two-column area: activity + side cards */}
        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-[1.6fr_1fr]"
        >
          <m.div variants={item} className="flex min-w-0 flex-col gap-[24px]">
            <NeedsAttention home={home} />
            <RecentActivity
              items={home.recentActivity}
              isLoading={home.isLoading}
              onOpenNotifications={workspaceExperience.openNotifications}
            />
            <ActiveProjects projects={home.projects} engagements={home.engagements} viewerRole={state.role} />
          </m.div>
          <m.div variants={item} className="flex min-w-0 flex-col gap-[24px]">
            <CurrentStatement home={home} />
            <MessagesCard conversations={home.conversations} engagements={home.engagements} viewerRole={state.role} />
            <UpcomingMeetingsCard meetings={upcomingMeetings(home.meetings)} />
          </m.div>
        </m.div>
      </div>
    </WorkspaceShell>
    </LazyMotion>
  )
}


// ─── Attention + statement derivations ─────────────────────────────────────

type AttentionSeverity = 'blocked' | 'risk' | 'info'

interface AttentionEntry {
  id: string
  severity: AttentionSeverity
  title: string
  detail: string
  href: string
}

/** Sub-line for the pending-decisions KPI: what actually makes up the count. */
function pendingDecisionsBreakdown(home: WorkspaceHomeSnapshot): string {
  const proposals = home.proposals.filter((p) => p.status === 'sent').length
  const contracts = home.contracts.filter(
    (c) => c.status === 'sent' || c.status === 'buyer_signed' || c.status === 'expert_signed',
  ).length
  const invoices = home.invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').length
  const parts = [
    proposals ? `${proposals} proposal${proposals === 1 ? '' : 's'}` : null,
    contracts ? `${contracts} contract${contracts === 1 ? '' : 's'}` : null,
    invoices ? `${invoices} invoice${invoices === 1 ? '' : 's'}` : null,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'nothing waiting'
}

/**
 * Items that need a decision, ordered by urgency. Derived from the same
 * snapshot the KPIs use — overdue invoices block, awaiting-signature contracts
 * and near-due invoices are risks, sent proposals are informational.
 */
function attentionEntries(home: WorkspaceHomeSnapshot): AttentionEntry[] {
  const now = Date.now()
  const soon = 1000 * 60 * 60 * 24 * 7
  const entries: AttentionEntry[] = []

  for (const invoice of home.invoices) {
    if (invoice.status === 'overdue') {
      entries.push({
        id: `invoice-${invoice.id}`,
        severity: 'blocked',
        title: `Invoice ${invoice.invoiceNumber} is overdue`,
        detail: `${usd(invoice.totalCents)} · was due ${longDate(invoice.dueAt)}`,
        href: '/workspace/invoices',
      })
    } else if (invoice.status === 'sent') {
      const due = new Date(invoice.dueAt).getTime()
      if (Number.isFinite(due) && due - now <= soon) {
        entries.push({
          id: `invoice-${invoice.id}`,
          severity: 'risk',
          title: `Invoice ${invoice.invoiceNumber} due soon`,
          detail: `${usd(invoice.totalCents)} · due ${longDate(invoice.dueAt)}`,
          href: '/workspace/invoices',
        })
      }
    }
  }

  for (const contract of home.contracts) {
    if (contract.status === 'sent' || contract.status === 'buyer_signed' || contract.status === 'expert_signed') {
      entries.push({
        id: `contract-${contract.id}`,
        severity: 'risk',
        title: `${contract.title} awaits signature`,
        detail: statusLabel(contract.status),
        href: '/workspace/contracts',
      })
    }
  }

  for (const proposal of home.proposals) {
    if (proposal.status === 'sent') {
      entries.push({
        id: `proposal-${proposal.id}`,
        severity: 'info',
        title: `${proposal.title} awaits a decision`,
        detail: 'Proposal sent',
        href: '/workspace/proposals',
      })
    }
  }

  const rank: Record<AttentionSeverity, number> = { blocked: 0, risk: 1, info: 2 }
  return entries.sort((a, b) => rank[a.severity] - rank[b.severity]).slice(0, 5)
}

const ATTENTION_STYLES: Record<AttentionSeverity, { icon: ReactNode; bg: string; fg: string }> = {
  blocked: { icon: <Ban size={16} />, bg: '#fef3f2', fg: '#b42318' },
  risk: { icon: <AlertTriangle size={16} />, bg: '#fffaeb', fg: '#b54708' },
  info: { icon: <Info size={16} />, bg: '#eff4ff', fg: '#004eeb' },
}

function NeedsAttention({ home }: { home: WorkspaceHomeSnapshot }) {
  const entries = attentionEntries(home)
  return (
    <SectionCard title="Needs attention">
      {entries.length === 0 ? (
        <p className="px-[20px] py-[24px] text-[13px] leading-[20px] text-[#717680]">
          {home.isLoading ? 'Checking for anything that needs a decision…' : 'Nothing is waiting on you right now.'}
        </p>
      ) : (
        <ul className="flex flex-col">
          {entries.map((entry) => {
            const style = ATTENTION_STYLES[entry.severity]
            return (
              <li key={entry.id} className="border-b border-[#f0f0f1] last:border-b-0">
                <Link href={entry.href} className="flex items-start gap-[12px] px-[20px] py-[14px] hover:bg-[#fafafa]">
                  <span
                    className="mt-[1px] flex size-[28px] shrink-0 items-center justify-center rounded-[8px]"
                    style={{ background: style.bg, color: style.fg }}
                  >
                    {style.icon}
                  </span>
                  <span className="flex min-w-0 flex-col gap-[2px]">
                    <span className="truncate text-[14px] font-medium leading-[20px] text-[#181d27]">{entry.title}</span>
                    <span className="truncate text-[12px] leading-[18px] text-[#717680]">{entry.detail}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

function CurrentStatement({ home }: { home: WorkspaceHomeSnapshot }) {
  const outstanding = home.invoices.filter((i) => i.status === 'sent' || i.status === 'overdue')
  const total = outstanding.reduce((sum, invoice) => sum + invoice.totalCents, 0)
  const latest = outstanding[0]

  return (
    <SectionCard title="Current statement" action={{ label: 'Invoices', href: '/workspace/invoices' }}>
      <div className="flex flex-col gap-[14px] px-[20px] py-[18px]">
        <div className="flex flex-col gap-[2px]">
          <p className="text-[13px] leading-[18px] text-[#535862]">Outstanding</p>
          <p className="font-semibold text-[28px] leading-[36px] tracking-[-0.02em] text-[#181d27]">
            {usd(total)}
          </p>
          <p className="text-[12px] leading-[18px] text-[#717680]">
            {outstanding.length === 0
              ? 'No open invoices'
              : `${outstanding.length} open invoice${outstanding.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {latest && (
          <div className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]">
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="truncate text-[13px] font-medium leading-[18px] text-[#181d27]">
                {latest.invoiceNumber}
              </span>
              <span className="text-[12px] leading-[18px] text-[#717680]">due {longDate(latest.dueAt)}</span>
            </span>
            <span className="shrink-0 text-[14px] font-semibold leading-[20px] text-[#181d27]">
              {usd(latest.totalCents)}
            </span>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

// ─── Quick actions ─────────────────────────────────────────────────────────

function QuickActions({
  isExpert,
  unreadNotifications,
  onOpenNotifications,
}: {
  isExpert: boolean
  unreadNotifications: number
  onOpenNotifications: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      <Link
        href="/workspace/messages"
        className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
      >
        <Plus size={16} />
        Open messages
      </Link>
      {isExpert && (
        <Link
          href="/workspace/proposals"
          className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
        >
          <FileText size={16} />
          Create proposal
        </Link>
      )}
      {isExpert && (
        <Link
          href="/workspace/sales"
          className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
        >
          <TrendingUp size={16} />
          View sales
        </Link>
      )}
      <button
        type="button"
        onClick={onOpenNotifications}
        className={`relative flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
      >
        <Bell size={16} />
        Notifications
        {unreadNotifications > 0 && (
          <span className="ml-[4px] inline-flex min-w-[18px] items-center justify-center rounded-full bg-white px-[6px] text-[11px] font-semibold text-[#155eef]">
            {unreadNotifications}
          </span>
        )}
      </button>
    </div>
  )
}

// ─── KPI card with per-card loading + error ────────────────────────────────

function KpiSkeleton() {
  return (
    <Skeleton
      className="h-[36px] w-[60px] rounded-[6px]"
      role="status"
      aria-label="loading"
    />
  )
}

// ─── Section card shell ────────────────────────────────────────────────────

// ─── Recent activity ───────────────────────────────────────────────────────

export function RecentActivity({
  items,
  isLoading,
  onOpenNotifications,
}: {
  items: WorkspaceHomeActivity[]
  isLoading: boolean
  onOpenNotifications?: () => void
}) {
  return (
    <SectionCard
      title="Recent activity"
      action={
        onOpenNotifications
          ? { label: 'All events', onClick: onOpenNotifications }
          : undefined
      }
    >
      {isLoading ? (
        <ActivitySkeleton />
      ) : items.length === 0 ? (
        <EmptyRows message="No recent activity yet." />
      ) : (
        <ul className="divide-y divide-[#f0f0f1]">
          {items.map((item) => {
            const content = (
              <>
                <span className="mt-[2px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
                  {activityIcon(item.kind)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-[8px]">
                    <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{item.title}</p>
                    <span className="shrink-0 text-[12px] leading-[18px] text-[#717680]">{relativeDate(item.createdAt)}</span>
                  </div>
                  {item.detail && <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#717680]">{item.detail}</p>}
                </div>
              </>
            )
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-start gap-[12px] px-[20px] py-[14px] hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155eef]"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-start gap-[12px] px-[20px] py-[14px]">{content}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

function ActivitySkeleton() {
  return (
    <ul className="divide-y divide-[#f0f0f1]" aria-label="loading">
      {Array.from({ length: 4 }).map((_, idx) => (
        <li key={idx} className="flex items-center gap-[12px] px-[20px] py-[14px]">
          <Skeleton className="size-[30px] rounded-[8px]" />
          <Skeleton className="h-[14px] flex-1 rounded-[4px]" />
        </li>
      ))}
    </ul>
  )
}

function activityIcon(kind: WorkspaceHomeActivity['kind']): ReactNode {
  switch (kind) {
    case 'engagement':
      return <Users size={15} />
    case 'proposal':
      return <Handshake size={15} />
    case 'contract':
      return <FileText size={15} />
    case 'invoice':
      return <TrendingUp size={15} />
    default:
      return <Bell size={15} />
  }
}

// ─── Active projects (existing card preserved) ─────────────────────────────

function ActiveProjects({
  projects,
  engagements,
  viewerRole,
}: {
  projects: WorkspaceProject[]
  engagements: WorkspaceEngagement[]
  viewerRole: 'buyer' | 'expert' | null
}) {
  const engagementMap = new Map(engagements.map((engagement) => [engagement.id, engagement]))
  return (
    <SectionCard title="Active projects" action={{ label: 'All projects', href: '/workspace/projects' }}>
      {projects.length === 0 ? (
        <EmptyRows message="No active projects yet." />
      ) : (
        <ul className="divide-y divide-[#f0f0f1]">
          {projects.slice(0, 5).map((project) => {
            const engagement = engagementMap.get(project.engagementId)
            return (
              <li key={project.id} className="flex flex-col gap-[12px] px-[20px] py-[16px]">
                <div className="flex flex-wrap items-start justify-between gap-[8px]">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[15px] leading-[22px] text-[#181d27]">{project.title}</p>
                    <p className="text-[13px] leading-[18px] text-[#717680]">
                      {engagement ? engagementTitle(engagement, viewerRole) : 'Workspace engagement'}
                    </p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${projectStatusClass(project.status)}`}>
                    <span className="size-[6px] rounded-full bg-current" />
                    {statusLabel(project.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-[12px] text-[12px] leading-[18px] text-[#717680]">
                  <span className="truncate">{project.summary || project.scope}</span>
                  <span className="shrink-0">{longDate(project.createdAt)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

// ─── Messages card (renamed to avoid clash with old `Messages`) ────────────

function MessagesCard({
  conversations,
  engagements,
  viewerRole,
}: {
  conversations: WorkspaceConversation[]
  engagements: WorkspaceEngagement[]
  viewerRole: 'buyer' | 'expert' | null
}) {
  const engagementMap = new Map(engagements.map((engagement) => [engagement.id, engagement]))
  return (
    <SectionCard title="Messages" action={{ label: 'Open inbox', href: '/workspace/messages' }}>
      {conversations.length === 0 ? (
        <EmptyRows message="No messages yet." />
      ) : (
        <ul className="divide-y divide-[#f0f0f1]">
          {conversations.slice(0, 5).map((conversation) => {
            const engagement = engagementMap.get(conversation.engagementId)
            const engagementLabel = engagement ? engagementTitle(engagement, viewerRole) : 'Engagement'
            const title = conversation.subject ?? engagementLabel
            return (
            <li key={conversation.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#155eef] text-[13px] font-semibold text-white">
                {initials(title)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-[8px]">
                  <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">
                    {title}
                  </p>
                  <span className="shrink-0 text-[12px] leading-[18px] text-[#717680]">
                    {relativeDate(conversation.lastMessageAt ?? conversation.createdAt)}
                  </span>
                </div>
                <p className="truncate text-[13px] leading-[18px] text-[#717680]">
                  {engagementLabel}
                </p>
              </div>
            </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

// ─── Upcoming meetings derived from /me/meetings ───────────────────────────

type UpcomingItem = { id: string; title: string; subtitle: string }

function upcomingMeetings(meetings: WorkspaceMeeting[] | undefined): UpcomingItem[] {
  const now = Date.now()
  return (meetings ?? [])
    .filter((m) => {
      if (m.status !== 'scheduled') return false
      const start = new Date(m.startsAt).getTime()
      return Number.isFinite(start) && start >= now
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 5)
    .map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: `${timeDate(m.startsAt)} · ${m.timezone}`,
    }))
}

function UpcomingMeetingsCard({ meetings }: { meetings: UpcomingItem[] }) {
  return (
    <SectionCard title="Upcoming" action={{ label: 'Calendar', href: '/workspace/meetings' }}>
      {meetings.length === 0 ? (
        <EmptyRows message="No upcoming meetings." />
      ) : (
        <ul className="divide-y divide-[#f0f0f1]">
          {meetings.map((item) => (
            <li key={item.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
              <span className="mt-[2px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
                <CalendarClock size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{item.title}</p>
                <p className="text-[13px] leading-[18px] text-[#717680]">{item.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function EmptyRows({ message }: { message: string }) {
  return <p className="px-[20px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">{message}</p>
}

function findEndpointError(
  home: WorkspaceHomeSnapshot,
  endpoint: string,
): { message: string } | null {
  const match = home.errors.find((err) => err.endpoint === endpoint)
  return match ? { message: match.message } : null
}
