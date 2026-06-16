import type {
  Client,
  ClientsState,
  Invoice,
  KanbanTask,
  Project,
  TimeEntry,
} from '@/hooks/types/clients-contracts'

export const PLATFORM_FEE_PCT = 10

const PALETTE = ['#6366f1', '#0ea5e9', '#22c55e', '#7a5af8', '#f97316', '#ec4899', '#14b8a6']
export const AVATAR_PALETTE = ['#f97316', '#a855f7', '#ec4899', '#0ea5e9', '#10b981', '#6366f1', '#ef4444', '#14b8a6']
export const colorFor = (s: string) =>
  AVATAR_PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length]
export const initials = (n: string) =>
  n.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase()

function tasks(prefix: string, spec: [string, KanbanTask['column'], number][]): KanbanTask[] {
  return spec.map(([title, column, est], i) => ({
    id: `${prefix}-t${i + 1}`,
    title,
    column,
    estimateHours: est,
    assignee: ['Maya Chen', 'Owen Park', 'Priya Nair'][i % 3],
    order: i,
  }))
}

const FEE_PCT = 10
function invoiceFor(
  prefix: string,
  number: string,
  issuedDate: string,
  status: Invoice['status'],
  projectName: string,
  lines: [string, number, number][], // [description, hours, rateCents]
): Invoice {
  const lineItems = lines.map(([description, hours, rateCents], i) => ({
    id: `${prefix}-li${i + 1}`,
    description,
    hours,
    rateCents,
    amountCents: Math.round(hours * rateCents),
  }))
  const subtotalCents = lineItems.reduce((s, li) => s + li.amountCents, 0)
  const feeCents = Math.round((subtotalCents * FEE_PCT) / 100)
  const due = new Date(new Date(issuedDate + 'T00:00:00').getTime() + 14 * 86400000).toISOString().slice(0, 10)
  return {
    id: `${prefix}-inv`, number, issuedDate, dueDate: due, status,
    lineItems, subtotalCents, feePct: FEE_PCT, feeCents, totalCents: subtotalCents - feeCents,
    notes: `Project: ${projectName}`,
  }
}

function entries(prefix: string, spec: [string, number, string, boolean, number][]): TimeEntry[] {
  return spec.map(([date, minutes, description, billable, rate], i) => ({
    id: `${prefix}-e${i + 1}`,
    date,
    minutes,
    description,
    billable,
    rateCents: rate,
    runningStartedAt: null,
  }))
}

const CLIENTS: Client[] = [
  { id: 'c1', name: 'Northwind Retail', domain: 'northwind.co', brand: PALETTE[0], status: 'Active', contactName: 'Dana Brooks', contactEmail: 'dana@northwind.co', owner: 'Maya Chen', industry: 'Retail', createdAt: '2026-02-10' },
  { id: 'c2', name: 'Helios Energy', domain: 'helios.io', brand: PALETTE[1], status: 'Active', contactName: 'Priya Nair', contactEmail: 'priya@helios.io', owner: 'Owen Park', industry: 'Energy', createdAt: '2026-03-01' },
  { id: 'c3', name: 'Meridian Health', domain: 'meridianhealth.com', brand: PALETTE[2], status: 'Completed', contactName: 'Devon Clarke', contactEmail: 'devon@meridianhealth.com', owner: 'Maya Chen', industry: 'Healthcare', createdAt: '2026-01-15' },
  { id: 'c4', name: 'Stack3d Lab', domain: 'stack3dlab.com', brand: PALETTE[3], status: 'Prospect', contactName: 'Sam Doyle', contactEmail: 'sam@stack3dlab.com', owner: 'Priya Nair', industry: 'SaaS', createdAt: '2026-05-20' },
  { id: 'c5', name: 'Quotient Media', domain: 'quotient.co', brand: PALETTE[4], status: 'On hold', contactName: 'Riya Kapoor', contactEmail: 'riya@quotient.co', owner: 'Owen Park', industry: 'Media', createdAt: '2026-04-08' },
]

