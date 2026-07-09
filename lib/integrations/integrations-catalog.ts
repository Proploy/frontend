// Integration catalog — the single source of truth for every third-party tool
// the expert portal can connect. Each entry is mapped to the portal surface it
// powers ("powers") so the same catalog drives both the Settings → Integrations
// tab and any in-context connect prompts (e.g. schedulers on the Calendar page).
//
// UI-first / no backend: connection state lives in integrations-store.ts
// (localStorage). `needsAuth` flags the tools that would require a real OAuth
// round-trip once a backend exists — the connect flow simulates it for now.

export type IntegrationCategory =
  | 'Scheduling'
  | 'Meetings & calls'
  | 'Documents & e-sign'
  | 'Payments & accounting'
  | 'CRM & leads'
  | 'Communication'
  | 'Project management'
  | 'Design & files'
  | 'Automation'

/** Meeting-provider value written onto a booking when this scheduler is active. */
export type SchedulerProvider = 'cal_com' | 'calendly' | 'google_cal' | 'cal_diy'

export interface IntegrationDef {
  key: string
  name: string
  category: IntegrationCategory
  /** What the tool is. */
  blurb: string
  /** Which portal surface it feeds, shown as a small "Powers …" tag. */
  powers: string
  /** True when a real OAuth authorization would be required (no backend yet). */
  needsAuth: boolean
  /** Participates in the Calendar booking-provider picker. */
  scheduling?: boolean
  /** Provider value stamped on meetings booked through this scheduler. */
  provider?: SchedulerProvider
  /** Label/placeholder for the "Connected as" account field. */
  accountLabel?: string
  /** Seed state so the demo opens with a realistic set of live integrations. */
  defaultConnected?: boolean
  defaultAccount?: string
}

