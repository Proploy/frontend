'use client'

import { LoaderCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  type EvaluationSummary,
  useEvaluationWorkspace,
} from '@/features/ai-workspace'
import { deriveJourney } from '@/features/ai-workspace/journey'
import { AgentResultsSidebar } from './AgentResultsSidebar'
import { DecisionBoard } from './DecisionBoard'
import { DocumentCard } from './DocumentCard'
import { EvaluationHeader } from './EvaluationHeader'
import { EvaluationSidebar } from './EvaluationSidebar'
import { SamConversation } from './SamConversation'
import { WelcomeState } from './WelcomeState'

export function SoftwareProcurementWorkspace() {
  const { user, isLoading: authLoading } = useAuth()
  const workspace = useEvaluationWorkspace()
  const [evaluationsOpen, setEvaluationsOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // A requirement chip in the results panel pushes text into the composer;
  // the nonce lets the same prompt be offered twice in a row.
  const [prefill, setPrefill] = useState<{ text: string; nonce: number } | null>(null)
  const askSam = (text: string) => setPrefill({ text, nonce: Date.now() })

  const [resultsCollapsed, setResultsCollapsed] = useState(false)
  const [resultsOpen, setResultsOpen] = useState(false)
  // The same three lanes as the results column, opened across the workspace.
  const [boardOpen, setBoardOpen] = useState(false)
  // A brief Sam finished, opened over the workspace. The transcript keeps its
  // own copy; this is the way in from the board, where the column is too
  // narrow to read one in place.
  const [openDocId, setOpenDocId] = useState<string | null>(null)
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

  const openDocument = (docId: string) => {
    setResultsOpen(false)
    setOpenDocId(docId)
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
        className="fixed inset-0 flex min-h-0 flex-col overflow-hidden overscroll-none bg-paper font-inter text-ink"
      >
        <div className="grid h-full min-w-0 grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_360px]">
          {/* Sidebar skeleton */}
          <aside className="hidden min-h-0 border-r border-border lg:flex lg:flex-col">
            <div className="flex min-h-[80px] items-center justify-between border-b border-border px-[16px]">
              <Skeleton className="h-[34px] w-[142px] rounded-[6px]" />
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
            <div className="flex items-center justify-between border-b border-border px-[24px] py-[16px]">
              <div className="flex flex-col gap-[6px]">
                <Skeleton className="h-[20px] w-[200px] rounded-[6px]" />
                <Skeleton className="h-[12px] w-[140px] rounded-[4px]" />
              </div>
              <div className="flex items-center gap-[8px]">
                <Skeleton className="h-[36px] w-[80px] rounded-[8px]" />
                <Skeleton className="h-[36px] w-[100px] rounded-[8px]" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[16px] overflow-hidden bg-paper p-[24px]">
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
              <div className="mt-8 flex flex-col items-center justify-center gap-4 pb-12">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#e9eaeb]">
                  <LoaderCircle size={24} className="animate-spin text-cobalt motion-reduce:animate-none" />
                </div>
                <span className="text-[15px] font-medium text-ink-soft">Preparing your workspace...</span>
              </div>
            </div>
            <div className="flex min-h-[88px] w-full items-center border-t border-border bg-white px-4 sm:px-6">
              <div className="mx-auto flex w-full max-w-[960px] items-end gap-2 rounded-2xl border border-border bg-white p-2.5">
                <Skeleton className="h-[44px] flex-1 rounded-[8px]" />
                <Skeleton className="size-[40px] shrink-0 rounded-xl" />
              </div>
            </div>
          </main>

          {/* Results sidebar skeleton */}
          <aside className="hidden min-h-0 border-l border-border xl:flex xl:flex-col">
            <div className="border-b border-border px-[20px] py-[14px]">
              <Skeleton className="h-[18px] w-[140px] rounded-[4px]" />
            </div>
            <div className="flex flex-col gap-[12px] p-[16px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-[8px] rounded-[12px] border border-border p-[12px]">
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
      <div className="flex h-dvh items-center justify-center bg-paper px-4 font-inter">
        <div className="glass-card max-w-md rounded-2xl p-8 text-center">
          <span className="label">Ask Sam</span>
          <h1 className="display mt-3 text-[1.75rem] text-ink">
            Sign in to work with Sam
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Your evaluations and the products Sam recommends are saved
            privately to your account.
          </p>
        </div>
      </div>
    )
  }

  const evaluation = workspace.activeEvaluation
  const openBrief = evaluation && openDocId
    ? deriveJourney(evaluation).documents.find((doc) => doc.doc_id === openDocId) ?? null
    : null
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
  const workspaceColumns = evaluation
    ? sidebarCollapsed
      ? resultsCollapsed
        ? 'lg:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[72px_minmax(600px,1fr)_52px]'
        : 'lg:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[72px_minmax(600px,1fr)_360px]'
      : resultsCollapsed
        ? 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_52px]'
        : 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_360px]'
    : sidebarCollapsed
      ? 'lg:grid-cols-[72px_minmax(0,1fr)]'
      : 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]'

  return (
    // Pinned to the viewport so the page itself can never scroll past the
    // workspace; every scrollable region inside contains its own overscroll.
    <div className="fixed inset-0 min-h-0 overflow-hidden overscroll-none bg-paper font-inter text-ink">
      <div
        className={`grid h-full min-w-0 grid-cols-1 transition-[grid-template-columns] duration-300 ease-out ${workspaceColumns}`}
      >
        <div className="hidden min-h-0 border-r border-border lg:block">
          <EvaluationSidebar
            evaluations={workspace.state.summaries}
            activeEvaluationId={workspace.state.activeEvaluationId}
            onSelect={(evaluationId) =>
              void workspace.selectEvaluation(evaluationId)
            }
            onNew={() => void workspace.newEvaluation()}
            onRename={rename}
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
            onOpenResults={() => setResultsOpen(true)}
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
              onExportDocument={(docId) => workspace.exportDocumentPdf(docId)}
              prefill={prefill}
            />
          ) : (
            <section className="flex min-h-0 flex-1 flex-col bg-white">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <WelcomeState
                  disabled={workspace.isStartingEvaluation}
                  onPrompt={(message) =>
                    void workspace.startEvaluation(message)
                  }
                />
              </div>
            </section>
          )}
        </main>

        {evaluation ? (
          <div className="hidden min-h-0 xl:block">
            <AgentResultsSidebar
              evaluation={evaluation}
              collapsed={resultsCollapsed}
              onToggleCollapsed={() =>
                setResultsCollapsed((collapsed) => !collapsed)
              }
              busy={workspace.isSending}
              onToggleShortlist={(product) =>
                void workspace.toggleShortlist(product)
              }
              onExpandBoard={() => setBoardOpen(true)}
              onRequestComparisonBrief={(products) =>
                void workspace.requestComparisonBrief(products)
              }
              onRequestImplementationBrief={(product) =>
                void workspace.requestImplementationBrief(product)
              }
              onOpenDocument={openDocument}
              onAsk={askSam}
            />
          </div>
        ) : null}
      </div>

      {evaluationsOpen ? (
        <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden">
          <div className="h-full w-[min(88vw,310px)] border-r border-border bg-white shadow-xl">
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
              onRename={rename}
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

      {resultsOpen && evaluation ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-ink/40 xl:hidden">
          <div className="h-full w-[min(94vw,390px)] bg-white shadow-xl">
            <AgentResultsSidebar
              evaluation={evaluation}
              onClose={() => setResultsOpen(false)}
              busy={workspace.isSending}
              onToggleShortlist={(product) =>
                void workspace.toggleShortlist(product)
              }
              onRequestComparisonBrief={(products) => {
                setResultsOpen(false)
                void workspace.requestComparisonBrief(products)
              }}
              onRequestImplementationBrief={(product) => {
                setResultsOpen(false)
                void workspace.requestImplementationBrief(product)
              }}
              onOpenDocument={openDocument}
              onAsk={(text) => {
                setResultsOpen(false)
                askSam(text)
              }}
            />
          </div>
        </div>
      ) : null}

      {boardOpen && evaluation ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-ink/40 p-3 sm:p-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="label">Sam&apos;s decision</p>
                <h2 className="display mt-1 text-[1.25rem] text-ink">{evaluation.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setBoardOpen(false)}
                aria-label="Close decision board"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-white text-ink"
              >
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-5">
              <DecisionBoard
                layout="columns"
                journey={deriveJourney(evaluation)}
                shortlist={evaluation.shortlist ?? []}
                busy={workspace.isSending}
                onToggleShortlist={(product) => void workspace.toggleShortlist(product)}
                onRequestComparisonBrief={(products) => {
                  setBoardOpen(false)
                  void workspace.requestComparisonBrief(products)
                }}
                onRequestImplementationBrief={(product) => {
                  setBoardOpen(false)
                  void workspace.requestImplementationBrief(product)
                }}
                onOpenDocument={openDocument}
              />
            </div>
          </div>
        </div>
      ) : null}

      {openBrief && evaluation ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink/50 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={openBrief.title}
          onClick={() => setOpenDocId(null)}
        >
          <div
            className="mx-auto flex min-h-0 w-full max-w-[900px] flex-1 flex-col overflow-hidden rounded-2xl bg-paper shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-end border-b border-border bg-white px-3 py-2">
              <button
                type="button"
                onClick={() => setOpenDocId(null)}
                aria-label="Close brief"
                className="grid size-8 place-items-center rounded-full border border-border bg-white text-ink"
              >
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4">
              <DocumentCard
                document={openBrief}
                onExportPdf={(docId) => workspace.exportDocumentPdf(docId)}
              />
            </div>
          </div>
        </div>
      ) : null}

    </div>
  )
}
