/**
 * Workspace home.
 *
 * Renders the cross-cutting dashboard from GET /me/dashboard:
 *   - 4 count cards (engagements, intents, messages, meetings)
 *   - Recent engagements list
 *   - Upcoming meetings list
 *
 * The visual pattern (cards-in-a-row + stacked lists) absorbs the legacy
 * expert dashboard layout from app/experts/dashboard/page.tsx, but the data
 * is the new workspace payload — no ExpertMe record, no tags, no regions.
 * The legacy ProfileCard lived on the expert-as-a-person model that is
 * moving to /workspace/settings; the dashboard itself is now about
 * workspace activity.
 */

'use client'

import Link from 'next/link'
import { Calendar, CheckCircle, ExternalLink, FileText, Inbox, MessageSquare, Users } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceShell,
  WorkspaceLoading,
} from '@/components/workspace/WorkspaceShell'
import { useCurrentUserRole } from '@/features/workspace/use-current-user-role'
import { getDashboardErrorMessage } from '@/components/workspace/dashboard-helpers'
import type {
  WorkspaceDashboardCounts,
  WorkspaceEngagementSummary,
  WorkspaceMeeting,
  WorkspaceRole,
} from '@/features/workspace/types'

type Metric = {
  label: string
  value: string
  sub: string
  href: string
  icon: typeof Users
}

function buildMetrics(counts: WorkspaceDashboardCounts, role: WorkspaceRole | null): Metric[] {
  const showExpert = role === 'expert'
  return [
    {
      label: showExpert ? 'Active engagements' : 'Your engagements',
      value: String(counts.activeEngagements),
      sub: 'in progress',
      href: '/workspace/engagements',
      icon: Users,
    },
    {
      label: showExpert ? 'Incoming requests' : 'Sent requests',
      value: String(counts.pendingIntents),
      sub: 'awaiting decision',
      href: '/workspace/requests',
      icon: Inbox,
    },
    {
      label: 'Unread messages',
      value: String(counts.unreadConversations),
      sub: 'across conversations',
      href: '/workspace/conversations',
      icon: MessageSquare,
    },
    {
      label: 'Upcoming meetings',
      value: String(counts.upcomingMeetings),
      sub: 'in the next 7 days',
      href: '/workspace/meetings',
      icon: Calendar,
    },
  ]
}

export default function WorkspaceHomePage() {
  const state = useCurrentUserRole()

  if (state.isPending) return <WorkspaceLoading />
  if (!state.user) return <WorkspaceSignIn />
  if (state.dashboardError) return <WorkspaceFailure state={state} />
  if (!state.dashboard) return <WorkspaceLoading />

  const { dashboard, role, user } = state
  const greetingName = user.name ?? user.email ?? 'there'
  const metrics = buildMetrics(dashboard.counts, role)
  const isExpert = role === 'expert'

  return (
    <WorkspaceShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[32px]">
          <header className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Workspace overview</h1>
                <span className="inline-flex items-center gap-[4px] rounded-full border border-[#abefc6] bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#067647]">
                  <CheckCircle size={14} />
                  {role ?? 'user'}
                </span>
              </div>
              <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                {isExpert
                  ? 'Review incoming requests, manage accepted engagements, and keep shared work moving.'
                  : `Hi ${greetingName}. Track expert requests, accepted engagements, shared projects, messages, and meetings.`}
              </p>
            </div>
            <div className="flex items-center gap-[12px]">
              <Link
                href={isExpert ? '/workspace/settings' : '/experts'}
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                {isExpert ? 'Edit profile' : 'Find experts'}
              </Link>
              <Link
                href={isExpert ? '/workspace/settings?tab=scheduling' : '/workspace/requests'}
                className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <ExternalLink size={16} />
                {isExpert ? 'Scheduling link' : 'View requests'}
              </Link>
            </div>
          </header>

          <MetricRow metrics={metrics} />

          <RecentEngagements engagements={dashboard.recentEngagements} />

          <UpcomingMeetings meetings={dashboard.upcomingMeetings} />
        </div>
      </div>
    </WorkspaceShell>
  )
}

function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Link
            key={metric.label}
            href={metric.href}
            className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] hover:border-[#155eef] transition-colors ${CARD_SHADOW}`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-[14px] leading-[20px] text-[#414651]">{metric.label}</p>
              <Icon size={16} className="text-[#717680]" />
            </div>
            <p className="font-semibold text-[30px] leading-[38px] text-[#181d27]">{metric.value}</p>
            <p className="font-normal text-[12px] leading-[18px] text-[#717680]">{metric.sub}</p>
          </Link>
        )
      })}
    </div>
  )
}

