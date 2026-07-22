export const CONTRACT_FIELDS = [
  { key: 'buyerLegalName', label: 'Buyer legal name', type: 'text' as const },
  { key: 'expertLegalName', label: 'Expert legal name', type: 'text' as const },
  { key: 'effectiveDate', label: 'Effective date', type: 'date' as const },
  { key: 'servicesDescription', label: 'Services and deliverables', type: 'textarea' as const },
  { key: 'consideration', label: 'Fees and payment', type: 'textarea' as const },
  { key: 'term', label: 'Term and termination', type: 'textarea' as const },
  { key: 'acceptanceCriteria', label: 'Acceptance criteria', type: 'textarea' as const },
  { key: 'confidentiality', label: 'Confidentiality', type: 'textarea' as const },
  { key: 'intellectualProperty', label: 'Intellectual property', type: 'textarea' as const },
  { key: 'governingLaw', label: 'Governing law', type: 'text' as const },
] as const

export type ContractFieldKey = (typeof CONTRACT_FIELDS)[number]['key']
export type ContractFieldValues = Record<ContractFieldKey, string>
export type ContractSignerAction = 'sign' | 'waiting' | 'complete' | 'none'

export interface ContractSection {
  title: string
  paragraphs: string[]
  bullets: string[]
}

export function contractSignerAction(
  role: 'buyer' | 'expert',
  status: string,
): ContractSignerAction {
  if (status === 'completed') return 'complete'
  if (role === 'buyer') {
    if (status === 'sent') return 'sign'
    if (status === 'draft') return 'waiting'
    return 'none'
  }
  if (status === 'buyer_signed') return 'sign'
  if (status === 'sent') return 'waiting'
  return 'none'
}

const HEADING_RE = /^\s*#{1,6}\s+(.+?)\s*$/
const BULLET_RE = /^\s*[-*]\s+(.+?)\s*$/

function normalise(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function parseContractSections(markdown: string): ContractSection[] {
  const sections: ContractSection[] = []
  let current: ContractSection | null = null
  const intro: string[] = []

  for (const rawLine of (markdown ?? '').split(/\r?\n/)) {
    const line = rawLine.trim()
    const heading = line.match(HEADING_RE)
    if (heading) {
      current = { title: heading[1].trim(), paragraphs: [], bullets: [] }
      sections.push(current)
      continue
    }
    if (!line) continue
    const bullet = line.match(BULLET_RE)
    if (bullet) {
      if (!current) {
        current = { title: 'Details', paragraphs: [], bullets: [] }
        sections.push(current)
      }
      current.bullets.push(bullet[1].trim())
      continue
    }
    if (current) current.paragraphs.push(line)
    else intro.push(line)
  }

  if (intro.length) sections.unshift({ title: 'Details', paragraphs: intro, bullets: [] })
  return sections
}

function sectionText(sections: ContractSection[], title: string) {
  const section = sections.find((item) => normalise(item.title) === normalise(title))
  return section ? [...section.paragraphs, ...section.bullets].join('\n').trim() : ''
}

function editableValue(value: string) {
  const trimmed = value.trim()
  if (!trimmed || /^\[.*\]$/.test(trimmed) || /^{{.*}}$/.test(trimmed)) return ''
  const incompleteCopy = [
    'scope should be decided in the scoping call',
    'the services and deliverables agreed by the parties',
    'the fees and payment schedule agreed by the parties',
    'the term and termination arrangements agreed by the parties',
    'the governing law agreed by the parties',
    'deliverables will be reviewed against the agreed scope and acceptance criteria',
  ]
  if (incompleteCopy.some((phrase) => trimmed.toLowerCase().includes(phrase))) return ''
  return trimmed
}

export function contractFieldValuesFromBody(markdown: string): ContractFieldValues {
  const sections = parseContractSections(markdown)
  const parties = sectionText(sections, 'Parties')
  const partyValue = (label: string) => parties
    .split('\n')
    .find((line) => line.toLowerCase().startsWith(`${label.toLowerCase()}:`))
    ?.split(':')
    .slice(1)
    .join(':')
    .trim() ?? ''

  return {
    buyerLegalName: editableValue(partyValue('Buyer')),
    expertLegalName: editableValue(partyValue('Expert')),
    effectiveDate: editableValue(partyValue('Effective date')),
    servicesDescription: editableValue(sectionText(sections, 'Services and deliverables')),
    consideration: editableValue(sectionText(sections, 'Fees and payment')),
    term: editableValue(sectionText(sections, 'Term and termination')),
    acceptanceCriteria: editableValue(sectionText(sections, 'Acceptance criteria')),
    confidentiality: editableValue(sectionText(sections, 'Confidentiality')),
    intellectualProperty: editableValue(sectionText(sections, 'Intellectual property')),
    governingLaw: editableValue(sectionText(sections, 'Governing law')),
  }
}

export function emptyContractFieldValues(): ContractFieldValues {
  return CONTRACT_FIELDS.reduce((values, field) => {
    values[field.key] = ''
    return values
  }, {} as ContractFieldValues)
}

export function contractContentCompleteness(values: Partial<ContractFieldValues>) {
  const missing = CONTRACT_FIELDS.filter((field) => !values[field.key]?.trim()).map((field) => field.label)
  return { ok: missing.length === 0, missing }
}
