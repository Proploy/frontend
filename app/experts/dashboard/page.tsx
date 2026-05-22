'use client'

import { useState } from 'react'
import {
  Search,
  Home,
  LayoutGrid,
  FolderClosed,
  Inbox,
  Wallet,
  Users,
  Settings,
  LifeBuoy,
  ChevronDown,
  ChevronsUpDown,
  Calendar as CalendarIcon,
  Filter,
  Upload,
  Plus,
  MoreHorizontal,
} from 'lucide-react'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
const CARD_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

type NavItem = { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: string; active?: boolean }

const NAV_PRIMARY: NavItem[] = [
  { label: 'Home', icon: Home },
  { label: 'Workspace', icon: LayoutGrid, active: true },
  { label: 'Projects', icon: FolderClosed },
  { label: 'Leads', icon: Inbox, badge: '12' },
  { label: 'Earnings', icon: Wallet },
  { label: 'Clients', icon: Users },
]

const NAV_SECONDARY: NavItem[] = [
  { label: 'Settings', icon: Settings },
  { label: 'Support', icon: LifeBuoy },
]

const TABS = ['Default', 'Saved view', '008 view'] as const

const METRICS = [
  { label: 'Active projects', value: '7', delta: '+ 2', positive: true, sub: 'vs last month' },
  { label: 'Open leads', value: '12', delta: '+ 3', positive: true, sub: 'vs last week' },
  { label: 'Earnings this month', value: '$14,820', delta: '+ 8.4%', positive: true, sub: 'vs last month' },
]

const SALES_TABS = ['12 months', '30 days', '7 days', '24 hours'] as const

const LINE_POINTS = [
  20, 28, 22, 35, 30, 42, 38, 48, 44, 55, 50, 62, 58, 68, 64, 75, 70, 80, 76, 86,
  82, 90, 88, 95,
]
const BARS = [
  35, 48, 55, 42, 60, 70, 52, 68, 78, 84, 72, 90,
]

const FEED: Array<{ name: string; action: string }> = [
  { name: 'Demi Wilkinson', action: 'Requested a proposal — Procurement audit' },
  { name: 'Aliah Lane', action: 'Accepted your proposal — Vendor RFP review' },
  { name: 'Lana Steiner', action: 'Sent a message about ERP rollout' },
  { name: 'Candice Wu', action: 'New lead — Strategic sourcing for SaaS stack' },
  { name: 'Ava Wright', action: 'Left a 5-star review on Contract negotiation' },
  { name: 'Koray Okumus', action: 'Milestone approved — Supplier shortlist' },
  { name: 'Andi Lane', action: 'Requested a discovery call' },
  { name: 'Drew Cano', action: 'New lead — Indirect spend assessment' },
  { name: 'Zahir Mays', action: 'Released payment of $2,400' },
  { name: 'Rene Wells', action: 'Shared scope doc for category management' },
  { name: 'Joshua Wilson', action: 'New lead — Procure-to-pay implementation' },
  { name: 'Lori Bryson', action: 'Accepted your proposal — Logistics RFQ' },
  { name: 'Loki Bright', action: 'Sent a message about supplier risk' },
  { name: 'Anita Cruz', action: 'Booked a follow-up — Q3 sourcing strategy' },
]

const AVATAR_PALETTE = [
  '#f97316', '#a855f7', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b',
  '#6366f1', '#ef4444', '#14b8a6', '#8b5cf6', '#22c55e', '#eab308',
]