function RecentEngagements({ engagements }: { engagements: WorkspaceEngagementSummary[] }) {
  return (
    <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#e9eaeb]">
        <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Recent engagements</h2>
        <Link
          href="/workspace/engagements"
          className="text-[13px] font-medium text-[#155eef] hover:underline"
        >
          See all
        </Link>
      </div>
      {engagements.length === 0 ? (
        <div className="px-[20px] py-[32px] text-center text-[14px] text-[#717680]">
          No engagements yet.
        </div>
      ) : (
        <ul className="divide-y divide-[#e9eaeb]">
          {engagements.slice(0, 3).map((e) => (
            <li key={e.id}>
              <Link
                href={`/workspace/engagements/${e.id}`}
                className="flex items-center gap-[12px] px-[20px] py-[14px] hover:bg-[#fafafa] transition-colors"
              >
                <EngagementAvatar name={getEngagementName(e)} url={e.buyerAvatarUrl} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">
                    {getEngagementName(e)}
                  </p>
                  <p className="font-normal text-[12px] leading-[18px] text-[#535862]">
                    {humanizeStatus(e.status)} · updated {humanizeRelative(e.lastMessageAt ?? e.updatedAt ?? e.lastActivityAt)}
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#414651] capitalize">
                  {e.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function UpcomingMeetings({ meetings }: { meetings: WorkspaceMeeting[] }) {
  return (
    <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#e9eaeb]">
        <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Upcoming meetings</h2>
        <Link
          href="/workspace/meetings"
          className="text-[13px] font-medium text-[#155eef] hover:underline"
        >
          See all
        </Link>
      </div>
      {meetings.length === 0 ? (
        <div className="px-[20px] py-[32px] text-center text-[14px] text-[#717680]">
          No upcoming meetings.
        </div>
      ) : (
        <ul className="divide-y divide-[#e9eaeb]">
          {meetings.slice(0, 3).map((m) => (
            <li key={m.id}>
              <Link
                href={`/workspace/meetings`}
                className="flex items-center gap-[12px] px-[20px] py-[14px] hover:bg-[#fafafa] transition-colors"
              >
                <div className="size-[40px] rounded-[8px] bg-[#eff4ff] flex items-center justify-center text-[#155eef] shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">
                    {m.title ?? 'Meeting'}
                  </p>
                  <p className="font-normal text-[12px] leading-[18px] text-[#535862]">
                    {formatMeetingTime(m)}
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#414651] capitalize">
                  {m.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function EngagementAvatar({ name, url }: { name: string; url?: string | null }) {
  const initial = name.charAt(0).toUpperCase()
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={name} className="size-[36px] rounded-full object-cover shrink-0" />
    )
  }
  return (
    <div className="size-[36px] rounded-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] flex items-center justify-center text-white font-semibold text-[13px] shrink-0">
      {initial}
    </div>
  )
}

function getEngagementName(engagement: WorkspaceEngagementSummary): string {
  const buyer = engagement.buyerDisplayName ?? engagement.buyerOrganizationId ?? engagement.buyerUserId
  const expert = engagement.expertDisplayName ?? engagement.expertId
  if (buyer && expert) return `${buyer} — ${expert}`
  return buyer ?? expert ?? 'Engagement'
}

function humanizeStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function humanizeRelative(iso?: string | null): string {
  if (!iso) return 'not available'
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = now - then
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.round(days / 7)
  return `${weeks}w ago`
}

function humanizeAbsolute(iso?: string): string {
  if (!iso) return 'Time not set'
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatMeetingTime(meeting: WorkspaceMeeting): string {
  const startsAt = humanizeAbsolute(meeting.startsAt)
  if (!meeting.startsAt || !meeting.endsAt) return startsAt

  const start = new Date(meeting.startsAt).getTime()
  const end = new Date(meeting.endsAt).getTime()
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return startsAt

  const minutes = Math.round((end - start) / 60000)
  return `${startsAt} · ${minutes} min`
}

function WorkspaceSignIn() {
  return (
    <WorkspaceShell>
      <main className="flex min-h-screen flex-1 items-center justify-center px-[32px]">
        <div className="max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Sign in required</h1>
          <p className="mt-[8px] text-[15px] leading-[22px] text-[#535862]">
            Use your Proploy account to open the workspace.
          </p>
          <Link
            href="/sign-in?redirect=/workspace"
            className={`mt-[24px] inline-flex rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
          >
            Sign in
          </Link>
        </div>
      </main>
    </WorkspaceShell>
  )
}

function WorkspaceFailure({ state }: { state: ReturnType<typeof useCurrentUserRole> }) {
  const error = state.dashboardError
  const message = error ? getDashboardErrorMessage(error) : 'The dashboard endpoint returned no data.'
  return (
    <WorkspaceShell>
      <main className="flex min-h-screen flex-1 items-center justify-center px-[32px]">
        <div className="max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Workspace unavailable</h1>
          <p className="mt-[8px] text-[15px] leading-[22px] text-[#535862]">{message}</p>
          <Link
            href="/"
            className={`mt-[24px] inline-flex rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
          >
            Go home
          </Link>
        </div>
      </main>
    </WorkspaceShell>
  )
}
