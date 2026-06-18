// Data contracts for the expert Contracts workspace (e-sign + document generation).
// UI-first mock model; persisted to localStorage via lib/contracts/contracts-store.

export type ContractStatus = 'draft' | 'awaiting_signature' | 'signed'

export const CONTRACT_STATUS_META: Record<
  ContractStatus,
  { label: string; color: string; bg: string }
> = {
  draft: { label: 'Draft', color: '#414651', bg: '#fafafa' },
  awaiting_signature: { label: 'Awaiting signature', color: '#b54708', bg: '#fffaeb' },
  signed: { label: 'Signed', color: '#067647', bg: '#ecfdf3' },
}

export type ContractTemplateKey = 'fixed_bid' | 'retainer' | 'discovery' | 'change_order'

export type ContractTemplate = {
  key: ContractTemplateKey
  name: string
  blurb: string
  scope: string
  milestones: { label: string; amountCents: number; offsetDays: number }[]
}

export type PartyRole = 'provider' | 'client'

export type ContractParty = {
  role: PartyRole
  name: string
  org: string
  email: string
}

export type ContractMilestone = {
  id: string
  label: string
  due: string // ISO YYYY-MM-DD
  amountCents: number
}

export type ContractSignature = {
  role: PartyRole
  // base64 PNG data URL captured from SignaturePad (draw / type / upload)
  dataUrl: string
  signedName: string
  signedAt: string // ISO timestamp
}

export type Contract = {
  id: string
  title: string
  project: string
  templateKey: ContractTemplateKey
  currency: string
  createdAt: string // ISO YYYY-MM-DD
  provider: ContractParty
  client: ContractParty
  scope: string
  milestones: ContractMilestone[]
  signatures: Partial<Record<PartyRole, ContractSignature>>
  // name of an uploaded source document, if the contract was uploaded rather than drafted
  uploadedDocName?: string | null
  status: ContractStatus
}

export type ContractsState = {
  contracts: Contract[]
}

// Derive status from signature presence. A contract with no signatures is a
// draft; one signed party means awaiting the counter-signature; both = signed.
export function deriveStatus(c: Pick<Contract, 'signatures'>): ContractStatus {
  const provider = Boolean(c.signatures.provider)
  const client = Boolean(c.signatures.client)
  if (provider && client) return 'signed'
  if (provider || client) return 'awaiting_signature'
  return 'draft'
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    key: 'fixed_bid',
    name: 'Fixed-bid SOW',
    blurb: 'Defined scope, fixed price, milestone payments.',
    scope:
      'Provider will deliver the implementation described below for a fixed fee. Work is broken into the milestones in the payment schedule; each milestone is invoiced on client acceptance. Scope changes are handled via a written change order. Provider retains no client data after handover; all IP in deliverables transfers to Client on final payment.',
    milestones: [
      { label: 'Discovery & solution design', amountCents: 1_200_000, offsetDays: 14 },
      { label: 'Build & configuration', amountCents: 2_400_000, offsetDays: 45 },
      { label: 'UAT, launch & handover', amountCents: 1_400_000, offsetDays: 70 },
    ],
  },
  {
    key: 'retainer',
    name: 'Monthly retainer',
    blurb: 'Ongoing implementation support billed monthly.',
    scope:
      'Provider will supply up to the agreed hours of implementation and optimization work each month. Unused hours do not roll over. Either party may end the engagement with 30 days written notice. Monthly fee is invoiced in advance on the first business day of each month.',
    milestones: [
      { label: 'Month 1 retainer', amountCents: 900_000, offsetDays: 30 },
      { label: 'Month 2 retainer', amountCents: 900_000, offsetDays: 60 },
      { label: 'Month 3 retainer', amountCents: 900_000, offsetDays: 90 },
    ],
  },
  {
    key: 'discovery',
    name: 'Discovery & assessment',
    blurb: 'Fixed-fee scoping engagement before a full build.',
    scope:
      'Provider will assess the current systems and processes, document requirements, and deliver a recommended implementation plan with effort and cost estimates. Deliverable is a written assessment and roadmap. This engagement does not include build work, which would be contracted separately.',
    milestones: [
      { label: 'Stakeholder interviews & systems audit', amountCents: 600_000, offsetDays: 10 },
      { label: 'Assessment report & roadmap', amountCents: 600_000, offsetDays: 21 },
    ],
  },
  {
    key: 'change_order',
    name: 'Change order',
    blurb: 'Amend scope or budget on an active engagement.',
    scope:
      'This change order amends the referenced statement of work. The added scope, deliverables, and fee below are incorporated into the original agreement; all other terms remain unchanged. Work on the added scope begins on signature by both parties.',
    milestones: [
      { label: 'Added scope — agreed fee', amountCents: 800_000, offsetDays: 30 },
    ],
  },
]
