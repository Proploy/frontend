'use client'

import { LoaderCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  type EvaluationSummary,
  useEvaluationWorkspace,
} from '@/features/ai-workspace'
import { buildCompareUrl } from '@/features/compare/compare-url'
import { DecisionWorkspace } from './DecisionWorkspace'
import { EvaluationHeader } from './EvaluationHeader'
import { EvaluationSidebar } from './EvaluationSidebar'
import { SamConversation } from './SamConversation'

export function SoftwareProcurementWorkspace() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const workspace = useEvaluationWorkspace()
  const [evaluationsOpen, setEvaluationsOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [decisionSidebarCollapsed, setDecisionSidebarCollapsed] =
    useState(false)
  const [decisionsOpen, setDecisionsOpen] = useState(false)
  const [saveStateById, setSaveStateById] = useState<
    Record<
      string,
      {
        messageCount: number
        state: 'idle' | 'saving' | 'saved'
      }
    >
  >({})
  const [shareStateById, setShareStateById] = useState<
    Record<string, 'idle' | 'sharing' | 'shared'>
  >({})

  const rename = async (evaluation: EvaluationSummary) => {
    const title = window.prompt(
      'Rename evaluation',
      evaluation.title,
    )
    if (title?.trim() && title.trim() !== evaluation.title) {
      await workspace.updateTitle(
        evaluation.evaluation_id,
        title.trim(),
      )
    }
  }

  const remove = async (
    evaluationId: string,
    archive: boolean,
  ) => {
    const approved = window.confirm(
      archive
        ? 'Archive this evaluation?'
        : 'Delete this evaluation? This cannot be undone.',
    )
    if (!approved) return
    if (archive) await workspace.archive(evaluationId)
    else await workspace.deleteEvaluation(evaluationId)
  }

  const openComparison = async (productIds: string[]) => {
    const saved = await workspace.selectComparison(productIds)
    if (saved) router.push(buildCompareUrl(productIds))
  }

  const saveEvaluation = async () => {
    const active = workspace.activeEvaluation
    if (!active || !active.messages.length || workspace.isSending) return
    const evaluationId = active.evaluation_id
    const messageCount = active.messages.length
    setSaveStateById((current) => ({
      ...current,
      [evaluationId]: { messageCount, state: 'saving' },
    }))
    const saved = await workspace.saveEvaluation()
    setSaveStateById((current) => ({
      ...current,
      [evaluationId]: {
        messageCount,
        state: saved ? 'saved' : 'idle',
      },
    }))
  }

  const shareEvaluation = async () => {
    const active = workspace.activeEvaluation
    if (!active) return
    const evaluationId = active.evaluation_id
    const url = new URL(window.location.href)
    url.searchParams.set('evaluation', evaluationId)
    setShareStateById((current) => ({
      ...current,
      [evaluationId]: 'sharing',
    }))
    try {
      if (navigator.share) {
        await navigator.share({
          title: active.title,
          text: `Software Procurement evaluation: ${active.title}`,
          url: url.toString(),
        })
      } else {
        await navigator.clipboard.writeText(url.toString())
      }
      setShareStateById((current) => ({
        ...current,
        [evaluationId]: 'shared',
      }))
      window.setTimeout(() => {
        setShareStateById((current) => ({
          ...current,
          [evaluationId]: 'idle',
        }))
      }, 2200)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setShareStateById((current) => ({
          ...current,
          [evaluationId]: 'idle',
        }))
        return
      }
      setShareStateById((current) => ({
        ...current,
        [evaluationId]: 'idle',
      }))
    }
  }

  if (authLoading || workspace.state.loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="mt-[80px] flex h-[calc(100dvh-80px)] min-h-0 flex-col overflow-hidden bg-white font-[family-name:var(--font-dm-sans)] text-[#181d27]"
      >
        <div className="grid h-full min-w-0 grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_360px]">
          {/* Sidebar skeleton */}
          <aside className="hidden min-h-0 border-r border-[#e9eaeb] lg:flex lg:flex-col">
            <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[16px] py-[14px]">
              <Skeleton className="h-[18px] w-[120px] rounded-[4px]" />
              <Skeleton shape="circle" className="size-[28px]" />
            </div>
            <div className="flex flex-col gap-[8px] p-[12px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-[10px] rounded-[10px] px-[10px] py-[10px]">
                  <Skeleton shape="circle" className="size-[28px]" />
                  <div className="flex flex-1 flex-col gap-[4px]">
                    <Skeleton className="h-[12px] w-[80%] rounded-[4px]" />
                    <Skeleton className="h-[10px] w-[50%] rounded-[4px]" />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main skeleton */}
          <main className="flex min-h-0 min-w-0 flex-col">
            <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[16px]">
              <div className="flex flex-col gap-[6px]">
                <Skeleton className="h-[20px] w-[200px] rounded-[6px]" />
                <Skeleton className="h-[12px] w-[140px] rounded-[4px]" />
              </div>
              <div className="flex items-center gap-[8px]">
                <Skeleton className="h-[36px] w-[80px] rounded-[8px]" />
                <Skeleton className="h-[36px] w-[100px] rounded-[8px]" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[16px] overflow-hidden bg-[#fafbfc] p-[24px]">
              <div className="flex items-start gap-[12px]">
                <Skeleton shape="circle" className="size-[32px]" />
                <div className="flex max-w-[70%] flex-col gap-[6px]">
                  <Skeleton className="h-[14px] w-[280px] rounded-[8px]" />
                  <Skeleton className="h-[14px] w-[420px] rounded-[8px]" />
                  <Skeleton className="h-[14px] w-[200px] rounded-[8px]" />
                </div>
              </div>
              <div className="flex items-start justify-end gap-[12px]">
                <div className="flex max-w-[70%] flex-col items-end gap-[6px]">
                  <Skeleton className="h-[14px] w-[160px] rounded-[8px]" />
                  <Skeleton className="h-[14px] w-[240px] rounded-[8px]" />
                </div>
                <Skeleton shape="circle" className="size-[32px]" />
              </div>
              <div className="flex items-start gap-[12px]">
                <Skeleton shape="circle" className="size-[32px]" />
                <div className="flex max-w-[70%] flex-col gap-[6px]">
                  <Skeleton className="h-[14px] w-[360px] rounded-[8px]" />
                  <Skeleton className="h-[14px] w-[180px] rounded-[8px]" />
                </div>
              </div>
            </div>
            <div className="border-t border-[#e9eaeb] p-[16px]">
              <Skeleton className="h-[80px] w-full rounded-[12px]" />
              <div className="mt-[12px] flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <LoaderCircle size={14} className="animate-spin text-[#155eef] motion-reduce:animate-none" />
                  <span className="text-[12px] text-[#717680]">Preparing your workspace…</span>
                </div>
                <Skeleton className="h-[40px] w-[100px] rounded-[8px]" />
              </div>
            </div>
          </main>

          {/* Decision sidebar skeleton */}
          <aside className="hidden min-h-0 border-l border-[#e9eaeb] xl:flex xl:flex-col">
            <div className="border-b border-[#e9eaeb] px-[20px] py-[14px]">
              <Skeleton className="h-[18px] w-[140px] rounded-[4px]" />
            </div>
            <div className="flex flex-col gap-[12px] p-[16px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-[8px] rounded-[12px] border border-[#e9eaeb] p-[12px]">
                  <Skeleton className="h-[60px] w-full rounded-[8px]" />
                  <Skeleton className="h-[12px] w-[80%] rounded-[4px]" />
                  <Skeleton className="h-[12px] w-[60%] rounded-[4px]" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-[80px] flex h-[calc(100dvh-80px)] items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-[#e9eaeb] bg-white p-7 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#181d27]">
            Sign in to use Software Procurement
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#535862]">
            Your evaluations, shortlist, evidence, and recommendations are
            saved privately to your account.
          </p>
        </div>
      </div>
    )
  }

  const evaluation = workspace.activeEvaluation
  const activeSaveEntry = evaluation
    ? saveStateById[evaluation.evaluation_id]
    : undefined
  const activeSaveState =
    activeSaveEntry &&
    activeSaveEntry.messageCount === evaluation?.messages.length
      ? activeSaveEntry.state
      : 'idle'
  const activeShareState =
    (evaluation
      ? shareStateById[evaluation.evaluation_id]
      : undefined) ?? 'idle'
  const workspaceColumns = sidebarCollapsed
    ? decisionSidebarCollapsed
      ? 'lg:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[72px_minmax(600px,1fr)_52px]'
      : 'lg:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[72px_minmax(600px,1fr)_360px]'
    : decisionSidebarCollapsed
      ? 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_52px]'
      : 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_360px]'

  return (
    <div className="mt-[80px] h-[calc(100dvh-80px)] min-h-0 overflow-hidden bg-white font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div
        className={`grid h-full min-w-0 grid-cols-1 transition-[grid-template-columns] duration-300 ease-out ${workspaceColumns}`}
      >
        <div className="hidden min-h-0 border-r border-[#e9eaeb] lg:block">
          <EvaluationSidebar
            evaluations={workspace.state.summaries}
            activeEvaluationId={workspace.state.activeEvaluationId}
            onSelect={(evaluationId) =>
              void workspace.selectEvaluation(evaluationId)
            }
            onNew={() => void workspace.newEvaluation()}
            onRename={(item) => void rename(item)}
            onDuplicate={(evaluationId) =>
              void workspace.duplicate(evaluationId)
            }
            onArchive={(evaluationId) =>
              void remove(evaluationId, true)
            }
            onDelete={(evaluationId) =>
              void remove(evaluationId, false)
            }
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() =>
              setSidebarCollapsed((collapsed) => !collapsed)
            }
          />
        </div>

        <main className="flex min-h-0 min-w-0 flex-col">
          <EvaluationHeader
            evaluation={evaluation}
            onOpenEvaluations={() => setEvaluationsOpen(true)}
            onOpenDecisions={() => setDecisionsOpen(true)}
            onShare={() => void shareEvaluation()}
            onSave={() => void saveEvaluation()}
            canSave={Boolean(evaluation?.messages.length) && !workspace.isSending}
            sharing={activeShareState === 'sharing'}
            shared={activeShareState === 'shared'}
            saving={activeSaveState === 'saving'}
            saved={activeSaveState === 'saved'}
          />
          {workspace.state.error ? (
            <div className="border-b border-[#fecdca] bg-[#fef3f2] px-5 py-2 text-sm text-[#b42318]">
              {workspace.state.error}
            </div>
          ) : null}
          {evaluation ? (
            <SamConversation
              evaluation={evaluation}
              isSending={workspace.isSending}
              onSend={(message) => void workspace.sendMessage(message)}
              onConfirmRequirements={() =>
                void workspace.confirmRequirements()
              }
            />
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[#fafbfc] px-4">
              <div className="max-w-md text-center">
                <h2 className="text-xl font-semibold text-[#181d27]">
                  Start your first evaluation
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#535862]">
                  Each evaluation has independent requirements, conversation,
                  shortlist, evidence, and recommendation.
                </p>
                <button
                  type="button"
                  onClick={() => void workspace.newEvaluation()}
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#0e4cc7]"
                >
                  <Plus size={16} />
                  New evaluation
                </button>
              </div>
            </div>
          )}
        </main>

        <div className="hidden min-h-0 xl:block">
          {evaluation ? (
            <DecisionWorkspace
              evaluation={evaluation}
              onReorder={(productIds) =>
                void workspace.reorderShortlist(productIds)
              }
              onRemove={(productId) =>
                void workspace.removeFromShortlist(productId)
              }
              onToggleShortlist={(productId, shortlisted) =>
                shortlisted
                  ? workspace.removeFromShortlist(productId)
                  : workspace.addToShortlist(productId)
              }
              onCompare={(productIds) =>
                void openComparison(productIds)
              }
              onGenerateRecommendation={() =>
                void workspace.generateRecommendation()
              }
              onRetry={() => void workspace.retryRegeneration()}
              collapsed={decisionSidebarCollapsed}
              onToggleCollapsed={() =>
                setDecisionSidebarCollapsed(
                  (collapsed) => !collapsed,
                )
              }
            />
          ) : null}
        </div>
      </div>

      {evaluationsOpen ? (
        <div className="fixed inset-0 z-40 bg-[#101828]/30 lg:hidden">
          <div className="h-full w-[min(88vw,310px)] border-r border-[#e9eaeb] bg-white shadow-xl">
            <EvaluationSidebar
              evaluations={workspace.state.summaries}
              activeEvaluationId={workspace.state.activeEvaluationId}
              onSelect={(evaluationId) => {
                setEvaluationsOpen(false)
                void workspace.selectEvaluation(evaluationId)
              }}
              onNew={() => {
                setEvaluationsOpen(false)
                void workspace.newEvaluation()
              }}
              onRename={(item) => void rename(item)}
              onDuplicate={(evaluationId) =>
                void workspace.duplicate(evaluationId)
              }
              onArchive={(evaluationId) =>
                void remove(evaluationId, true)
              }
              onDelete={(evaluationId) =>
                void remove(evaluationId, false)
              }
              onClose={() => setEvaluationsOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {decisionsOpen && evaluation ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-[#101828]/30 xl:hidden">
          <div className="h-full w-[min(94vw,390px)] bg-white shadow-xl">
            <DecisionWorkspace
              evaluation={evaluation}
              onReorder={(productIds) =>
                void workspace.reorderShortlist(productIds)
              }
              onRemove={(productId) =>
                void workspace.removeFromShortlist(productId)
              }
              onToggleShortlist={(productId, shortlisted) =>
                shortlisted
                  ? workspace.removeFromShortlist(productId)
                  : workspace.addToShortlist(productId)
              }
              onCompare={(productIds) =>
                void openComparison(productIds)
              }
              onGenerateRecommendation={() =>
                void workspace.generateRecommendation()
              }
              onRetry={() => void workspace.retryRegeneration()}
              onClose={() => setDecisionsOpen(false)}
            />
          </div>
        </div>
      ) : null}

    </div>
  )
}
