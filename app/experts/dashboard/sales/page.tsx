'use client'

import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  DownloadCloud,
  MoreVertical,
  Plus,
  SlidersHorizontal,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const AVATAR_PALETTE = [
  '#f97316', '#a855f7', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b',
  '#6366f1', '#ef4444', '#14b8a6', '#8b5cf6', '#22c55e', '#eab308',
]

type Metric = {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
}

const METRICS: Metric[] = [
  { label: "Today's revenue", value: '$1,280', delta: '10%', trend: 'up' },
  { label: "Today's orders", value: '14', delta: '12%', trend: 'up' },
  { label: 'Avg. order value', value: '$91.42', delta: '2%', trend: 'down' },
]

const RANGE_TABS = ['12 months', '3 months', '30 days', '7 days', '24 hours']

type Activity = { name: string; product: string; online?: boolean }

const ACTIVITY: Activity[] = [
  { name: 'Demi Wikinson', product: 'Webflow 101', online: true },
  { name: 'Aliah Lane', product: 'SEO Masterclass' },
  { name: 'Lana Steiner', product: 'Figma Mockups' },
  { name: 'Candice Wu', product: 'Webflow 101' },
  { name: 'Ava Wright', product: 'SEO Masterclass' },
  { name: 'Koray Okumus', product: 'SEO Masterclass' },
  { name: 'Andi Lane', product: 'The Ultimate Guide to Backlinks' },
  { name: 'Drew Cano', product: 'The Figma Dashboard Bundle' },
  { name: 'Zahir Mays', product: 'The Figma Dashboard Bundle' },
  { name: 'Rene Wells', product: 'The Design Handbook' },
  { name: 'Joshua Wilson', product: 'Phone 13 Mockups' },
  { name: 'Lori Bryson', product: 'SEO Masterclass' },
  { name: 'Loki Bright', product: 'Figma Mockups' },
  { name: 'Anita Cruz', product: 'The Ultimate Guide to Backlinks' },
]

// Sample series for the line chart (two trend lines).
const LINE_A = [28, 30, 27, 34, 31, 42, 45, 40, 52, 55, 60, 64]
const LINE_B = [18, 20, 19, 24, 22, 28, 30, 27, 34, 33, 38, 40]
// Stacked bar values (solid + faint cap), as percentages of column height.
const BARS = [62, 70, 48, 82, 40, 88, 64, 72, 60, 84, 90, 66]

export default function ExpertsSalesOverviewPage() {
  const [activeTab, setActiveTab] = useState('Saved view')
  const [lineRange, setLineRange] = useState('12 months')
  const [barRange, setBarRange] = useState('12 months')

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1280px] mx-auto px-[32px] py-[32px] flex flex-col gap-[24px]">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Sales overview</h1>
              <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                Your current sales summary and activity.
              </p>
            </div>
            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                <DownloadCloud size={18} className="text-[#717680]" />
                Export report
              </button>
              <button
                type="button"
                className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <Plus size={18} />
                Invite
              </button>
            </div>
          </div>

          {/* Toolbar: saved views + date range/filters */}
          <div className="flex flex-wrap items-center justify-between gap-[16px]">
            <div className={`inline-flex items-center bg-white border border-[#d5d7da] rounded-[8px] p-[4px] ${BUTTON_SKEUO}`}>
              {['Default', 'Saved view', 'SDR view'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-[6px] rounded-[6px] px-[12px] py-[6px] text-[14px] leading-[20px] font-semibold transition-colors ${
                    activeTab === tab ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651] hover:bg-[#fafafa]'
                  }`}
                >
                  {tab === 'Saved view' && <span className="size-[8px] rounded-full bg-[#17b26a]" />}
                  {tab}
                </button>
              ))}
              <button
                type="button"
                aria-label="Add view"
                className="flex items-center justify-center size-[32px] rounded-[6px] text-[#717680] hover:bg-[#fafafa]"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                className={`flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                <Calendar size={18} className="text-[#717680]" />
                Jan 10, 2025 – Jan 16, 2025
              </button>
              <button
                type="button"
                className={`flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                <SlidersHorizontal size={18} className="text-[#717680]" />
                Filters
              </button>
            </div>
          </div>

          {/* Layout: main + activity rail */}
          <div className="flex flex-wrap gap-[24px]">
            <div className="flex-1 min-w-0 flex flex-col gap-[24px]">
              {/* Metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
                {METRICS.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>

              {/* Sales report — line chart */}
              <ReportCard
                title="Sales report"
                range={lineRange}
                onRange={setLineRange}
              >
                <LineChart />
              </ReportCard>

              {/* Second report — bar chart */}
              <ReportCard
                title="Revenue by month"
                range={barRange}
                onRange={setBarRange}
              >
                <BarChart />
              </ReportCard>

              <div className="flex justify-center">
                <button
                  type="button"
                  className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                >
                  <Plus size={18} className="text-[#717680]" />
                  Add
                </button>
              </div>
            </div>

            <ActivityRail />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight
  const trendColor = metric.trend === 'up' ? 'text-[#17b26a]' : 'text-[#f04438]'
  return (
    <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] ${CARD_SHADOW}`}>
      <div className="flex items-start justify-between gap-[8px]">
        <p className="font-medium text-[16px] leading-[24px] text-[#414651]">{metric.label}</p>
        <button type="button" aria-label="Options" className="text-[#a4a7ae] hover:text-[#717680]">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="flex items-end justify-between gap-[12px]">
        <p className="font-semibold text-[36px] leading-[44px] tracking-[-0.72px] text-[#181d27]">{metric.value}</p>
        <span className={`inline-flex items-center gap-[4px] rounded-full border border-[#e9eaeb] bg-white px-[8px] py-[2px] text-[13px] font-medium ${trendColor}`}>
          <TrendIcon size={14} />
          {metric.delta}
        </span>
      </div>
    </div>
  )
}

