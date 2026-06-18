import type { Metadata } from 'next'
import {
  BadgeCheck,
  Check,
  FileCheck2,
  ReceiptText,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react'
import {
  CTABanner,
  FAQAccordion,
  LogoMarquee,
  MarketingHero,
  MetricStat,
  StackedFeatureBlock,
  TestimonialWall,
  ThreeUpCards,
  UISnippetFrame,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Approve expert invoices · Proploy',
  description:
    'Review and approve invoices from your implementation experts in one place — tied to signed milestones, with reviewers, status, and an audit trail built in.',
}

/* --------------------------------------------------------------- snippets */

type InvoiceStatus = 'Pending review' | 'Approved' | 'Rejected'

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
    'Pending review': { bg: '#fffaeb', text: '#b54708', dot: '#f79009' },
    Approved: { bg: '#ecfdf3', text: '#067647', dot: '#17b26a' },
    Rejected: { bg: '#fef3f2', text: '#b42318', dot: '#f04438' },
  }
  const s = styles[status]
  return (
    <span
      className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className="size-[6px] rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  )
}

function InvoiceTableMock() {
  const rows: {
    id: string
    vendor: string
    milestone: string
    amount: string
    reviewer: string
    initials: string
    status: InvoiceStatus
  }[] = [
    {
      id: 'INV-2041',
      vendor: 'Northwind Consulting',
      milestone: 'NetSuite ERP · Data migration',
      amount: '$24,000',
      reviewer: 'Dana Okoro',
      initials: 'DO',
      status: 'Pending review',
    },
    {
      id: 'INV-2038',
      vendor: 'Brightside Partners',
      milestone: 'Salesforce CRM · Discovery',
      amount: '$12,000',
      reviewer: 'Marco Vidal',
      initials: 'MV',
      status: 'Approved',
    },
    {
      id: 'INV-2033',
      vendor: 'Cedar & Co',
      milestone: 'HubSpot rollout · Integrations',
      amount: '$8,500',
      reviewer: 'Priya Raman',
      initials: 'PR',
      status: 'Rejected',
    },
  ]

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <div className="flex items-center gap-[10px]">
          <ReceiptText size={18} className="text-[#155eef]" />
          <span className="font-semibold text-[15px] leading-[22px] text-[#181d27]">Invoices to review</span>
        </div>
        <span className="rounded-full bg-[#fffaeb] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#b54708]">
          1 pending
        </span>
      </div>

      <div className="hidden grid-cols-[1.6fr_0.8fr_1.1fr_auto] gap-[12px] border-b border-[#e9eaeb] bg-[#fafafa] px-[20px] py-[10px] sm:grid">
        {['Invoice', 'Amount', 'Reviewer', 'Status'].map((h) => (
          <span
            key={h}
            className={`text-[12px] font-medium uppercase tracking-[0.04em] leading-[18px] text-[#717680] ${
              h === 'Status' ? 'text-right' : ''
            }`}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="flex flex-col">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={`grid grid-cols-1 gap-[12px] px-[20px] py-[16px] sm:grid-cols-[1.6fr_0.8fr_1.1fr_auto] sm:items-center ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-[8px]">
                <span className="font-mono text-[12px] leading-[18px] text-[#717680]">{r.id}</span>
                <span className="size-[3px] rounded-full bg-[#d5d7da]" />
                <span className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{r.vendor}</span>
              </div>
              <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#535862]">{r.milestone}</p>
            </div>

            <span className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{r.amount}</span>

            <span className="flex items-center gap-[8px] min-w-0">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[11px] font-semibold leading-none text-[#155eef]">
                {r.initials}
              </span>
              <span className="truncate text-[14px] leading-[20px] text-[#252b37]">{r.reviewer}</span>
            </span>

            <div className="flex items-center justify-between gap-[10px] sm:justify-end">
              {r.status === 'Pending review' ? (
                <div className="flex items-center gap-[8px]">
                  <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[7px] text-[13px] font-semibold leading-[18px] text-white">
                    <Check size={15} /> Approve
                  </span>
                  <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[7px] text-[13px] font-semibold leading-[18px] text-[#414651]">
                    <X size={15} /> Reject
                  </span>
                </div>
              ) : (
                <StatusBadge status={r.status} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MilestoneMatchMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-center justify-between gap-[12px]">
        <div>
          <p className="font-mono text-[12px] leading-[18px] text-[#717680]">INV-2041</p>
          <h3 className="mt-[2px] font-semibold text-[18px] leading-[26px] text-[#181d27] tracking-[-0.2px]">
            Northwind Consulting
          </h3>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <BadgeCheck size={14} /> Matches SOW
        </span>
      </div>

      <div className="mt-[18px] flex flex-col gap-[8px]">
        {[
          ['Milestone', 'Data migration + config', true],
          ['Contracted amount', '$24,000', true],
          ['Invoiced amount', '$24,000', true],
          ['Acceptance', 'Signed off Jun 12', true],
        ].map(([label, value, ok]) => (
          <div
            key={label as string}
            className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[14px] py-[11px]"
          >
            <span className="text-[13px] leading-[18px] text-[#717680]">{label}</span>
            <span className="flex items-center gap-[8px]">
              <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{value}</span>
              {ok && (
                <span className="flex size-[18px] items-center justify-center rounded-full bg-[#dcfae6]">
                  <Check size={12} className="text-[#067647]" />
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[16px] flex items-center gap-[10px]">
        <span className="inline-flex flex-1 items-center justify-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[10px] text-[14px] font-semibold leading-[20px] text-white">
          <Check size={16} /> Approve for payment
        </span>
        <span className="inline-flex items-center justify-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651]">
          Request changes
        </span>
      </div>
    </div>
  )
}

function AuditTrailMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] leading-[18px] text-[#717680]">
        Activity · INV-2038
      </p>
      <div className="mt-[16px] flex flex-col gap-[0px]">
        {[
          ['Submitted by Brightside Partners', 'Jun 14 · 9:02 AM', '#717680', false],
          ['Routed to Marco Vidal (Finance)', 'Jun 14 · 9:02 AM', '#717680', false],
          ['Matched to signed milestone', 'Jun 14 · 9:03 AM', '#155eef', false],
          ['Approved by Marco Vidal', 'Jun 14 · 2:41 PM', '#067647', true],
        ].map(([label, time, color, done], i, arr) => (
          <div key={label as string} className="flex gap-[12px]">
            <div className="flex flex-col items-center">
              <span
                className="mt-[2px] flex size-[20px] items-center justify-center rounded-full"
                style={{ backgroundColor: done ? '#dcfae6' : '#eff4ff' }}
              >
                {done ? (
                  <Check size={12} className="text-[#067647]" />
                ) : (
                  <span className="size-[7px] rounded-full" style={{ backgroundColor: color as string }} />
                )}
              </span>
              {i < arr.length - 1 && <span className="my-[2px] w-px flex-1 bg-[#e9eaeb]" />}
            </div>
            <div className="pb-[16px]">
              <p className="text-[14px] font-medium leading-[20px] text-[#252b37]">{label}</p>
              <p className="mt-[1px] text-[13px] leading-[18px] text-[#717680]">{time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-[8px] rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] px-[14px] py-[11px]">
        <ShieldCheck size={16} className="text-[#155eef]" />
        <span className="text-[13px] leading-[18px] text-[#535862]">
          Locked, timestamped record kept for every approval.
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ApproveInvoicesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Invoices"
        title="Approve expert invoices with one review"
        subtitle="Every invoice from your implementation partners lands in one queue — already matched to the milestone you signed, routed to the right reviewer, and one click from approved or sent back."
        primary={{ label: 'Start reviewing', href: '/for-businesses' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[860px]">
          <UISnippetFrame title="proploy.com/dashboard/invoices">
            <InvoiceTableMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Invoice review that finance can actually trust"
        body="No more reconciling PDFs against scattered SOWs. Each invoice arrives tied to signed work, with the right approver already on it."
        cards={[
          {
            icon: <FileCheck2 size={24} className="text-white" />,
            title: 'Tied to signed milestones',
            body: 'Every invoice is checked against the contracted milestone and amount, so you approve work you already agreed to — not a number in an email.',
          },
          {
            icon: <UserCheck size={24} className="text-white" />,
            title: 'Routed to the right reviewer',
            body: 'Invoices land with the project owner or finance lead by default. Reassign in a click, and nobody approves their own budget.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'A complete audit trail',
            body: 'Who submitted, who reviewed, what changed, and when — captured automatically and kept as a timestamped record for every invoice.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="One queue"
        title="Every implementation invoice in a single review queue"
        body="ERP rollouts, CRM migrations, analytics builds, security tooling — invoices from every engagement and vendor sit in one place, with status and reviewer always visible."
        bullets={[
          'Approve or reject inline without opening a single PDF',
          'Status badges show what is pending, approved, or sent back',
          'Filter by vendor, project, reviewer, or amount in seconds',
        ]}
        link={{ label: 'Tour the dashboard', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <InvoiceTableMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Milestone match"
        title="Approve against the work you signed, not a guess"
        body="Before an invoice reaches you, Proploy checks it against the signed statement of work — milestone, contracted amount, and acceptance — and flags anything that doesn’t line up."
        bullets={[
          'Invoiced amount checked against the contracted milestone',
          'Acceptance sign-off surfaced alongside the request',
          'Mismatches flagged before they hit your approval queue',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <MilestoneMatchMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Audit trail"
        title="A clean paper trail for finance and security"
        body="Every submission, routing decision, change request, and approval is logged automatically — so quarter-end reconciliation and vendor audits take minutes, not days."
        bullets={[
          'Timestamped record of every action on an invoice',
          'Reviewer and approver captured on each decision',
          'Export-ready history for finance and procurement',
        ]}
        link={{ label: 'See controls for teams', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <AuditTrailMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '90s',
            label: 'Median time to approve',
            sub: 'From invoice received to approved, with the milestone match already done.',
          },
          {
            value: '100%',
            label: 'Tied to signed work',
            sub: 'Every invoice maps to a contracted milestone before it reaches a reviewer.',
          },
          {
            value: '0',
            label: 'Spreadsheets to reconcile',
            sub: 'Status, reviewer, and history live with the invoice — not in a side file.',
          },
        ]}
      />

      <TestimonialWall
        heading="The teams approving invoices on Proploy"
        testimonials={[
          {
            quote:
              'Our NetSuite rollout had four vendors invoicing across eight milestones. Proploy lined every invoice up against the SOW so I could approve a quarter’s worth in one sitting.',
            name: 'Dana Okoro',
            role: 'Director of Finance, Northwind',
            color: '#155eef',
          },
          {
            quote:
              'I stopped chasing project leads for sign-off. The right reviewer is already on each invoice, and the audit trail answers procurement before they ask.',
            name: 'Marco Vidal',
            role: 'Controller, Layers',
            color: '#079455',
          },
          {
            quote:
              'A consultant invoiced ahead of an unaccepted milestone and Proploy flagged it instantly. That one catch covered the cost of the platform.',
            name: 'Priya Raman',
            role: 'Head of Ops, Capsule',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How does an invoice get matched to a milestone?',
            a: 'When an expert submits an invoice, Proploy ties it to the milestone in the signed statement of work, then compares the invoiced amount and acceptance status against the contracted terms. Anything that doesn’t match is flagged before it reaches your queue.',
          },
          {
            q: 'Who can approve invoices?',
            a: 'You decide. Invoices route to the project owner or a finance lead by default, and you can set approval rules by amount or project. Reviewers can’t approve their own budgets, and high-value invoices can require a second sign-off.',
          },
          {
            q: 'What happens when I reject an invoice?',
            a: 'The expert is notified with your note, the invoice is sent back for changes, and the request stays in the audit trail. Once they resubmit, it returns to the same reviewer with the full history attached.',
          },
          {
            q: 'Can I see a record of who approved what?',
            a: 'Yes. Every submission, routing decision, change request, and approval is logged with a timestamp and the person responsible. The history is export-ready for finance reconciliation and vendor audits.',
          },
          {
            q: 'Do invoices connect to how experts get paid?',
            a: 'Once you approve an invoice, it moves into payment against the agreed milestone terms — so the work you signed, the invoice you reviewed, and the payment that follows all stay connected.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Give every expert invoice one clean review"
        body="See how businesses approve implementation invoices on Proploy — matched to signed work, routed to the right reviewer, and audit-ready."
        primary={{ label: 'Get started', href: '/for-businesses' }}
        secondary={{ label: 'Talk to our team', href: '/contact' }}
      />
    </>
  )
}
