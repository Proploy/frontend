'use client'

import { CheckCircle2, Pencil } from 'lucide-react'
import type { RequirementsDraft } from '@/features/ai-workspace'

const LABELS: Record<string, string> = {
  category: 'Category',
  primary_use_case: 'Primary use case',
  problem_frame: 'Current problem',
  team_size: 'Team size',
  budget: 'Budget',
  required_integrations: 'Required integrations',
  security: 'Security',
  region: 'Region',
  deployment: 'Deployment',
  required_capabilities: 'Required capabilities',
}

function displayValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

export function RequirementSummaryCard({
  requirements,
  missing,
  onEdit,
  confirmed,
  onConfirm,
}: {
  requirements: RequirementsDraft
  missing: string[]
  onEdit: () => void
  confirmed: boolean
  onConfirm: () => void
}) {
  const rows = Object.entries(requirements).filter(
    ([key, field]) =>
      LABELS[key] &&
      field &&
      (field.state === 'answered' ||
        field.state === 'no_requirement'),
  )

  return (
    <section className="rounded-2xl border border-[#d5d7da] bg-white shadow-[0_4px_16px_rgba(10,13,18,0.05)]">
      <div className="flex items-start justify-between gap-4 border-b border-[#e9eaeb] px-4 py-3.5">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={17}
              className="text-[#079455]"
              aria-hidden
            />
            <h3 className="text-sm font-semibold text-[#181d27]">
              Requirements captured
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#717680]">
            {missing.length
              ? `${missing.length} critical ${missing.length === 1 ? 'detail' : 'details'} still needed`
              : 'Ready to confirm'}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#d5d7da] px-2.5 text-xs font-semibold text-[#414651] hover:bg-[#fafafa]"
        >
          <Pencil size={13} />
          Edit requirements
        </button>
      </div>
      <dl className="grid gap-x-6 gap-y-0 px-4 py-2 sm:grid-cols-2">
        {rows.map(([key, field]) => (
          <div
            key={key}
            className="grid grid-cols-[125px_1fr] gap-3 border-b border-[#f2f4f7] py-2.5 text-sm last:border-0"
          >
            <dt className="text-[#717680]">{LABELS[key]}</dt>
            <dd className="font-medium text-[#344054]">
              {field.state === 'no_requirement'
                ? 'No requirement'
                : displayValue(field.value)}
            </dd>
          </div>
        ))}
      </dl>
      {!confirmed && missing.length === 0 ? (
        <div className="flex items-center justify-between gap-4 border-t border-[#e9eaeb] px-4 py-3">
          <p className="text-xs text-[#535862]">
            Confirm this summary to discover matching products.
          </p>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 shrink-0 rounded-lg bg-[#155eef] px-3 text-sm font-semibold text-white hover:bg-[#0e4cc7]"
          >
            Confirm requirements
          </button>
        </div>
      ) : null}
    </section>
  )
}