function ReportCard({
  title,
  range,
  onRange,
  children,
}: {
  title: string
  range: string
  onRange: (r: string) => void
  children: React.ReactNode
}) {
  return (
    <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-center justify-between gap-[16px]">
        <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{title}</p>
        <button
          type="button"
          className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[8px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
        >
          View report
        </button>
      </div>

      <div className={`inline-flex w-fit items-center bg-white border border-[#d5d7da] rounded-[8px] p-[4px] ${BUTTON_SKEUO}`}>
        {RANGE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onRange(tab)}
            className={`rounded-[6px] px-[12px] py-[6px] text-[14px] leading-[20px] font-semibold transition-colors ${
              range === tab ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651] hover:bg-[#fafafa]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {children}
    </section>
  )
}

function LineChart() {
  const W = 760
  const H = 220
  const max = Math.max(...LINE_A) * 1.15
  const stepX = W / (MONTHS.length - 1)
  const toPath = (data: number[]) =>
    data
      .map((v, i) => {
        const x = i * stepX
        const y = H - (v / max) * H
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  const areaPath = `${toPath(LINE_A)} L${W},${H} L0,${H} Z`

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[220px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#155eef" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#155eef" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#f5f5f5" strokeWidth="1" />
          ))}
          <path d={areaPath} fill="url(#lineFill)" />
          <path d={toPath(LINE_A)} fill="none" stroke="#155eef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={toPath(LINE_B)} fill="none" stroke="#84caff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <MonthAxis />
    </div>
  )
}

function BarChart() {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-end justify-between gap-[8px] h-[220px]">
        {BARS.map((pct, i) => (
          <div key={MONTHS[i]} className="flex-1 flex flex-col justify-end items-center h-full">
            <div className="w-full max-w-[40px] h-full flex flex-col justify-end rounded-t-[6px] overflow-hidden">
              <div className="w-full bg-[#eaecf5]" style={{ height: `${100 - pct}%` }} />
              <div className="w-full bg-[#155eef]" style={{ height: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <MonthAxis />
    </div>
  )
}

function MonthAxis() {
  return (
    <div className="flex justify-between">
      {MONTHS.map((m) => (
        <span key={m} className="flex-1 text-center font-medium text-[12px] leading-[18px] text-[#717680]">
          {m}
        </span>
      ))}
    </div>
  )
}

function ActivityRail() {
  return (
    <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Activity</p>
        <button type="button" className="font-semibold text-[14px] leading-[20px] text-[#155eef] hover:text-[#004eeb]">
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-[16px]">
        {ACTIVITY.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center gap-[12px]">
            <Avatar name={item.name} index={index} online={item.online} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{item.name}</p>
              <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">
                Purchased <span className="font-semibold text-[#155eef]">{item.product}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function Avatar({ name, index, online }: { name: string; index: number; online?: boolean }) {
  const initials = name
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="relative shrink-0">
      <div
        className="size-[40px] rounded-full flex items-center justify-center text-white font-semibold text-[14px]"
        style={{ background: AVATAR_PALETTE[index % AVATAR_PALETTE.length] }}
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 size-[10px] rounded-full bg-[#17b26a] border-2 border-white" />
      )}
    </div>
  )
}
