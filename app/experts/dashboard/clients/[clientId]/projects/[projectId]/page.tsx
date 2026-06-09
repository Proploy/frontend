'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileUp, Paperclip } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { useAuth } from '@/components/providers/auth-provider'
import { useClients } from '@/lib/clients/clients-store'
import { KanbanBoard } from '@/components/clients/KanbanBoard'
import { TimeTracker } from '@/components/clients/TimeTracker'
import { InvoiceTab } from '@/components/clients/InvoiceTab'
import { formatCurrency, formatDuration } from '@/lib/format'
import { PROJECT_STATUSES } from '@/hooks/types/clients-contracts'
import type { Project, ProjectStatus } from '@/hooks/types/clients-contracts'

const STATUS_COLOR: Record<ProjectStatus, string> = {
  'Not started': '#717680', Active: '#155eef', Review: '#f79009', Completed: '#17b26a', Paused: '#6938ef',
}
const TABS = ['Overview', 'Board', 'Time', 'Files', 'Invoice'] as const
type Tab = (typeof TABS)[number]

const billableMins = (p: Project) => p.timeEntries.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0)
const billableValue = (p: Project) => p.timeEntries.filter((e) => e.billable).reduce((s, e) => s + Math.round((e.minutes / 60) * e.rateCents), 0)

export default function ProjectDetailPage() {
  const { clientId, projectId } = useParams<{ clientId: string; projectId: string }>()
  const { user } = useAuth()
  const { getClient, getProject, updateProject, setProjectStatus } = useClients()
  const [tab, setTab] = useState<Tab>('Overview')
  const [statusMenu, setStatusMenu] = useState(false)

  const client = getClient(clientId)
  const project = getProject(projectId)

  if (!client || !project) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <p className="text-[16px] text-[#414651]">Project not found.</p>
            <Link href="/experts/dashboard/clients" className="mt-[12px] inline-block text-[14px] font-semibold text-[#155eef]">Back to clients</Link>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1200px] mx-auto px-[32px] py-[32px] flex flex-col gap-[20px]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-[6px] text-[14px] text-[#717680]">
            <Link href="/experts/dashboard/clients" className="hover:text-[#414651]">Clients</Link>
            <span>/</span>
            <Link href={`/experts/dashboard/clients/${client.id}`} className="hover:text-[#414651]">{client.name}</Link>
            <span>/</span>
            <span className="text-[#414651]">{project.name}</span>
          </div>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[6px]">
              <input
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="font-semibold text-[24px] leading-[32px] text-[#181d27] bg-transparent border border-transparent hover:border-[#e9eaeb] focus:border-[#155eef] rounded-[6px] px-[6px] -ml-[6px] focus:outline-none"
              />
              <p className="text-[14px] text-[#535862] px-[6px] -ml-[6px]">{client.name}</p>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusMenu((v) => !v)}
                className={`inline-flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                <span className="size-[8px] rounded-full" style={{ background: STATUS_COLOR[project.status] }} />
                {project.status}
              </button>
              {statusMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setStatusMenu(false)} />
                  <div className="absolute right-0 top-[calc(100%+4px)] z-40 min-w-[180px] rounded-[8px] border border-[#e9eaeb] bg-white py-[4px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08)]">
                    {PROJECT_STATUSES.map((st) => (
                      <button key={st} type="button" onClick={() => { setProjectStatus(project.id, st); setStatusMenu(false) }} className="flex w-full items-center gap-[8px] px-[12px] py-[7px] text-[13px] text-[#414651] hover:bg-[#fafafa]">
                        <span className="size-[8px] rounded-full" style={{ background: STATUS_COLOR[st] }} />
                        {st}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-[16px] border-b border-[#e9eaeb]">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`relative pb-[10px] text-[14px] font-semibold ${tab === t ? 'text-[#155eef]' : 'text-[#717680] hover:text-[#414651]'}`}
              >
                {t}
                {tab === t && <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-[#155eef]" />}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'Overview' && <Overview project={project} onSummary={(v) => updateProject(project.id, { summary: v })} onDate={(k, v) => updateProject(project.id, { [k]: v })} />}
          {tab === 'Board' && <KanbanBoard project={project} />}
          {tab === 'Time' && <TimeTracker project={project} />}
          {tab === 'Files' && <FilesTab />}
          {tab === 'Invoice' && <InvoiceTab project={project} client={client} expertName={user?.name || 'Expert'} />}
        </div>
      </div>
    </DashboardShell>
  )
}

function Overview({ project, onSummary, onDate }: { project: Project; onSummary: (v: string) => void; onDate: (k: 'startDate' | 'dueDate', v: string) => void }) {
  const prog = project.tasks.length ? Math.round((project.tasks.filter((t) => t.column === 'done').length / project.tasks.length) * 100) : 0
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[20px]">
        <Stat label="Progress" value={`${prog}%`} />
        <Stat label="Tasks" value={`${project.tasks.filter((t) => t.column === 'done').length}/${project.tasks.length}`} />
        <Stat label="Billable time" value={formatDuration(billableMins(project))} />
        <Stat label="Billable value" value={formatCurrency(billableValue(project))} />
      </div>

      <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[16px] ${CARD_SHADOW}`}>
        <div>
          <p className="text-[13px] font-medium text-[#414651] mb-[6px]">Summary</p>
          <textarea
            value={project.summary}
            onChange={(e) => onSummary(e.target.value)}
            rows={3}
            placeholder="Project summary…"
            className="w-full bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[10px] text-[14px] text-[#181d27] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 resize-none"
          />
        </div>
        <div className="flex flex-wrap gap-[20px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-[#414651]">Start date</label>
            <input type="date" value={project.startDate} onChange={(e) => onDate('startDate', e.target.value)} className="bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[9px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-[#414651]">Due date</label>
            <input type="date" value={project.dueDate} onChange={(e) => onDate('dueDate', e.target.value)} className="bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[9px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilesTab() {
  const [files, setFiles] = useState<{ name: string; size: string }[]>([
    { name: 'scope-of-work.pdf', size: '184 KB' },
    { name: 'data-mapping.xlsx', size: '52 KB' },
  ])
  return (
    <div className="flex flex-col gap-[16px]">
      <label className="rounded-[12px] border border-dashed border-[#d5d7da] p-[32px] flex flex-col items-center gap-[8px] text-center cursor-pointer hover:border-[#155eef]">
        <div className="size-[44px] rounded-full bg-[#eff4ff] flex items-center justify-center text-[#155eef]"><FileUp size={22} /></div>
        <p className="text-[14px] font-medium text-[#181d27]">Drop files or click to upload</p>
        <p className="text-[13px] text-[#717680]">PDF, images, docs — attached to this project</p>
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) setFiles((prev) => [{ name: f.name, size: `${Math.max(1, Math.round(f.size / 1024))} KB` }, ...prev])
          }}
        />
      </label>
      <div className="rounded-[12px] border border-[#e9eaeb] divide-y divide-[#e9eaeb]">
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-[12px] px-[16px] py-[12px]">
            <Paperclip size={18} className="text-[#717680]" />
            <span className="flex-1 text-[14px] text-[#181d27] truncate">{f.name}</span>
            <span className="text-[13px] text-[#717680]">{f.size}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[16px] ${CARD_SHADOW}`}>
      <p className="text-[13px] font-medium text-[#717680]">{label}</p>
      <p className="mt-[2px] font-semibold text-[22px] leading-[30px] text-[#181d27] tabular-nums">{value}</p>
    </div>
  )
}
