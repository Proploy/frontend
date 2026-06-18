'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'

/* ============================== Types ============================== */

type Option = { label: string; color: string }

type Lead = {
  id: string
  name: string
  domain: string
  brand: string
  status: string
  owner: string
  score: number
  trend: number
  closeDate: string
  nextStep: string
  hours: number
  spSubmitted: string
  licDollar: number
  discount: number
  unitValue: number
  contact: string
  email: string
  phone: string
  lastFollowUp: string
  nextFollowUp: string
  followUpNotes: string
  industry: string[]
  product: string
  source: string
  company: string
  fullName: string
  title: string
  region: string
  physicalAddress: string
  utmSource: string
  linkedin: string
  projectPlan: string
  invoiceId: string
  xeroLink: string
  label: string
  agreement: string
  // computed (read-only) — present so they are valid keyof Lead column keys
  value?: number
  dealLength?: string
}

type ColType =
  | 'text' | 'longtext' | 'number' | 'money' | 'date' | 'email' | 'phone'
  | 'link' | 'status' | 'dropdown' | 'tags' | 'people' | 'formula'

type Column = {
  key: keyof Lead
  label: string
  type: ColType
  width: number
  options?: Option[]
  formula?: (l: Lead) => string
}

/* ============================== Option sets ============================== */

const STATUS_OPTS: Option[] = [
  { label: 'New leads', color: '#155eef' },
  { label: 'Booked/Follow up', color: '#f79009' },
  { label: 'Qualified', color: '#6938ef' },
  { label: 'Proposal/Contracting', color: '#0086c0' },
  { label: 'Won', color: '#17b26a' },
  { label: 'Unqualified', color: '#717680' },
]
const SP_OPTS: Option[] = [
  { label: 'Submitted', color: '#17b26a' },
  { label: 'Pending', color: '#f79009' },
  { label: 'Not started', color: '#717680' },
]
const AGREEMENT_OPTS: Option[] = [
  { label: 'One off', color: '#f79009' },
  { label: 'Retainer', color: '#17b26a' },
  { label: 'Pilot', color: '#6938ef' },
]
const LABEL_OPTS: Option[] = [
  { label: 'Hot', color: '#f04438' },
  { label: 'Warm', color: '#f79009' },
  { label: 'Cold', color: '#155eef' },
]
const PRODUCT_OPTS: Option[] = ['Salesforce', 'HubSpot', 'Hootsuite', 'Zoho', 'Pipedrive'].map((l) => ({ label: l, color: '#155eef' }))
const SOURCE_OPTS: Option[] = ['Website', 'Referral', 'LinkedIn', 'Outbound', 'Event'].map((l) => ({ label: l, color: '#6938ef' }))
const REGION_OPTS: Option[] = ['APAC', 'EMEA', 'AMER'].map((l) => ({ label: l, color: '#0086c0' }))

const optColor = (opts: Option[] | undefined, val: string) =>
  opts?.find((o) => o.label === val)?.color ?? '#717680'

/* ============================== Columns ============================== */

const daysUntil = (iso: string) => {
  const d = new Date(iso + 'T00:00:00').getTime() - new Date('2026-06-03T00:00:00').getTime()
  return Math.round(d / 86400000)
}

