// UI-first fixture for the business (buyer) dashboard. Mirrors the features
// promised across the marketing pages (manage-team-projects, payments,
// global-payments-tax) and is shaped to later map onto a `/api/v1/businesses/me/*`
// surface. Money is stored in cents unless a display currency is noted.

export const MOCK_BUSINESS_USER = {
  id: 'mock-business-1',
  email: 'ops@northwind.example',
  name: 'Jordan Avery',
  company: 'Northwind Capital',
  role: 'business' as const,
}

/* ----------------------------------------------------------------- projects */

export type EngagementStatus = 'On track' | 'At risk' | 'Blocked' | 'In review' | 'Launched'

export interface BusinessProject {
  id: string
  name: string
  expert: string
  expertInitial: string
  owner: string
  status: EngagementStatus
  progress: number
  budgetCents: number
  spentCents: number
  nextMilestone: string
  dueDate: string // ISO
}

export interface TeamWorkload {
  name: string
  role: string
  activeProjects: number
  capacity: 'Has room' | 'Balanced' | 'At capacity'
}

export interface AttentionItem {
  id: string
  severity: 'blocked' | 'risk' | 'info'
  title: string
  detail: string
}

/* ---------------------------------------------------------------- payments */

export interface ConsolidatedInvoiceLine {
  expert: string
  country: string
  description: string
  amount: number
  currency: string
  usdCents: number
}

export interface ConsolidatedInvoice {
  id: string
  number: string
  period: string
  status: 'Paid' | 'Due' | 'Scheduled'
  dueDate: string
  lines: ConsolidatedInvoiceLine[]
  totalUsdCents: number
}

export interface EscrowMilestone {
  id: string
  project: string
  expert: string
  milestone: string
  amountCents: number
  state: 'Funded' | 'In review' | 'Released'
}

/* -------------------------------------------------------------- compliance */

export interface ComplianceRow {
  expert: string
  country: string
  classification: string
  taxForm: { label: string; done: boolean }
  msa: boolean
  identity: boolean
  payoutMethod: boolean
}

/* --------------------------------------------------------------------- team */

export interface TeamMember {
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Member' | 'Billing'
  projects: number
  brand: string
}

export interface BusinessContract {
  id: string
  title: string
  expert: string
  value: string
  status: 'Signed' | 'Awaiting signature' | 'Draft'
  date: string
}

export interface BusinessMessage {
  id: string
  from: string
  project: string
  preview: string
  when: string
  unread: boolean
  brand: string
}

/* -------------------------------------------------------------- the fixture */

export interface BusinessDashboardData {
  kpis: {
    activeEngagements: number
    inEscrowCents: number
    spendThisMonthCents: number
    pendingApprovals: number
  }
  projects: BusinessProject[]
  workload: TeamWorkload[]
  attention: AttentionItem[]
  invoices: ConsolidatedInvoice[]
  escrow: EscrowMilestone[]
  compliance: ComplianceRow[]
  team: TeamMember[]
  contracts: BusinessContract[]
  messages: BusinessMessage[]
}