const PROJECTS: Project[] = [
  {
    id: 'p1', clientId: 'c1', name: 'Salesforce CRM migration', summary: 'Migrate legacy CRM to Salesforce, 120k records.',
    status: 'Active', startDate: '2026-05-01', dueDate: '2026-07-15',
    tasks: tasks('p1', [
      ['Data audit & mapping', 'done', 8],
      ['Sandbox setup', 'done', 4],
      ['Field migration scripts', 'in_progress', 16],
      ['Validation rules', 'in_progress', 6],
      ['UAT with client', 'review', 8],
      ['Go-live runbook', 'todo', 5],
    ]),
    timeEntries: entries('p1', [
      ['2026-05-30', 150, 'Data mapping workshop', true, 12000],
      ['2026-06-01', 240, 'Migration script build', true, 12000],
      ['2026-06-02', 90, 'Internal sync', false, 12000],
      ['2026-06-03', 180, 'Validation rules', true, 12000],
    ]),
    invoice: null,
  },
  {
    id: 'p2', clientId: 'c1', name: 'Marketing automation setup', summary: 'HubSpot workflows + lead scoring.',
    status: 'Not started', startDate: '2026-07-20', dueDate: '2026-08-30',
    tasks: tasks('p2', [['Discovery call', 'todo', 2], ['Workflow design', 'todo', 6]]),
    timeEntries: [],
    invoice: null,
  },
  {
    id: 'p3', clientId: 'c2', name: 'Data warehouse build', summary: 'Snowflake + dbt analytics pipeline.',
    status: 'Review', startDate: '2026-04-15', dueDate: '2026-06-20',
    tasks: tasks('p3', [
      ['Schema design', 'done', 10],
      ['Ingestion jobs', 'done', 14],
      ['dbt models', 'review', 20],
      ['Dashboards', 'review', 8],
    ]),
    timeEntries: entries('p3', [
      ['2026-05-28', 300, 'dbt model build', true, 13500],
      ['2026-05-29', 180, 'Dashboard wiring', true, 13500],
      ['2026-06-01', 120, 'Review prep', true, 13500],
    ]),
    invoice: invoiceFor('p3', 'INV-202605-3310', '2026-05-30', 'sent', 'Data warehouse build', [
      ['dbt model build', 5, 13500],
      ['Dashboard wiring', 3, 13500],
      ['Review prep', 2, 13500],
    ]),
  },
  {
    id: 'p4', clientId: 'c3', name: 'EHR integration', summary: 'HL7/FHIR integration for patient records.',
    status: 'Completed', startDate: '2026-01-20', dueDate: '2026-04-30',
    tasks: tasks('p4', [
      ['Requirements', 'done', 6],
      ['FHIR mapping', 'done', 18],
      ['Integration tests', 'done', 10],
      ['Handover', 'done', 4],
    ]),
    timeEntries: entries('p4', [
      ['2026-03-10', 480, 'FHIR mapping', true, 15000],
      ['2026-03-12', 360, 'Integration tests', true, 15000],
      ['2026-04-01', 240, 'Handover & docs', true, 15000],
      ['2026-04-02', 60, 'Wrap-up call', false, 15000],
    ]),
    invoice: invoiceFor('p4', 'INV-202604-4821', '2026-04-30', 'paid', 'EHR integration', [
      ['FHIR mapping', 8, 15000],
      ['Integration tests', 6, 15000],
      ['Handover & docs', 4, 15000],
    ]),
  },
  {
    id: 'p5', clientId: 'c5', name: 'Analytics dashboard', summary: 'Looker Studio exec dashboard.',
    status: 'Paused', startDate: '2026-04-10', dueDate: '2026-06-10',
    tasks: tasks('p5', [['Metric definitions', 'done', 4], ['Dashboard build', 'in_progress', 10]]),
    timeEntries: entries('p5', [['2026-04-20', 200, 'Metric workshop', true, 11000]]),
    invoice: null,
  },
]

export function seedClientsState(): ClientsState {
  return { clients: CLIENTS, projects: PROJECTS }
}
