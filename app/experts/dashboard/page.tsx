'use client'

import Link from 'next/link'
import { CheckCircle, ExternalLink, MapPin, Tags } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardFailureState,
  DashboardLoading,
  DashboardShell,
  useExpertDashboardData,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import type { ExpertDashboardResponse, ExpertMe } from '@/hooks/types/expert-contracts'

type Metric = { label: string; value: string; sub: string }
type ActivityItem = { title: string; body: string; tone: string }

const AVATAR_PALETTE = [
  '#f97316', '#a855f7', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b',
  '#6366f1', '#ef4444', '#14b8a6', '#8b5cf6', '#22c55e', '#eab308',
]

function stringifyRecordValue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number') return String(value)
  return null
}

function getRecordLabel(record: Record<string, unknown>) {
  return (
    stringifyRecordValue(record.name)
    ?? stringifyRecordValue(record.title)
    ?? stringifyRecordValue(record.productName)
    ?? stringifyRecordValue(record.product_id)
    ?? stringifyRecordValue(record.productId)
    ?? stringifyRecordValue(record.id)
    ?? 'Saved item'
  )
}

function buildActivityItems(dashboard: ExpertDashboardResponse): ActivityItem[] {
  const recentlyViewed = dashboard.recentlyViewed ?? []
  const interests = dashboard.interests ?? []

  const recentItems = recentlyViewed.slice(0, 6).map((item) => ({
    title: getRecordLabel(item),
    body: 'Recently viewed from service-apis',
    tone: '#155eef',
  }))

  const interestItems = interests.slice(0, 4).map((item) => ({
    title: getRecordLabel(item),
    body: 'Interest profile from service-apis',
    tone: '#10b981',
  }))

  return [...recentItems, ...interestItems]
}

function buildMetrics(expert: ExpertMe, dashboard: ExpertDashboardResponse): Metric[] {
  return [
    {
      label: 'Portfolio projects',
      value: String(expert.projects.length),
      sub: 'managed in Projects',
    },
    {
      label: 'Profile links',
      value: String(expert.links.length),
      sub: 'portfolio and proof links',
    },
    {
      label: 'Recently viewed',
      value: String(dashboard.recentlyViewed?.length ?? 0),
      sub: 'from dashboard endpoint',
    },
  ]
}

export default function ExpertsDashboardPage() {
  const state = useExpertDashboardData()

  if (state.isPending) return <DashboardLoading />
  if (!state.user || state.dashboardError || !state.dashboard) return <DashboardFailureState state={state} />

  const expert = state.dashboard.expert
  const metrics = buildMetrics(expert, state.dashboard)
  const activities = buildActivityItems(state.dashboard)

  return (
    <DashboardShell expert={expert}>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-wrap items-start justify-between gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <div className="flex flex-wrap items-center gap-[10px]">
                  <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Workspace overview</h1>
                  <span className="inline-flex items-center gap-[4px] rounded-full border border-[#abefc6] bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#067647]">
                    <CheckCircle size={14} />
                    {expert.status}
                  </span>
                </div>
                <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                  {expert.headline || 'Expert dashboard loaded from service-apis.'}
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
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
                    className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO}`}
                  >
                    <ExternalLink size={16} />
                    Scheduling link
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-[32px]">
            <div className="flex-1 min-w-0 flex flex-col gap-[24px]">
              <MetricRow metrics={metrics} />
              <ProfileCard expert={expert} />
            </div>

            <ActivityRail items={activities} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] ${CARD_SHADOW}`}
        >
          <p className="font-medium text-[14px] leading-[20px] text-[#414651]">{metric.label}</p>
          <p className="font-semibold text-[30px] leading-[38px] text-[#181d27]">{metric.value}</p>
          <p className="font-normal text-[12px] leading-[18px] text-[#717680]">{metric.sub}</p>
        </div>
      ))}
    </div>
  )
}

function ProfileCard({ expert }: { expert: ExpertMe }) {
  const tags = expert.tags.slice(0, 12)
  return (
    <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Expert profile</p>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
            {[expert.regionCity, expert.regionCountry].filter(Boolean).join(', ') || 'Location not set'}
          </p>
        </div>
        <div className="inline-flex items-center gap-[6px] rounded-full border border-[#e9eaeb] px-[10px] py-[4px] text-[13px] font-medium text-[#414651]">
          <MapPin size={14} />
          {expert.timezone || 'Timezone not set'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        <InfoTile label="Years experience" value={String(expert.yearsExperience ?? 0)} />
        <InfoTile label="Completed projects" value={String(expert.projectsCompletedTotal ?? 0)} />
        <InfoTile label="Availability" value={`${expert.availabilityHoursPerWeek ?? 0} hrs/week`} />
      </div>

      <div className="flex flex-col gap-[10px]">
        <p className="inline-flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651]">
          <Tags size={16} />
          Expertise tags
        </p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-[8px]">
            {tags.map((tag) => (
              <span key={tag.id} className="rounded-full border border-[#b2ccff] bg-[#eff4ff] px-[10px] py-[4px] text-[13px] font-medium text-[#004eeb]">
                {tag.tagValue}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[14px] leading-[20px] text-[#717680]">No tags returned by service-apis.</p>
        )}
      </div>
    </section>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[16px]">
      <p className="text-[13px] leading-[18px] font-medium text-[#717680]">{label}</p>
      <p className="mt-[4px] text-[20px] leading-[30px] font-semibold text-[#181d27]">{value}</p>
    </div>
  )
}

function ActivityRail({ items }: { items: ActivityItem[] }) {
  return (
    <aside className="w-[240px] shrink-0 flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Activity</p>
      </div>
      {items.length > 0 ? (
        <ul className="flex flex-col gap-[16px]">
          {items.map((item, index) => (
            <li key={`${item.title}-${index}`} className="flex items-start gap-[12px]">
              <div
                className="size-[32px] rounded-full flex items-center justify-center text-white font-semibold text-[12px] shrink-0"
                style={{ background: item.tone || AVATAR_PALETTE[index % AVATAR_PALETTE.length] }}
              >
                {item.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{item.title}</p>
                <p className="font-normal text-[12px] leading-[18px] text-[#535862] line-clamp-2">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] text-[14px] leading-[20px] text-[#717680]">
          No dashboard activity returned by service-apis.
        </div>
      )}
    </aside>
  )
}
