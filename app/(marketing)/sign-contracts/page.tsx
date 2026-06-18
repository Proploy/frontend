import type { Metadata } from 'next'
import {
  CheckCircle2,
  Clock3,
  FileSignature,
  PenLine,
  ScrollText,
  ShieldCheck,
  Wallet,
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
  title: 'Sign software contracts · Proploy',
  description:
    'Draft, send, and e-sign statements of work for software implementations — with deal protection and payment terms built in.',
}

/* --------------------------------------------------------------- snippets */

function ContractPreview() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          <span className="size-[6px] rounded-full bg-[#155eef]" /> Awaiting countersign
        </span>
        <span className="text-[13px] leading-[18px] text-[#717680]">Created Jun 12, 2026</span>
      </div>
      <div className="px-[24px] py-[20px]">
        <h3 className="font-semibold text-[20px] leading-[30px] text-[#181d27] tracking-[-0.2px]">
          Salesforce CRM rollout — Statement of Work
        </h3>
        <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">Northwind Logistics · Salesforce migration</p>

        <div className="mt-[20px] overflow-hidden rounded-[10px] border border-[#e9eaeb]">
          {[
            ['Discovery & migration plan', 'Jul 1', '$12,000'],
            ['Data migration + config', 'Jul 22', '$24,000'],
            ['Training & go-live', 'Aug 8', '$12,000'],
          ].map(([label, due, amt], i) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-[12px] px-[16px] py-[12px] ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              }`}
            >
              <span className="flex items-center gap-[10px] min-w-0">
                <span className="size-[22px] rounded-full bg-[#eff4ff] text-[#155eef] text-[12px] font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-[14px] leading-[20px] text-[#252b37] truncate">{label}</span>
              </span>
              <span className="flex items-center gap-[14px] shrink-0">
                <span className="text-[13px] leading-[18px] text-[#717680]">Due {due}</span>
                <span className="w-[72px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">{amt}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          <div className="rounded-[10px] border border-[#a9efc5] bg-[#f6fef9] p-[14px]">
            <span className="text-[24px] leading-none text-[#067647]" style={{ fontStyle: 'italic', fontWeight: 600 }}>
              Jordan Avery
            </span>
            <p className="mt-[10px] border-t border-[#e9eaeb] pt-[8px] text-[13px] leading-[18px] text-[#535862]">
              Provider · signed
            </p>
          </div>
          <div className="rounded-[10px] border border-dashed border-[#d5d7da] bg-[#fafafa] p-[14px]">
            <span className="flex h-[24px] items-center gap-[8px] text-[14px] leading-[20px] text-[#717680]">
              <Clock3 size={16} /> Awaiting signature
            </span>
            <p className="mt-[10px] border-t border-[#e9eaeb] pt-[8px] text-[13px] leading-[18px] text-[#535862]">
              Client · Northwind Logistics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatePickerMock() {
  const rows = [
    ['Fixed-bid implementation SOW', 'Most used'],
    ['Monthly retainer agreement', ''],
    ['Discovery & assessment', ''],
    ['Change order', ''],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Start from a template</p>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {rows.map(([label, tag], i) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-[12px] rounded-[10px] border px-[14px] py-[12px] ${
              i === 0 ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb]'
            }`}
          >
            <span className="flex items-center gap-[10px]">
              <ScrollText size={18} className={i === 0 ? 'text-[#155eef]' : 'text-[#717680]'} />
              <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{label}</span>
            </span>
            {tag && (
              <span className="rounded-full bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#155eef]">
                {tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SignFlowMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="size-[40px] rounded-full bg-[#155eef] text-white font-semibold flex items-center justify-center">
          J
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Send for signature</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">dana@northwind.io</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-white">
          <PenLine size={15} /> Send
        </span>
      </div>
      <div className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[14px] flex flex-col gap-[10px]">
        {[
          ['Contract sent', true],
          ['Client reviewed', true],
          ['Payment terms accepted', true],
          ['Counter-signed', false],
        ].map(([label, done]) => (
          <div key={label as string} className="flex items-center gap-[10px]">
            {done ? (
              <CheckCircle2 size={18} className="text-[#17b26a]" />
            ) : (
              <Clock3 size={18} className="text-[#f79009]" />
            )}
            <span className="text-[14px] leading-[20px] text-[#252b37]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function SignContractsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Contracts"
        title="Sign software contracts in minutes, not mailrooms."
        subtitle="Draft a statement of work from a proven template, send it for e-signature, and lock in milestone payment terms — without leaving Proploy."
        primary={{ label: 'Start a contract', href: '/become-expert' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/contracts">
            <ContractPreview />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Protected work, from kickoff to final invoice"
        body="Every engagement starts on clear, signed terms — so scope, timeline, and payment are never in question."
        cards={[
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Deal protection built in',
            body: 'Scope, milestones, and acceptance criteria are written into every contract, so disputes have an answer before they start.',
          },
          {
            icon: <FileSignature size={24} className="text-white" />,
            title: 'E-signature in a click',
            body: 'Send a contract for signature and counter-sign in the browser — timestamped copies are stored for both parties.',
          },
          {
            icon: <Wallet size={24} className="text-white" />,
            title: 'Payment terms attached',
            body: 'Tie each milestone to a payment amount so invoicing flows straight from the contract you both signed.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Templates"
        title="Start from a template built for implementation work"
        body="Fixed-bid SOWs, monthly retainers, discovery agreements, and change orders — drafted for software rollouts, not generic gigs."
        bullets={[
          'Reusable clauses for scope, IP, and acceptance',
          'Auto-filled with client, project, and rate details',
          'Edit inline before you send — no Word round-trips',
        ]}
        link={{ label: 'Browse templates', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <TemplatePickerMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Signature & payment"
        title="One flow from signature to first payment"
        body="Send for e-signature, track who has reviewed and signed, and trigger milestone invoicing the moment a contract is counter-signed."
        bullets={[
          'Live status on every signature request',
          'Milestone amounts ready to invoice on signing',
          'Stored, timestamped copies for both sides',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <SignFlowMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '3 min', label: 'Median time to send', sub: 'From template to a contract in the client’s inbox.' },
          { value: '92%', label: 'Signed within 48h', sub: 'Clear, scoped contracts get countersigned fast.' },
          { value: '$0', label: 'Per-signature fees', sub: 'E-signature is included for every Proploy expert.' },
        ]}
      />

      <TestimonialWall
        heading="Contracts experts actually trust"
        testimonials={[
          {
            quote:
              'I used to chase signatures over email for a week. Now the SOW goes out from the template and comes back signed the same day.',
            name: 'Jordan Avery',
            role: 'Salesforce implementation lead',
            color: '#155eef',
          },
          {
            quote:
              'Milestones map straight to invoices. My finance contact signs once and the payment schedule is already agreed.',
            name: 'Priya Raman',
            role: 'ERP consultant',
            color: '#079455',
          },
          {
            quote:
              'The deal-protection clauses caught a scope gap before kickoff. That alone paid for itself on the first project.',
            name: 'Marco Vidal',
            role: 'Marketing ops specialist',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'Are Proploy contracts legally binding?',
            a: 'Yes. Contracts are e-signed by both parties with timestamped records stored for each side, the same way standard e-signature tools work.',
          },
          {
            q: 'Can I use my own contract?',
            a: 'You can start from a Proploy template or paste in your own terms. Either way you get inline editing, e-signature, and milestone payment terms.',
          },
          {
            q: 'How do payments connect to a contract?',
            a: 'Each milestone in a contract carries an amount. Once the contract is signed, those milestones are ready to invoice from your dashboard.',
          },
          {
            q: 'What happens if scope changes mid-project?',
            a: 'Send a change order from the same workspace. It references the original SOW and is signed the same way, so the paper trail stays clean.',
          },
          {
            q: 'Does the client need a Proploy account?',
            a: 'No. Clients receive a secure link to review and sign — no account required.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Put your next engagement on signed terms"
        body="Join the Proploy expert network and send your first contract this week."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
