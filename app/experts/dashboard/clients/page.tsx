'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Plus, Search, SlidersHorizontal } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { useClients } from '@/lib/clients/clients-store'
import { colorFor, initials } from '@/lib/clients/clients-mock'
import { formatCurrency, formatDuration } from '@/lib/format'
import type { Client, ClientStatus, Project } from '@/hooks/types/clients-contracts'

const CLIENT_STATUS: { label: ClientStatus; color: string }[] = [
  { label: 'Active', color: '#17b26a' },
  { label: 'Prospect', color: '#155eef' },
  { label: 'On hold', color: '#f79009' },
  { label: 'Completed', color: '#717680' },
]
const statusColor = (s: string) => CLIENT_STATUS.find((x) => x.label === s)?.color ?? '#717680'

const TABS = ['All', 'Active', 'Prospect', 'On hold', 'Completed']

function billableMinutes(p: Project) {
  return p.timeEntries.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0)
}
function billableValueCents(p: Project) {
  return p.timeEntries
    .filter((e) => e.billable)
    .reduce((s, e) => s + Math.round((e.minutes / 60) * e.rateCents), 0)
}

export default function ClientsListPage() {
  const router = useRouter()
  const { clients, projectsForClient, addClient, updateClient } = useClients()
  const [tab, setTab] = useState('All')
  const [query, setQuery] = useState('')
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const rows = useMemo(() => {
    return clients
      .filter((c) => (tab === 'All' ? true : c.status === tab))
      .filter((c) => {
        if (!query) return true
        const q = query.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q)
      })
      .map((c) => {
        const ps = projectsForClient(c.id)
        const active = ps.find((p) => p.status === 'Active') ?? ps[0]
        const mins = ps.reduce((s, p) => s + billableMinutes(p), 0)
        const value = ps.reduce((s, p) => s + billableValueCents(p), 0)
        return { client: c, projectCount: ps.length, active, mins, value }
      })
  }, [clients, projectsForClient, tab, query])

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1280px] mx-auto px-[32px] py-[32px]">
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-[16px] px-[24px] pt-[20px] pb-[16px]">
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <h1 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Clients</h1>
                  <span className="rounded-full bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-medium text-[#155eef]">
                    {clients.length} clients
                  </span>
                </div>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Manage client engagements, projects, time and invoices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { const c = addClient(); router.push(`/experts/dashboard/clients/${c.id}`) }}
                className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}
              >
                <Plus size={18} /> Add client
              </button>
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
              <table className="w-full min-w-[920px] border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e9eaeb] text-left">
                    <Th className="pl-[24px]">Client</Th>
                    <Th>Status</Th>
                    <Th>Projects</Th>
                    <Th>Active project</Th>
                    <Th>Billable time</Th>
                    <Th>Billable value</Th>
                    <Th>Contact</Th>
                    <Th className="pr-[24px]" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ client, projectCount, active, mins, value }) => (
                    <tr
                      key={client.id}
                      onClick={() => router.push(`/experts/dashboard/clients/${client.id}`)}
                      className="border-b border-[#e9eaeb] last:border-b-0 hover:bg-[#fafafa] cursor-pointer"
                    >
                      <Td className="pl-[24px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="size-[40px] rounded-full flex items-center justify-center text-white font-semibold text-[15px] shrink-0" style={{ background: client.brand }}>
                            {client.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[14px] text-[#181d27] truncate">{client.name}</p>
                            <p className="text-[13px] text-[#535862] truncate">{client.domain || '—'}</p>
                          </div>
                        </div>
                      </Td>
                      <Td onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setMenuFor(menuFor === client.id ? null : client.id)}
                            className="inline-flex items-center gap-[6px] rounded-full border border-[#e9eaeb] bg-white pl-[8px] pr-[8px] py-[2px] text-[13px] font-medium text-[#414651] hover:bg-[#fafafa]"
                          >
                            <span className="size-[7px] rounded-full" style={{ background: statusColor(client.status) }} />
                            {client.status}
                          </button>
                          {menuFor === client.id && (
                            <StatusMenu
                              current={client.status}
                              onPick={(s) => { updateClient(client.id, { status: s as ClientStatus }); setMenuFor(null) }}
                              onClose={() => setMenuFor(null)}
                            />
                          )}
                        </div>
                      </Td>
                      <Td><span className="text-[13px] text-[#414651]">{projectCount}</span></Td>
                      <Td><span className="text-[13px] text-[#414651] truncate">{active?.name ?? '—'}</span></Td>
                      <Td><span className="text-[13px] text-[#414651] tabular-nums">{mins ? formatDuration(mins) : '—'}</span></Td>
                      <Td><span className="text-[13px] font-medium text-[#181d27] tabular-nums">{value ? formatCurrency(value) : '—'}</span></Td>
                      <Td>
                        <ContactCell client={client} />
                      </Td>
                      <Td className="pr-[24px]">
                        <ChevronRight size={18} className="text-[#a4a7ae]" />
                      </Td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={8} className="px-[24px] py-[48px] text-center text-[14px] text-[#717680]">No clients match this view.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

function ContactCell({ client }: { client: Client }) {
  if (!client.contactName) return <span className="text-[13px] text-[#717680]">—</span>
  return (
    <div className="flex items-center gap-[8px] min-w-0">
      <span className="size-[26px] rounded-full flex items-center justify-center text-white font-semibold text-[10px] shrink-0" style={{ background: colorFor(client.contactName) }}>
        {initials(client.contactName)}
      </span>
      <span className="text-[13px] text-[#414651] truncate">{client.contactName}</span>
    </div>
  )
}

function StatusMenu({ current, onPick, onClose }: { current: string; onPick: (s: string) => void; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute left-0 top-[calc(100%+4px)] z-40 min-w-[160px] rounded-[8px] border border-[#e9eaeb] bg-white py-[4px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08)]">
        {CLIENT_STATUS.map((o) => (
          <button key={o.label} type="button" onClick={() => onPick(o.label)} className="flex w-full items-center gap-[8px] px-[12px] py-[7px] text-[13px] text-[#414651] hover:bg-[#fafafa]">
            <span className="size-[8px] rounded-full" style={{ background: o.color }} />
            <span className="flex-1 text-left">{o.label}</span>
            {current === o.label && <span className="text-[#155eef]">✓</span>}
          </button>
        ))}
      </div>
    </>
  )
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={`font-medium text-[12px] text-[#717680] px-[16px] py-[12px] ${className}`}>{children}</th>
}
function Td({ children, className = '', onClick }: { children?: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return <td className={`px-[16px] py-[14px] align-middle ${className}`} onClick={onClick}>{children}</td>
}