export const MOCK_BUSINESS_DASHBOARD: BusinessDashboardData = {
  kpis: {
    activeEngagements: 4,
    inEscrowCents: 9_800_000,
    spendThisMonthCents: 5_240_000,
    pendingApprovals: 3,
  },
  projects: [
    {
      id: 'bp1',
      name: 'Salesforce CRM migration',
      expert: 'Avery Mock',
      expertInitial: 'A',
      owner: 'Priya Nair',
      status: 'On track',
      progress: 72,
      budgetCents: 4_800_000,
      spentCents: 3_100_000,
      nextMilestone: 'UAT sign-off',
      dueDate: '2026-06-27',
    },
    {
      id: 'bp2',
      name: 'NetSuite ERP rollout',
      expert: 'Daniel Okafor',
      expertInitial: 'D',
      owner: 'Tom Albrecht',
      status: 'At risk',
      progress: 38,
      budgetCents: 12_000_000,
      spentCents: 4_600_000,
      nextMilestone: 'Data mapping review',
      dueDate: '2026-06-21',
    },
    {
      id: 'bp3',
      name: 'Snowflake + dbt analytics',
      expert: 'Mei Lin',
      expertInitial: 'M',
      owner: 'Priya Nair',
      status: 'In review',
      progress: 88,
      budgetCents: 6_400_000,
      spentCents: 5_900_000,
      nextMilestone: 'Go-live checklist',
      dueDate: '2026-06-25',
    },
    {
      id: 'bp4',
      name: 'Workato integration layer',
      expert: 'Carlos Mendez',
      expertInitial: 'C',
      owner: 'Sofia Reyes',
      status: 'Blocked',
      progress: 20,
      budgetCents: 3_200_000,
      spentCents: 700_000,
      nextMilestone: 'API credentials from IT',
      dueDate: '2026-07-02',
    },
  ],
  workload: [
    { name: 'Priya Nair', role: 'Implementation lead', activeProjects: 2, capacity: 'Balanced' },
    { name: 'Tom Albrecht', role: 'Data & migrations', activeProjects: 3, capacity: 'At capacity' },
    { name: 'Sofia Reyes', role: 'Integrations', activeProjects: 1, capacity: 'Has room' },
  ],
  attention: [
    {
      id: 'a1',
      severity: 'blocked',
      title: 'Workato integration is blocked',
      detail: 'Carlos is waiting on API credentials from your IT team — 4 days idle.',
    },
    {
      id: 'a2',
      severity: 'risk',
      title: 'NetSuite ERP rollout slipping',
      detail: 'Data mapping review is 2 days behind; go-live date is at risk.',
    },
    {
      id: 'a3',
      severity: 'info',
      title: '3 invoices awaiting your approval',
      detail: 'Consolidated June statement is ready to review and approve.',
    },
  ],
  invoices: [
    {
      id: 'inv1',
      number: 'PRO-2026-06',
      period: 'June 2026',
      status: 'Due',
      dueDate: '2026-06-30',
      totalUsdCents: 5_240_000,
      lines: [
        { expert: 'Avery Mock', country: 'Australia', description: 'CRM migration — milestone 3', amount: 9800, currency: 'AUD', usdCents: 640_000 },
        { expert: 'Daniel Okafor', country: 'Nigeria', description: 'ERP rollout — discovery', amount: 18000, currency: 'USD', usdCents: 1_800_000 },
        { expert: 'Mei Lin', country: 'Singapore', description: 'Analytics build — milestone 2', amount: 3200, currency: 'SGD', usdCents: 2_400_000 },
        { expert: 'Carlos Mendez', country: 'Mexico', description: 'Integration — kickoff', amount: 8000, currency: 'USD', usdCents: 400_000 },
      ],
    },
    {
      id: 'inv2',
      number: 'PRO-2026-05',
      period: 'May 2026',
      status: 'Paid',
      dueDate: '2026-05-31',
      totalUsdCents: 4_120_000,
      lines: [
        { expert: 'Avery Mock', country: 'Australia', description: 'CRM migration — milestone 2', amount: 9800, currency: 'AUD', usdCents: 640_000 },
        { expert: 'Mei Lin', country: 'Singapore', description: 'Analytics build — milestone 1', amount: 4600, currency: 'SGD', usdCents: 3_480_000 },
      ],
    },
  ],
  escrow: [
    { id: 'e1', project: 'CRM migration', expert: 'Avery Mock', milestone: 'UAT sign-off', amountCents: 1_700_000, state: 'In review' },
    { id: 'e2', project: 'ERP rollout', expert: 'Daniel Okafor', milestone: 'Data migration', amountCents: 3_600_000, state: 'Funded' },
    { id: 'e3', project: 'Analytics build', expert: 'Mei Lin', milestone: 'Dashboards delivered', amountCents: 1_500_000, state: 'In review' },
    { id: 'e4', project: 'Integration layer', expert: 'Carlos Mendez', milestone: 'Connectors live', amountCents: 3_000_000, state: 'Funded' },
  ],
  compliance: [
    { expert: 'Avery Mock', country: 'Australia', classification: 'Independent contractor', taxForm: { label: 'W-8BEN', done: true }, msa: true, identity: true, payoutMethod: true },
    { expert: 'Daniel Okafor', country: 'Nigeria', classification: 'Independent contractor', taxForm: { label: 'W-8BEN', done: true }, msa: true, identity: true, payoutMethod: false },
    { expert: 'Mei Lin', country: 'Singapore', classification: 'Business entity', taxForm: { label: 'W-8BEN-E', done: true }, msa: true, identity: true, payoutMethod: true },
    { expert: 'Carlos Mendez', country: 'Mexico', classification: 'Independent contractor', taxForm: { label: 'W-8BEN', done: false }, msa: false, identity: true, payoutMethod: false },
  ],
  team: [
    { name: 'Jordan Avery', email: 'jordan@northwind.example', role: 'Owner', projects: 4, brand: '#155eef' },
    { name: 'Priya Nair', email: 'priya@northwind.example', role: 'Admin', projects: 2, brand: '#7f56d9' },
    { name: 'Tom Albrecht', email: 'tom@northwind.example', role: 'Member', projects: 3, brand: '#dd2590' },
    { name: 'Sofia Reyes', email: 'sofia@northwind.example', role: 'Member', projects: 1, brand: '#0e9384' },
    { name: 'Casey Lim', email: 'finance@northwind.example', role: 'Billing', projects: 0, brand: '#dc6803' },
  ],
  contracts: [
    { id: 'c1', title: 'MSA — Avery Mock', expert: 'Avery Mock', value: '$48,000', status: 'Signed', date: '2026-04-02' },
    { id: 'c2', title: 'SOW — NetSuite ERP rollout', expert: 'Daniel Okafor', value: '$120,000', status: 'Signed', date: '2026-05-10' },
    { id: 'c3', title: 'SOW — Snowflake analytics', expert: 'Mei Lin', value: '$64,000', status: 'Signed', date: '2026-05-18' },
    { id: 'c4', title: 'SOW — Workato integration', expert: 'Carlos Mendez', value: '$32,000', status: 'Awaiting signature', date: '2026-06-12' },
  ],
  messages: [
    { id: 'm1', from: 'Avery Mock', project: 'CRM migration', preview: 'UAT environment is ready for your team to test.', when: '18m', unread: true, brand: '#155eef' },
    { id: 'm2', from: 'Daniel Okafor', project: 'ERP rollout', preview: 'Need a call to unblock the data mapping decisions.', when: '2h', unread: true, brand: '#7f56d9' },
    { id: 'm3', from: 'Mei Lin', project: 'Analytics build', preview: 'Dashboards shipped — sharing the walkthrough recording.', when: 'Yesterday', unread: false, brand: '#dd2590' },
  ],
}

