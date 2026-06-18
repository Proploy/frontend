'use client'

import { useMemo, useState } from 'react'
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Eye,
  KanbanSquare,
  Timer,
} from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW, DashboardShell } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { KanbanBoard } from '@/components/clients/KanbanBoard'
import { TimeTracker } from '@/components/clients/TimeTracker'
import { useClients } from '@/lib/clients/clients-store'
import { colorFor, initials } from '@/lib/clients/clients-mock'
import { PROJECT_STATUSES, TASK_COLUMNS } from '@/hooks/types/clients-contracts'
import type { Project, ProjectStatus } from '@/hooks/types/clients-contracts'
import { formatCurrency, formatDate, formatDuration } from '@/lib/format'

/* ------------------------------------------------------------------ helpers */

const STATUS_META: Record<ProjectStatus, { color: string; bg: string }> = {
  'Not started': { color: '#717680', bg: '#f5f5f5' },
  Active: { color: '#155eef', bg: '#eff4ff' },
  Review: { color: '#b54708', bg: '#fffaeb' },
  Completed: { color: '#067647', bg: '#ecfdf3' },
  Paused: { color: '#b42318', bg: '#fef3f2' },
}

type MilestoneState = 'approved' | 'in_review' | 'upcoming'

const MILESTONE_META: Record<MilestoneState, { label: string; color: string; bg: string; ring: string }> = {
  approved: { label: 'Approved', color: '#067647', bg: '#ecfdf3', ring: '#17b26a' },
  in_review: { label: 'In review', color: '#b54708', bg: '#fffaeb', ring: '#f79009' },
  upcoming: { label: 'Upcoming', color: '#717680', bg: '#fafafa', ring: '#d5d7da' },
}

type Milestone = { id: string; label: string; detail: string; state: MilestoneState }

/**
 * Derive a client-visible milestone timeline from the project's kanban tasks
 * and lifecycle. Each kanban column maps to a phase the client can follow:
 * done work is "approved", review work is "in review", everything ahead is
 * "upcoming". Kickoff + delivery bookend the timeline using project dates.
 */
function deriveMilestones(project: Project): Milestone[] {
  const count = (col: string) => project.tasks.filter((t) => t.column === col).length
  const total = project.tasks.length
  const done = count('done')
  const review = count('review')
  const inProgress = count('in_progress')

  const allDone = total > 0 && done === total
  const projectDone = project.status === 'Completed'

  const out: Milestone[] = [
    {
      id: 'kickoff',
      label: 'Kickoff',
      detail: `Started ${formatDate(project.startDate)}`,
      state: 'approved',
    },
  ]

  for (const col of TASK_COLUMNS) {
    if (col.id === 'todo') continue
    const n = col.id === 'done' ? done : col.id === 'review' ? review : inProgress
    let state: MilestoneState = 'upcoming'
    if (col.id === 'done') state = done > 0 ? 'approved' : 'upcoming'
    else if (col.id === 'review') state = review > 0 ? 'in_review' : 'upcoming'
    else state = inProgress > 0 ? 'in_review' : done > 0 ? 'approved' : 'upcoming'

    out.push({
      id: col.id,
      label: col.label,
      detail: n > 0 ? `${n} item${n === 1 ? '' : 's'}` : 'Nothing here yet',
      state,
    })
  }

  out.push({
    id: 'delivery',
    label: 'Delivery & sign-off',
    detail: `Due ${formatDate(project.dueDate)}`,
    state: projectDone || allDone ? 'approved' : project.status === 'Review' ? 'in_review' : 'upcoming',
  })

  return out
}

function projectMinutes(project: Project): number {
  return project.timeEntries.reduce(
    (s, e) => s + e.minutes + (e.runningStartedAt ? Math.floor((Date.now() - e.runningStartedAt) / 60000) : 0),
    0,
  )
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Monday = 0
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - day)
  return x
}

