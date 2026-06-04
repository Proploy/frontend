'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Client,
  ClientsState,
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  KanbanTask,
  Project,
  ProjectStatus,
  TaskColumn,
  TimeEntry,
} from '@/hooks/types/clients-contracts'
import { PLATFORM_FEE_PCT, seedClientsState } from './clients-mock'

const STORAGE_KEY = 'proploy.clients.v2'

const uid = (p = 'id') =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${p}-${crypto.randomUUID().slice(0, 8)}`
    : `${p}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`

type ClientsContextValue = {
  clients: Client[]
  projects: Project[]
  getClient: (id: string) => Client | undefined
  getProject: (id: string) => Project | undefined
  projectsForClient: (clientId: string) => Project[]
  // clients
  addClient: (partial?: Partial<Client>) => Client
  updateClient: (id: string, patch: Partial<Client>) => void
  // projects
  addProject: (clientId: string, partial?: Partial<Project>) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  setProjectStatus: (id: string, status: ProjectStatus) => void
  // tasks
  addTask: (projectId: string, column: TaskColumn, title: string) => void
  updateTask: (projectId: string, taskId: string, patch: Partial<KanbanTask>) => void
  moveTask: (projectId: string, taskId: string, column: TaskColumn) => void
  deleteTask: (projectId: string, taskId: string) => void
  // time
  startTimer: (projectId: string, description: string, rateCents: number) => void
  stopTimer: (projectId: string) => void
  addManualEntry: (projectId: string, entry: Omit<TimeEntry, 'id'>) => void
  updateEntry: (projectId: string, entryId: string, patch: Partial<TimeEntry>) => void
  deleteEntry: (projectId: string, entryId: string) => void
  runningEntry: (projectId: string) => TimeEntry | undefined
  // invoice
  createInvoiceFromProject: (projectId: string) => void
  setInvoiceStatus: (projectId: string, status: InvoiceStatus) => void
}

const ClientsContext = createContext<ClientsContextValue | null>(null)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClientsState>(seedClientsState)
  const hydrated = useRef(false)

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw) as ClientsState)
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const patchProject = (id: string, fn: (p: Project) => Project) =>
    setState((s) => ({ ...s, projects: s.projects.map((p) => (p.id === id ? fn(p) : p)) }))

  const value = useMemo<ClientsContextValue>(() => {
    return {
      clients: state.clients,
      projects: state.projects,
      getClient: (id) => state.clients.find((c) => c.id === id),
      getProject: (id) => state.projects.find((p) => p.id === id),
      projectsForClient: (clientId) => state.projects.filter((p) => p.clientId === clientId),

      addClient: (partial) => {
        const c: Client = {
          id: uid('c'), name: 'New client', domain: '', brand: '#155eef', status: 'Prospect',
          contactName: '', contactEmail: '', owner: 'You', industry: '',
          createdAt: new Date().toISOString().slice(0, 10), ...partial,
        }
        setState((s) => ({ ...s, clients: [c, ...s.clients] }))
        return c
      },
      updateClient: (id, patch) =>
        setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      addProject: (clientId, partial) => {
        const today = new Date().toISOString().slice(0, 10)
        const p: Project = {
          id: uid('p'), clientId, name: 'New project', summary: '', status: 'Not started',
          startDate: today, dueDate: today, tasks: [], timeEntries: [], invoice: null, ...partial,
        }
        setState((s) => ({ ...s, projects: [p, ...s.projects] }))
        return p
      },
      updateProject: (id, patch) => patchProject(id, (p) => ({ ...p, ...patch })),
      setProjectStatus: (id, status) => patchProject(id, (p) => ({ ...p, status })),

      addTask: (projectId, column, title) =>
        patchProject(projectId, (p) => ({
          ...p,
          tasks: [...p.tasks, { id: uid('t'), title, column, order: p.tasks.length }],
        })),
      updateTask: (projectId, taskId, patch) =>
        patchProject(projectId, (p) => ({
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
        })),
      moveTask: (projectId, taskId, column) =>
        patchProject(projectId, (p) => ({
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, column } : t)),
        })),
      deleteTask: (projectId, taskId) =>
        patchProject(projectId, (p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== taskId) })),

      startTimer: (projectId, description, rateCents) =>
        patchProject(projectId, (p) => {
          // stop any existing running entry first
          const stopped = p.timeEntries.map((e) =>
            e.runningStartedAt ? finalizeRunning(e) : e,
          )
          const entry: TimeEntry = {
            id: uid('e'), date: new Date().toISOString().slice(0, 10), minutes: 0,
            description: description || 'Tracked time', billable: true, rateCents,
            runningStartedAt: Date.now(),
          }
          return { ...p, timeEntries: [...stopped, entry] }
        }),
      stopTimer: (projectId) =>
        patchProject(projectId, (p) => ({
          ...p,
          timeEntries: p.timeEntries.map((e) => (e.runningStartedAt ? finalizeRunning(e) : e)),
        })),
      addManualEntry: (projectId, entry) =>
        patchProject(projectId, (p) => ({
          ...p,
          timeEntries: [...p.timeEntries, { ...entry, id: uid('e'), runningStartedAt: null }],
        })),
      updateEntry: (projectId, entryId, patch) =>
        patchProject(projectId, (p) => ({
          ...p,
          timeEntries: p.timeEntries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
        })),
      deleteEntry: (projectId, entryId) =>
        patchProject(projectId, (p) => ({
          ...p,
          timeEntries: p.timeEntries.filter((e) => e.id !== entryId),
        })),
      runningEntry: (projectId) =>
        state.projects.find((p) => p.id === projectId)?.timeEntries.find((e) => e.runningStartedAt),

      createInvoiceFromProject: (projectId) =>
        patchProject(projectId, (p) => ({ ...p, invoice: buildInvoice(p) })),
      setInvoiceStatus: (projectId, status) =>
        patchProject(projectId, (p) => (p.invoice ? { ...p, invoice: { ...p.invoice, status } } : p)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
}

export function useClients(): ClientsContextValue {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within ClientsProvider')
  return ctx
}

/* ---------------- helpers ---------------- */

function finalizeRunning(e: TimeEntry): TimeEntry {
  const elapsedMin = e.runningStartedAt ? Math.round((Date.now() - e.runningStartedAt) / 60000) : 0
  return { ...e, minutes: e.minutes + elapsedMin, runningStartedAt: null }
}

/** Build an invoice from a project's billable time entries, grouped by rate + description. */
export function buildInvoice(p: Project): Invoice {
  const billable = p.timeEntries.filter((e) => e.billable && !e.runningStartedAt && e.minutes > 0)
  const groups = new Map<string, InvoiceLineItem>()
  for (const e of billable) {
    const key = `${e.description}|${e.rateCents}`
    const hours = e.minutes / 60
    const existing = groups.get(key)
    if (existing) {
      existing.hours += hours
      existing.amountCents = Math.round(existing.hours * existing.rateCents)
    } else {
      groups.set(key, {
        id: key,
        description: e.description,
        hours,
        rateCents: e.rateCents,
        amountCents: Math.round(hours * e.rateCents),
      })
    }
  }
  const lineItems = [...groups.values()].map((li) => ({ ...li, hours: round2(li.hours) }))
  const subtotalCents = lineItems.reduce((s, li) => s + li.amountCents, 0)
  const feeCents = Math.round((subtotalCents * PLATFORM_FEE_PCT) / 100)
  const today = new Date()
  const due = new Date(today.getTime() + 14 * 86400000)
  return {
    id: uid('inv'),
    number: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`,
    issuedDate: today.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
    status: 'draft',
    lineItems,
    subtotalCents,
    feePct: PLATFORM_FEE_PCT,
    feeCents,
    totalCents: subtotalCents - feeCents,
    notes: `Project: ${p.name}`,
  }
}

const round2 = (n: number) => Math.round(n * 100) / 100
