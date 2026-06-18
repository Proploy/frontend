import type { Contract, ContractsState } from '@/hooks/types/contracts-doc'

// Seed contracts shown on first load (before any localStorage state exists).
// Mirrors the three reference contracts from the original mock so the page is
// populated for demos: one awaiting counter-signature, one draft, one signed.

const PROVIDER = {
  role: 'provider' as const,
  name: 'Jordan Avery',
  org: 'Avery Implementation Co.',
  email: 'jordan@averyimpl.co',
}

// Seeded signatures are stored as a `typed:Name` sentinel and materialized into
// a real PNG data URL on first mount (see ContractsProvider). This avoids
// bundling binary image data while keeping the PDF/DOCX export working — the
// sentinel becomes a genuine signature image once rendered client-side.
const seedSig = (name: string) => `typed:${name}`

const CONTRACTS: Contract[] = [
  {
    id: 'ctr-seed-1',
    title: 'Salesforce CRM rollout — Fixed-bid SOW',
    project: 'Northwind CRM migration',
    templateKey: 'fixed_bid',
    currency: 'USD',
    createdAt: '2026-05-28',
    provider: PROVIDER,
    client: { role: 'client', name: 'Dana Whitfield', org: 'Northwind Trading', email: 'dana@northwind.com' },
    scope:
      'Provider will deliver a Salesforce Sales Cloud implementation: data migration from the legacy CRM, lead and opportunity configuration, two automation flows, and team enablement. Milestones are invoiced on client acceptance.',
    milestones: [
      { id: 'm1', label: 'Discovery & solution design', due: '2026-06-11', amountCents: 1_200_000 },
      { id: 'm2', label: 'Build & configuration', due: '2026-07-12', amountCents: 2_400_000 },
      { id: 'm3', label: 'UAT, launch & handover', due: '2026-08-06', amountCents: 1_200_000 },
    ],
    signatures: {
      provider: { role: 'provider', dataUrl: seedSig('Jordan Avery'), signedName: 'Jordan Avery', signedAt: '2026-05-29T15:12:00.000Z' },
    },
    uploadedDocName: null,
    status: 'awaiting_signature',
  },
  {
    id: 'ctr-seed-2',
    title: 'HubSpot marketing ops — Monthly retainer',
    project: 'HubSpot lifecycle automation',
    templateKey: 'retainer',
    currency: 'USD',
    createdAt: '2026-06-09',
    provider: PROVIDER,
    client: { role: 'client', name: 'Marcus Lindqvist', org: 'Brightwave SaaS', email: 'marcus@brightwave.io' },
    scope:
      'Provider will supply up to 40 hours of HubSpot implementation and optimization per month: lifecycle automation, attribution reporting, and campaign setup. Billed monthly in advance.',
    milestones: [
      { id: 'm1', label: 'Month 1 retainer', due: '2026-07-09', amountCents: 900_000 },
      { id: 'm2', label: 'Month 2 retainer', due: '2026-08-09', amountCents: 900_000 },
      { id: 'm3', label: 'Month 3 retainer', due: '2026-09-09', amountCents: 900_000 },
    ],
    signatures: {},
    uploadedDocName: null,
    status: 'draft',
  },
  {
    id: 'ctr-seed-3',
    title: 'NetSuite finance implementation — Fixed-bid SOW',
    project: 'NetSuite ERP go-live',
    templateKey: 'fixed_bid',
    currency: 'USD',
    createdAt: '2026-04-15',
    provider: PROVIDER,
    client: { role: 'client', name: 'Priya Raman', org: 'Cedar & Co.', email: 'priya@cedarco.com' },
    scope:
      'Provider will implement NetSuite ERP financials: chart of accounts, multi-subsidiary consolidation, AP/AR workflows, and month-end close reporting, with finance-team training and a 30-day hypercare window.',
    milestones: [
      { id: 'm1', label: 'Discovery & solution design', due: '2026-04-29', amountCents: 1_600_000 },
      { id: 'm2', label: 'Build & configuration', due: '2026-05-30', amountCents: 3_200_000 },
      { id: 'm3', label: 'UAT, launch & handover', due: '2026-06-24', amountCents: 1_600_000 },
    ],
    signatures: {
      provider: { role: 'provider', dataUrl: seedSig('Jordan Avery'), signedName: 'Jordan Avery', signedAt: '2026-04-16T10:02:00.000Z' },
      client: { role: 'client', dataUrl: seedSig('Priya Raman'), signedName: 'Priya Raman', signedAt: '2026-04-18T18:44:00.000Z' },
    },
    uploadedDocName: null,
    status: 'signed',
  },
]

export function seedContractsState(): ContractsState {
  return { contracts: CONTRACTS }
}
