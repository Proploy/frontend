'use client'

import { useEffect, useMemo, useState } from 'react'
import type { DragEvent, FormEvent, ReactNode } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  FolderClosed,
  GripVertical,
  ListChecks,
  Maximize2,
  MessageSquare,
  Plus,
  PenLine,
  Play,
  Send,
  RefreshCw,
  Save,
  Square,
  XCircle,
  Wallet,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  engagementTitle,
  longDate,
  money,
  projectStatusClass,
  relativeDate,
  statusLabel,
} from '@/components/workspace/workspace-format'
import {
  useCurrentUserRole,
  useWorkspace,
  useWorkspaceProjectDetail,
  type Milestone,
  type ProjectSubItem,
  type SubItemStatus,
  type TimeEntry,
  type TimeSummary,
} from '@/features/workspace'
import type { WorkspaceEngagement, WorkspaceProject } from '@/features/workspace/types'
import type { WorkspaceProposal } from '@/features/workspace/home-types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { elapsedSeconds, formatElapsedSeconds } from '@/features/workspace/time-format'
import { buildSubItemReorderInput, sortSubItems, type ReorderColumns } from '@/features/workspace/subitem-order'
import { groupTimeEntries } from '@/features/workspace/time-log'
import { getMilestonePresentation } from '@/features/workspace/project-progress'

const SUBITEM_COLUMNS: Array<{
  status: SubItemStatus
  label: string
  panelClass: string
  headerClass: string
  dotClass: string
}> = [
  {
    status: 'open',
    label: 'Open',
    panelClass: 'border-[#b2ccff] bg-[#f5f8ff]',
    headerClass: 'bg-[#eaf2ff] text-[#155eef]',
    dotClass: 'bg-[#155eef]',
  },
  {
    status: 'in_progress',
    label: 'In progress',
    panelClass: 'border-[#fedf89] bg-[#fffcf5]',
    headerClass: 'bg-[#fff4cc] text-[#b54708]',
    dotClass: 'bg-[#b54708]',
  },
  {
    status: 'completed',
    label: 'Completed',
    panelClass: 'border-[#a6f4c5] bg-[#f3fdf7]',
    headerClass: 'bg-[#dcfae6] text-[#067647]',
    dotClass: 'bg-[#067647]',
  },
  {
    status: 'cancelled',
    label: 'Cancelled',
    panelClass: 'border-[#fecdca] bg-[#fff8f7]',
    headerClass: 'bg-[#fee4e2] text-[#b42318]',
    dotClass: 'bg-[#b42318]',
  },
]