const COLUMNS: Column[] = [
  { key: 'status', label: 'Status', type: 'status', width: 150, options: STATUS_OPTS },
  { key: 'owner', label: 'Owner', type: 'people', width: 150 },
  { key: 'closeDate', label: 'Close Date', type: 'date', width: 130 },
  { key: 'nextStep', label: 'Next Step', type: 'longtext', width: 240 },
  { key: 'hours', label: 'Hours', type: 'number', width: 90 },
  { key: 'spSubmitted', label: 'S&P Submitted', type: 'status', width: 140, options: SP_OPTS },
  { key: 'licDollar', label: 'Lic. $', type: 'money', width: 110 },
  { key: 'discount', label: 'Discount', type: 'money', width: 110 },
  { key: 'value', label: 'Value', type: 'formula', width: 110, formula: (l) => `$${(l.licDollar - l.discount).toLocaleString()}` },
  { key: 'unitValue', label: 'Unit Value', type: 'money', width: 110 },
  { key: 'contact', label: 'Contact Name', type: 'text', width: 150 },
  { key: 'email', label: 'Email', type: 'email', width: 210 },
  { key: 'phone', label: 'Phone', type: 'phone', width: 150 },
  { key: 'lastFollowUp', label: 'Last Follow Up', type: 'date', width: 140 },
  { key: 'nextFollowUp', label: 'Next Follow up', type: 'date', width: 140 },
  { key: 'followUpNotes', label: 'Follow-up Notes', type: 'text', width: 200 },
  { key: 'industry', label: 'Industry', type: 'tags', width: 220 },
  { key: 'product', label: 'Product', type: 'dropdown', width: 130, options: PRODUCT_OPTS },
  { key: 'source', label: 'Source', type: 'dropdown', width: 130, options: SOURCE_OPTS },
  { key: 'dealLength', label: 'Deal Length', type: 'formula', width: 110, formula: (l) => { const d = daysUntil(l.closeDate); return d >= 0 ? `${d}d left` : `${-d}d ago` } },
  { key: 'company', label: 'Company Name', type: 'text', width: 160 },
  { key: 'fullName', label: 'Full Name', type: 'text', width: 150 },
  { key: 'title', label: 'Title', type: 'text', width: 150 },
  { key: 'region', label: 'Region', type: 'dropdown', width: 110, options: REGION_OPTS },
  { key: 'physicalAddress', label: 'Physical Address', type: 'text', width: 200 },
  { key: 'utmSource', label: 'utm_source', type: 'text', width: 130 },
  { key: 'linkedin', label: 'LinkedIn', type: 'link', width: 160 },
  { key: 'projectPlan', label: 'Project Plan Link', type: 'link', width: 160 },
  { key: 'invoiceId', label: 'Invoice ID', type: 'text', width: 130 },
  { key: 'xeroLink', label: 'Xero Link', type: 'link', width: 150 },
  { key: 'label', label: 'Label', type: 'status', width: 110, options: LABEL_OPTS },
  { key: 'agreement', label: 'Agreement Type', type: 'status', width: 150, options: AGREEMENT_OPTS },
]

const NAME_W = 260
const ACTION_W = 90
const TOTAL_W = NAME_W + COLUMNS.reduce((s, c) => s + c.width, 0) + ACTION_W

/* ============================== Seed (fictional) ============================== */

const BRANDS = ['#6366f1', '#0ea5e9', '#181d27', '#22c55e', '#7a5af8', '#f97316', '#ec4899', '#14b8a6']
const INDUSTRIES = ['SaaS', 'Fintech', 'Retail', 'Healthcare', 'Logistics', 'Education', 'Energy', 'Media', 'Real estate']

