import type { ProposalsState } from './proposals-store'

// Inbound project requests from businesses, surfaced in the expert's Proposals
// inbox. Mirrors the "get-discovered" marketing promise: verified buyers send
// scoped requests; the expert reviews and sends a proposal in one click.

export function seedProposalsState(): ProposalsState {
  return {
    requests: [
      {
        id: 'req-1',
        company: 'Northwind Trading',
        contact: 'Dana Whitfield · VP Operations',
        role: 'Salesforce implementation lead',
        software: ['Salesforce', 'Data migration', 'CPQ'],
        scope:
          'Migrating off a legacy CRM to Salesforce Sales Cloud for a 60-person sales org. Need data migration, lead/opportunity config, and two approval automations. Go-live targeted for the end of the quarter.',
        budgetLowCents: 4_000_000,
        budgetHighCents: 6_000_000,
        startDate: '2026-06-30',
        receivedAt: '2026-06-15T14:20:00.000Z',
        verified: true,
        matchScore: 96,
        status: 'new',
        proposal: null,
      },
      {
        id: 'req-2',
        company: 'Brightwave SaaS',
        contact: 'Marcus Lindqvist · Head of Marketing',
        role: 'HubSpot RevOps consultant',
        software: ['HubSpot', 'Lifecycle automation', 'Attribution'],
        scope:
          'Lifecycle email build-out, lead scoring, and multi-touch attribution reporting in HubSpot. Ongoing optimization preferred over a one-off project.',
        budgetLowCents: 800_000,
        budgetHighCents: 1_200_000,
        startDate: '2026-07-07',
        receivedAt: '2026-06-14T09:05:00.000Z',
        verified: true,
        matchScore: 91,
        status: 'reviewing',
        proposal: null,
      },
      {
        id: 'req-3',
        company: 'Cedar & Co.',
        contact: 'Priya Raman · Controller',
        role: 'NetSuite ERP implementer',
        software: ['NetSuite', 'Financials', 'Multi-subsidiary'],
        scope:
          'Stand up NetSuite financials for a multi-entity group: chart of accounts, consolidation, AP/AR workflows, and month-end close reporting with finance-team training.',
        budgetLowCents: 5_000_000,
        budgetHighCents: 7_000_000,
        startDate: '2026-07-14',
        receivedAt: '2026-06-12T16:40:00.000Z',
        verified: true,
        matchScore: 88,
        status: 'proposed',
        proposal: {
          summary:
            'Fixed-bid NetSuite financials implementation across three milestones: discovery & design, build & configuration, and UAT/launch with a 30-day hypercare window.',
          rateModel: 'fixed',
          amountCents: 6_400_000,
          timelineWeeks: 10,
          sentAt: '2026-06-13T11:15:00.000Z',
        },
      },
      {
        id: 'req-4',
        company: 'Helios Robotics',
        contact: 'Sam Okeke · COO',
        role: 'Analytics platform architect',
        software: ['Snowflake', 'dbt', 'Looker'],
        scope:
          'Build a governed analytics stack: Snowflake warehouse, dbt models for core business metrics, and Looker dashboards for the leadership team.',
        budgetLowCents: 3_000_000,
        budgetHighCents: 4_500_000,
        startDate: '2026-08-01',
        receivedAt: '2026-06-10T08:30:00.000Z',
        verified: false,
        matchScore: 82,
        status: 'new',
        proposal: null,
      },
      {
        id: 'req-5',
        company: 'Atlas Freight',
        contact: 'Lena Hoffmann · IT Director',
        role: 'Integration engineer',
        software: ['iPaaS', 'API integration', 'Webhooks'],
        scope:
          'Connect an ERP, a TMS, and a customer portal via an iPaaS layer. Need reliable webhook handling and a monitoring dashboard for failed syncs.',
        budgetLowCents: 2_000_000,
        budgetHighCents: 3_000_000,
        startDate: '2026-07-21',
        receivedAt: '2026-06-08T13:00:00.000Z',
        verified: true,
        matchScore: 79,
        status: 'won',
        proposal: {
          summary: 'iPaaS integration of ERP, TMS, and customer portal with a failed-sync monitoring dashboard.',
          rateModel: 'fixed',
          amountCents: 2_600_000,
          timelineWeeks: 8,
          sentAt: '2026-06-09T10:00:00.000Z',
        },
      },
    ],
  }
}