/* ------------------------------------------------------------- approvals */

export type ApprovalKind = 'milestone' | 'invoice'

export interface PendingApproval {
  id: string
  kind: ApprovalKind
  title: string
  expert: string
  expertInitial: string
  project: string
  amountCents: number
  submitted: string // ISO
  completesProject?: boolean // approving this finishes the engagement → prompt a review
}

export const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  { id: 'ap1', kind: 'milestone', title: 'UAT sign-off', expert: 'Avery Mock', expertInitial: 'A', project: 'CRM migration', amountCents: 1_700_000, submitted: '2026-06-16', completesProject: false },
  { id: 'ap2', kind: 'milestone', title: 'Dashboards delivered', expert: 'Mei Lin', expertInitial: 'M', project: 'Analytics build', amountCents: 1_500_000, submitted: '2026-06-15', completesProject: true },
  { id: 'ap3', kind: 'invoice', title: 'Invoice PRO-2026-06', expert: '4 experts', expertInitial: 'P', project: 'June consolidated statement', amountCents: 5_240_000, submitted: '2026-06-14', completesProject: false },
]

/* -------------------------------------------------------------- disputes */

export type DisputeState = 'Open' | 'In mediation' | 'Resolved'

export interface Dispute {
  id: string
  project: string
  expert: string
  milestone: string
  amountCents: number
  reason: string
  state: DisputeState
  opened: string // ISO
}

