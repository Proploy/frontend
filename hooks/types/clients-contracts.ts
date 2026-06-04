// Data contracts for the expert Clients workspace (project management + time
// tracking + invoicing). UI-first mock model; shaped to later map onto
// service-apis responses.

export type ClientStatus = 'Active' | 'Prospect' | 'On hold' | 'Completed'

export type ProjectStatus =
  | 'Not started'
  | 'Active'
  | 'Review'
  | 'Completed'
  | 'Paused'

export const PROJECT_STATUSES: ProjectStatus[] = [
  'Not started',
  'Active',
  'Review',
  'Completed',
  'Paused',
]

export type TaskColumn = 'todo' | 'in_progress' | 'review' | 'done'

export const TASK_COLUMNS: { id: TaskColumn; label: string; color: string }[] = [
  { id: 'todo', label: 'To do', color: '#717680' },
  { id: 'in_progress', label: 'In progress', color: '#155eef' },
  { id: 'review', label: 'Review', color: '#f79009' },
  { id: 'done', label: 'Done', color: '#17b26a' },
]

export type KanbanTask = {
  id: string
  title: string
  column: TaskColumn
  assignee?: string
  estimateHours?: number
  order: number
}

export type TimeEntry = {
  id: string
  date: string // ISO YYYY-MM-DD
  minutes: number
  description: string
  billable: boolean
  rateCents: number // hourly rate in cents
  // when set, this entry is a live-running timer (started at epoch ms)
  runningStartedAt?: number | null
}

export type InvoiceLineItem = {
  id: string
  description: string
  hours: number
  rateCents: number
  amountCents: number
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid'

export type Invoice = {
  id: string
  number: string
  issuedDate: string
  dueDate: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  subtotalCents: number
  feePct: number // platform take-rate
  feeCents: number
  totalCents: number
  notes?: string
}

export type Project = {
  id: string
  clientId: string
  name: string
  summary: string
  status: ProjectStatus
  startDate: string
  dueDate: string
  tasks: KanbanTask[]
  timeEntries: TimeEntry[]
  invoice?: Invoice | null
}

export type Client = {
  id: string
  name: string
  domain: string
  brand: string // avatar bg color
  status: ClientStatus
  contactName: string
  contactEmail: string
  owner: string
  industry: string
  createdAt: string // ISO
}

export type ClientsState = {
  clients: Client[]
  projects: Project[]
}
