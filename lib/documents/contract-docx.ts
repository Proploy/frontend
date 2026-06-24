import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import type { Contract, ContractParty, ContractSignature } from '@/hooks/types/contracts-doc'
import { contractTotalCents, dateTime, longDate, money } from './contract-format'

const BRAND = '155EEF'
const INK = '181D27'
const MUTED = '717680'

// data:image/png;base64,XXXX -> Uint8Array of the decoded bytes
function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

const label = (text: string) =>
  new Paragraph({
    spacing: { before: 280, after: 100 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: MUTED, size: 18 })],
  })

const partyParagraphs = (heading: string, p: ContractParty) => [
  new Paragraph({ children: [new TextRun({ text: heading, color: MUTED, size: 18 })] }),
  new Paragraph({ children: [new TextRun({ text: p.org, bold: true, size: 22, color: INK })] }),
  new Paragraph({ children: [new TextRun({ text: p.name, size: 22, color: INK })] }),
  new Paragraph({ children: [new TextRun({ text: p.email, size: 20, color: MUTED })] }),
]

function signatureParagraphs(heading: string, p: ContractParty, sig?: ContractSignature): Paragraph[] {
  const out: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: heading, color: MUTED, size: 18 })] }),
  ]
  if (sig) {
    out.push(
      new Paragraph({
        children: [
          new ImageRun({
            type: 'png',
            data: dataUrlToBytes(sig.dataUrl),
            transformation: { width: 180, height: 56 },
          }),
        ],
      }),
    )
  } else {
    out.push(new Paragraph({ children: [new TextRun({ text: 'Awaiting signature', italics: true, color: MUTED, size: 20 })] }))
  }
  out.push(
    new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: INK } },
      children: [new TextRun({ text: sig?.signedName || p.name, bold: true, size: 22, color: INK })],
    }),
    new Paragraph({ children: [new TextRun({ text: p.org, size: 20, color: MUTED })] }),
  )
  if (sig) {
    out.push(new Paragraph({ children: [new TextRun({ text: `Signed ${dateTime(sig.signedAt)}`, size: 18, color: MUTED })] }))
  }
  return out
}

function cell(text: string, opts: { bold?: boolean; align?: typeof AlignmentType[keyof typeof AlignmentType]; shade?: boolean; width: number } ) {
  return new TableCell({
    width: { size: opts.width, type: WidthType.PERCENTAGE },
    shading: opts.shade ? { fill: 'FAFAFA' } : undefined,
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [new TextRun({ text, bold: opts.bold, size: 20, color: INK })],
      }),
    ],
  })
}

export async function buildContractDocxBlob(contract: Contract): Promise<Blob> {
  const total = contractTotalCents(contract)

  const milestoneRows = [
    new TableRow({
      children: [
        cell('Milestone', { bold: true, shade: true, width: 50 }),
        cell('Due', { bold: true, shade: true, width: 28 }),
        cell('Amount', { bold: true, shade: true, align: AlignmentType.RIGHT, width: 22 }),
      ],
    }),
    ...contract.milestones.map(
      (m) =>
        new TableRow({
          children: [
            cell(m.label, { width: 50 }),
            cell(longDate(m.due), { width: 28 }),
            cell(money(m.amountCents, contract.currency), { align: AlignmentType.RIGHT, width: 22 }),
          ],
        }),
    ),
    new TableRow({
      children: [
        cell('Total contract value', { bold: true, width: 50 }),
        cell('', { width: 28 }),
        cell(money(total, contract.currency), { bold: true, align: AlignmentType.RIGHT, width: 22 }),
      ],
    }),
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new TextRun({ text: 'proploy', bold: true, size: 30, color: BRAND })] }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 40 },
            children: [new TextRun({ text: contract.title, bold: true, size: 36, color: INK })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${contract.project} · Created ${longDate(contract.createdAt)}`, color: MUTED, size: 20 }),
            ],
          }),

          label('Parties'),
          ...partyParagraphs('Provider', contract.provider),
          new Paragraph({ children: [new TextRun({ text: '' })] }),
          ...partyParagraphs('Client', contract.client),

          label('Scope of work'),
          new Paragraph({ children: [new TextRun({ text: contract.scope, size: 20, color: '414651' })] }),
          ...(contract.uploadedDocName
            ? [new Paragraph({ children: [new TextRun({ text: `Attached source document: ${contract.uploadedDocName}`, size: 18, color: MUTED })] })]
            : []),

          label('Payment schedule'),
          new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: milestoneRows }),

          label('Signatures'),
          ...signatureParagraphs('Provider', contract.provider, contract.signatures.provider),
          new Paragraph({ children: [new TextRun({ text: '' })] }),
          ...signatureParagraphs('Client', contract.client, contract.signatures.client),

          new Paragraph({
            spacing: { before: 360 },
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'E9EAEB' } },
            children: [
              new TextRun({
                text: 'Executed via Proploy · Signed copies are stored and timestamped for both parties.',
                size: 16,
                color: MUTED,
              }),
            ],
          }),
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}