export const MOCK_DISPUTES: Dispute[] = [
  { id: 'dp1', project: 'Integration layer', expert: 'Carlos Mendez', milestone: 'Connectors live', amountCents: 3_000_000, reason: 'Deliverable incomplete — 2 of 5 connectors not functional.', state: 'In mediation', opened: '2026-06-13' },
]

/* ------------------------------------------------------------- documents */

export type DocCategory = 'Contract' | 'Tax form' | 'Deliverable' | 'Invoice'

export interface BusinessDocument {
  id: string
  name: string
  category: DocCategory
  owner: string // expert/party
  date: string // ISO
  size: string
}

export const MOCK_DOCUMENTS: BusinessDocument[] = [
  { id: 'd1', name: 'MSA — Avery Mock.pdf', category: 'Contract', owner: 'Avery Mock', date: '2026-04-02', size: '218 KB' },
  { id: 'd2', name: 'SOW — NetSuite ERP rollout.pdf', category: 'Contract', owner: 'Daniel Okafor', date: '2026-05-10', size: '186 KB' },
  { id: 'd3', name: 'W-8BEN — Avery Mock.pdf', category: 'Tax form', owner: 'Avery Mock', date: '2026-04-02', size: '92 KB' },
  { id: 'd4', name: 'W-8BEN-E — Mei Lin.pdf', category: 'Tax form', owner: 'Mei Lin', date: '2026-05-18', size: '104 KB' },
  { id: 'd5', name: 'CRM migration — runbook.pdf', category: 'Deliverable', owner: 'Avery Mock', date: '2026-06-09', size: '1.2 MB' },
  { id: 'd6', name: 'Analytics dashboards — handover.pdf', category: 'Deliverable', owner: 'Mei Lin', date: '2026-06-12', size: '3.4 MB' },
  { id: 'd7', name: 'Invoice PRO-2026-05.pdf', category: 'Invoice', owner: 'Proploy', date: '2026-05-31', size: '64 KB' },
  { id: 'd8', name: 'Invoice PRO-2026-06.pdf', category: 'Invoice', owner: 'Proploy', date: '2026-06-14', size: '66 KB' },
]

/* ----------------------------------------------------------------- spend */

export interface SpendByMonth {
  month: string
  cents: number
}

export interface SpendByProject {
  project: string
  cents: number
  color: string
}

export const MOCK_SPEND_BY_MONTH: SpendByMonth[] = [
  { month: 'Jan', cents: 2_100_000 },
  { month: 'Feb', cents: 2_800_000 },
  { month: 'Mar', cents: 3_400_000 },
  { month: 'Apr', cents: 3_900_000 },
  { month: 'May', cents: 4_120_000 },
  { month: 'Jun', cents: 5_240_000 },
]

export const MOCK_SPEND_BY_PROJECT: SpendByProject[] = [
  { project: 'CRM migration', cents: 3_100_000, color: '#155eef' },
  { project: 'NetSuite ERP', cents: 4_600_000, color: '#7f56d9' },
  { project: 'Analytics build', cents: 5_900_000, color: '#dd2590' },
  { project: 'Integration layer', cents: 700_000, color: '#0e9384' },
]

/* ------------------------------------------------------- activation (first-run) */

export interface ActivationStep {
  id: string
  label: string
  done: boolean
  href: string
}

export const MOCK_ACTIVATION: ActivationStep[] = [
  { id: 'act1', label: 'Complete company profile', done: true, href: '/business/dashboard/settings' },
  { id: 'act2', label: 'Invite a teammate', done: true, href: '/business/dashboard/team' },
  { id: 'act3', label: 'Post your first brief', done: false, href: '/business/dashboard/hire/brief' },
  { id: 'act4', label: 'Add a payment method', done: false, href: '/business/dashboard/settings' },
  { id: 'act5', label: 'Hire your first expert', done: false, href: '/business/dashboard/hire' },
]
