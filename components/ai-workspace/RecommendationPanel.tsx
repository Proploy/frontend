'use client'

import type { EvaluationDetail } from '@/features/ai-workspace'
import { RecommendationCard } from './RecommendationCard'

export function canGenerateRecommendation(
  requirementsConfirmed: boolean,
  shortlistCount: number,
): boolean {
  return requirementsConfirmed && shortlistCount >= 2
}

export function RecommendationPanel({
  evaluation,
  onGenerate,
  onRetry,
}: {
  evaluation: EvaluationDetail
  onGenerate: () => void
  onRetry: () => void
}) {
  if (evaluation.recommendation) {
    return (
      <RecommendationCard recommendation={evaluation.recommendation} />
    )
  }

  if (
    !canGenerateRecommendation(
      evaluation.milestones.requirements_confirmed,
      evaluation.shortlist.length,
    )
  ) {
    return (
      <div className="rounded-xl border border-dashed border-[#d5d7da] bg-[#fafafa] px-4 py-8 text-center">
        <p className="text-sm font-semibold text-[#414651]">
          Recommendation not ready
        </p>
        <p className="mt-1 text-xs leading-5 text-[#717680]">
          Confirm the requirements and shortlist at least two products.
        </p>
      </div>
    )
  }

  if (evaluation.regeneration_status === 'failed') {
    return (
      <div className="rounded-xl border border-[#fecdca] bg-[#fef3f2] p-4">
        <p className="text-sm font-semibold text-[#b42318]">
          Recommendation update failed
        </p>
        <p className="mt-1 text-xs leading-5 text-[#7a271a]">
          Your prior results remain unchanged.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 h-9 rounded-lg bg-[#b42318] px-3 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#b2ccff] bg-[#f5f8ff] p-4">
      <p className="text-sm font-semibold text-[#1849a9]">
        Ready for a recommendation
      </p>
      <p className="mt-1 text-xs leading-5 text-[#414651]">
        SAM will select a winner using the confirmed requirements, shortlist,
        and internal evidence.
      </p>
      <button
        type="button"
        onClick={onGenerate}
        disabled={
          evaluation.regeneration_status === 'pending' ||
          evaluation.regeneration_status === 'running'
        }
        className="mt-3 h-9 rounded-lg bg-[#155eef] px-3 text-sm font-semibold text-white disabled:bg-[#84adff]"
      >
        {evaluation.regeneration_status === 'pending' ||
        evaluation.regeneration_status === 'running'
          ? 'Generating…'
          : 'Generate recommendation'}
      </button>
    </div>
  )
}
