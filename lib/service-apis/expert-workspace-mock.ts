// Workspace-overview fixture for the expert dashboard home. UI-first, mock-driven
// (mirrors the marketing pages' feature set) and shaped to map onto a future
// `/api/v1/experts/me/workspace` response. Money is stored in cents.

export type WorkspaceProjectStatus = 'On track' | 'At risk' | 'Blocked' | 'Review' | 'Launched'

export interface WorkspaceProject {
  id: string
  name: string
  client: string
  status: WorkspaceProjectStatus
  progress: number // 0-100
  nextMilestone: string
  dueDate: string // ISO YYYY-MM-DD
}

export interface WorkspaceEarnings {
  thisMonthCents: number
  lastMonthCents: number
  inEscrowCents: number
  pendingPayoutCents: number
  nextPayoutCents: number
  nextPayoutDate: string // ISO YYYY-MM-DD
}

export interface WorkspacePipeline {
  newLeads: number
  awaitingResponse: number
  proposalsOut: number
  winRatePct: number
}

export interface WorkspaceProfileItem {
  label: string
  done: boolean
}

export interface WorkspaceUpcoming {
  id: string
  kind: 'call' | 'deadline' | 'invoice'
  title: string
  when: string // human label, e.g. "Tomorrow · 10:00 AEST"
  meta: string
}

export interface WorkspaceMessage {
  id: string
  from: string
  preview: string
  when: string
  unread: boolean
  brand: string // avatar bg
}

export interface ExpertWorkspaceSummary {
  earnings: WorkspaceEarnings
  projects: WorkspaceProject[]
  pipeline: WorkspacePipeline
  profileCompleteness: { percent: number; items: WorkspaceProfileItem[] }
  upcoming: WorkspaceUpcoming[]
  messages: WorkspaceMessage[]
}

export const MOCK_EXPERT_WORKSPACE: ExpertWorkspaceSummary = {
  earnings: {
    thisMonthCents: 1_842_000,
    lastMonthCents: 1_560_000,
    inEscrowCents: 2_400_000,
    pendingPayoutCents: 680_000,
    nextPayoutCents: 680_000,
    nextPayoutDate: '2026-06-23',
  },
  projects: [
    {
      id: 'wp1',
      name: 'CRM migration — fintech scale-up',
      client: 'Northwind Capital',
      status: 'On track',
      progress: 72,
      nextMilestone: 'UAT sign-off',
      dueDate: '2026-06-27',
    },
    {
      id: 'wp2',
      name: 'HubSpot → Salesforce consolidation',
      client: 'Lumen Health',
      status: 'At risk',
      progress: 44,
      nextMilestone: 'Data mapping review',
      dueDate: '2026-06-21',
    },
    {
      id: 'wp3',
      name: 'Lead-routing & forecasting build',
      client: 'Atlas Logistics',
      status: 'Review',
      progress: 90,
      nextMilestone: 'Go-live checklist',
      dueDate: '2026-06-25',
    },
  ],
  pipeline: {
    newLeads: 5,
    awaitingResponse: 3,
    proposalsOut: 4,
    winRatePct: 38,
  },
  profileCompleteness: {
    percent: 70,
    items: [
      { label: 'Headline & bio', done: true },
      { label: 'Expertise tags', done: true },
      { label: 'Portfolio projects', done: true },
      { label: 'Profile photo', done: false },
      { label: 'Intro video', done: false },
      { label: 'Scheduling link', done: false },
    ],
  },
  upcoming: [
    { id: 'u1', kind: 'call', title: 'Discovery call — Atlas Logistics', when: 'Tomorrow · 10:00 AEST', meta: 'Video · 30 min' },
    { id: 'u2', kind: 'deadline', title: 'UAT sign-off — Northwind Capital', when: 'Sat 27 Jun', meta: 'Milestone due' },
    { id: 'u3', kind: 'invoice', title: 'Invoice #2041 — Lumen Health', when: 'Due Mon 23 Jun', meta: '$6,800 · awaiting payment' },
  ],
  messages: [
    { id: 'm1', from: 'Priya Nair', preview: 'Can we move the UAT session to Friday morning?', when: '12m', unread: true, brand: '#155eef' },
    { id: 'm2', from: 'Tom Albrecht', preview: 'Shared the updated field-mapping sheet — looks good to me.', when: '1h', unread: true, brand: '#7f56d9' },
    { id: 'm3', from: 'Sofia Reyes', preview: 'Thanks for the go-live plan, the team is aligned.', when: 'Yesterday', unread: false, brand: '#dd2590' },
  ],
}
