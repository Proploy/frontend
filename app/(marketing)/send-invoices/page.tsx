import type { Metadata } from 'next'
import { ArrowRight, BadgeCheck, Banknote, Bell, CalendarClock, ReceiptText } from 'lucide-react'
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
  title: 'Send invoices · Proploy',
  description:
    'Invoice straight from signed project milestones, track Paid, Sent, and Overdue at a glance, and get paid on the terms you already agreed.',
}

/* --------------------------------------------------------------- snippets */

function StatusBadge({ status }: { status: 'Paid' | 'Sent' | 'Overdue' }) {
  const styles = {
    Paid: { bg: '#ecfdf3', fg: '#067647', dot: '#17b26a' },
    Sent: { bg: '#eff4ff', fg: '#155eef', dot: '#155eef' },
    Overdue: { bg: '#fef3f2', fg: '#b42318', dot: '#f04438' },
  }[status]
  return (
    <span
      className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
      style={{ backgroundColor: styles.bg, color: styles.fg }}
    >
      <span className="size-[6px] rounded-full" style={{ backgroundColor: styles.dot }} /> {status}
    </span>
  )
}

function InvoicePreview() {
  const lines: [string, string, string][] = [
    ['Milestone 2 — NetSuite data migration', 'Acceptance: Jun 4', '$24,000'],
    ['Saved-search & report rebuild', 'Fixed scope', '$6,500'],
    ['Sandbox-to-production cutover', '14 hrs @ $185', '$2,590'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <div className="min-w-0">
          <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">Invoice INV-0247</p>
          <p className="text-[13px] leading-[18px] text-[#717680]">Meridian Retail Group · NetSuite ERP</p>
        </div>
        <StatusBadge status="Sent" />
      </div>

      <div className="px-[24px] py-[20px]">
        <div className="flex items-center justify-between text-[13px] leading-[18px] text-[#717680]">
          <span>Issued Jun 9, 2026</span>
          <span>Due Jun 23, 2026 · Net 14</span>
        </div>

        <div className="mt-[16px] overflow-hidden rounded-[10px] border border-[#e9eaeb]">
          {lines.map(([label, meta, amt], i) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-[12px] px-[16px] py-[12px] ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              }`}
            >
              <span className="min-w-0">
                <span className="block text-[14px] leading-[20px] text-[#252b37] truncate">{label}</span>
                <span className="block text-[12px] leading-[18px] text-[#717680]">{meta}</span>
              </span>
              <span className="w-[80px] shrink-0 text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">
                {amt}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[16px] flex flex-col gap-[6px] border-t border-[#e9eaeb] pt-[16px]">
          <div className="flex items-center justify-between text-[14px] leading-[20px] text-[#535862]">
            <span>Subtotal</span>
            <span className="text-[#252b37]">$33,090</span>
          </div>
          <div className="flex items-center justify-between text-[14px] leading-[20px] text-[#535862]">
            <span>Platform fee</span>
            <span className="text-[#252b37]">$0</span>
          </div>
          <div className="mt-[6px] flex items-center justify-between">
            <span className="text-[15px] font-semibold leading-[22px] text-[#181d27]">Total due</span>
            <span className="text-[20px] font-semibold leading-[28px] text-[#181d27] tracking-[-0.2px]">$33,090</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MilestoneToInvoiceMock() {
  const milestones: [string, string, boolean][] = [
    ['Discovery & integration map', '$8,000', true],
    ['HubSpot–Salesforce sync build', '$18,000', true],
    ['Pipeline migration & QA', '$14,000', false],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Signed milestones</p>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {milestones.map(([label, amt, ready], i) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-[12px] rounded-[10px] border px-[14px] py-[12px] ${
              i === 1 ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb]'
            }`}
          >
            <span className="flex min-w-0 items-center gap-[10px]">
              {ready ? (
                <BadgeCheck size={18} className="shrink-0 text-[#17b26a]" />
              ) : (
                <CalendarClock size={18} className="shrink-0 text-[#717680]" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium leading-[20px] text-[#252b37]">{label}</span>
                <span className="block text-[12px] leading-[18px] text-[#717680]">
                  {ready ? 'Accepted — ready to invoice' : 'In progress'}
                </span>
              </span>
            </span>
            <span className="w-[72px] shrink-0 text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">
              {amt}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-[14px] flex items-center justify-between rounded-[10px] bg-[#155eef] px-[14px] py-[12px]">
        <span className="text-[13px] font-medium leading-[18px] text-white">Invoice milestone 2 · $18,000</span>
        <span className="inline-flex items-center gap-[6px] text-[13px] font-semibold leading-[18px] text-white">
          Create invoice <ArrowRight size={15} />
        </span>
      </div>
    </div>
  )
}

function PayoutTrackerMock() {
  const rows: [string, string, 'Paid' | 'Sent' | 'Overdue'][] = [
    ['INV-0241 · Acme Foods', '$12,000', 'Paid'],
    ['INV-0244 · Northwind Logistics', '$9,500', 'Paid'],
    ['INV-0247 · Meridian Retail', '$33,090', 'Sent'],
    ['INV-0239 · Brightside Health', '$7,200', 'Overdue'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Payments</p>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#f6fef9] px-[10px] py-[4px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <Banknote size={14} /> $21,500 paid this month
        </span>
      </div>
      <div className="mt-[14px] flex flex-col gap-[8px]">
        {rows.map(([label, amt, status]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
          >
            <span className="min-w-0 truncate text-[14px] leading-[20px] text-[#252b37]">{label}</span>
            <span className="flex shrink-0 items-center gap-[12px]">
              <span className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{amt}</span>
              <StatusBadge status={status} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-[14px] flex items-center gap-[10px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[14px] py-[12px]">
        <Bell size={16} className="shrink-0 text-[#f79009]" />
        <span className="text-[13px] leading-[18px] text-[#535862]">
          INV-0239 is 6 days overdue — a reminder was sent to accounts@brightside.io.
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function SendInvoicesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Invoicing"
        title="Send invoices and get paid on signed terms"
        subtitle="Turn accepted project milestones into invoices in a click. Track what's paid, sent, and overdue from one place — and collect on the payment schedule you already agreed."
        primary={{ label: 'Start invoicing', href: '/become-expert' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/invoices">
            <InvoicePreview />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Meridian', 'Northwind', 'Acme Foods', 'Brightside', 'Cedar & Co', 'Layers', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Billing that follows the work you already scoped"
        body="Implementation engagements live and die on milestones. Proploy invoicing draws straight from the contract you signed, so what you bill always matches what was agreed."
        cards={[
          {
            icon: <ReceiptText size={24} className="text-white" />,
            title: 'Invoice from milestones',
            body: 'Each accepted milestone carries its amount. Convert it into an invoice with line items pre-filled — no re-keying scope or rates.',
          },
          {
            icon: <BadgeCheck size={24} className="text-white" />,
            title: 'Status at a glance',
            body: 'Paid, Sent, and Overdue badges across every invoice, so you always know what is collected and what needs a nudge.',
          },
          {
            icon: <Banknote size={24} className="text-white" />,
            title: 'Paid on agreed terms',
            body: 'Net terms, deposits, and acceptance gates come from the signed SOW — clients pay on the schedule both sides committed to.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="From milestone to invoice"
        title="Bill the moment a milestone is accepted"
        body="When a client signs off on a data migration cutover or an integration build, the milestone is ready to invoice — amount, scope, and acceptance date already attached."
        bullets={[
          'Line items pull from the signed statement of work',
          'Mix fixed-bid milestones with hourly add-ons in one invoice',
          'Send for payment without leaving your project workspace',
        ]}
        link={{ label: 'See milestone billing', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <MilestoneToInvoiceMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Track & collect"
        title="Know what's paid, what's sent, and what's overdue"
        body="One ledger for every engagement. Watch invoices move from Sent to Paid, and let automatic reminders chase the ones that slip past their due date."
        bullets={[
          'Live Paid / Sent / Overdue status on every invoice',
          'Automatic reminders on overdue balances',
          'Running totals so payouts are never a surprise',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <PayoutTrackerMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '60 sec', label: 'Milestone to sent invoice', sub: 'Accepted work becomes a ready-to-send invoice in under a minute.' },
          { value: '11 days', label: 'Faster average payment', sub: 'Signed terms and reminders close the gap between sent and paid.' },
          { value: '0%', label: 'Invoicing fees', sub: 'Send unlimited invoices — Proploy never charges per invoice.' },
        ]}
      />

      <TestimonialWall
        heading="Experts who stopped chasing payments"
        testimonials={[
          {
            quote:
              'My NetSuite milestones map straight to invoices. The client accepts the cutover, I hit send, and the line items are already correct.',
            name: 'Priya Raman',
            role: 'NetSuite ERP consultant',
            color: '#155eef',
          },
          {
            quote:
              'The Paid, Sent, Overdue view replaced a spreadsheet I dreaded. I can see every open balance across four rollouts in one glance.',
            name: 'Daniel Okafor',
            role: 'Salesforce implementation lead',
            color: '#079455',
          },
          {
            quote:
              'Net-14 terms come straight from the signed SOW, so there is no negotiation at invoice time. Reminders handle the awkward follow-ups for me.',
            name: 'Sofia Marquez',
            role: 'Data migration specialist',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How do invoices connect to my milestones?',
            a: 'Every milestone in a signed statement of work carries an amount and acceptance criteria. Once a client accepts a milestone, you can turn it into an invoice with the line items already filled in.',
          },
          {
            q: 'Can I combine fixed-bid and hourly work on one invoice?',
            a: 'Yes. A single invoice can include fixed-bid milestone amounts alongside hourly add-ons — for example a migration milestone plus extra cutover hours — each as its own line item.',
          },
          {
            q: 'What do the Paid, Sent, and Overdue badges mean?',
            a: 'Sent means the invoice is with the client and awaiting payment. Paid means funds have cleared. Overdue means the due date has passed — Proploy can send automatic reminders on those balances.',
          },
          {
            q: 'How are payment terms set?',
            a: 'Net terms, deposits, and acceptance gates are inherited from the signed SOW, so the invoice reflects the schedule both sides already agreed to. You can adjust terms per invoice before sending.',
          },
          {
            q: 'Does Proploy charge per invoice?',
            a: 'No. Sending invoices and tracking payments is included for every Proploy expert — there are no per-invoice or per-payment fees.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Get paid on the terms you already signed"
        body="Join the Proploy expert network and send your first milestone invoice this week."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
