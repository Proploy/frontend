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
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { CompleteApplicationCard } from '@/components/experts/CompleteApplicationCard'
import { KpiCard, SectionCard, usd } from '@/components/dashboard/ui'
import { Note, PageHeader } from '@/components/portal/ui'
import {

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
  const roleLabel = isExpert ? 'Expert workspace' : `${statusLabel(state.role ?? 'buyer')} workspace`

  return (
    <LazyMotion features={domAnimation}>
    <WorkspaceShell role={state.role}>
      <div className="pf-main">
        <PageHeader
          eyebrow={roleLabel}
          title={`Welcome back, ${firstName}`}
          lede="Everything waiting on you, in one view."
          actions={
            <QuickActions
              isExpert={isExpert}
              unreadNotifications={workspaceExperience.unreadCount}
              onOpenNotifications={workspaceExperience.openNotifications}
            />
          }
        />

        {/* Per-endpoint error banner (collapses when empty) */}
        {home.errors.length > 0 && !home.serviceUnavailable && (
          <div className="mt-[20px]">
            <Note tone="warn" icon={<AlertTriangle size={15} />}>
              Some workspace sections could not refresh:{' '}
              {home.errors.slice(0, 2).map((err) => `${err.endpoint} (${err.message})`).join('; ')}
            </Note>
          </div>
        )}

        {home.serviceUnavailable && (
          <div className="mt-[20px]">
            <Note tone="danger" icon={<AlertTriangle size={15} />}>
              The workspace API is currently unreachable. Counts and activity below are stale or empty
              until it recovers.
            </Note>
          </div>
        )}

        {!isExpert && <CompleteApplicationCard className="mt-[18px]" />}

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
  blocked: { icon: <Ban size={16} />, bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  risk: { icon: <AlertTriangle size={16} />, bg: 'var(--warn-soft)', fg: 'var(--warn)' },
  info: { icon: <Info size={16} />, bg: 'var(--cobalt-soft)', fg: 'var(--cobalt-deep)' },
}

function NeedsAttention({ home }: { home: WorkspaceHomeSnapshot }) {
  const entries = attentionEntries(home)
  return (
    <SectionCard title="Needs attention">
      {entries.length === 0 ? (
        <p className="px-[20px] py-[24px] text-[13px] leading-[20px] text-ink-muted">
          {home.isLoading ? 'Checking for anything that needs a decision…' : 'Nothing is waiting on you right now.'}
        </p>
      ) : (
        <ul className="flex flex-col">
          {entries.map((entry) => {
            const style = ATTENTION_STYLES[entry.severity]
            return (
              <li key={entry.id} className="border-b border-line-soft last:border-b-0">
                <Link href={entry.href} className="flex items-start gap-[12px] px-[20px] py-[14px] hover:bg-surface-hover">
                  <span
                    className="mt-[1px] flex size-[28px] shrink-0 items-center justify-center rounded-[8px]"
                    style={{ background: style.bg, color: style.fg }}
                  >
                    {style.icon}
                  </span>
                  <span className="flex min-w-0 flex-col gap-[2px]">
                    <span className="truncate text-[14px] font-medium leading-[20px] text-ink">{entry.title}</span>
                    <span className="truncate text-[12px] leading-[18px] text-ink-muted">{entry.detail}</span>
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
          <p className="text-[13px] leading-[18px] text-ink-soft">Outstanding</p>
          <p className="font-semibold text-[28px] leading-[36px] tracking-[-0.02em] text-ink">
            {usd(total)}
          </p>
          <p className="text-[12px] leading-[18px] text-ink-muted">
            {outstanding.length === 0
              ? 'No open invoices'
              : `${outstanding.length} open invoice${outstanding.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {latest && (
          <div className="flex items-center justify-between gap-[12px] rounded-[10px] border border-line px-[14px] py-[12px]">
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="truncate text-[13px] font-medium leading-[18px] text-ink">
                {latest.invoiceNumber}
              </span>
              <span className="text-[12px] leading-[18px] text-ink-muted">due {longDate(latest.dueAt)}</span>
            </span>
            <span className="shrink-0 text-[14px] font-semibold leading-[20px] text-ink">
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
    <>
      <Link href="/workspace/messages" className="pf-btn pf-btn--secondary">
        <MessageSquare size={15} />
        Messages
      </Link>
      {isExpert && (
        <Link href="/workspace/proposals" className="pf-btn pf-btn--secondary">
          <FileText size={15} />
          New proposal
        </Link>
      )}
      {isExpert && (
        <Link href="/workspace/sales" className="pf-btn pf-btn--secondary">
          <TrendingUp size={15} />
          Sales
        </Link>
      )}
      <button type="button" onClick={onOpenNotifications} className="pf-btn pf-btn--primary">
        <Bell size={15} />
        Notifications
        {unreadNotifications > 0 && (
          <span className="ml-[2px] inline-flex min-w-[18px] items-center justify-center rounded-full bg-white/20 px-[5px] font-[family-name:var(--font-ibm-plex-mono)] text-[11px] leading-[16px]">
            {unreadNotifications}
          </span>
        )}
      </button>
    </>
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
        <ul className="divide-y divide-line-soft">
          {items.map((item) => {
            const content = (
              <>
                <span className="mt-[2px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-cobalt-soft text-cobalt">
                  {activityIcon(item.kind)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-[8px]">
                    <p className="truncate font-semibold text-[14px] leading-[20px] text-ink">{item.title}</p>
                    <span className="shrink-0 text-[12px] leading-[18px] text-ink-muted">{relativeDate(item.createdAt)}</span>
                  </div>
                  {item.detail && <p className="mt-[2px] truncate text-[13px] leading-[18px] text-ink-muted">{item.detail}</p>}
                </div>
              </>
            )
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-start gap-[12px] px-[20px] py-[14px] hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cobalt"
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
    <ul className="divide-y divide-line-soft" aria-label="loading">
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
        <ul className="divide-y divide-line-soft">
          {projects.slice(0, 5).map((project) => {
            const engagement = engagementMap.get(project.engagementId)
            return (
              <li key={project.id} className="flex flex-col gap-[12px] px-[20px] py-[16px]">
                <div className="flex flex-wrap items-start justify-between gap-[8px]">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[15px] leading-[22px] text-ink">{project.title}</p>
                    <p className="text-[13px] leading-[18px] text-ink-muted">
                      {engagement ? engagementTitle(engagement, viewerRole) : 'Workspace engagement'}
                    </p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${projectStatusClass(project.status)}`}>
                    <span className="size-[6px] rounded-full bg-current" />
                    {statusLabel(project.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-[12px] text-[12px] leading-[18px] text-ink-muted">
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
        <ul className="divide-y divide-line-soft">
          {conversations.slice(0, 5).map((conversation) => {
            const engagement = engagementMap.get(conversation.engagementId)
            const engagementLabel = engagement ? engagementTitle(engagement, viewerRole) : 'Engagement'
            const title = conversation.subject ?? engagementLabel
            return (
            <li key={conversation.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-cobalt text-[13px] font-semibold text-white">
                {initials(title)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-[8px]">
                  <p className="truncate font-semibold text-[14px] leading-[20px] text-ink">
                    {title}
                  </p>
                  <span className="shrink-0 text-[12px] leading-[18px] text-ink-muted">
                    {relativeDate(conversation.lastMessageAt ?? conversation.createdAt)}
                  </span>
                </div>
                <p className="truncate text-[13px] leading-[18px] text-ink-muted">
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
        <ul className="divide-y divide-line-soft">
          {meetings.map((item) => (
            <li key={item.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
              <span className="mt-[2px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-cobalt-soft text-cobalt">
                <CalendarClock size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[14px] leading-[20px] text-ink">{item.title}</p>
                <p className="text-[13px] leading-[18px] text-ink-muted">{item.subtitle}</p>
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
  return <p className="px-[20px] py-[24px] text-center text-[14px] leading-[20px] text-ink-muted">{message}</p>
}

function findEndpointError(
  home: WorkspaceHomeSnapshot,
  endpoint: string,
): { message: string } | null {
  const match = home.errors.find((err) => err.endpoint === endpoint)
  return match ? { message: match.message } : null
}