function makeSeed(): Lead[] {
  const base = [
    ['Ephemeral', 'ephemeral.io', 'New leads', 'Maya Chen', 'Content curation platform'],
    ['Stack3d Lab', 'stack3dlab.com', 'Qualified', 'Maya Chen', 'Design ops tooling rollout'],
    ['Warpspeed', 'getwarpspeed.com', 'Proposal/Contracting', 'Owen Park', 'ML data pipeline build'],
    ['CloudWatch', 'cloudwatch.app', 'Won', 'Owen Park', 'Productivity suite onboarding'],
    ['ContrastAI', 'contrastai.com', 'Unqualified', 'Priya Nair', 'Web app integrations'],
    ['Convergence', 'convergence.io', 'Booked/Follow up', 'Priya Nair', 'Sales CRM implementation'],
    ['Sisyphus', 'sisyphus.com', 'Booked/Follow up', 'Maya Chen', 'Automation & workflow setup'],
    ['Quotient', 'quotient.co', 'New leads', 'Owen Park', 'Analytics dashboard project'],
    ['Layers', 'layers.dev', 'Qualified', 'Priya Nair', 'Design system migration'],
    ['Siphon', 'siphon.app', 'Proposal/Contracting', 'Maya Chen', 'Data warehouse setup'],
  ]
  return base.map((b, i): Lead => {
    const lic = 4000 + ((i * 1700) % 16000)
    const disc = (i % 3) * 500
    return {
      id: String(i + 1),
      name: b[0], domain: b[1], brand: BRANDS[i % BRANDS.length],
      status: b[2], owner: b[3], score: 35 + ((i * 13) % 60), trend: ((i % 4) - 1) * 3 + 2,
      closeDate: `2026-0${(i % 6) + 6}-${String((i * 3) % 27 + 1).padStart(2, '0')}`,
      nextStep: b[4], hours: 8 + (i % 5) * 4, spSubmitted: SP_OPTS[i % 3].label,
      licDollar: lic, discount: disc, unitValue: Math.round(lic / 4),
      contact: ['Alex Rivera', 'Sam Doyle', 'Jordan Wu', 'Riya Kapoor', 'Theo Marsh'][i % 5],
      email: `hello@${b[1]}`, phone: `+1 (555) 0${100 + i}`,
      lastFollowUp: `2026-05-${String((i % 27) + 1).padStart(2, '0')}`,
      nextFollowUp: `2026-06-${String((i % 27) + 1).padStart(2, '0')}`,
      followUpNotes: ['Sent recap', 'Awaiting reply', 'Booked call', 'Needs budget sign-off', 'Intro made'][i % 5],
      industry: [INDUSTRIES[i % INDUSTRIES.length], INDUSTRIES[(i + 3) % INDUSTRIES.length]],
      product: PRODUCT_OPTS[i % PRODUCT_OPTS.length].label,
      source: SOURCE_OPTS[i % SOURCE_OPTS.length].label,
      company: b[0] + (i % 2 ? ' Inc.' : ' Co.'),
      fullName: ['Alex Rivera', 'Sam Doyle', 'Jordan Wu', 'Riya Kapoor', 'Theo Marsh'][i % 5],
      title: ['Ops Lead', 'CTO', 'Head of Sales', 'Founder', 'PM'][i % 5],
      region: REGION_OPTS[i % 3].label,
      physicalAddress: `${100 + i} Market St, Suite ${i + 1}`,
      utmSource: ['google', 'linkedin', 'newsletter', 'direct', 'event'][i % 5],
      linkedin: `linkedin.com/company/${b[0].toLowerCase()}`,
      projectPlan: `plan.proploy.io/${b[0].toLowerCase()}`,
      invoiceId: `INV-${2000 + i}`,
      xeroLink: `xero.com/inv/${2000 + i}`,
      label: LABEL_OPTS[i % 3].label,
      agreement: AGREEMENT_OPTS[i % 3].label,
    }
  })
}

const TABS = ['View all', 'New leads', 'Booked/Follow up', 'Qualified', 'Proposal/Contracting', 'Won', 'Unqualified']
const PALETTE = ['#f97316', '#a855f7', '#ec4899', '#0ea5e9', '#10b981', '#6366f1', '#ef4444', '#14b8a6']
const colorFor = (s: string) => PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length]
const initials = (n: string) => n.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase()
const fmtDate = (iso: string) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

/* ============================== Page ============================== */

const STORAGE_KEY = 'proploy.leads.v1'

