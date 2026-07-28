'use client'

import type { EvaluationDetail } from '@/features/ai-workspace'

export function ResponseLifecycle({
  evaluation,
}: {
  evaluation: EvaluationDetail
}) {
  const steps = [
    evaluation.requirements
      ? 'Reviewed the active evaluation requirements'
      : 'Identified the next material requirement gaps',
    evaluation.matches.length
      ? `Checked ${evaluation.matches.length} published catalog ${evaluation.matches.length === 1 ? 'match' : 'matches'}`
      : 'Used only the published internal catalog and review database',
    evaluation.shortlist.length
      ? `Considered the current shortlist of ${evaluation.shortlist.length}`
      : 'Kept this evaluation independent from other sessions',
  ]

  return (
    <details className="group mt-3 rounded-xl border border-[#e9eaeb] bg-[#fafafa]">
      <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-[#535862] marker:text-[#155eef]">
        How SAM evaluated this
      </summary>
      <ol className="space-y-2 border-t border-[#e9eaeb] px-4 py-3 text-xs leading-5 text-[#717680]">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-2">
            <span className="font-semibold text-[#155eef]">
              {index + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </details>
  )
}