export default function ExpertsDashboardPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Default')

  return (
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[32px]">
            {/* Header */}
            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-wrap items-start justify-between gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Workspace overview</h1>
                  <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                    Track your leads, projects and earnings on Proploy.
                  </p>
                </div>
                <div className="flex items-center gap-[12px]">
                  <button
                    type="button"
                    className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                  >
                    <Upload size={16} />
                    Export report
                  </button>
                  <button
                    type="button"
                    className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO}`}
                  >
                    <Plus size={16} />
                    Invite
                  </button>
                </div>
              </div>

              {/* Tabs + filters */}
              <div className="flex flex-wrap items-center justify-between gap-[16px]">
                <div className={`inline-flex items-center bg-white border border-[#d5d7da] rounded-[8px] ${BUTTON_SKEUO}`}>
                  {TABS.map((tab, i) => {
                    const active = activeTab === tab
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] transition-colors ${
                          active ? 'bg-[#fafafa] text-[#252b37]' : 'bg-white text-[#414651] hover:bg-[#fafafa]'
                        } ${i === 0 ? 'rounded-l-[8px]' : ''} ${i === TABS.length - 1 ? 'rounded-r-[8px]' : ''} ${i > 0 ? 'border-l border-[#d5d7da]' : ''}`}
                      >
                        {tab}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-[12px]">
                  <button
                    type="button"
                    className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                  >
                    <CalendarIcon size={16} />
                    Jan 10, 2025 – Jan 16, 2025
                    <ChevronDown size={16} className="text-[#a4a7ae]" />
                  </button>
                  <button
                    type="button"
                    className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-wrap gap-[32px]">
              <div className="flex-1 min-w-0 flex flex-col gap-[24px]">
                <MetricRow />
                <ChartCard title="Lead inquiries" subtitle="New procurement leads matched to your expertise." kind="line" />
                <ChartCard title="Project hours" subtitle="Billable hours logged across active engagements." kind="bar" />
              </div>

              <ActivityRail />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[296px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#e9eaeb] px-[16px] py-[24px] gap-[24px]">
      {/* Logo */}
      <div className="px-[8px] flex items-center gap-[10px]">
        <div className="size-[32px] rounded-[8px] bg-[#155eef] flex items-center justify-center text-white font-bold text-[14px]">
          p
        </div>
        <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">proploy</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
        <input
          type="text"
          placeholder="Search"
          className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[36px] py-[8px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
        />
        <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680] border border-[#e9eaeb] rounded-[4px] bg-white">
          ⌘K
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-[2px]">
        {NAV_PRIMARY.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Secondary nav */}
      <nav className="flex flex-col gap-[2px]">
        {NAV_SECONDARY.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      {/* User card */}
      <div className="flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-[#fafafa] transition-colors">
        <div className="size-[40px] rounded-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] flex items-center justify-center text-white font-semibold text-[14px] shrink-0">
          O
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">Olivia Rhye</p>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">olivia@proploy.io</p>
        </div>
        <button type="button" aria-label="Logout" className="text-[#717680] hover:text-[#414651] shrink-0">
          <ChevronsUpDown size={16} />
        </button>
      </div>
    </aside>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      className={`flex items-center gap-[12px] px-[12px] py-[8px] rounded-[6px] text-left font-semibold text-[14px] leading-[20px] transition-colors ${
        item.active ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651] hover:bg-[#fafafa]'
      }`}
    >
      <Icon size={20} className="text-[#717680] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
          {item.badge}
        </span>
      )}
    </button>
  )
}

function MetricRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
      {METRICS.map((m) => (
        <div
          key={m.label}
          className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] ${CARD_SHADOW}`}
        >
          <p className="font-medium text-[14px] leading-[20px] text-[#414651]">{m.label}</p>
          <div className="flex items-end justify-between gap-[8px]">
            <p className="font-semibold text-[30px] leading-[38px] text-[#181d27]">{m.value}</p>
            <span
              className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[12px] leading-[18px] font-medium ${
                m.positive
                  ? 'bg-[#ecfdf3] text-[#067647] border border-[#abefc6]'
                  : 'bg-[#fef3f2] text-[#b42318] border border-[#fecdca]'
              }`}
            >
              {m.delta}
            </span>
          </div>
          <p className="font-normal text-[12px] leading-[18px] text-[#717680]">{m.sub}</p>
        </div>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  kind,
}: {
  title: string
  subtitle: string
  kind: 'line' | 'bar'
}) {
  const [tab, setTab] = useState<(typeof SALES_TABS)[number]>('12 months')

  return (
    <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{title}</p>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className={`inline-flex items-center bg-white border border-[#d5d7da] rounded-[8px] ${BUTTON_SKEUO}`}>
            {SALES_TABS.map((t, i) => {
              const active = tab === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-[12px] py-[8px] font-semibold text-[14px] leading-[20px] ${
                    active ? 'bg-[#fafafa] text-[#252b37]' : 'bg-white text-[#414651] hover:bg-[#fafafa]'
                  } ${i === 0 ? 'rounded-l-[8px]' : ''} ${i === SALES_TABS.length - 1 ? 'rounded-r-[8px]' : ''} ${i > 0 ? 'border-l border-[#d5d7da]' : ''}`}
                >
                  {t}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[8px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            View report
          </button>
        </div>
      </div>

      <div className="w-full h-[200px]">
        {kind === 'line' ? <LineChart /> : <BarChart />}
      </div>
    </section>
  )
}

function LineChart() {
  const w = 752
  const h = 200
  const pad = 24
  const max = Math.max(...LINE_POINTS)
  const min = Math.min(...LINE_POINTS)
  const step = (w - pad * 2) / (LINE_POINTS.length - 1)
  const yScale = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2)

  const linePath = LINE_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${yScale(p)}`).join(' ')
  const areaPath = `${linePath} L ${pad + (LINE_POINTS.length - 1) * step} ${h - pad} L ${pad} ${h - pad} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#155eef" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#155eef" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="#f5f5f5"
          strokeWidth={1}
        />
      ))}
      <path d={areaPath} fill="url(#lineFill)" />
      <path d={linePath} fill="none" stroke="#155eef" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart() {
  const w = 752
  const h = 200
  const pad = 24
  const max = Math.max(...BARS)
  const barW = (w - pad * 2) / BARS.length - 8
  const yScale = (v: number) => ((v - 0) / max) * (h - pad * 2)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="#f5f5f5"
          strokeWidth={1}
        />
      ))}
      {BARS.map((b, i) => {
        const x = pad + i * ((w - pad * 2) / BARS.length) + 4
        const barH = yScale(b)
        const y = h - pad - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill="#155eef" />
            <rect x={x + barW * 0.45} y={y - 1} width={barW * 0.55} height={barH + 1} rx={4} fill="#528bff" opacity={0.6} />
          </g>
        )
      })}
    </svg>
  )
}

function ActivityRail() {
  return (
    <aside className="w-[240px] shrink-0 flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Activity</p>
        <button type="button" className="font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-[16px]">
        {FEED.map((f, i) => (
          <li key={`${f.name}-${i}`} className="flex items-start gap-[12px]">
            <div
              className="size-[32px] rounded-full flex items-center justify-center text-white font-semibold text-[12px] shrink-0"
              style={{ background: AVATAR_PALETTE[i % AVATAR_PALETTE.length] }}
            >
              {f.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{f.name}</p>
              <p className="font-normal text-[12px] leading-[18px] text-[#535862] line-clamp-2">{f.action}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`mt-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center justify-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
      >
        <MoreHorizontal size={16} />
        Show more
      </button>
    </aside>
  )
}