export const INTEGRATION_CATALOG: IntegrationDef[] = [
  // ── Scheduling ────────────────────────────────────────────────────────────
  {
    key: 'cal_com',
    name: 'Cal.com',
    category: 'Scheduling',
    blurb: 'Open-source scheduling — share booking links and let clients pick a slot.',
    powers: 'Calendar',
    needsAuth: false,
    scheduling: true,
    provider: 'cal_com',
    accountLabel: 'Cal.com username',
    defaultConnected: true,
    defaultAccount: 'cal.com/avery',
  },
  {
    key: 'calendly',
    name: 'Calendly',
    category: 'Scheduling',
    blurb: 'Sync your Calendly event types and pull booked meetings onto your calendar.',
    powers: 'Calendar',
    needsAuth: true,
    scheduling: true,
    provider: 'calendly',
    accountLabel: 'Calendly organization',
  },
  {
    key: 'google_cal',
    name: 'Google Calendar',
    category: 'Scheduling',
    blurb: 'Two-way sync of events and free/busy so bookings respect your real availability.',
    powers: 'Calendar',
    needsAuth: true,
    scheduling: true,
    provider: 'google_cal',
    accountLabel: 'Google account',
  },

  // ── Meetings & calls ──────────────────────────────────────────────────────
  {
    key: 'fireflies',
    name: 'Fireflies.ai',
    category: 'Meetings & calls',
    blurb: 'Auto-record, transcribe and summarize client calls; attach notes to the client.',
    powers: 'Calendar · Clients',
    needsAuth: true,
    defaultConnected: true,
    defaultAccount: 'avery@proploy.co',
  },
  {
    key: 'zoom',
    name: 'Zoom',
    category: 'Meetings & calls',
    blurb: 'Generate a video link automatically for every scheduled call.',
    powers: 'Calendar',
    needsAuth: false,
    defaultConnected: true,
    defaultAccount: 'avery@proploy.co',
  },

  // ── Documents & e-sign ────────────────────────────────────────────────────
  {
    key: 'docusign',
    name: 'DocuSign',
    category: 'Documents & e-sign',
    blurb: 'Send and track contracts and SOWs for e-signature, with status back in-app.',
    powers: 'Contracts',
    needsAuth: true,
    defaultConnected: true,
    defaultAccount: 'avery@proploy.co',
  },
  {
    key: 'gdrive',
    name: 'Google Drive',
    category: 'Documents & e-sign',
    blurb: 'Attach proposals and deliverables straight from Drive.',
    powers: 'Proposals · Projects',
    needsAuth: true,
    defaultConnected: true,
    defaultAccount: 'avery@proploy.co',
  },

  // ── Payments & accounting ─────────────────────────────────────────────────
  {
    key: 'stripe',
    name: 'Stripe',
    category: 'Payments & accounting',
    blurb: 'Collect invoice payments and track payouts against your earnings.',
    powers: 'Invoices · Earnings',
    needsAuth: false,
    defaultConnected: true,
    defaultAccount: 'acct_1PAvery',
  },
  {
    key: 'quickbooks',
    name: 'QuickBooks',
    category: 'Payments & accounting',
    blurb: 'Sync invoices and reconcile your Proploy payouts.',
    powers: 'Invoices · Earnings',
    needsAuth: true,
    defaultConnected: true,
    defaultAccount: 'Avery Consulting LLC',
  },

  // ── CRM & leads ───────────────────────────────────────────────────────────
  {
    key: 'hubspot',
    name: 'HubSpot',
    category: 'CRM & leads',
    blurb: 'Push client leads and engagements into your CRM and keep status in sync.',
    powers: 'Leads · Clients',
    needsAuth: true,
    defaultConnected: true,
    defaultAccount: 'Avery Consulting',
  },
  {
    key: 'clearbit',
    name: 'Clearbit Enrich',
    category: 'CRM & leads',
    blurb: 'Auto-fill company and contact details when you add a new client.',
    powers: 'Clients · Leads',
    needsAuth: true,
  },

  // ── Communication ─────────────────────────────────────────────────────────
  {
    key: 'slack',
    name: 'Slack',
    category: 'Communication',
    blurb: 'Get lead alerts and client messages in your channels.',
    powers: 'Messages · Leads',
    needsAuth: false,
    defaultConnected: true,
    defaultAccount: 'proploy.slack.com',
  },
  {
    key: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    blurb: 'Draft and send client follow-ups from your connected inbox.',
    powers: 'Messages',
    needsAuth: true,
  },

  // ── Project management ────────────────────────────────────────────────────
  {
    key: 'linear',
    name: 'Linear',
    category: 'Project management',
    blurb: 'Mirror project tasks and delivery status from where the work happens.',
    powers: 'Projects',
    needsAuth: true,
  },
  {
    key: 'monday',
    name: 'monday.com',
    category: 'Project management',
    blurb: 'Sync project boards and client work into your engagements.',
    powers: 'Projects',
    needsAuth: true,
  },

  // ── Design & files ────────────────────────────────────────────────────────
  {
    key: 'figma',
    name: 'Figma',
    category: 'Design & files',
    blurb: 'Embed live design files in proposals and deliverables.',
    powers: 'Proposals',
    needsAuth: true,
  },
  {
    key: 'canva',
    name: 'Canva',
    category: 'Design & files',
    blurb: 'Create branded proposal decks and client-facing assets.',
    powers: 'Proposals',
    needsAuth: true,
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    key: 'zapier',
    name: 'Zapier',
    category: 'Automation',
    blurb: 'Automate your sourcing workflow across 6,000+ apps.',
    powers: 'Whole portal',
    needsAuth: true,
  },
]

/** Category display order for the Settings → Integrations tab. */
export const CATEGORY_ORDER: IntegrationCategory[] = [
  'Scheduling',
  'Meetings & calls',
  'Documents & e-sign',
  'Payments & accounting',
  'CRM & leads',
  'Communication',
  'Project management',
  'Design & files',
  'Automation',
]

const BY_KEY = new Map(INTEGRATION_CATALOG.map((d) => [d.key, d]))

export function getIntegration(key: string): IntegrationDef | undefined {
  return BY_KEY.get(key)
}

/** Scheduling integrations, in catalog order (Cal.com first). */
export const SCHEDULING_INTEGRATIONS = INTEGRATION_CATALOG.filter((d) => d.scheduling)

/** Group the catalog (optionally filtered) by category, preserving CATEGORY_ORDER. */
export function groupByCategory(
  items: IntegrationDef[] = INTEGRATION_CATALOG,
): { category: IntegrationCategory; items: IntegrationDef[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((d) => d.category === category),
  })).filter((g) => g.items.length > 0)
}