export default function ExpertLeadsPage() {
  const [rows, setRows] = useState<Lead[]>(makeSeed)
  const hydrated = useRef(false)

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setRows(JSON.parse(raw) as Lead[])
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
    } catch {
      /* ignore quota errors */
    }
  }, [rows])
  const [tab, setTab] = useState('View all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [edit, setEdit] = useState<{ id: string; key: keyof Lead } | null>(null)
  const [menu, setMenu] = useState<{ id: string; key: keyof Lead } | null>(null)

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tab !== 'View all' && r.status !== tab) return false
      if (query) {
        const q = query.toLowerCase()
        return r.name.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.contact.toLowerCase().includes(q)
      }
      return true
    })
  }, [rows, tab, query])

  const setField = (id: string, key: keyof Lead, value: unknown) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)))

  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id))

  const allSel = filtered.length > 0 && filtered.every((r) => selected.has(r.id))
  const toggleAll = () =>
    setSelected((p) => {
      const n = new Set(p)
      if (allSel) filtered.forEach((r) => n.delete(r.id))
      else filtered.forEach((r) => n.add(r.id))
      return n
    })
  const toggleOne = (id: string) =>
    setSelected((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1280px] mx-auto px-[32px] py-[32px]">
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-[16px] px-[24px] pt-[20px] pb-[16px]">
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <h1 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Leads</h1>
                  <span className="rounded-full bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-medium text-[#155eef]">
                    {rows.length} leads
                  </span>
                </div>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Track AI-matched client opportunities through your pipeline.
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
                <button type="button" className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
                  <UploadCloud size={18} className="text-[#717680]" /> Import
                </button>
                <button
                  type="button"
                  onClick={() => { setRows((rs) => [{ ...makeSeed()[0], id: String(Date.now()), name: 'New lead', domain: '', status: 'New', industry: [] }, ...rs]) }}
                  className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}
                >
                  <Plus size={18} /> Add lead
                </button>
              </div>
            </div>

            {/* Tabs + search */}
            <div className="flex flex-wrap items-center justify-between gap-[12px] px-[24px] pb-[16px]">
              <div className={`inline-flex items-center bg-white border border-[#d5d7da] rounded-[8px] p-[4px] ${BUTTON_SKEUO}`}>
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-[6px] px-[12px] py-[6px] text-[14px] font-semibold transition-colors ${
                      tab === t ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651] hover:bg-[#fafafa]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="relative">
                  <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className={`w-[240px] bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[12px] py-[9px] text-[14px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                  />
                </div>
                <button type="button" className={`flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[9px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
                  <SlidersHorizontal size={18} className="text-[#717680]" /> Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-t border-[#e9eaeb]">
              <div style={{ width: TOTAL_W }} className="min-w-full">
                {/* Header row */}
                <div className="flex bg-[#fafafa] border-b border-[#e9eaeb]">
                  <div className="sticky left-0 z-20 bg-[#fafafa] shrink-0 flex items-center gap-[10px] px-[16px] h-[44px]" style={{ width: NAME_W }}>
                    <Checkbox checked={allSel} onChange={toggleAll} />
                    <span className="inline-flex items-center gap-[4px] font-medium text-[12px] text-[#717680]">
                      Lead <ChevronDown size={14} />
                    </span>
                  </div>
                  {COLUMNS.map((c) => (
                    <div key={c.key} className="shrink-0 flex items-center px-[12px] h-[44px] border-l border-[#e9eaeb] font-medium text-[12px] text-[#717680]" style={{ width: c.width }}>
                      {c.label}
                    </div>
                  ))}
                  <div className="shrink-0" style={{ width: ACTION_W }} />
                </div>

                {/* Rows */}
                {filtered.map((row) => (
                  <div key={row.id} className="group flex bg-white border-b border-[#e9eaeb] last:border-b-0 hover:bg-[#fafafa]">
                    {/* Sticky name */}
                    <div className="sticky left-0 z-10 shrink-0 bg-white group-hover:bg-[#fafafa] flex items-center gap-[10px] px-[16px] h-[60px]" style={{ width: NAME_W }}>
                      <Checkbox checked={selected.has(row.id)} onChange={() => toggleOne(row.id)} />
                      <div className="size-[40px] rounded-full flex items-center justify-center text-white font-semibold text-[15px] shrink-0" style={{ background: row.brand }}>
                        {row.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        {edit?.id === row.id && edit.key === 'name' ? (
                          <CellInput
                            initial={row.name}
                            onCommit={(v) => { setField(row.id, 'name', v); setEdit(null) }}
                            onCancel={() => setEdit(null)}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEdit({ id: row.id, key: 'name' })}
                            className="block w-full text-left font-semibold text-[14px] text-[#181d27] truncate"
                          >
                            {row.name}
                          </button>
                        )}
                        <p className="font-normal text-[13px] leading-[18px] text-[#535862] truncate">{row.domain || '—'}</p>
                      </div>
                    </div>

                    {COLUMNS.map((c) => (
                      <div key={c.key} className="shrink-0 flex items-center px-[12px] h-[60px] border-l border-[#e9eaeb] overflow-visible relative" style={{ width: c.width }}>
                        <CellRenderer
                          row={row}
                          col={c}
                          editing={edit?.id === row.id && edit.key === c.key}
                          menuOpen={menu?.id === row.id && menu.key === c.key}
                          onStartEdit={() => setEdit({ id: row.id, key: c.key })}
                          onOpenMenu={() => setMenu({ id: row.id, key: c.key })}
                          onCloseMenu={() => setMenu(null)}
                          onCommit={(v) => { setField(row.id, c.key, v); setEdit(null); setMenu(null) }}
                          onCancel={() => setEdit(null)}
                        />
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="shrink-0 flex items-center justify-center gap-[10px] h-[60px] border-l border-[#e9eaeb]" style={{ width: ACTION_W }}>
                      <button type="button" aria-label="Delete" onClick={() => removeRow(row.id)} className="text-[#a4a7ae] hover:text-[#f04438]">
                        <Trash2 size={18} />
                      </button>
                      <button type="button" aria-label="Edit" onClick={() => setEdit({ id: row.id, key: 'name' })} className="text-[#a4a7ae] hover:text-[#155eef]">
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="px-[24px] py-[48px] text-center text-[14px] text-[#717680]">No leads match this view.</div>
                )}
              </div>
            </div>

            {/* Footer / pagination */}
            <div className="flex items-center justify-between gap-[16px] px-[24px] py-[16px] border-t border-[#e9eaeb]">
              <p className="text-[14px] text-[#717680]">
                {selected.size > 0 ? `${selected.size} selected · ` : ''}Page 1 of 1
              </p>
              <div className="flex items-center gap-[8px]">
                <button type="button" className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[8px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
                  <ChevronLeft size={16} /> Previous
                </button>
                <button type="button" className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[8px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

/* ============================== Cells ============================== */

function CellRenderer({
  row, col, editing, menuOpen, onStartEdit, onOpenMenu, onCloseMenu, onCommit, onCancel,
}: {
  row: Lead
  col: Column
  editing: boolean
  menuOpen: boolean
  onStartEdit: () => void
  onOpenMenu: () => void
  onCloseMenu: () => void
  onCommit: (v: unknown) => void
  onCancel: () => void
}) {
  const raw = row[col.key]

  switch (col.type) {
    case 'status': {
      const color = optColor(col.options, String(raw))
      return (
        <div className="relative w-full">
          <button type="button" onClick={onOpenMenu} className="inline-flex max-w-full items-center gap-[6px] rounded-full border border-[#e9eaeb] bg-white pl-[8px] pr-[6px] py-[2px] text-[13px] font-medium text-[#414651] hover:bg-[#fafafa]">
            <span className="size-[7px] rounded-full shrink-0" style={{ background: color }} />
            <span className="truncate">{String(raw) || '—'}</span>
            <ChevronDown size={13} className="text-[#a4a7ae] shrink-0" />
          </button>
          {menuOpen && (
            <OptionMenu options={col.options ?? []} current={String(raw)} onPick={onCommit} onClose={onCloseMenu} />
          )}
        </div>
      )
    }
    case 'dropdown': {
      return (
        <div className="relative w-full">
          <button type="button" onClick={onOpenMenu} className="inline-flex max-w-full items-center gap-[4px] rounded-[6px] px-[8px] py-[3px] text-[13px] text-[#414651] hover:bg-[#eef1f6]">
            <span className="truncate">{String(raw) || '—'}</span>
            <ChevronDown size={13} className="text-[#a4a7ae] shrink-0" />
          </button>
          {menuOpen && (
            <OptionMenu options={col.options ?? []} current={String(raw)} dot={false} onPick={onCommit} onClose={onCloseMenu} />
          )}
        </div>
      )
    }
    case 'people': {
      if (editing) return <CellInput initial={String(raw)} onCommit={onCommit} onCancel={onCancel} />
      return (
        <button type="button" onClick={onStartEdit} className="flex items-center gap-[8px] min-w-0 w-full text-left">
          <span className="size-[28px] rounded-full flex items-center justify-center text-white font-semibold text-[11px] shrink-0" style={{ background: colorFor(String(raw)) }}>
            {initials(String(raw))}
          </span>
          <span className="text-[13px] text-[#414651] truncate">{String(raw)}</span>
        </button>
      )
    }
    case 'tags':
      return <TagsCell tags={raw as string[]} onChange={onCommit} />
    case 'formula':
      return <span className="text-[13px] font-medium text-[#181d27] tabular-nums">{col.formula?.(row)}</span>
    case 'money': {
      if (editing) return <CellInput initial={String(raw)} numeric onCommit={(v) => onCommit(Number(v) || 0)} onCancel={onCancel} />
      return <button type="button" onClick={onStartEdit} className="w-full text-left text-[13px] text-[#181d27] tabular-nums">${Number(raw).toLocaleString()}</button>
    }
    case 'number': {
      if (editing) return <CellInput initial={String(raw)} numeric onCommit={(v) => onCommit(Number(v) || 0)} onCancel={onCancel} />
      return <button type="button" onClick={onStartEdit} className="w-full text-left text-[13px] text-[#181d27] tabular-nums">{String(raw)}</button>
    }
    case 'date': {
      if (editing) return <CellInput initial={String(raw)} type="date" onCommit={onCommit} onCancel={onCancel} />
      return <button type="button" onClick={onStartEdit} className="w-full text-left text-[13px] text-[#414651]">{fmtDate(String(raw)) || '—'}</button>
    }
    case 'email':
    case 'phone':
    case 'link': {
      if (editing) return <CellInput initial={String(raw)} onCommit={onCommit} onCancel={onCancel} />
      const href = col.type === 'email' ? `mailto:${raw}` : col.type === 'phone' ? `tel:${raw}` : `https://${String(raw).replace(/^https?:\/\//, '')}`
      return (
        <div className="flex items-center w-full min-w-0">
          <a href={href} target={col.type === 'link' ? '_blank' : undefined} rel="noopener noreferrer" className="text-[13px] text-[#155eef] truncate hover:underline" onClick={(e) => e.stopPropagation()}>
            {String(raw) || '—'}
          </a>
          <button type="button" onClick={onStartEdit} className="ml-[6px] opacity-0 group-hover:opacity-100 text-[#a4a7ae] hover:text-[#155eef] shrink-0">
            <Pencil size={12} />
          </button>
        </div>
      )
    }
    default: {
      if (editing) return <CellInput initial={String(raw)} onCommit={onCommit} onCancel={onCancel} />
      return <button type="button" onClick={onStartEdit} className="w-full text-left text-[13px] text-[#414651] truncate">{String(raw) || '—'}</button>
    }
  }
}

function CellInput({
  initial, type = 'text', numeric = false, onCommit, onCancel,
}: {
  initial: string
  type?: string
  numeric?: boolean
  onCommit: (v: string) => void
  onCancel: () => void
}) {
  const [v, setV] = useState(initial)
  return (
    <input
      autoFocus
      type={type}
      inputMode={numeric ? 'decimal' : undefined}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onCommit(v)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(v)
        if (e.key === 'Escape') onCancel()
      }}
      className="w-full bg-white border border-[#155eef] rounded-[6px] px-[8px] py-[5px] text-[13px] text-[#181d27] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
    />
  )
}

function OptionMenu({
  options, current, dot = true, onPick, onClose,
}: {
  options: Option[]
  current: string
  dot?: boolean
  onPick: (v: string) => void
  onClose: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute left-0 top-[calc(100%+4px)] z-40 min-w-[180px] rounded-[8px] border border-[#e9eaeb] bg-white py-[4px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08)]">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(o.label)}
            className="flex w-full items-center gap-[8px] px-[12px] py-[7px] text-[13px] text-[#414651] hover:bg-[#fafafa]"
          >
            {dot && <span className="size-[8px] rounded-full shrink-0" style={{ background: o.color }} />}
            <span className="flex-1 text-left truncate">{o.label}</span>
            {current === o.label && <Check size={15} className="text-[#155eef]" />}
          </button>
        ))}
      </div>
    </>
  )
}

function TagsCell({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [adding, setAdding] = useState(false)
  return (
    <div className="flex items-center gap-[4px] flex-wrap">
      {tags.map((t) => (
        <span key={t} className="group/tag inline-flex items-center gap-[4px] rounded-full bg-[#eff8ff] border border-[#b2ddff] px-[8px] py-[1px] text-[12px] font-medium text-[#175cd3]">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="opacity-0 group-hover/tag:opacity-100 text-[#175cd3]/60 hover:text-[#175cd3]">×</button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          onBlur={(e) => { const val = e.target.value.trim(); if (val) onChange([...tags, val]); setAdding(false) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value.trim(); if (val) onChange([...tags, val]); setAdding(false) }
            if (e.key === 'Escape') setAdding(false)
          }}
          className="w-[80px] bg-white border border-[#155eef] rounded-[4px] px-[6px] py-[1px] text-[12px] focus:outline-none"
        />
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="rounded-full border border-dashed border-[#d5d7da] px-[6px] text-[12px] text-[#717680] hover:border-[#155eef] hover:text-[#155eef]">+</button>
      )}
    </div>
  )
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="size-[18px] rounded-[5px] border border-[#d5d7da] accent-[#155eef] cursor-pointer shrink-0"
    />
  )
}
