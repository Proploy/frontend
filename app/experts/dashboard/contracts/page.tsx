'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CheckCircle2,
  Clock3,
  FileSignature,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW, DashboardShell } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { SignaturePad } from '@/components/experts/dashboard/SignaturePad'
import { ContractActions } from '@/components/experts/dashboard/ContractActions'
import { FileDropzone } from '@/components/experts/dashboard/FileDropzone'
import { useContracts } from '@/lib/contracts/contracts-store'
import {
  CONTRACT_STATUS_META,
  CONTRACT_TEMPLATES,
  type Contract,
  type ContractParty,
  type ContractSignature,
  type ContractStatus,
  type ContractTemplateKey,
  type PartyRole,
} from '@/hooks/types/contracts-doc'
import { contractTotalCents, dateTime, longDate, money } from '@/lib/documents/contract-format'

const TABS: { id: 'all' | ContractStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'awaiting_signature', label: 'Awaiting signature' },
  { id: 'signed', label: 'Signed' },
]

export default function ContractsPage() {
  const { contracts, getContract, signContract, deleteContract } = useContracts()
  const [selectedId, setSelectedId] = useState<string | null>(contracts[0]?.id ?? null)
  const [tab, setTab] = useState<'all' | ContractStatus>('all')
  const [query, setQuery] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [signingRole, setSigningRole] = useState<PartyRole | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return contracts.filter((c) => {
      if (tab !== 'all' && c.status !== tab) return false
      if (!q) return true
      return (
        c.title.toLowerCase().includes(q) ||
        c.client.org.toLowerCase().includes(q) ||
        c.project.toLowerCase().includes(q)
      )
    })
  }, [contracts, tab, query])

  const selected = (selectedId && getContract(selectedId)) || contracts[0] || null

  return (
    <DashboardShell>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <FileSignature size={22} className="text-[#155eef]" />
              Contracts
            </h1>
            <p className="text-[14px] leading-[20px] text-[#535862]">
              Draft from a template or upload, e-sign in the browser, and export a signed PDF or DOCX.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
          >
            <Plus size={18} /> New contract
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* list */}
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[380px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="flex flex-col gap-[12px] border-b border-[#e9eaeb] p-[16px]">
              <div className="relative">
                <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search contracts"
                  className={`w-full rounded-[8px] border border-[#d5d7da] bg-white py-[8px] pl-[36px] pr-[12px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                />
              </div>
              <div className="flex gap-[4px] overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`whitespace-nowrap rounded-[6px] px-[10px] py-[6px] text-[13px] font-semibold leading-[18px] transition-colors ${
                      tab === t.id ? 'bg-[#eff4ff] text-[#155eef]' : 'text-[#535862] hover:bg-[#fafafa]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No contracts match.
                </p>
              )}
              {visible.map((c) => {
                const meta = CONTRACT_STATUS_META[c.status]
                const active = c.id === selected?.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <span className="line-clamp-2 text-[14px] font-semibold leading-[20px] text-[#181d27]">
                      {c.title}
                    </span>
                    <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#535862]">{c.client.org}</p>
                    <div className="mt-[8px] flex items-center justify-between gap-[8px]">
                      <span
                        className="inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
                      <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">
                        {money(contractTotalCents(c), c.currency)}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* document */}
          <section className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa] p-[24px]">
            {selected ? (
              <>
                <ContractDoc contract={selected} />

                <div className="mx-auto mt-[16px] flex max-w-[760px] flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
                  <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
                    <ShieldCheck size={16} className="text-[#17b26a]" />
                    Signed copies are stored and timestamped for both parties.
                  </span>
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={() => {
                        deleteContract(selected.id)
                        setSelectedId(null)
                      }}
                      className="flex size-[40px] items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-[#fef3f2] hover:text-[#d92d20]"
                      aria-label="Delete contract"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ContractActions contract={selected} />
                    {selected.signatures.provider ? (
                      <span className="inline-flex items-center gap-[8px] rounded-[8px] bg-[#ecfdf3] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#067647]">
                        <CheckCircle2 size={18} /> You signed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSigningRole('provider')}
                        className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
                      >
                        <PenLine size={18} /> Sign contract
                      </button>
                    )}
                    {selected.signatures.provider && !selected.signatures.client && (
                      <button
                        type="button"
                        onClick={() => setSigningRole('client')}
                        className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
                      >
                        <PenLine size={18} /> Counter-sign as client
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <FileSignature size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No contract selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Create a new contract from a template or upload one to get started.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowNew(true)}
                    className={`mt-[16px] inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white ${BUTTON_SKEUO}`}
                  >
                    <Plus size={18} /> New contract
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {showNew && (
        <NewContractModal
          onClose={() => setShowNew(false)}
          onCreated={(id) => {
            setShowNew(false)
            setSelectedId(id)
          }}
        />
      )}

      {signingRole && selected && (
        <SignModal
          role={signingRole}
          party={signingRole === 'provider' ? selected.provider : selected.client}
          onClose={() => setSigningRole(null)}
          onSign={(sig) => {
            signContract(selected.id, signingRole, sig)
            setSigningRole(null)
          }}
        />
      )}
    </DashboardShell>
  )
}

/* ------------------------------------------------------------------ document */

function ContractDoc({ contract }: { contract: Contract }) {
  const meta = CONTRACT_STATUS_META[contract.status]
  const total = contractTotalCents(contract)
  return (
    <article className={`mx-auto max-w-[760px] rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
      <div className="border-b border-[#e9eaeb] px-[32px] pb-[24px] pt-[32px]">
        <div className="flex items-center justify-between gap-[12px]">
          <span
            className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
            style={{ color: meta.color, background: meta.bg }}
          >
            <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
            {meta.label}
          </span>
          <span className="text-[13px] leading-[18px] text-[#717680]">Created {longDate(contract.createdAt)}</span>
        </div>
        <h2 className="mt-[16px] text-[24px] font-semibold leading-[32px] tracking-[-0.4px] text-[#181d27]">
          {contract.title}
        </h2>
        <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">{contract.project}</p>
        {contract.uploadedDocName && (
          <p className="mt-[8px] inline-flex items-center gap-[6px] rounded-[6px] bg-[#fafafa] px-[10px] py-[4px] text-[13px] text-[#535862]">
            <FileSignature size={14} className="text-[#717680]" /> {contract.uploadedDocName}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-[16px] border-b border-[#e9eaeb] px-[32px] py-[24px] sm:grid-cols-2">
        <PartyCard label="Provider" party={contract.provider} />
        <PartyCard label="Client" party={contract.client} />
      </div>

      <div className="border-b border-[#e9eaeb] px-[32px] py-[24px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Scope of work</p>
        <p className="mt-[10px] text-[15px] leading-[24px] text-[#252b37]">{contract.scope}</p>
      </div>

      <div className="border-b border-[#e9eaeb] px-[32px] py-[24px]">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Payment schedule</p>
          <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">
            Total {money(total, contract.currency)}
          </p>
        </div>
        <div className="mt-[12px] overflow-hidden rounded-[12px] border border-[#e9eaeb]">
          {contract.milestones.map((m, i) => (
            <div
              key={m.id}
              className={`flex items-center justify-between gap-[12px] px-[16px] py-[12px] ${i > 0 ? 'border-t border-[#e9eaeb]' : ''}`}
            >
              <span className="flex min-w-0 items-center gap-[10px]">
                <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[12px] font-semibold text-[#155eef]">
                  {i + 1}
                </span>
                <span className="truncate text-[14px] leading-[20px] text-[#252b37]">{m.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-[16px]">
                <span className="text-[13px] leading-[18px] text-[#717680]">Due {longDate(m.due)}</span>
                <span className="w-[90px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">
                  {money(m.amountCents, contract.currency)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-[32px] py-[24px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Signatures</p>
        <div className="mt-[12px] grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <SignatureView party={contract.provider} sig={contract.signatures.provider} />
          <SignatureView party={contract.client} sig={contract.signatures.client} />
        </div>
      </div>
    </article>
  )
}

function PartyCard({ label, party }: { label: string; party: ContractParty }) {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">{label}</p>
      <div className="mt-[10px] flex items-center gap-[10px]">
        <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#155eef] text-[14px] font-semibold text-white">
          {party.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{party.name}</span>
          <span className="block truncate text-[13px] leading-[18px] text-[#535862]">{party.org}</span>
        </span>
      </div>
    </div>
  )
}

function SignatureView({ party, sig }: { party: ContractParty; sig?: ContractSignature }) {
  return (
    <div
      className={`rounded-[12px] border p-[16px] ${
        sig ? 'border-[#a9efc5] bg-[#f6fef9]' : 'border-dashed border-[#d5d7da] bg-[#fafafa]'
      }`}
    >
      <div className="flex h-[56px] items-center">
        {sig ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sig.dataUrl} alt={`${sig.signedName} signature`} className="max-h-[52px] max-w-full object-contain" />
        ) : (
          <span className="flex items-center gap-[8px] text-[14px] leading-[20px] text-[#717680]">
            <Clock3 size={16} /> Awaiting signature
          </span>
        )}
      </div>
      <div className="mt-[10px] border-t border-[#e9eaeb] pt-[10px]">
        <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{sig?.signedName || party.name}</p>
        <p className="text-[13px] leading-[18px] text-[#535862]">{party.org}</p>
        {sig && <p className="mt-[2px] text-[12px] leading-[18px] text-[#717680]">Signed {dateTime(sig.signedAt)}</p>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ sign modal */

function SignModal({
  role,
  party,
  onClose,
  onSign,
}: {
  role: PartyRole
  party: ContractParty
  onClose: () => void
  onSign: (sig: Omit<ContractSignature, 'role'>) => void
}) {
  return (
    <Overlay onClose={onClose} title={role === 'provider' ? 'Sign contract' : 'Counter-sign as client'}>
      <p className="mb-[16px] text-[14px] leading-[20px] text-[#535862]">
        Signing as <span className="font-semibold text-[#181d27]">{party.name}</span> · {party.org}
      </p>
      <SignaturePad
        defaultName={party.name}
        onCancel={onClose}
        onSave={({ dataUrl, signedName }) =>
          onSign({ dataUrl, signedName, signedAt: new Date().toISOString() })
        }
      />
    </Overlay>
  )
}

/* ------------------------------------------------------------------ new-contract modal */

type FormValues = {
  templateKey: ContractTemplateKey
  title: string
  project: string
  clientName: string
  clientOrg: string
  clientEmail: string
}

function NewContractModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const { addContract, addUploadedContract } = useContracts()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { templateKey: 'fixed_bid', title: '', project: '', clientName: '', clientOrg: '', clientEmail: '' },
  })
  const templateKey = watch('templateKey')

  const submit = (v: FormValues) => {
    const client = { name: v.clientName, org: v.clientOrg, email: v.clientEmail }
    const base = { templateKey: v.templateKey, title: v.title, project: v.project, client }
    const created = uploadFile
      ? addUploadedContract({ ...base, fileName: uploadFile.name })
      : addContract(base)
    onCreated(created.id)
  }

  const inputCls = `w-full rounded-[8px] border bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`

  return (
    <Overlay onClose={onClose} title="New contract">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium leading-[20px] text-[#414651]">Template</label>
          <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
            {CONTRACT_TEMPLATES.map((t) => {
              const active = templateKey === t.key
              return (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => setValue('templateKey', t.key)}
                  className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                    active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb] hover:bg-[#fafafa]'
                  }`}
                >
                  <span className="block text-[14px] font-semibold leading-[20px] text-[#181d27]">{t.name}</span>
                  <span className="mt-[2px] block text-[13px] leading-[18px] text-[#535862]">{t.blurb}</span>
                </button>
              )
            })}
          </div>
        </div>

        <Field label="Contract title" error={errors.title?.message}>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g. Salesforce CRM rollout — Fixed-bid SOW"
            className={`${inputCls} ${errors.title ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
          />
        </Field>

        <Field label="Project" error={errors.project?.message}>
          <input
            {...register('project', { required: 'Project is required' })}
            placeholder="e.g. Northwind CRM migration"
            className={`${inputCls} ${errors.project ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
          />
        </Field>

        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3">
          <Field label="Client name" error={errors.clientName?.message}>
            <input
              {...register('clientName', { required: 'Required' })}
              placeholder="Dana Whitfield"
              className={`${inputCls} ${errors.clientName ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
            />
          </Field>
          <Field label="Client company" error={errors.clientOrg?.message}>
            <input
              {...register('clientOrg', { required: 'Required' })}
              placeholder="Northwind Trading"
              className={`${inputCls} ${errors.clientOrg ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
            />
          </Field>
          <Field label="Client email" error={errors.clientEmail?.message}>
            <input
              type="email"
              {...register('clientEmail', { required: 'Required' })}
              placeholder="dana@northwind.com"
              className={`${inputCls} ${errors.clientEmail ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium leading-[20px] text-[#414651]">
            Upload an existing document <span className="text-[#717680]">(optional)</span>
          </label>
          <FileDropzone
            accept={{ 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
            hint="PDF or DOCX — milestones still come from the chosen template"
            fileName={uploadFile?.name ?? null}
            onFiles={(files) => setUploadFile(files[0] ?? null)}
            onClear={() => setUploadFile(null)}
          />
        </div>

        <div className="flex items-center justify-end gap-[10px] border-t border-[#e9eaeb] pt-[16px]">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
          >
            Create contract
          </button>
        </div>
      </form>
    </Overlay>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[14px] font-medium leading-[20px] text-[#414651]">{label}</label>
      {children}
      {error && <span className="text-[13px] leading-[18px] text-[#d92d20]">{error}</span>}
    </div>
  )
}

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a0d12]/40 p-[24px] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="my-[24px] w-full max-w-[640px] rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[18px]">
          <h2 className="text-[18px] font-semibold leading-[28px] text-[#181d27]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#181d27]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-[24px]">{children}</div>
      </div>
    </div>
  )
}
