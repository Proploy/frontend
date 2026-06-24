'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowUpRight as ExternalArrow,
  Calendar,
  Check,
  DownloadCloud,
  MoreVertical,
  Plus,
  SlidersHorizontal,
  X,
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

const VIEWS_STORAGE_KEY = 'proploy.sales.views.v1'
const DEFAULT_VIEWS = ['Default', 'Saved view', 'SDR view']

// Wrap a CSV cell so commas, quotes and newlines survive.
function csvCell(value: string | number): string {
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// Build a CSV from the in-file metric + activity arrays and trigger a download.
function exportSalesReport(): void {
  const rows: (string | number)[][] = [
    ['Section', 'Label', 'Value', 'Change', 'Trend'],
    ...METRICS.map((m) => ['Metric', m.label, m.value, m.delta, m.trend]),
    [],
    ['Section', 'Customer', 'Product', 'Status'],
    ...ACTIVITY.map((a) => ['Activity', a.name, a.product, a.online ? 'Online' : 'Offline']),
  ]
  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sales-overview-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ExpertsSalesOverviewPage() {
  const [views, setViews] = useState<string[]>(DEFAULT_VIEWS)
  const [activeTab, setActiveTab] = useState('Saved view')
  const [lineRange, setLineRange] = useState('12 months')
  const [barRange, setBarRange] = useState('12 months')
  const [addingView, setAddingView] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const addViewInputRef = useRef<HTMLInputElement>(null)

  // Hydrate saved views after mount to avoid SSR mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VIEWS_STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
          setViews(parsed as string[])
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, [])

  useEffect(() => {
    if (addingView) addViewInputRef.current?.focus()
  }, [addingView])

  const commitNewView = () => {
    const name = newViewName.trim()
    if (!name) {
      setAddingView(false)
      return
    }
    const next = views.includes(name) ? views : [...views, name]
    setViews(next)
    try {
      localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage write failure
    }
    setActiveTab(name)
    setNewViewName('')
    setAddingView(false)
  }

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
                onClick={exportSalesReport}
                className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                <DownloadCloud size={18} className="text-[#717680]" />
                Export report
              </button>
              <button
                type="button"
                onClick={() => setShowInvite(true)}
                className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
              >
                <Plus size={18} />
                Invite
              </button>
            </div>
          </div>

          {/* Toolbar: saved views + date range/filters */}
          <div className="flex flex-wrap items-center justify-between gap-[16px]">
            <div className={`inline-flex items-center bg-white border border-[#d5d7da] rounded-[8px] p-[4px] ${BUTTON_SKEUO}`}>
              {views.map((tab) => (
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
              {addingView ? (
                <span className="flex items-center gap-[4px] pl-[6px]">
                  <input
                    ref={addViewInputRef}
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitNewView()
                      if (e.key === 'Escape') {
                        setNewViewName('')
                        setAddingView(false)
                      }
                    }}
                    onBlur={commitNewView}
                    placeholder="View name"
                    className="w-[120px] rounded-[6px] border border-[#d5d7da] bg-white px-[8px] py-[5px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                  />
                  <button
                    type="button"
                    aria-label="Save view"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={commitNewView}
                    className="flex items-center justify-center size-[32px] rounded-[6px] text-[#155eef] hover:bg-[#fafafa]"
                  >
                    <Check size={18} />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  aria-label="Add view"
                  onClick={() => setAddingView(true)}
                  className="flex items-center justify-center size-[32px] rounded-[6px] text-[#717680] hover:bg-[#fafafa]"
                >
                  <Plus size={18} />
                </button>
              )}
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
                <Link
                  href="/experts/dashboard/earnings"
                  className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
                >
                  <Plus size={18} className="text-[#717680]" />
                  Add report
                </Link>
              </div>
            </div>

            <ActivityRail />
          </div>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </DashboardShell>
  )
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const send = () => {
    const value = email.trim()
    if (!value) return
    setSentTo(value)
    setEmail('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a0d12]/40 p-[24px] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="my-[24px] w-full max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[18px]">
          <h2 className="text-[18px] font-semibold leading-[28px] text-[#181d27]">Invite a teammate</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-[32px] items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#181d27]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-[16px] p-[24px]">
          <p className="text-[14px] leading-[20px] text-[#535862]">
            They&apos;ll get access to this sales workspace.
          </p>
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="invite-email" className="text-[14px] font-medium leading-[20px] text-[#414651]">
              Email address
            </label>
            <input
              ref={inputRef}
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send()
              }}
              placeholder="name@company.com"
              className={`w-full rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
            />
          </div>
          {sentTo && (
            <p className="flex items-center gap-[8px] rounded-[8px] bg-[#ecfdf3] px-[12px] py-[10px] text-[14px] font-medium leading-[20px] text-[#067647]">
              <Check size={16} /> Invitation sent to {sentTo}
            </p>
          )}
          <div className="flex items-center justify-end gap-[10px] border-t border-[#e9eaeb] pt-[16px]">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!email.trim()}
              className={`rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              Send invite
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight
  const trendColor = metric.trend === 'up' ? 'text-[#17b26a]' : 'text-[#f04438]'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  return (
    <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] ${CARD_SHADOW}`}>
      <div className="flex items-start justify-between gap-[8px]">
        <p className="font-medium text-[16px] leading-[24px] text-[#414651]">{metric.label}</p>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-[#a4a7ae] hover:text-[#717680]"
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className={`absolute right-0 top-[28px] z-20 w-[176px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white py-[4px] ${CARD_SHADOW}`}
            >
              <Link
                href="/experts/dashboard/earnings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-[8px] px-[12px] py-[8px] text-[14px] leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa]"
              >
                <ExternalArrow size={16} className="text-[#717680]" />
                View in earnings
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  exportSalesReport()
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-[8px] px-[12px] py-[8px] text-left text-[14px] leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa]"
              >
                <DownloadCloud size={16} className="text-[#717680]" />
                Export CSV
              </button>
            </div>
          )}
        </div>
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
        <Link
          href="/experts/dashboard/earnings"
          className={`inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[8px] font-semibold text-[14px] leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
        >
          View report
          <ExternalArrow size={16} className="text-[#717680]" />
        </Link>
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
        <Link
          href="/experts/dashboard/clients"
          className="font-semibold text-[14px] leading-[20px] text-[#155eef] hover:text-[#004eeb]"
        >
          View all
        </Link>
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
