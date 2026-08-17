'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, FileText, PenLine, RefreshCw, Save, Send, XCircle } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  contractStatusClass,
  engagementTitle,
  longDate,
  relativeDate,
  statusLabelForViewer,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type { WorkspaceContract } from '@/features/workspace/home-types'
import type { WorkspaceEngagement, WorkspaceRole } from '@/features/workspace/types'
import { useWorkspaceQueryParam } from '@/features/workspace/use-workspace-query-param'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import {
  CONTRACT_FIELDS,
  contractContentCompleteness,
  contractFieldValuesFromBody,
  contractSignerAction,
  parseContractSections,
  type ContractFieldKey,
  type ContractFieldValues,
} from '@/features/workspace/contract-format'

type ContractBusyAction = 'save' | 'send' | 'cancel' | 'decline' | 'sign'

export default function WorkspaceContractsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const requestedContractId = useWorkspaceQueryParam('contract')
  const [contracts, setContracts] = useState<WorkspaceContract[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyAction, setBusyAction] = useState<ContractBusyAction | null>(null)
  const [refreshNonce, setRefreshNonce] = useState(0)
  const [signatureName, setSignatureName] = useState('')
  const [signedDocumentUrl, setSignedDocumentUrl] = useState<string | null>(null)
  const [documentLoading, setDocumentLoading] = useState(false)
  const [signedDocumentPreviewOpen, setSignedDocumentPreviewOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (signedDocumentUrl) URL.revokeObjectURL(signedDocumentUrl)
    }
  }, [signedDocumentUrl])

  useEffect(() => {
    if (!signedDocumentPreviewOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSignedDocumentPreviewOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [signedDocumentPreviewOpen])

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setErrorMessage(null)
      try {
        const result = await workspace.listContracts()
        if (cancelled) return
        const engagementResult = await workspace.listEngagements()
        if (cancelled) return
        if (result.ok) {
          setContracts(result.data.contracts ?? [])
          setSelectedId(
            (current) => current ?? requestedContractId ?? result.data.contracts[0]?.id ?? null,
          )
        } else {
          setContracts([])
          setError(result)
        }
        if (engagementResult.ok) {
          setEngagements(engagementResult.data.engagements)
        } else {
          setError((current) => current ?? engagementResult)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [refreshNonce, requestedContractId, state.isPending, state.user, workspace])

  useEffect(() => {
    if (!requestedContractId || !contracts.some((contract) => contract.id === requestedContractId)) return
    setSelectedId(requestedContractId)
  }, [contracts, requestedContractId])

  const sorted = useMemo(
    () => contracts.slice().sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime()),
    [contracts],
  )
  const selected = sorted.find((contract) => contract.id === selectedId) ?? sorted[0] ?? null
  const engagementMap = useMemo(
    () => new Map(engagements.map((engagement) => [engagement.id, engagement])),
    [engagements],
  )
  const selectedEngagementLabel = selected
    ? engagementMap.get(selected.engagementId)
      ? engagementTitle(engagementMap.get(selected.engagementId)!, state.role)
      : 'Engagement'
    : 'Engagement'
  const isExpert = state.role === 'expert'
  const signingRole = state.role === 'buyer' || state.role === 'expert' ? state.role : null

  function replaceContract(contract: WorkspaceContract) {
    setContracts((current) => current.map((item) => (item.id === contract.id ? contract : item)))
    setSelectedId(contract.id)
    setError(null)
    setErrorMessage(null)
    setSignedDocumentUrl(null)
    setSignedDocumentPreviewOpen(false)
  }

  async function send(contract: WorkspaceContract) {
    if (busyAction) return
    setBusyAction('send')
    setErrorMessage(null)
    try {
      const result = await workspace.sendContract(contract.id)
      if (result.ok) replaceContract(result.data)
      else setError(result)
    } finally {
      setBusyAction(null)
    }
  }

  async function update(contract: WorkspaceContract, fieldValues: ContractFieldValues) {
    if (busyAction) return
    setBusyAction('save')
    setErrorMessage(null)
    try {
      const result = await workspace.updateContract(contract.id, { fieldValues })
      if (result.ok) replaceContract(result.data)
      else setError(result)
    } finally {
      setBusyAction(null)
    }
  }

  async function cancel(contract: WorkspaceContract) {
    if (busyAction) return
    setBusyAction('cancel')
    setErrorMessage(null)
    try {
      const result = await workspace.cancelContract(contract.id)
      if (result.ok) replaceContract(result.data)
      else setError(result)
    } finally {
      setBusyAction(null)
    }
  }

  async function decline(contract: WorkspaceContract) {
    if (busyAction) return
    setBusyAction('decline')
    setError(null)
    setErrorMessage(null)
    try {
      const result = await workspace.declineContract(contract.id)
      if (result.ok) replaceContract(result.data)
      else setError(result)
    } finally {
      setBusyAction(null)
    }
  }

  async function sign(contract: WorkspaceContract) {
    if (!signingRole) return
    const name = signatureName.trim()
    if (!name) {
      setErrorMessage('Enter the signer name before signing.')
      return
    }

    if (busyAction) return
    setBusyAction('sign')
    setError(null)
    setErrorMessage(null)
    try {
      const result = await workspace.signContract(contract.id, {
        role: signingRole,
        name,
      })
      if (result.ok) {
        replaceContract(result.data)
        setSignatureName('')
      } else {
        setError(result)
      }
    } finally {
      setBusyAction(null)
    }
  }

  async function loadSignedDocument(contract: WorkspaceContract) {
    setDocumentLoading(true)
    setError(null)
    try {
      const result = await workspace.downloadSignedContractDocument(contract.id)
      if (result.ok) {
        setSignedDocumentUrl((current) => {
          if (current) URL.revokeObjectURL(current)
          return URL.createObjectURL(result.data)
        })
      } else {
        setError(result)
      }
    } finally {
      setDocumentLoading(false)
    }
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/contracts" />

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <FileText size={22} className="text-[#155eef]" />
              Contracts
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setRefreshNonce((current) => current + 1)}
            disabled={loading}
            className={`inline-flex items-center gap-[7px] rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[8px] text-[13px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-[#155eef]' : 'text-[#155eef]'} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to refresh contracts.'}
          </div>
        )}
        {errorMessage && (
          <div className="border-b border-[#fda29b] bg-[#fef3f2] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b42318]">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[420px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="border-b border-[#e9eaeb] px-[16px] py-[14px]">
              <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">All contracts</h2>
              <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">
                {sorted.length === 0 ? 'No contracts yet.' : `${sorted.length} contract${sorted.length === 1 ? '' : 's'} on file.`}
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {sorted.length === 0 && !loading ? <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">Contracts appear after a proposal is accepted.</p> : null}
              {sorted.map((contract) => (
                <button
                  key={contract.id}
                  type="button"
                  onClick={() => setSelectedId(contract.id)}
                  className={`rounded-[10px] border p-[12px] text-left transition-colors ${selected?.id === contract.id ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'}`}
                >
                  <div className="flex items-start justify-between gap-[8px]">
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{contract.title}</span>
                      <span className="mt-[2px] block truncate text-[13px] leading-[18px] text-[#535862]">{engagementMap.get(contract.engagementId) ? engagementTitle(engagementMap.get(contract.engagementId)!, state.role) : 'Engagement'}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${contractStatusClass(contract.status)}`}>{statusLabelForViewer(contract.status, state.role)}</span>
                  </div>
                  <p className="mt-[8px] text-[12px] leading-[18px] text-[#717680]">Updated {relativeDate(contract.updatedAt)}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <ContractDetail
                key={`${selected.id}:${selected.updatedAt}`}
                contract={selected}
                busy={busyAction !== null}
                busyAction={busyAction}
                isExpert={isExpert}
                isBuyer={state.role === 'buyer'}
                signingRole={signingRole}
                signatureName={signatureName}
                onSignatureNameChange={setSignatureName}
                onUpdate={(fieldValues) => void update(selected, fieldValues)}
                onSend={() => void send(selected)}
                onCancel={() => void cancel(selected)}
                onDecline={() => void decline(selected)}
                onSign={() => void sign(selected)}
                onLoadSignedDocument={() => void loadSignedDocument(selected)}
                onOpenSignedDocument={() => setSignedDocumentPreviewOpen(true)}
                onCloseSignedDocument={() => setSignedDocumentPreviewOpen(false)}
                signedDocumentUrl={signedDocumentUrl}
                signedDocumentPreviewOpen={signedDocumentPreviewOpen}
                documentLoading={documentLoading}
                engagementLabel={selectedEngagementLabel}
                viewerRole={state.role}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <FileText size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No contract selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">Accepting a proposal creates the first contract draft.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </WorkspaceShell>
  )
}

function ContractDetail({
  contract,
  busy,
  busyAction,
  isExpert,
  isBuyer,
  signingRole,
  signatureName,
  onSignatureNameChange,
  onUpdate,
  onSend,
  onCancel,
  onDecline,
  onSign,
  onLoadSignedDocument,
  onOpenSignedDocument,
  onCloseSignedDocument,
  signedDocumentUrl,
  signedDocumentPreviewOpen,
  documentLoading,
  engagementLabel,
  viewerRole,
}: {
  contract: WorkspaceContract
  busy: boolean
  busyAction: ContractBusyAction | null
  isExpert: boolean
  isBuyer: boolean
  signingRole: 'buyer' | 'expert' | null
  signatureName: string
  onSignatureNameChange: (value: string) => void
  onUpdate: (fieldValues: ContractFieldValues) => void
  onSend: () => void
  onCancel: () => void
  onDecline: () => void
  onSign: () => void
  onLoadSignedDocument: () => void
  onOpenSignedDocument: () => void
  onCloseSignedDocument: () => void
  signedDocumentUrl: string | null
  signedDocumentPreviewOpen: boolean
  documentLoading: boolean
  engagementLabel: string
  viewerRole: WorkspaceRole | null
}) {
  const canBuyerSign = signingRole === 'buyer' && contract.status === 'sent'
  const canExpertSign = signingRole === 'expert' && contract.status === 'buyer_signed'
  const canSign = canBuyerSign || canExpertSign
  const signerAction = signingRole ? contractSignerAction(signingRole, contract.status) : 'none'
  const [fieldValues, setFieldValues] = useState<ContractFieldValues>(() => contractFieldValuesFromBody(contract.bodyMarkdown))
  const sections = useMemo(() => parseContractSections(contract.bodyMarkdown), [contract.bodyMarkdown])
  const savedCompleteness = useMemo(
    () => contractContentCompleteness(contractFieldValuesFromBody(contract.bodyMarkdown)),
    [contract.bodyMarkdown],
  )

  const section = (title: string) => sections.find((item) => item.title.trim().toLowerCase() === title.toLowerCase())
  const brief = section('Agreement brief')
  const parties = section('Parties')
  const displaySections = sections.filter((item) => !['title', 'details', 'agreement brief', 'parties', 'signatures'].includes(item.title.trim().toLowerCase()))

  function setField(key: ContractFieldKey, value: string) {
    setFieldValues((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-[16px]">
      <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
        <div className="border-b border-[#e9eaeb] px-[32px] pb-[24px] pt-[32px]">
          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <span className={`rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${contractStatusClass(contract.status)}`}>{statusLabelForViewer(contract.status, viewerRole)}</span>
            <span className="text-[12px] font-medium text-[#717680]">Updated {relativeDate(contract.updatedAt)}</span>
          </div>
          <h2 className="mt-[16px] text-[24px] font-semibold leading-[32px] text-[#181d27]">{contract.title}</h2>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">Engagement {engagementLabel}</p>
        </div>

        <div className="grid grid-cols-1 gap-px border-b border-[#e9eaeb] bg-[#e9eaeb] sm:grid-cols-3">
          <FactCell label="Created">{longDate(contract.createdAt)}</FactCell>
          <FactCell label="Buyer signature">{contract.buyerSignedAt ? longDate(contract.buyerSignedAt) : 'Pending'}</FactCell>
          <FactCell label="Expert signature">{contract.expertSignedAt ? longDate(contract.expertSignedAt) : 'Pending'}</FactCell>
        </div>

        <div className="px-[32px] py-[24px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Agreement</p>
          {brief ? (
            <div className="mt-[12px] rounded-[10px] border border-[#bfdbfe] bg-[#eff6ff] px-[16px] py-[14px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#1d4ed8]">Agreement brief</p>
              {brief.paragraphs.map((paragraph) => <p key={paragraph} className="mt-[6px] text-[14px] leading-[22px] text-[#1e3a8a]">{paragraph}</p>)}
            </div>
          ) : null}

          {parties ? (
            <div className="mt-[14px] grid gap-px overflow-hidden rounded-[10px] border border-[#e4e7ec] bg-[#e4e7ec] sm:grid-cols-3">
              {parties.bullets.map((bullet) => {
                const [label, ...rest] = bullet.split(':')
                return <div key={bullet} className="bg-[#f9fafb] px-[14px] py-[12px]"><p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#717680]">{label}</p><p className="mt-[4px] text-[13px] font-semibold leading-[20px] text-[#181d27]">{rest.join(':').trim()}</p></div>
              })}
            </div>
          ) : null}

          <div className="mt-[16px] flex flex-col gap-[12px]">
            {displaySections.map((item) => (
              <div key={item.title} className="rounded-[10px] border border-[#e4e7ec] bg-white px-[16px] py-[14px]">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#155eef]">{item.title}</h3>
                <div className="mt-[8px] flex flex-col gap-[6px] text-[14px] leading-[22px] text-[#344054]">
                  {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {item.bullets.map((bullet) => <p key={bullet} className="flex gap-[8px]"><span className="text-[#155eef]">-</span><span>{bullet}</span></p>)}
                </div>
              </div>
            ))}
          </div>

          {isExpert && (contract.status === 'draft' || contract.status === 'declined') ? (
            <div className="mt-[20px] rounded-[12px] border border-[#dbeafe] bg-[#f8fbff] p-[16px]">
              <div className="flex flex-wrap items-start justify-between gap-[10px]">
                <div>
                  <h3 className="text-[15px] font-semibold text-[#181d27]">{contract.status === 'declined' ? 'Revise and resubmit contract' : 'Complete contract details'}</h3>
                  <p className="mt-[3px] text-[13px] leading-[20px] text-[#535862]">Fill each field before sending this agreement to the buyer. These values are also used in the final signed PDF.</p>
                </div>
                <span className="rounded-full bg-[#e0edff] px-[9px] py-[3px] text-[11px] font-semibold text-[#1d4ed8]">Draft editor</span>
              </div>
              <div className="mt-[14px] grid gap-[12px] md:grid-cols-2">
                {CONTRACT_FIELDS.map((field) => (
                  <label key={field.key} className={`flex flex-col gap-[6px] ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                    <span className="text-[12px] font-semibold text-[#414651]">{field.label}</span>
                    {field.type === 'textarea' ? (
                      <textarea value={fieldValues[field.key]} onChange={(event) => setField(field.key, event.target.value)} rows={3} placeholder={`Enter ${field.label.toLowerCase()}`} className="resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27] placeholder:text-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30" />
                    ) : (
                      <input type={field.type} value={fieldValues[field.key]} onChange={(event) => setField(field.key, event.target.value)} placeholder={`Enter ${field.label.toLowerCase()}`} className="rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27] placeholder:text-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30" />
                    )}
                  </label>
                ))}
              </div>
              <div className="mt-[14px] flex flex-wrap items-center justify-between gap-[10px]">
                <p className="text-[12px] leading-[18px] text-[#667085]">Saving replaces the placeholders in the stored agreement. After saving, use the same send button to resubmit a declined contract.</p>
                <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onUpdate(fieldValues) }} disabled={busy || !contractContentCompleteness(fieldValues).ok} className={`inline-flex items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[13px] py-[9px] text-[13px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                  <Save size={15} /> {busyAction === 'save' ? 'Saving…' : 'Save contract details'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </article>

      <div className="flex flex-col gap-[14px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
        <div className="flex items-start gap-[8px] text-[13px] leading-[18px] text-[#535862]">
          <CheckCircle2 size={16} className="mt-[1px] shrink-0 text-[#17b26a]" />
          <span>Both parties must sign. The buyer signs first, then the expert countersigns.</span>
        </div>
        {contract.status === 'buyer_signed' ? (
          <div className="rounded-[8px] border border-[#dbeafe] bg-[#eff6ff] px-[12px] py-[10px] text-[13px] leading-[18px] text-[#1d4ed8]">
            Buyer signature recorded{contract.buyerSignerName ? ` for ${contract.buyerSignerName}` : ''}. Review the agreement above and countersign to generate the final signed PDF.
          </div>
        ) : null}
        {signingRole && signerAction === 'waiting' ? (
          <div className="rounded-[8px] border border-[#dbeafe] bg-[#f8fbff] px-[12px] py-[11px] text-[13px] leading-[19px] text-[#1d4ed8]">
            {signingRole === 'buyer' && contract.status === 'draft'
              ? 'The expert is still preparing this contract. Save does not send it; the buyer signature action appears after the expert selects Send contract. Refresh after it is sent.'
              : 'Your signing action will appear here after the other party completes their step.'}
          </div>
        ) : null}
        {contract.signedDocumentAvailable ? (
          <div className="flex flex-wrap items-center justify-between gap-[10px] rounded-[8px] border border-[#d1fadf] bg-[#f0fdf4] px-[12px] py-[10px] text-[13px] text-[#067647]">
            <span>
              {contract.status === 'buyer_signed' && isExpert
                ? 'The buyer-signed version is ready for your review and countersignature.'
                : 'A service-stored signed version is available to both parties.'}
            </span>
            <div className="flex items-center gap-[8px]">
              {signedDocumentUrl ? (
                <button type="button" onClick={onOpenSignedDocument} className={`inline-flex items-center gap-[6px] rounded-[8px] bg-white px-[10px] py-[7px] font-semibold text-[#067647] ${BUTTON_SKEUO}`}>
                  <Eye size={15} /> Open signed document
                </button>
              ) : (
                <button type="button" onClick={onLoadSignedDocument} disabled={documentLoading} className={`inline-flex items-center gap-[6px] rounded-[8px] bg-white px-[10px] py-[7px] font-semibold text-[#067647] disabled:opacity-50 ${BUTTON_SKEUO}`}>
                  <Eye size={15} /> {documentLoading ? 'Loading…' : 'View signed version'}
                </button>
              )}
            </div>
          </div>
        ) : null}
        {isExpert && (contract.status === 'draft' || contract.status === 'declined') ? (
          <div className="flex flex-col gap-[10px]">
            {!savedCompleteness.ok ? (
              <div className="rounded-[8px] border border-[#fedf89] bg-[#fffaeb] px-[12px] py-[10px] text-[13px] leading-[19px] text-[#b54708]">
                Complete and save the required fields before sending: {savedCompleteness.missing.join(', ')}.
              </div>
            ) : null}
            <div className="flex flex-wrap justify-end gap-[8px]">
            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onCancel() }} disabled={busy} className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}>
              <XCircle size={17} /> Cancel
            </button>
            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onSend() }} disabled={busy || !savedCompleteness.ok} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
              <Send size={17} /> {busyAction === 'send' ? 'Sending…' : contract.status === 'declined' ? 'Resubmit contract' : 'Send contract'}
            </button>
            </div>
          </div>
        ) : null}
        {isExpert && contract.status === 'sent' ? (
          <div className="flex flex-wrap justify-end gap-[8px]">
            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onCancel() }} disabled={busy} className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}>
              <XCircle size={17} /> Cancel contract
            </button>
            <span className="self-center text-[13px] text-[#717680]">Waiting for the buyer to sign.</span>
          </div>
        ) : null}
        {isBuyer && contract.status === 'sent' ? (
          <div className="flex flex-wrap justify-end gap-[8px] border-t border-[#e9eaeb] pt-[14px]">
            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onDecline() }} disabled={busy} className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#fda29b] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#b42318] disabled:opacity-50 ${BUTTON_SKEUO}`}>
              <XCircle size={17} /> {busyAction === 'decline' ? 'Declining…' : 'Decline contract'}
            </button>
          </div>
        ) : null}
        {canSign ? (
          <div className="flex flex-col gap-[10px] border-t border-[#e9eaeb] pt-[14px]">
            <div className="rounded-[8px] border border-[#d1fadf] bg-[#f0fdf4] px-[12px] py-[10px] text-[13px] font-semibold leading-[19px] text-[#067647]">
              {signingRole === 'buyer' ? 'Your signature is required first.' : 'The buyer has signed. Your countersignature is required.'}
            </div>
            <label className="flex flex-col gap-[6px]">
              <span className="text-[13px] font-semibold leading-[18px] text-[#414651]">Typed signature name</span>
              <input value={signatureName} onChange={(event) => onSignatureNameChange(event.target.value)} placeholder="Your full legal name" className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30" />
            </label>
            <div className="flex justify-end">
              <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onSign() }} disabled={busy || !signatureName.trim()} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                <PenLine size={17} /> {busyAction === 'sign' ? 'Signing…' : `Sign as ${signingRole}`}
              </button>
            </div>
          </div>
        ) : null}
        {contract.status === 'completed' ? <p className="flex items-center gap-[8px] text-[13px] font-semibold text-[#067647]"><CheckCircle2 size={16} /> Fully signed and completed.</p> : null}
      </div>

      {signedDocumentUrl && signedDocumentPreviewOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#101828]/70 p-[16px] sm:p-[28px]"
          role="dialog"
          aria-modal="true"
          aria-label="Signed contract preview"
          onClick={onCloseSignedDocument}
        >
          <div
            className="flex h-[min(90vh,900px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-[12px] border-b border-[#e4e7ec] px-[16px] py-[12px] sm:px-[20px]">
              <div>
                <p className="text-[14px] font-semibold text-[#181d27]">Signed contract preview</p>
                <p className="mt-[2px] text-[12px] text-[#717680]">This document is available only to the parties on this engagement.</p>
              </div>
              <button
                type="button"
                onClick={onCloseSignedDocument}
                aria-label="Close signed contract preview"
                className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}
              >
                <XCircle size={16} /> Close
              </button>
            </div>
            <div className="min-h-0 flex-1 bg-[#f2f4f7] p-[8px] sm:p-[16px]">
              <iframe
                src={signedDocumentUrl}
                title="Signed contract document"
                className="h-full w-full rounded-[8px] border border-[#d5d7da] bg-white"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FactCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-[20px] py-[16px]">
      <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#717680]">{label}</p>
      <p className="mt-[4px] text-[14px] font-semibold leading-[20px] text-[#181d27]">{children}</p>
    </div>
  )
}