function weeklyBillableCents(project: Project): number {
  const weekStart = startOfWeek(new Date())
  return project.timeEntries
    .filter((e) => e.billable)
    .filter((e) => {
      const d = new Date(`${e.date}T00:00:00`)
      return d >= weekStart
    })
    .reduce((s, e) => {
      const mins = e.minutes + (e.runningStartedAt ? Math.floor((Date.now() - e.runningStartedAt) / 60000) : 0)
      return s + Math.round((mins / 60) * e.rateCents)
    }, 0)
}

/* ------------------------------------------------------------------ page */

export default function ExpertDashboardProjectsPage() {
  const { clients, projects, getProject, setProjectStatus } = useClients()
  const [selectedId, setSelectedId] = useState<string | null>(projects[0]?.id ?? null)

  const selected = (selectedId && getProject(selectedId)) || projects[0] || null
  const clientFor = (clientId: string) => clients.find((c) => c.id === clientId)

  return (
    <DashboardShell>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Briefcase size={22} className="text-[#155eef]" />
              Projects
            </h1>
            <p className="text-[14px] leading-[20px] text-[#535862]">
              Run delivery on a kanban board, log billable and internal time, and share a client-visible milestone
              timeline — all in one workspace.
            </p>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* project selector */}
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[300px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="border-b border-[#e9eaeb] px-[16px] py-[14px]">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Projects</p>
            </div>
            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {projects.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No projects yet.
                </p>
              )}
              {projects.map((p) => {
                const active = p.id === selected?.id
                const client = clientFor(p.clientId)
                const meta = STATUS_META[p.status]
                const open = p.tasks.filter((t) => t.column !== 'done').length
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-center gap-[10px]">
                      <span
                        className="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] text-[11px] font-semibold text-white"
                        style={{ background: client?.brand ?? colorFor(p.name) }}
                      >
                        {initials(client?.name ?? p.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                          {p.name}
                        </span>
                        <span className="block truncate text-[13px] leading-[18px] text-[#535862]">
                          {client?.name ?? 'No client'}
                        </span>
                      </span>
                    </div>
                    <div className="mt-[8px] flex items-center justify-between gap-[8px]">
                      <span
                        className="inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
                        {p.status}
                      </span>
                      <span className="text-[12px] leading-[18px] text-[#717680]">{open} open</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* workspace */}
          <section className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa] p-[24px]">
            {selected ? (
              <div className="mx-auto flex max-w-[1100px] flex-col gap-[24px]">
                <ProjectHeader
                  project={selected}
                  clientName={clientFor(selected.clientId)?.name ?? 'No client'}
                  onStatus={(s) => setProjectStatus(selected.id, s)}
                />

                <MilestoneTimeline project={selected} />

                <Panel
                  icon={<KanbanSquare size={18} className="text-[#155eef]" />}
                  title="Board"
                  subtitle="Drag cards across columns. Internal — not shared with the client."
                >
                  <KanbanBoard project={selected} />
                </Panel>

                <Panel
                  icon={<Timer size={18} className="text-[#155eef]" />}
                  title="Time tracking"
                  subtitle="Run a live timer or log entries manually. Toggle billable vs internal per entry."
                  aside={
                    <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#ecfdf3] px-[10px] py-[6px] text-[13px] font-semibold leading-[18px] text-[#067647]">
                      {formatCurrency(weeklyBillableCents(selected))} billable this week
                    </span>
                  }
                >
                  <TimeTracker project={selected} />
                </Panel>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Briefcase size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No project selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Pick a project from the list to open its board, time log, and milestone timeline.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardShell>
  )
}

/* ------------------------------------------------------------------ project header */

function ProjectHeader({
  project,
  clientName,
  onStatus,
}: {
  project: Project
  clientName: string
  onStatus: (status: ProjectStatus) => void
}) {
  const done = project.tasks.filter((t) => t.column === 'done').length
  const total = project.tasks.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const tracked = projectMinutes(project)

  return (
    <div className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="min-w-0">
          <h2 className="text-[22px] font-semibold leading-[30px] tracking-[-0.3px] text-[#181d27]">
            {project.name}
          </h2>
          <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">
            {clientName}
            {project.summary ? ` · ${project.summary}` : ''}
          </p>
          <div className="mt-[10px] flex flex-wrap items-center gap-x-[16px] gap-y-[6px] text-[13px] leading-[18px] text-[#717680]">
            <span className="inline-flex items-center gap-[6px]">
              <CalendarDays size={14} /> {formatDate(project.startDate)} – {formatDate(project.dueDate)}
            </span>
            <span className="inline-flex items-center gap-[6px]">
              <Clock3 size={14} /> {formatDuration(tracked)} tracked
            </span>
          </div>
        </div>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Status</span>
          <select
            value={project.status}
            onChange={(e) => onStatus(e.target.value as ProjectStatus)}
            className={`rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[9px] text-[14px] font-semibold text-[#414651] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* progress */}
      <div className="mt-[18px]">
        <div className="flex items-center justify-between text-[13px] leading-[18px]">
          <span className="font-medium text-[#414651]">
            {done} of {total} tasks done
          </span>
          <span className="font-semibold text-[#181d27]">{pct}%</span>
        </div>
        <div className="mt-[8px] h-[8px] w-full overflow-hidden rounded-full bg-[#eaecf0]">
          <div
            className="h-full rounded-full bg-[#155eef] transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ milestone timeline */

function MilestoneTimeline({ project }: { project: Project }) {
  const milestones = useMemo(() => deriveMilestones(project), [project])

  return (
    <div className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="flex items-center gap-[8px] text-[18px] font-semibold leading-[28px] text-[#181d27]">
            <Eye size={18} className="text-[#155eef]" />
            Milestone timeline
          </p>
          <p className="text-[14px] leading-[20px] text-[#535862]">
            How the client sees delivery progress — approved, in review, and upcoming phases.
          </p>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full border border-[#b2ccff] bg-[#eff4ff] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#155eef]">
          <Eye size={12} /> Client-visible
        </span>
      </div>

      {/* legend */}
      <div className="mt-[16px] flex flex-wrap items-center gap-[16px]">
        {(Object.keys(MILESTONE_META) as MilestoneState[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-[6px] text-[12px] leading-[18px] text-[#717680]">
            <span className="size-[10px] rounded-full" style={{ background: MILESTONE_META[k].ring }} />
            {MILESTONE_META[k].label}
          </span>
        ))}
      </div>

      {/* timeline rail */}
      <ol className="mt-[20px] flex flex-col gap-0">
        {milestones.map((m, i) => {
          const meta = MILESTONE_META[m.state]
          const isLast = i === milestones.length - 1
          return (
            <li key={m.id} className="flex gap-[14px]">
              <div className="flex flex-col items-center">
                <span
                  className="flex size-[28px] shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: meta.ring, background: meta.bg }}
                >
                  {m.state === 'approved' ? (
                    <CheckCircle2 size={16} style={{ color: meta.ring }} />
                  ) : m.state === 'in_review' ? (
                    <Clock3 size={15} style={{ color: meta.ring }} />
                  ) : (
                    <Circle size={13} style={{ color: meta.ring }} />
                  )}
                </span>
                {!isLast && (
                  <span
                    className="w-[2px] flex-1 min-h-[24px]"
                    style={{ background: m.state === 'approved' ? meta.ring : '#e9eaeb' }}
                  />
                )}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-[20px]'}`}>
                <div className="flex flex-wrap items-center gap-[8px]">
                  <span className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{m.label}</span>
                  <span
                    className="rounded-full px-[8px] py-[1px] text-[12px] font-medium leading-[18px]"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">{m.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ panel */

function Panel({
  icon,
  title,
  subtitle,
  aside,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] ${CARD_SHADOW}`}>
      <div className="mb-[18px] flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="flex items-center gap-[8px] text-[18px] font-semibold leading-[28px] text-[#181d27]">
            {icon}
            {title}
          </p>
          <p className="text-[14px] leading-[20px] text-[#535862]">{subtitle}</p>
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}
