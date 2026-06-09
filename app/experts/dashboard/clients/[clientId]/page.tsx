'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Plus } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { useClients } from '@/lib/clients/clients-store'
import { formatCurrency, formatDate, formatDuration } from '@/lib/format'
import type { Project, ProjectStatus } from '@/hooks/types/clients-contracts'

const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  'Not started': '#717680',
  Active: '#155eef',
  Review: '#f79009',
  Completed: '#17b26a',
  Paused: '#6938ef',
}

const billableMins = (p: Project) => p.timeEntries.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0)
const billableValue = (p: Project) => p.timeEntries.filter((e) => e.billable).reduce((s, e) => s + Math.round((e.minutes / 60) * e.rateCents), 0)
const taskProgress = (p: Project) => {
  const done = p.tasks.filter((t) => t.column === 'done').length
  return { done, total: p.tasks.length, pct: p.tasks.length ? Math.round((done / p.tasks.length) * 100) : 0 }
}

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const router = useRouter()
  const { getClient, projectsForClient, addProject } = useClients()
  const client = getClient(clientId)

  if (!client) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[16px] text-[#414651]">Client not found.</p>
            <Link href="/experts/dashboard/clients" className="mt-[12px] inline-block text-[14px] font-semibold text-[#155eef]">Back to clients</Link>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const projects = projectsForClient(client.id)
  const totalMins = projects.reduce((s, p) => s + billableMins(p), 0)
  const totalValue = projects.reduce((s, p) => s + billableValue(p), 0)

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[24px]">
          {/* Breadcrumb */}
          <Link href="/experts/dashboard/clients" className="inline-flex items-center gap-[6px] text-[14px] font-medium text-[#717680] hover:text-[#414651]">
            <ArrowLeft size={16} /> Clients
          </Link>

          {/* Client header */}
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex items-center gap-[16px]">
              <div className="size-[56px] rounded-[14px] flex items-center justify-center text-white font-semibold text-[22px]" style={{ background: client.brand }}>
                {client.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">{client.name}</h1>
                <p className="text-[14px] text-[#535862]">
                  {client.industry || '—'} · {client.domain || 'no domain'}
                </p>
                {client.contactEmail && (
                  <a href={`mailto:${client.contactEmail}`} className="mt-[4px] inline-flex items-center gap-[6px] text-[13px] text-[#155eef] hover:underline">
                    <Mail size={14} /> {client.contactEmail}
                  </a>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { const p = addProject(client.id); router.push(`/experts/dashboard/clients/${client.id}/projects/${p.id}`) }}
              className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}
            >
              <Plus size={18} /> New project
            </button>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
            <Stat label="Projects" value={String(projects.length)} />
            <Stat label="Billable time" value={totalMins ? formatDuration(totalMins) : '0m'} />
            <Stat label="Billable value" value={formatCurrency(totalValue)} />
          </div>

          {/* Projects */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Projects</p>
            {projects.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-[#d5d7da] p-[32px] text-center text-[14px] text-[#717680]">
                No projects yet. Create the first one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                {projects.map((p) => {
                  const prog = taskProgress(p)
                  return (
                    <Link
                      key={p.id}
                      href={`/experts/dashboard/clients/${client.id}/projects/${p.id}`}
                      className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[14px] hover:shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08)] transition-shadow ${CARD_SHADOW}`}
                    >
                      <div className="flex items-start justify-between gap-[8px]">
                        <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{p.name}</p>
                        <span className="shrink-0 inline-flex items-center gap-[6px] rounded-full border border-[#e9eaeb] px-[8px] py-[2px] text-[12px] font-medium text-[#414651]">
                          <span className="size-[7px] rounded-full" style={{ background: PROJECT_STATUS_COLOR[p.status] }} />
                          {p.status}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[18px] text-[#535862] line-clamp-2">{p.summary || 'No summary'}</p>
                      <div className="flex flex-col gap-[6px]">
                        <div className="flex items-center justify-between text-[12px] text-[#717680]">
                          <span>{prog.done}/{prog.total} tasks</span>
                          <span>{prog.pct}%</span>
                        </div>
                        <div className="h-[6px] rounded-full bg-[#eaecf0] overflow-hidden">
                          <div className="h-full rounded-full bg-[#155eef]" style={{ width: `${prog.pct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-[4px] border-t border-[#f5f5f5] text-[13px]">
                        <span className="text-[#535862]">Due {formatDate(p.dueDate)}</span>
                        <span className="font-medium text-[#181d27]">{formatCurrency(billableValue(p))}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] ${CARD_SHADOW}`}>
      <p className="font-medium text-[14px] text-[#414651]">{label}</p>
      <p className="mt-[4px] font-semibold text-[28px] leading-[36px] text-[#181d27] tabular-nums">{value}</p>
    </div>
  )
}