export default function WorkspaceProjectsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const projectDetail = useWorkspaceProjectDetail()
  const [projects, setProjects] = useState<WorkspaceProject[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [proposals, setProposals] = useState<WorkspaceProposal[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [milestonesProjectId, setMilestonesProjectId] = useState<string | null>(null)
  const [showMilestoneCreate, setShowMilestoneCreate] = useState(false)
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    summary: '',
    dueAt: '',
  })
  const [subitems, setSubitems] = useState<ProjectSubItem[]>([])
  const [subitemsProjectId, setSubitemsProjectId] = useState<string | null>(null)
  const [showSubitemCreate, setShowSubitemCreate] = useState(false)
  const [subitemForm, setSubitemForm] = useState({
    title: '',
    description: '',
    milestoneId: '',
  })
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [timeEntriesProjectId, setTimeEntriesProjectId] = useState<string | null>(null)
  const [timeSummary, setTimeSummary] = useState<TimeSummary | null>(null)
  const [timerNote, setTimerNote] = useState('')
  const [timerSubitemId, setTimerSubitemId] = useState('')
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null)
  const [milestoneEditForm, setMilestoneEditForm] = useState({ title: '', summary: '', dueAt: '' })
  const [signedDocumentUrl, setSignedDocumentUrl] = useState<string | null>(null)
  const [documentLoading, setDocumentLoading] = useState(false)
  const [signedDocumentPreviewOpen, setSignedDocumentPreviewOpen] = useState(false)
  const [workBoardModalOpen, setWorkBoardModalOpen] = useState(false)
  const [timeLogModalOpen, setTimeLogModalOpen] = useState(false)
  const [draggedSubitemId, setDraggedSubitemId] = useState<string | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<{ status: SubItemStatus; index: number } | null>(null)
  const [clock, setClock] = useState(() => Date.now())
  const [form, setForm] = useState({
    engagementId: '',
    title: '',
    summary: '',
    scope: '',
    budget: '',
    estimatedDuration: '',
    milestones: [{ id: crypto.randomUUID(), title: '', summary: '', dueAt: '' }],
  })
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [projectEditForm, setProjectEditForm] = useState({
    title: '',
    summary: '',
    scope: '',
    budget: '',
    estimatedDuration: '',
  })

  useEffect(() => {
    return () => {
      if (signedDocumentUrl) URL.revokeObjectURL(signedDocumentUrl)
    }
  }, [signedDocumentUrl])

  useEffect(() => {
    if (!signedDocumentPreviewOpen && !workBoardModalOpen && !timeLogModalOpen) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setSignedDocumentPreviewOpen(false)
      setWorkBoardModalOpen(false)
      setTimeLogModalOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [signedDocumentPreviewOpen, timeLogModalOpen, workBoardModalOpen])

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadProjects() {
      setLoading(true)
      setError(null)
      try {
        const [projectResult, engagementResult, proposalResult] = await Promise.all([
          workspace.listProjects(),
          workspace.listEngagements(),
          workspace.listProposals(),
        ])
        if (cancelled) return
        if (projectResult.ok) {
          setProjects(projectResult.data.projects)
          setSelectedId((current) => current ?? projectResult.data.projects[0]?.id ?? null)
        } else {
          setError(projectResult)
        }
        if (engagementResult.ok) {
          setEngagements(engagementResult.data.engagements)
        } else {
          setError((current) => current ?? engagementResult)
        }
        if (proposalResult.ok) {
          setProposals(proposalResult.data.proposals)
        } else {
          setError((current) => current ?? proposalResult)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadProjects()
    return () => {
      cancelled = true
    }
  }, [state.isPending, state.user, workspace])

  useEffect(() => {
    if (state.isPending || !state.user || !selectedId) {
      return
    }
    const projectId = selectedId
    let cancelled = false

    async function loadProjectDetail() {
      const [milestoneResult, subitemResult, timeResult, summaryResult] = await Promise.all([
        projectDetail.listMilestones(projectId),
        projectDetail.listSubItems(projectId),
        projectDetail.listTimeEntries(projectId),
        projectDetail.summarizeTime(projectId),
      ])
      if (cancelled) return
      setMilestonesProjectId(projectId)
      setSubitemsProjectId(projectId)
      setTimeEntriesProjectId(projectId)
      if (milestoneResult.ok) {
        setMilestones(milestoneResult.data.milestones)
      } else {
        setMilestones([])
        setError((current) => current ?? milestoneResult)
      }
      if (subitemResult.ok) {
        setSubitems(sortSubItems(subitemResult.data.subitems))
      } else {
        setSubitems([])
        setError((current) => current ?? subitemResult)
      }
      if (timeResult.ok) {
        setTimeEntries(timeResult.data.entries)
      } else {
        setTimeEntries([])
        setError((current) => current ?? timeResult)
      }
      if (summaryResult.ok) {
        setTimeSummary(summaryResult.data)
      } else {
        setTimeSummary(null)
        setError((current) => current ?? summaryResult)
      }
    }

    void loadProjectDetail()
    return () => {
      cancelled = true
    }
  }, [projectDetail, selectedId, state.isPending, state.user])

  const acceptedEngagementIds = useMemo(
    () => new Set(proposals.filter((proposal) => proposal.status === 'accepted').map((proposal) => proposal.engagementId)),
    [proposals],
  )
  const eligibleEngagements = useMemo(
    () => state.role === 'expert'
      ? engagements.filter((engagement) => acceptedEngagementIds.has(engagement.id))
      : [],
    [acceptedEngagementIds, engagements, state.role],
  )
  const proposalCount = proposals.filter((proposal) => proposal.status === 'sent').length
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0] ?? null
  const visibleMilestones = selected && milestonesProjectId === selected.id ? milestones : []
  const visibleSubitems = useMemo(() => selected && subitemsProjectId === selected.id ? subitems : [], [selected, subitems, subitemsProjectId])
  const orderedVisibleSubitems = useMemo(() => sortSubItems(visibleSubitems), [visibleSubitems])
  const boardColumns = useMemo(() => ({
    open: orderedVisibleSubitems.filter((item) => item.status === 'open'),
    in_progress: orderedVisibleSubitems.filter((item) => item.status === 'in_progress'),
    completed: orderedVisibleSubitems.filter((item) => item.status === 'completed'),
    cancelled: orderedVisibleSubitems.filter((item) => item.status === 'cancelled'),
  }), [orderedVisibleSubitems])
  const visibleTimeEntries = useMemo(() => selected && timeEntriesProjectId === selected.id ? timeEntries : [], [selected, timeEntries, timeEntriesProjectId])
  const visibleTimeSummary = selected && timeEntriesProjectId === selected.id ? timeSummary : null
  const canCreateMilestone = Boolean(
    state.role === 'expert' && selected && ['draft', 'proposed', 'accepted'].includes(selected.status),
  )
  const canManageDelivery = selected?.status === 'accepted'
  const canManageTimer = Boolean(state.role === 'expert' && selected?.status === 'accepted')
  const canEditSelectedProject = Boolean(
    state.role === 'expert'
      && state.user
      && selected
      && selected.createdByUserId === state.user.id
      && (selected.status === 'draft' || selected.status === 'declined'),
  )
  const visibleActiveTimers = visibleTimeEntries.filter((entry) => !entry.endedAt)
  const activeTimer = visibleTimeEntries.find(
    (entry) => entry.userId === state.user?.id && !entry.endedAt,
  )
  const otherActiveTimers = visibleActiveTimers.filter(
    (entry) => entry.userId !== state.user?.id,
  )
  const hasActiveTimer = visibleActiveTimers.length > 0
  const selectedTimerSubitemId = visibleSubitems.some((item) => item.id === timerSubitemId)
    ? timerSubitemId
    : ''
  const groupedTimeEntries = groupTimeEntries(visibleTimeEntries, new Date(clock))

  useEffect(() => {
    if (!hasActiveTimer) return
    const interval = window.setInterval(() => setClock(Date.now()), 1_000)
    return () => window.clearInterval(interval)
  }, [hasActiveTimer])

  useEffect(() => {
    if (state.isPending || !state.user || !selectedId) return
    const projectId = selectedId
    let cancelled = false

    async function refreshTime() {
      const [timeResult, summaryResult] = await Promise.all([
        projectDetail.listTimeEntries(projectId),
        projectDetail.summarizeTime(projectId),
      ])
      if (cancelled) return
      if (timeResult.ok) {
        setTimeEntriesProjectId(projectId)
        setTimeEntries(timeResult.data.entries)
      } else {
        setError((current) => current ?? timeResult)
      }
      if (summaryResult.ok) {
        setTimeSummary(summaryResult.data)
      } else {
        setError((current) => current ?? summaryResult)
      }
    }

    const interval = window.setInterval(() => void refreshTime(), 15_000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [projectDetail, selectedId, state.isPending, state.user])

  const liveTimeTotalMinutes = visibleTimeEntries.reduce((total, entry) => {
    if (entry.durationMinutes != null) return total + entry.durationMinutes
    if (!entry.endedAt) {
      return total + Math.floor(elapsedSeconds(entry.startedAt, clock) / 60)
    }
    return total
  }, 0)

  function selectProject(projectId: string) {
    setSelectedId(projectId)
    setSignedDocumentUrl(null)
    setSignedDocumentPreviewOpen(false)
  }

  function beginProjectEdit(project: WorkspaceProject) {
    setEditingProjectId(project.id)
    setProjectEditForm({
      title: project.title,
      summary: project.summary,
      scope: project.scope,
      budget: project.budgetCents == null ? '' : String(project.budgetCents / 100),
      estimatedDuration: project.estimatedDuration ?? '',
    })
  }

  async function saveProjectChanges() {
    if (!editingProjectId) return
    const title = projectEditForm.title.trim()
    const summary = projectEditForm.summary.trim()
    const scope = projectEditForm.scope.trim()
    const budget = projectEditForm.budget ? Number(projectEditForm.budget) : Number.NaN
    if (!title || !summary || !scope || (projectEditForm.budget && !Number.isFinite(budget))) {
      setError({ ok: false, status: 400, error: { code: 'VALIDATION_ERROR', message: 'Complete the project title, summary, scope, and a valid budget.' } })
      return
    }
    setBusyId(`project-edit:${editingProjectId}`)
    const result = await workspace.updateProject(editingProjectId, {
      title,
      summary,
      scope,
      budgetCents: Number.isFinite(budget) ? Math.round(budget * 100) : null,
      estimatedDuration: projectEditForm.estimatedDuration.trim() || null,
    })
    if (result.ok) {
      setProjects((current) => current.map((project) => project.id === result.data.id ? result.data : project))
      setEditingProjectId(null)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    const summary = form.summary.trim()
    const scope = form.scope.trim()
    if (!form.engagementId || !title || !summary || !scope) {
      setError({ ok: false, status: 400, error: { code: 'VALIDATION_ERROR', message: 'Choose an accepted engagement and complete the project fields.' } })
      return
    }
    const budget = form.budget ? Number(form.budget) : Number.NaN
    const milestoneRows = form.milestones
      .map((milestone) => ({
        title: milestone.title.trim(),
        summary: milestone.summary.trim(),
        dueAt: milestone.dueAt ? new Date(milestone.dueAt).toISOString() : undefined,
      }))
    if (milestoneRows.some((milestone) => !milestone.title)) {
      setError({ ok: false, status: 400, error: { code: 'VALIDATION_ERROR', message: 'Complete or remove every milestone row before creating the project.' } })
      return
    }
    setBusyId('new')
    const result = await workspace.createProject({
      engagementId: form.engagementId,
      title,
      summary,
      scope,
      budgetCents: Number.isFinite(budget) ? Math.round(budget * 100) : null,
      estimatedDuration: form.estimatedDuration.trim() || null,
      milestones: milestoneRows.map((milestone) => ({
        title: milestone.title,
        summary: milestone.summary || null,
        dueAt: milestone.dueAt || null,
      })),
    })
    if (result.ok) {
      setProjects((current) => [result.data, ...current])
      selectProject(result.data.id)
      setForm({ engagementId: form.engagementId, title: '', summary: '', scope: '', budget: '', estimatedDuration: '', milestones: [{ title: '', summary: '', dueAt: '' }] })
      setShowCreate(false)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function submitProject(projectId: string) {
    setBusyId(projectId)
    const result = await workspace.submitProject(projectId)
    if (result.ok) setProjects((current) => current.map((project) => project.id === projectId ? result.data : project))
    else setError(result)
    setBusyId(null)
  }

  async function decideProject(projectId: string, decision: 'accept' | 'decline') {
    setBusyId(projectId)
    const result = await workspace.decideProject(projectId, decision)
    if (result.ok) setProjects((current) => current.map((project) => project.id === projectId ? result.data : project))
    else setError(result)
    setBusyId(null)
  }

  async function createMilestone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !canCreateMilestone) return
    const title = milestoneForm.title.trim()
    const summary = milestoneForm.summary.trim()
    if (!title) {
      setError({ ok: false, status: 400, error: { code: 'VALIDATION_ERROR', message: 'Enter a milestone title.' } })
      return
    }

    setBusyId('milestone:new')
    const result = await projectDetail.addMilestone(selected.id, {
      title,
      summary: summary || undefined,
      dueAt: milestoneForm.dueAt ? new Date(milestoneForm.dueAt).toISOString() : undefined,
    })
    if (result.ok) {
      setMilestones((current) => [...current, result.data])
      setMilestoneForm({ title: '', summary: '', dueAt: '' })
      setShowMilestoneCreate(false)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  function beginMilestoneEdit(milestone: Milestone) {
    setEditingMilestoneId(milestone.id)
    setMilestoneEditForm({
      title: milestone.title,
      summary: milestone.summary ?? '',
      dueAt: milestone.dueAt ? new Date(milestone.dueAt).toISOString().slice(0, 16) : '',
    })
  }

  async function updateMilestone(milestoneId: string) {
    const title = milestoneEditForm.title.trim()
    if (!title) {
      setError({ ok: false, status: 400, error: { code: 'VALIDATION_ERROR', message: 'Enter a milestone title.' } })
      return
    }
    setBusyId(`milestone-edit:${milestoneId}`)
    const result = await projectDetail.updateMilestone(milestoneId, {
      title,
      summary: milestoneEditForm.summary.trim() || null,
      dueAt: milestoneEditForm.dueAt ? new Date(milestoneEditForm.dueAt).toISOString() : null,
    })
    if (result.ok) {
      setMilestones((current) => current.map((milestone) => milestone.id === milestoneId ? result.data : milestone))
      setEditingMilestoneId(null)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function loadSignedDocument(projectId: string) {
    setDocumentLoading(true)
    setError(null)
    try {
      const result = await workspace.downloadProjectSignedContract(projectId)
      if (result.ok) {
        setSignedDocumentUrl((current) => {
          if (current) URL.revokeObjectURL(current)
          return URL.createObjectURL(result.data)
        })
      } else {
        setError(result)
      }
    } finally {
      setDocumentLoading(false)
    }
  }

  async function decideMilestone(milestoneId: string, decision: 'accept' | 'decline') {
    setBusyId(`milestone:${milestoneId}`)
    const result = await projectDetail.decideMilestone(milestoneId, { decision })
    if (result.ok) {
      setMilestones((current) => current.map((milestone) => milestone.id === milestoneId ? result.data : milestone))
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function createSubitem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !canManageDelivery) return
    const title = subitemForm.title.trim()
    const description = subitemForm.description.trim()
    if (!title) {
      setError({ ok: false, status: 400, error: { code: 'VALIDATION_ERROR', message: 'Enter a work item title.' } })
      return
    }

    setBusyId('subitem:new')
    const result = await projectDetail.addSubItem(selected.id, {
      title,
      description: description || undefined,
      milestoneId: subitemForm.milestoneId || undefined,
    })
    if (result.ok) {
      setSubitems((current) => [...current, result.data])
      setSubitemForm({ title: '', description: '', milestoneId: '' })
      setShowSubitemCreate(false)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function updateSubitemStatus(subitem: ProjectSubItem, status: 'in_progress' | 'completed') {
    setBusyId(`subitem:${subitem.id}`)
    const result = await projectDetail.updateSubItem(subitem.id, { status })
    if (result.ok) {
      setSubitems((current) => current.map((item) => item.id === subitem.id ? result.data : item))
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  function handleSubitemDragStart(event: DragEvent<HTMLDivElement>, subitemId: string) {
    if (!canManageDelivery) return
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', subitemId)
    setDraggedSubitemId(subitemId)
  }

  function handleSubitemDragOver(event: DragEvent<HTMLDivElement>, status: SubItemStatus, index: number) {
    if (!canManageDelivery || !draggedSubitemId) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverTarget({ status, index })
  }

  async function persistSubitemBoard(nextItems: ProjectSubItem[], previousItems: ProjectSubItem[]) {
    if (!selected || !canManageDelivery) return
    setSubitems(nextItems)
    setBusyId('subitems:reorder')
    const columns: ReorderColumns = { open: [], in_progress: [], completed: [], cancelled: [] }
    for (const item of nextItems) columns[item.status].push({ id: item.id, status: item.status })
    const result = await projectDetail.reorderSubItems(selected.id, buildSubItemReorderInput(columns))
    if (result.ok) {
      setSubitems(sortSubItems(result.data.subitems))
      setError(null)
    } else {
      setSubitems(previousItems)
      setError(result)
    }
    setBusyId(null)
  }

  async function handleSubitemDrop(event: DragEvent<HTMLDivElement>, status: SubItemStatus, index: number) {
    event.preventDefault()
    event.stopPropagation()
    const subitemId = event.dataTransfer.getData('text/plain') || draggedSubitemId
    setDraggedSubitemId(null)
    setDragOverTarget(null)
    if (!subitemId || !canManageDelivery) return

    const currentItems = SUBITEM_COLUMNS.flatMap((column) => boardColumns[column.status])
    const source = currentItems.find((item) => item.id === subitemId)
    if (!source) return
    const sourceIndex = boardColumns[source.status].findIndex((item) => item.id === source.id)
    const nextColumns: Record<SubItemStatus, ProjectSubItem[]> = {
      open: [...boardColumns.open],
      in_progress: [...boardColumns.in_progress],
      completed: [...boardColumns.completed],
      cancelled: [...boardColumns.cancelled],
    }
    nextColumns[source.status].splice(sourceIndex, 1)
    const insertionIndex = source.status === status && sourceIndex < index ? index - 1 : index
    nextColumns[status].splice(Math.max(0, Math.min(insertionIndex, nextColumns[status].length)), 0, { ...source, status })
    const nextItems = SUBITEM_COLUMNS.flatMap((column) => nextColumns[column.status])
    await persistSubitemBoard(nextItems, currentItems)
  }

  async function startProjectTimer() {
    if (!selected || !canManageTimer || activeTimer) return
    setBusyId('timer:start')
    const result = await projectDetail.startTimer({
      projectId: selected.id,
      subitemId: selectedTimerSubitemId || undefined,
      note: timerNote.trim() || undefined,
    })
    if (result.ok) {
      setTimeEntries((current) => [result.data, ...current])
      const summary = await projectDetail.summarizeTime(result.data.projectId)
      if (summary.ok) setTimeSummary(summary.data)
      setTimerNote('')
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function stopProjectTimer() {
    if (!activeTimer) return
    setBusyId(`timer:${activeTimer.id}`)
    const result = await projectDetail.stopTimer(activeTimer.id)
    if (result.ok) {
      setTimeEntries((current) => current.map((entry) => entry.id === result.data.id ? result.data : entry))
      const summary = await projectDetail.summarizeTime(result.data.projectId)
      if (summary.ok) setTimeSummary(summary.data)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/projects" />
  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <FolderClosed size={22} className="text-[#155eef]" />
              Projects
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-[8px]">
            <Link
              href="/workspace/proposals"
              className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              {proposalCount} proposals awaiting review
            </Link>
            {state.role === 'expert' && eligibleEngagements.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCreate((open) => !open)}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <FolderClosed size={16} /> {showCreate ? 'Close' : 'New project'}
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to refresh projects.'}
          </div>
        )}

        {showCreate && (
          <form onSubmit={createProject} className="border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
            <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-[12px] lg:grid-cols-[1fr_1fr_180px_180px]">
              <Field label="Confirmed engagement">
                <select value={form.engagementId} onChange={(event) => setForm((current) => ({ ...current, engagementId: event.target.value }))} className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px]">
                  <option value="">Select engagement</option>
                  {eligibleEngagements.map((engagement) => <option key={engagement.id} value={engagement.id}>{engagementTitle(engagement, state.role)}</option>)}
                </select>
              </Field>
              <Field label="Title">
                <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Website implementation" className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" />
              </Field>
              <Field label="Budget USD">
                <input type="number" min="0" step="100" value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))} placeholder="40000" className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" />
              </Field>
              <Field label="Duration">
                <input value={form.estimatedDuration} onChange={(event) => setForm((current) => ({ ...current, estimatedDuration: event.target.value }))} placeholder="6 weeks" className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" />
              </Field>
            </div>
            <div className="mx-auto mt-[12px] grid max-w-[1180px] grid-cols-1 gap-[12px] lg:grid-cols-2">
              <Field label="Summary">
                <textarea rows={2} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} placeholder="Outcome for this project" className="resize-y rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" />
              </Field>
              <Field label="Scope">
                <textarea rows={2} value={form.scope} onChange={(event) => setForm((current) => ({ ...current, scope: event.target.value }))} placeholder="Deliverables and acceptance criteria" className="resize-y rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" />
              </Field>
            </div>
            <div className="mx-auto mt-[16px] max-w-[1180px] rounded-[12px] border border-[#dbeafe] bg-[#f8fbff] p-[16px]">
              <div className="flex flex-wrap items-start justify-between gap-[10px]">
                <div>
                  <h3 className="text-[15px] font-semibold text-[#181d27]">Milestone breakdown</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, milestones: [...current.milestones, { id: crypto.randomUUID(), title: '', summary: '', dueAt: '' }] }))}
                  className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#bfd4ff] bg-white px-[10px] py-[7px] text-[12px] font-semibold text-[#155eef] ${BUTTON_SKEUO}`}
                >
                  <Plus size={14} /> Add milestone
                </button>
              </div>
              <div className="mt-[12px] flex flex-col gap-[10px]">
                {form.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="grid gap-[10px] rounded-[10px] border border-[#e4e7ec] bg-white p-[12px] md:grid-cols-[1fr_1fr_190px_auto]">
                    <input
                      value={milestone.title}
                      onChange={(event) => setForm((current) => ({ ...current, milestones: current.milestones.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) }))}
                      placeholder="Milestone title"
                      className="rounded-[8px] border border-[#d5d7da] px-[10px] py-[9px] text-[13px]"
                    />
                    <input
                      value={milestone.summary}
                      onChange={(event) => setForm((current) => ({ ...current, milestones: current.milestones.map((item, itemIndex) => itemIndex === index ? { ...item, summary: event.target.value } : item) }))}
                      placeholder="What will be delivered"
                      className="rounded-[8px] border border-[#d5d7da] px-[10px] py-[9px] text-[13px]"
                    />
	                    <input
	                      type="datetime-local"
	                      aria-label={`Milestone ${index + 1} due date`}
	                      value={milestone.dueAt}
                      onChange={(event) => setForm((current) => ({ ...current, milestones: current.milestones.map((item, itemIndex) => itemIndex === index ? { ...item, dueAt: event.target.value } : item) }))}
                      className="rounded-[8px] border border-[#d5d7da] px-[10px] py-[9px] text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, milestones: current.milestones.length === 1 ? [{ title: '', summary: '', dueAt: '' }] : current.milestones.filter((_, itemIndex) => itemIndex !== index) }))}
                      aria-label={`Remove milestone ${index + 1}`}
                      className={`inline-flex items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white px-[9px] py-[8px] text-[#b42318] ${BUTTON_SKEUO}`}
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-[12px] flex max-w-[1180px] justify-end">
              <button type="submit" disabled={busyId === 'new'} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                <FolderClosed size={17} /> {busyId === 'new' ? 'Creating…' : 'Create draft project'}
              </button>
            </div>
          </form>
        )}

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[360px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[16px] py-[14px]">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Shared projects</p>
              {loading && <RefreshCw size={16} className="shrink-0 animate-spin text-[#155eef]" />}
            </div>
            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {projects.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No projects yet. Create one from a confirmed engagement.
                </p>
              )}
              {projects.map((project) => {
                const active = project.id === selected?.id
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => selectProject(project.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                      {project.title}
                    </span>
                    <span className="mt-[2px] block line-clamp-2 text-[13px] leading-[18px] text-[#535862]">
                      {project.summary}
                    </span>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <ProjectStatusBadge status={project.status} />
                      <span className="text-[12px] leading-[18px] text-[#717680]">{relativeDate(project.updatedAt)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <div className="mx-auto flex max-w-[920px] flex-col gap-[16px]">
                <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-start justify-between gap-[16px] border-b border-[#e9eaeb] px-[32px] py-[28px]">
                    <div>
                      <ProjectStatusBadge status={selected.status} />
                      <h2 className="mt-[12px] text-[24px] font-semibold leading-[32px] text-[#181d27]">{selected.title}</h2>
                      <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">{selected.summary}</p>
                    </div>
                    {selected.status === 'accepted' && (
                      <Link
                        href="/workspace/messages"
                        className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
                      >
                        <MessageSquare size={16} />
                        Open messages
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-px border-b border-[#e9eaeb] bg-[#e9eaeb] sm:grid-cols-3">
                    <FactCell icon={<Wallet size={16} className="text-[#717680]" />} label="Budget">
                      {money(selected.budgetCents)}
                    </FactCell>
                    <FactCell icon={<CalendarDays size={16} className="text-[#717680]" />} label="Duration">
                      {selected.estimatedDuration || 'Not set'}
                    </FactCell>
                    <FactCell icon={<CheckCircle2 size={16} className="text-[#717680]" />} label="Accepted">
                      {longDate(selected.buyerAcceptedAt ?? selected.expertAcceptedAt)}
                    </FactCell>
                  </div>

                </article>

                <section className={`rounded-[16px] border border-[#dbeafe] bg-[#f8fbff] p-[16px] ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-center justify-between gap-[12px]">
                    <div>
                      <h3 className="flex items-center gap-[8px] text-[15px] font-semibold leading-[22px] text-[#181d27]"><FileText size={17} className="text-[#155eef]" /> Signed contract</h3>
                      <p className="mt-[3px] text-[13px] leading-[19px] text-[#535862]">The private signed contract for this engagement is available to both project parties.</p>
                    </div>
                    {signedDocumentUrl ? (
                      <button type="button" onClick={() => setSignedDocumentPreviewOpen(true)} className={`inline-flex items-center gap-[7px] rounded-[8px] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#155eef] ${BUTTON_SKEUO}`}>
                        <Eye size={15} /> Open signed document
                      </button>
                    ) : (
                      <button type="button" onClick={() => void loadSignedDocument(selected.id)} disabled={documentLoading} className={`inline-flex items-center gap-[7px] rounded-[8px] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#155eef] disabled:opacity-50 ${BUTTON_SKEUO}`}>
                        <Eye size={15} /> {documentLoading ? 'Loading…' : 'View signed document'}
                      </button>
                    )}
                  </div>
                </section>

                {selected.status !== 'accepted' && (
                  <div className={`flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] ${CARD_SHADOW}`}>
                    <p className="text-[13px] leading-[18px] text-[#535862]">
                      {selected.status === 'draft' ? 'The expert can submit this draft so the buyer can review it.' : selected.status === 'proposed' ? 'The buyer must approve this submitted project before delivery begins.' : selected.status === 'declined' ? 'The buyer declined this project. Revise the draft and resubmit it for review.' : 'This project is not currently active.'}
                    </p>
                    <div className="flex flex-wrap gap-[8px]">
                      {(selected.status === 'draft' || selected.status === 'declined') && state.role === 'expert' && selected.createdByUserId === state.user.id && (
                        <button type="button" onClick={() => void submitProject(selected.id)} disabled={busyId === selected.id} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                          <Send size={16} /> {selected.status === 'declined' ? 'Resubmit project' : 'Submit project'}
                        </button>
                      )}
                      {selected.status === 'proposed' && state.role === 'buyer' && (
                        <>
                          <button type="button" onClick={() => void decideProject(selected.id, 'decline')} disabled={busyId === selected.id} className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}>
                            <XCircle size={16} /> Decline
                          </button>
                          <button type="button" onClick={() => void decideProject(selected.id, 'accept')} disabled={busyId === selected.id} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                            <CheckCircle2 size={16} /> Accept
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {canEditSelectedProject ? (
                  <section className={`rounded-[16px] border border-[#dbeafe] bg-[#f8fbff] p-[20px] ${CARD_SHADOW}`}>
                    <div className="flex flex-wrap items-start justify-between gap-[10px]">
                      <div>
                        <h3 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">{selected.status === 'declined' ? 'Revise and resubmit project' : 'Edit project draft'}</h3>
                        <p className="mt-[3px] text-[13px] leading-[19px] text-[#535862]">Save your changes, then use the same {selected.status === 'declined' ? 'resubmit' : 'submit'} button above to send the project back to the buyer.</p>
                      </div>
                      <button type="button" onClick={() => beginProjectEdit(selected)} className={`inline-flex items-center gap-[7px] rounded-[8px] border border-[#b2ccff] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#155eef] ${BUTTON_SKEUO}`}>
                        <PenLine size={15} /> {editingProjectId === selected.id ? 'Editing' : 'Edit project'}
                      </button>
                    </div>
                    {editingProjectId === selected.id ? (
                      <div className="mt-[14px] grid gap-[12px] md:grid-cols-2">
                        <label className="flex flex-col gap-[6px] text-[12px] font-semibold text-[#414651]">Title<input value={projectEditForm.title} onChange={(event) => setProjectEditForm((current) => ({ ...current, title: event.target.value }))} className="rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] font-normal text-[#181d27]" /></label>
                        <label className="flex flex-col gap-[6px] text-[12px] font-semibold text-[#414651]">Budget USD<input type="number" min="0" step="100" value={projectEditForm.budget} onChange={(event) => setProjectEditForm((current) => ({ ...current, budget: event.target.value }))} className="rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] font-normal text-[#181d27]" /></label>
                        <label className="flex flex-col gap-[6px] text-[12px] font-semibold text-[#414651]">Duration<input value={projectEditForm.estimatedDuration} onChange={(event) => setProjectEditForm((current) => ({ ...current, estimatedDuration: event.target.value }))} className="rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] font-normal text-[#181d27]" /></label>
                        <label className="flex flex-col gap-[6px] text-[12px] font-semibold text-[#414651]">Summary<textarea rows={3} value={projectEditForm.summary} onChange={(event) => setProjectEditForm((current) => ({ ...current, summary: event.target.value }))} className="resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] font-normal text-[#181d27]" /></label>
                        <label className="flex flex-col gap-[6px] text-[12px] font-semibold text-[#414651] md:col-span-2">Scope<textarea rows={4} value={projectEditForm.scope} onChange={(event) => setProjectEditForm((current) => ({ ...current, scope: event.target.value }))} className="resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] font-normal text-[#181d27]" /></label>
                        <div className="flex justify-end gap-[8px] md:col-span-2"><button type="button" onClick={() => setEditingProjectId(null)} className={`rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>Cancel</button><button type="button" onClick={() => void saveProjectChanges()} disabled={busyId === `project-edit:${selected.id}`} className={`inline-flex items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}><Save size={15} /> {busyId === `project-edit:${selected.id}` ? 'Saving…' : 'Save changes'}</button></div>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                <section className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
                  <div className="flex items-center justify-between gap-[12px]">
                    <div>
                      <h3 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Progress</h3>
                    </div>
                    <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                      <span className="size-[6px] rounded-full bg-current" />
                      Active
                    </span>
                  </div>
                </section>

                <section className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-start justify-between gap-[12px]">
                    <div>
                      <h3 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Milestones</h3>
                    </div>
                    {canCreateMilestone && (
                      <button
                        type="button"
                        onClick={() => setShowMilestoneCreate((open) => !open)}
                        className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[12px] py-[9px] text-[13px] font-semibold text-white ${BUTTON_SKEUO}`}
                      >
                        <Plus size={16} /> {showMilestoneCreate ? 'Close' : 'New milestone'}
                      </button>
                    )}
                  </div>

                  {showMilestoneCreate && (
                    <form onSubmit={createMilestone} className="mt-[16px] grid gap-[10px] border-t border-[#e9eaeb] pt-[16px]">
                      <Field label="Milestone title">
                        <input
                          value={milestoneForm.title}
                          onChange={(event) => setMilestoneForm((current) => ({ ...current, title: event.target.value }))}
                          placeholder="Data migration complete"
                          className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]"
                        />
                      </Field>
                      <div className="grid gap-[10px] sm:grid-cols-[1fr_220px]">
                        <Field label="Summary">
                          <textarea
                            rows={2}
                            value={milestoneForm.summary}
                            onChange={(event) => setMilestoneForm((current) => ({ ...current, summary: event.target.value }))}
                            placeholder="What will be delivered"
                            className="resize-y rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]"
                          />
                        </Field>
                        <Field label="Due date">
                          <input
                            type="datetime-local"
                            value={milestoneForm.dueAt}
                            onChange={(event) => setMilestoneForm((current) => ({ ...current, dueAt: event.target.value }))}
                            className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]"
                          />
                        </Field>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={busyId === 'milestone:new'}
                          className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[13px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
                        >
                          <Plus size={16} /> {busyId === 'milestone:new' ? 'Creating…' : 'Create milestone'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-[16px] flex flex-col gap-[10px]">
                    {visibleMilestones.length === 0 && (
                      <p className="rounded-[10px] border border-dashed border-[#d5d7da] bg-white px-[12px] py-[16px] text-[13px] leading-[18px] text-[#717680]">
                        No milestones yet. Add the first deliverable for this project.
                      </p>
                    )}
                    {visibleMilestones.map((milestone, milestoneIndex) => {
                      const currentDecision = milestone.acceptances.find((acceptance) => acceptance.userId === state.user?.id)
                      const acceptedByBoth = milestone.status === 'in_progress' || Boolean(milestone.buyerAcceptedAt && milestone.expertAcceptedAt)
                      const canDecide = selected.status === 'accepted' && (state.role === 'buyer' || state.role === 'expert') && milestone.status === 'planned' && !currentDecision
                      const canEdit = (state.role === 'buyer' || state.role === 'expert') && milestone.status === 'planned' && ['draft', 'proposed', 'accepted'].includes(selected.status)
                      const presentation = getMilestonePresentation(milestone)
                      return (
                        <div key={milestone.id} className="relative flex gap-[12px]">
                          <div className="relative flex w-[28px] shrink-0 justify-center">
                            <span className={`relative z-[1] flex size-[28px] items-center justify-center rounded-full border-2 ${presentation.dotClass}`}>
                              {presentation.key === 'approved' ? <CheckCircle2 size={16} /> : presentation.key === 'in_review' ? <Clock3 size={16} /> : <span className="size-[10px] rounded-full border-2 border-current" />}
                            </span>
                            {milestoneIndex < visibleMilestones.length - 1 && <span className={`absolute left-1/2 top-[28px] h-[calc(100%+10px)] w-[2px] -translate-x-1/2 ${presentation.connectorClass}`} />}
                          </div>
                          <div className="min-w-0 flex-1 rounded-[12px] border border-[#e9eaeb] bg-white p-[14px]">
                            <div className="flex flex-wrap items-start justify-between gap-[10px]">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-[8px]">
                                  <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{milestone.title}</p>
                                  <span className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${presentation.badgeClass}`}>
                                    <span className="size-[6px] rounded-full bg-current" />
                                    {presentation.label}
                                  </span>
                                </div>
                                {milestone.summary && <p className="mt-[3px] text-[13px] leading-[18px] text-[#535862]">{milestone.summary}</p>}
                                {milestone.dueAt && <p className="mt-[6px] text-[12px] leading-[18px] text-[#717680]">Due {longDate(milestone.dueAt)}</p>}
                              </div>
                            </div>
                          {editingMilestoneId === milestone.id && canEdit && (
                            <div className="mt-[12px] grid gap-[10px] border-t border-[#f2f4f7] pt-[12px]">
                              <Field label="Milestone title">
                                <input
                                  value={milestoneEditForm.title}
                                  onChange={(event) => setMilestoneEditForm((current) => ({ ...current, title: event.target.value }))}
                                  className="rounded-[8px] border border-[#d5d7da] px-[10px] py-[8px] text-[13px]"
                                />
                              </Field>
                              <div className="grid gap-[10px] sm:grid-cols-[1fr_220px]">
                                <Field label="Summary">
                                  <textarea
                                    rows={2}
                                    value={milestoneEditForm.summary}
                                    onChange={(event) => setMilestoneEditForm((current) => ({ ...current, summary: event.target.value }))}
                                    className="resize-y rounded-[8px] border border-[#d5d7da] px-[10px] py-[8px] text-[13px]"
                                  />
                                </Field>
                                <Field label="Due date">
                                  <input
                                    type="datetime-local"
                                    value={milestoneEditForm.dueAt}
                                    onChange={(event) => setMilestoneEditForm((current) => ({ ...current, dueAt: event.target.value }))}
                                    className="rounded-[8px] border border-[#d5d7da] px-[10px] py-[8px] text-[13px]"
                                  />
                                </Field>
                              </div>
                              <div className="flex justify-end gap-[8px]">
                                <button type="button" onClick={() => setEditingMilestoneId(null)} className={`rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[12px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>Cancel</button>
                                <button type="button" onClick={() => void updateMilestone(milestone.id)} disabled={busyId === `milestone-edit:${milestone.id}`} className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[7px] text-[12px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                                  <Save size={14} /> {busyId === `milestone-edit:${milestone.id}` ? 'Saving…' : 'Save changes'}
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[10px] border-t border-[#f2f4f7] pt-[10px]">
                            <p className="text-[12px] leading-[18px] text-[#717680]">
                              {acceptedByBoth ? 'Both parties accepted this milestone.' : currentDecision?.decision === 'accepted' ? 'Your acceptance is recorded. Waiting for the other party.' : currentDecision?.decision === 'declined' ? 'You declined this milestone.' : selected.status !== 'accepted' ? 'Pending project approval. The buyer can edit this milestone before approval.' : 'Review the deliverable and record your decision.'}
                            </p>
                            <div className="flex flex-wrap gap-[8px]">
                              {canEdit && !editingMilestoneId && (
                                <button type="button" onClick={() => beginMilestoneEdit(milestone)} className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[12px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>
                                  <PenLine size={14} /> Edit milestone
                                </button>
                              )}
                              {canDecide && (
                                <div className="flex gap-[8px]">
                                <button type="button" onClick={() => void decideMilestone(milestone.id, 'decline')} disabled={busyId === `milestone:${milestone.id}`} className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[12px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}>
                                  <XCircle size={14} /> Decline
                                </button>
                                <button type="button" onClick={() => void decideMilestone(milestone.id, 'accept')} disabled={busyId === `milestone:${milestone.id}`} className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[7px] text-[12px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                                  <CheckCircle2 size={14} /> Accept
                                </button>
                                </div>
                              )}
                            </div>
                          </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                <section className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-start justify-between gap-[12px]">
                    <div>
                      <h3 className="flex items-center gap-[8px] text-[16px] font-semibold leading-[24px] text-[#181d27]"><ListChecks size={18} className="text-[#155eef]" /> Work board</h3>
                    </div>
                    <div className="flex flex-wrap gap-[8px]">
                      <button
                        type="button"
                        onClick={() => setWorkBoardModalOpen(true)}
                        className={`inline-flex items-center gap-[7px] rounded-[8px] border border-[#b2ccff] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#155eef] ${BUTTON_SKEUO}`}
                      >
                        <Maximize2 size={15} /> Full view
                      </button>
                      {canManageDelivery && (
                        <button
                          type="button"
                          onClick={() => setShowSubitemCreate((open) => !open)}
                          className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[12px] py-[9px] text-[13px] font-semibold text-white ${BUTTON_SKEUO}`}
                        >
                          <Plus size={16} /> {showSubitemCreate ? 'Close' : 'Add work item'}
                        </button>
                      )}
                    </div>
                  </div>

                  {!canManageDelivery && (
                    <p className="mt-[16px] rounded-[10px] bg-[#fffaeb] px-[12px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
                      The work board opens after both parties accept the project.
                    </p>
                  )}

                  {showSubitemCreate && canManageDelivery && (
                    <form onSubmit={createSubitem} className="mt-[16px] grid gap-[10px] border-t border-[#e9eaeb] pt-[16px]">
                      <div className="grid gap-[10px] sm:grid-cols-[1fr_220px]">
                        <Field label="Work item title">
                          <input
                            value={subitemForm.title}
                            onChange={(event) => setSubitemForm((current) => ({ ...current, title: event.target.value }))}
                            placeholder="Prepare client data mapping"
                            className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]"
                          />
                        </Field>
                        <Field label="Milestone (optional)">
                          <select
                            value={subitemForm.milestoneId}
                            onChange={(event) => setSubitemForm((current) => ({ ...current, milestoneId: event.target.value }))}
                            className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px]"
                          >
                            <option value="">No milestone</option>
                            {visibleMilestones.filter((milestone) => milestone.status !== 'cancelled').map((milestone) => (
                              <option key={milestone.id} value={milestone.id}>{milestone.title}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Description">
                        <textarea
                          rows={2}
                          value={subitemForm.description}
                          onChange={(event) => setSubitemForm((current) => ({ ...current, description: event.target.value }))}
                          placeholder="What needs to be done"
                          className="resize-y rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]"
                        />
                      </Field>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={busyId === 'subitem:new'}
                          className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[13px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
                        >
                          <Plus size={16} /> {busyId === 'subitem:new' ? 'Adding…' : 'Add work item'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-[16px] grid gap-[12px] lg:grid-cols-2 xl:grid-cols-4">
                    {SUBITEM_COLUMNS.map((column) => {
                      const items = boardColumns[column.status]
                      return (
                        <div
                          key={column.status}
                          className={`min-h-[180px] rounded-[12px] border p-[12px] transition-colors ${column.panelClass} ${dragOverTarget?.status === column.status && dragOverTarget.index === items.length ? 'ring-2 ring-[#84adff]' : ''}`}
                          onDragOver={(event) => handleSubitemDragOver(event, column.status, items.length)}
                          onDrop={(event) => void handleSubitemDrop(event, column.status, items.length)}
                        >
                          <div className={`flex items-center justify-between gap-[8px] rounded-[8px] px-[9px] py-[7px] ${column.headerClass}`}>
                            <p className="flex items-center gap-[7px] text-[13px] font-semibold leading-[20px]"><span className={`size-[7px] rounded-full ${column.dotClass}`} />{column.label}</p>
                            <span className="rounded-full bg-white/80 px-[8px] py-[2px] text-[12px] font-semibold">{items.length}</span>
                          </div>
                          <div className="mt-[10px] flex min-h-[100px] flex-col gap-[8px]">
                            {items.length === 0 && <p className="rounded-[8px] border border-dashed border-current/30 bg-white/60 px-[10px] py-[12px] text-[12px] leading-[18px] text-[#98a2b3]">Drop work items here</p>}
                            {items.map((item, itemIndex) => (
                              <div
                                key={item.id}
                                draggable={canManageDelivery}
                                onDragStart={(event) => handleSubitemDragStart(event, item.id)}
                                onDragEnd={() => { setDraggedSubitemId(null); setDragOverTarget(null) }}
                                onDragOver={(event) => handleSubitemDragOver(event, column.status, itemIndex)}
                                onDrop={(event) => void handleSubitemDrop(event, column.status, itemIndex)}
                                className={`cursor-grab rounded-[10px] border border-[#e9eaeb] bg-white p-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.05)] active:cursor-grabbing ${draggedSubitemId === item.id ? 'opacity-50' : ''} ${dragOverTarget?.status === column.status && dragOverTarget.index === itemIndex ? 'ring-2 ring-[#84adff]' : ''}`}
                              >
                                <div className="flex items-start gap-[7px]">
                                  <GripVertical size={15} className="mt-[1px] shrink-0 text-[#98a2b3]" aria-hidden="true" />
                                  <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold leading-[18px] text-[#181d27]">{item.title}</p>
                                {item.description && <p className="mt-[4px] line-clamp-2 text-[12px] leading-[18px] text-[#535862]">{item.description}</p>}
                                {item.milestoneId && (
                                  <p className="mt-[7px] truncate text-[11px] leading-[16px] text-[#717680]">
                                    {visibleMilestones.find((milestone) => milestone.id === item.milestoneId)?.title ?? 'Milestone linked'}
                                  </p>
                                )}
                                {canManageDelivery && (column.status === 'open' || column.status === 'in_progress') && (
                                  <button
                                    type="button"
                                    onClick={() => void updateSubitemStatus(item, column.status === 'open' ? 'in_progress' : 'completed')}
                                    disabled={busyId === `subitem:${item.id}`}
                                    className={`mt-[10px] inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[9px] py-[6px] text-[12px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}
                                  >
                                    {column.status === 'open' ? 'Start work' : 'Mark complete'}
                                  </button>
                                )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                <section className={`rounded-[16px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-start justify-between gap-[12px]">
                    <div>
                      <h3 className="flex items-center gap-[8px] text-[16px] font-semibold leading-[24px] text-[#181d27]"><Clock3 size={18} className="text-[#155eef]" /> Time tracking</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <button
                        type="button"
                        onClick={() => setTimeLogModalOpen(true)}
                        className={`inline-flex items-center gap-[7px] rounded-[8px] border border-[#b2ccff] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#155eef] ${BUTTON_SKEUO}`}
                      >
                        <Maximize2 size={15} /> Full view
                      </button>
                      <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                        <span className="size-[6px] rounded-full bg-current" />
                        {activeTimer ? 'You are tracking' : otherActiveTimers.length > 0 ? 'Other party is tracking' : 'No active timer'}
                      </span>
                    </div>
                  </div>

                  {state.role === 'expert' ? (
                    <div className="mt-[16px] flex flex-col gap-[10px] rounded-[12px] border border-[#d5d7da] bg-white p-[12px] sm:flex-row sm:items-end">
                      <Field label="What are you working on?">
                        <input
                          value={timerNote}
                          onChange={(event) => setTimerNote(event.target.value)}
                          placeholder="Client workshop and implementation"
                          disabled={!canManageTimer || Boolean(activeTimer)}
                          className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] disabled:bg-[#f2f4f7]"
                        />
                      </Field>
                      <Field label="Work item (optional)">
                        <select
                          value={selectedTimerSubitemId}
                          onChange={(event) => setTimerSubitemId(event.target.value)}
                          disabled={!canManageTimer || Boolean(activeTimer)}
                          className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] disabled:bg-[#f2f4f7]"
                        >
                          <option value="">General project work</option>
                          {visibleSubitems.filter((item) => item.status !== 'completed' && item.status !== 'cancelled').map((item) => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                          ))}
                        </select>
                      </Field>
                      <div className="flex shrink-0 items-center gap-[10px]">
                        {activeTimer && (
                          <span className="whitespace-nowrap text-[18px] font-bold tabular-nums leading-[24px] text-[#181d27]" aria-live="polite">
                            {formatElapsedSeconds(elapsedSeconds(activeTimer.startedAt, clock))}
                          </span>
                        )}
                        {activeTimer ? (
                          <button
                            type="button"
                            onClick={() => void stopProjectTimer()}
                            disabled={busyId === `timer:${activeTimer.id}`}
                            className={`inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[8px] bg-[#b42318] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
                          >
                            <Square size={15} /> {busyId === `timer:${activeTimer.id}` ? 'Stopping…' : 'Stop timer'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void startProjectTimer()}
                            disabled={!canManageTimer || busyId === 'timer:start'}
                            className={`inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
                          >
                            <Play size={15} /> {busyId === 'timer:start' ? 'Starting…' : 'Start timer'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-[16px] rounded-[12px] border border-[#d5d7da] bg-[#f8fafc] px-[12px] py-[12px] text-[13px] leading-[18px] text-[#535862]">
                      Time is logged by the expert and shared with you for this project.
                    </p>
                  )}

                  <div className="mt-[12px] grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                    <FactCell icon={<Clock3 size={16} className="text-[#717680]" />} label="Total tracked">
                      {formatMinutes(visibleTimeEntries.length ? liveTimeTotalMinutes : (visibleTimeSummary?.totalMinutes ?? 0))}
                    </FactCell>
                    <FactCell icon={<ListChecks size={16} className="text-[#717680]" />} label="Entries">
                      {visibleTimeSummary?.entryCount ?? visibleTimeEntries.length}
                    </FactCell>
                  </div>

                  <TimeEntryTable
                    entries={visibleTimeEntries}
                    subitems={visibleSubitems}
                    currentUserId={state.user?.id}
                    clock={clock}
                  />
                </section>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <FolderClosed size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No active project selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Confirmed engagements can create shared projects here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
        {workBoardModalOpen && selected ? (
          <WorkspaceFullViewDialog
            title="Work board"
            subtitle="Move work items between columns or reorder them. Changes are saved for both project parties."
            onClose={() => setWorkBoardModalOpen(false)}
          >
            <div className="flex flex-wrap items-center justify-between gap-[10px]">
              <p className="text-[13px] leading-[20px] text-[#535862]">
                {canManageDelivery ? 'Drag a card to change its position or advance its status.' : 'This board is shared with both parties.'}
              </p>
              {canManageDelivery && (
                <button
                  type="button"
                  onClick={() => { setWorkBoardModalOpen(false); setShowSubitemCreate(true) }}
                  className={`inline-flex items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold text-white ${BUTTON_SKEUO}`}
                >
                  <Plus size={15} /> Add work item
                </button>
              )}
            </div>
            <div className="mt-[18px] grid gap-[14px] lg:grid-cols-2 xl:grid-cols-4">
              {SUBITEM_COLUMNS.map((column) => {
                const items = boardColumns[column.status]
                return (
                  <div
                    key={column.status}
                    className={`min-h-[420px] rounded-[14px] border p-[14px] ${column.panelClass} ${dragOverTarget?.status === column.status && dragOverTarget.index === items.length ? 'ring-2 ring-[#84adff]' : ''}`}
                    onDragOver={(event) => handleSubitemDragOver(event, column.status, items.length)}
                    onDrop={(event) => void handleSubitemDrop(event, column.status, items.length)}
                  >
                    <div className={`flex items-center justify-between gap-[8px] rounded-[9px] px-[11px] py-[9px] ${column.headerClass}`}>
                      <p className="flex items-center gap-[8px] text-[14px] font-semibold"><span className={`size-[8px] rounded-full ${column.dotClass}`} />{column.label}</p>
                      <span className="rounded-full bg-white/80 px-[9px] py-[3px] text-[12px] font-semibold">{items.length}</span>
                    </div>
                    <div className="mt-[12px] flex min-h-[340px] flex-col gap-[10px]">
                      {items.length === 0 && <p className="rounded-[10px] border border-dashed border-current/30 bg-white/60 px-[12px] py-[16px] text-[13px] leading-[20px] text-[#98a2b3]">Drop work items here</p>}
                      {items.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          draggable={canManageDelivery}
                          onDragStart={(event) => handleSubitemDragStart(event, item.id)}
                          onDragEnd={() => { setDraggedSubitemId(null); setDragOverTarget(null) }}
                          onDragOver={(event) => handleSubitemDragOver(event, column.status, itemIndex)}
                          onDrop={(event) => void handleSubitemDrop(event, column.status, itemIndex)}
                          className={`cursor-grab rounded-[12px] border border-[#e4e7ec] bg-white p-[14px] shadow-[0_1px_3px_rgba(16,24,40,0.08)] active:cursor-grabbing ${draggedSubitemId === item.id ? 'opacity-50' : ''} ${dragOverTarget?.status === column.status && dragOverTarget.index === itemIndex ? 'ring-2 ring-[#84adff]' : ''}`}
                        >
                          <div className="flex items-start gap-[8px]">
                            <GripVertical size={16} className="mt-[2px] shrink-0 text-[#98a2b3]" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{item.title}</p>
                              {item.description && <p className="mt-[5px] text-[13px] leading-[19px] text-[#535862]">{item.description}</p>}
                              {item.milestoneId && <p className="mt-[8px] truncate text-[12px] leading-[18px] text-[#717680]">{visibleMilestones.find((milestone) => milestone.id === item.milestoneId)?.title ?? 'Milestone linked'}</p>}
                              {canManageDelivery && (column.status === 'open' || column.status === 'in_progress') && (
                                <button
                                  type="button"
                                  onClick={() => void updateSubitemStatus(item, column.status === 'open' ? 'in_progress' : 'completed')}
                                  disabled={busyId === `subitem:${item.id}` || busyId === 'subitems:reorder'}
                                  className={`mt-[12px] inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[12px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}
                                >
                                  {column.status === 'open' ? 'Start work' : 'Mark complete'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </WorkspaceFullViewDialog>
        ) : null}
        {timeLogModalOpen && selected ? (
          <WorkspaceFullViewDialog
            title="Time tracking"
            subtitle="Authoritative work logs are stored by the service APIs and shared only with this project’s buyer and expert."
            onClose={() => setTimeLogModalOpen(false)}
          >
            <div className="grid gap-[12px] sm:grid-cols-3">
              <FactCell icon={<Clock3 size={16} className="text-[#717680]" />} label="Total tracked">
                {formatMinutes(visibleTimeEntries.length ? liveTimeTotalMinutes : (visibleTimeSummary?.totalMinutes ?? 0))}
              </FactCell>
              <FactCell icon={<ListChecks size={16} className="text-[#717680]" />} label="Entries">
                {visibleTimeSummary?.entryCount ?? visibleTimeEntries.length}
              </FactCell>
            </div>

            {state.role === 'expert' ? (
              <div className="mt-[16px] flex flex-col gap-[10px] rounded-[12px] border border-[#d5d7da] bg-[#f8fafc] p-[14px] sm:flex-row sm:items-end">
                <Field label="What are you working on?">
                  <input
                    value={timerNote}
                    onChange={(event) => setTimerNote(event.target.value)}
                    placeholder="Client workshop and implementation"
                    disabled={!canManageTimer || Boolean(activeTimer)}
                    className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] disabled:bg-[#f2f4f7]"
                  />
                </Field>
                <Field label="Work item (optional)">
                  <select
                    value={selectedTimerSubitemId}
                    onChange={(event) => setTimerSubitemId(event.target.value)}
                    disabled={!canManageTimer || Boolean(activeTimer)}
                    className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] disabled:bg-[#f2f4f7]"
                  >
                    <option value="">General project work</option>
                    {visibleSubitems.filter((item) => item.status !== 'completed' && item.status !== 'cancelled').map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                  </select>
                </Field>
                <div className="flex shrink-0 items-center gap-[10px]">
                  {activeTimer && <span className="whitespace-nowrap text-[20px] font-bold tabular-nums text-[#181d27]" aria-live="polite">{formatElapsedSeconds(elapsedSeconds(activeTimer.startedAt, clock))}</span>}
                  {activeTimer ? (
                    <button type="button" onClick={() => void stopProjectTimer()} disabled={busyId === `timer:${activeTimer.id}`} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#b42318] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                      <Square size={15} /> {busyId === `timer:${activeTimer.id}` ? 'Stopping…' : 'Stop timer'}
                    </button>
                  ) : (
                    <button type="button" onClick={() => void startProjectTimer()} disabled={!canManageTimer || busyId === 'timer:start'} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                      <Play size={15} /> {busyId === 'timer:start' ? 'Starting…' : 'Start timer'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-[16px] rounded-[12px] border border-[#d5d7da] bg-[#f8fafc] px-[14px] py-[12px] text-[13px] leading-[20px] text-[#535862]">Time is logged by the expert and shared with you for this project.</p>
            )}

            <div className="mt-[18px] flex flex-col gap-[18px]">
              {groupedTimeEntries.length === 0 && <p className="rounded-[10px] border border-dashed border-[#d5d7da] px-[14px] py-[24px] text-center text-[13px] text-[#717680]">No time entries yet.</p>}
              {groupedTimeEntries.map((period) => (
                <section key={period.key}>
                  <div className="flex items-center justify-between border-b border-[#d5d7da] bg-[#eef4f8] px-[14px] py-[10px]">
                    <p className="text-[14px] font-semibold text-[#344054]">{period.label}</p>
                    <p className="text-[13px] font-semibold text-[#344054]">Total: {formatMinutes(Math.floor(period.totalSeconds / 60))}</p>
                  </div>
                  <div className="flex flex-col gap-[10px] pt-[10px]">
                    {period.days.map((day) => (
                      <div key={day.key} className="overflow-hidden rounded-[10px] border border-[#e4e7ec]">
                        <div className="flex items-center justify-between bg-[#f8fafc] px-[14px] py-[9px]">
                          <p className="text-[13px] font-semibold text-[#535862]">{day.label}</p>
                          <p className="text-[12px] font-semibold text-[#717680]">Total: {formatMinutes(Math.floor(day.totalSeconds / 60))}</p>
                        </div>
                        <TimeEntryTable
                          entries={day.entries}
                          subitems={visibleSubitems}
                          currentUserId={state.user?.id}
                          clock={clock}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </WorkspaceFullViewDialog>
        ) : null}
        {signedDocumentUrl && signedDocumentPreviewOpen ? (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#101828]/70 p-[16px] sm:p-[28px]"
            role="dialog"
            aria-modal="true"
            aria-label="Signed contract preview"
            onClick={() => setSignedDocumentPreviewOpen(false)}
          >
            <div className="flex h-[min(90vh,900px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-[12px] border-b border-[#e4e7ec] px-[16px] py-[12px] sm:px-[20px]">
                <div>
                  <p className="text-[14px] font-semibold text-[#181d27]">Signed contract preview</p>
                  <p className="mt-[2px] text-[12px] text-[#717680]">Available only to the parties on this engagement.</p>
                </div>
                <button type="button" onClick={() => setSignedDocumentPreviewOpen(false)} className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>
                  <XCircle size={16} /> Close
                </button>
              </div>
              <div className="min-h-0 flex-1 bg-[#f2f4f7] p-[8px] sm:p-[16px]">
                <iframe src={signedDocumentUrl} title="Signed contract document" className="h-full w-full rounded-[8px] border border-[#d5d7da] bg-white" />
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </WorkspaceShell>
  )
}

function ProjectStatusBadge({ status }: { status: WorkspaceProject['status'] }) {
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${projectStatusClass(status)}`}>
      <span className="size-[6px] rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  )
}

function FactCell({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="bg-white px-[32px] py-[20px]">
      <p className="flex items-center gap-[6px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        {icon} {label}
      </p>
      <p className="mt-[6px] text-[16px] font-semibold leading-[24px] text-[#181d27]">{children}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-[6px]">
      <span className="text-[13px] font-semibold leading-[18px] text-[#414651]">{label}</span>
      {children}
    </label>
  )
}

function WorkspaceFullViewDialog({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string
  subtitle: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#101828]/70 p-[12px] sm:p-[24px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="flex h-[min(94vh,980px)] w-full max-w-[1440px] flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-wrap items-start justify-between gap-[12px] border-b border-[#e4e7ec] px-[18px] py-[15px] sm:px-[24px]">
          <div>
            <h2 className="text-[18px] font-semibold leading-[26px] text-[#181d27]">{title}</h2>
            <p className="mt-[3px] text-[13px] leading-[19px] text-[#535862]">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>
            <XCircle size={16} /> Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] p-[14px] sm:p-[24px]">{children}</div>
      </div>
    </div>
  )
}

function TimeEntryTable({
  entries,
  subitems,
  currentUserId,
  clock,
}: {
  entries: TimeEntry[]
  subitems: ProjectSubItem[]
  currentUserId?: string
  clock: number
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-[10px] border border-dashed border-[#d5d7da] bg-white px-[12px] py-[20px] text-center text-[13px] leading-[18px] text-[#717680]">
        No time entries yet. Start the first timer when work begins.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[10px] border border-[#e4e7ec] bg-white">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead className="bg-[#f8fafc]">
          <tr className="border-b border-[#e4e7ec]">
            {['Date', 'Description', 'Duration', 'Billable'].map((label) => (
              <th key={label} className="px-[14px] py-[10px] text-[11px] font-medium uppercase tracking-[0.04em] text-[#717680]">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f2f4f7]">
          {entries.map((entry) => {
            const linkedSubitem = subitems.find((item) => item.id === entry.subitemId)
            const duration = entry.endedAt
              ? formatMinutes(entry.durationMinutes ?? 0)
              : `${formatElapsedSeconds(elapsedSeconds(entry.startedAt, clock))} running`
            return (
              <tr key={entry.id}>
                <td className="whitespace-nowrap px-[14px] py-[12px] text-[13px] text-[#535862]">
                  {longDate(entry.startedAt)}
                </td>
                <td className="min-w-[260px] px-[14px] py-[12px]">
                  <p className="truncate text-[13px] font-semibold leading-[19px] text-[#181d27]">
                    {entry.note || linkedSubitem?.title || 'Project work'}
                  </p>
                  <p className="mt-[2px] truncate text-[12px] leading-[18px] text-[#717680]">
                    {linkedSubitem?.title || 'General project work'} · {entry.userId === currentUserId ? 'You' : 'Other party'}
                  </p>
                </td>
                <td className="whitespace-nowrap px-[14px] py-[12px] text-[14px] font-bold tabular-nums text-[#181d27]">
                  {duration}
                </td>
                <td className="px-[14px] py-[12px]">
                  <span className={`inline-flex items-center gap-[6px] rounded-full px-[9px] py-[3px] text-[12px] font-medium ${entry.endedAt ? 'bg-[#ecfdf3] text-[#067647]' : 'bg-[#fffaeb] text-[#b54708]'}`}>
                    <span className="size-[6px] rounded-full bg-current" />
                    Billable
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}
