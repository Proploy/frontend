import type { Metadata } from 'next'
import {
  ArrowDownToLine,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Landmark,
  Lock,
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
  title: 'Get paid for implementation work · Proploy',
  description:
    'Escrow-backed payouts for software implementation experts. Clients fund milestones up front, funds are held in escrow, and money lands in your account on release — no chasing invoices.',
}

/* --------------------------------------------------------------- snippets */

function PayoutTimeline() {
  const steps = [
    {
      state: 'done' as const,
      title: 'Awaiting client payment',
      meta: 'Milestone 2 · Data migration + config',
      detail: 'Funded by Northwind Logistics · Jun 9',
    },
    {
      state: 'active' as const,
      title: 'Held in escrow',
      meta: '$24,000 secured',
      detail: 'Releases on milestone acceptance',
    },
    {
      state: 'pending' as const,
      title: 'Paid out',
      meta: 'To •••• 4471 · 1–2 business days',
      detail: 'Net of 0% platform fee on this payout',
    },
  ]

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          <Lock size={12} /> Escrow active
        </span>
        <span className="text-[13px] leading-[18px] text-[#717680]">Salesforce CRM rollout</span>
      </div>

      <div className="px-[24px] py-[20px]">
        <div className="flex items-baseline justify-between gap-[12px]">
          <h3 className="font-semibold text-[20px] leading-[30px] text-[#181d27] tracking-[-0.2px]">
            Milestone 2 payout
          </h3>
          <span className="font-semibold text-[20px] leading-[30px] text-[#181d27]">$24,000</span>
        </div>
        <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">
          Northwind Logistics · countersigned SOW
        </p>

        <div className="mt-[20px] flex flex-col">
          {steps.map((step, i) => {
            const last = i === steps.length - 1
            return (
              <div key={step.title} className="flex gap-[14px]">
                <div className="flex flex-col items-center">
                  {step.state === 'done' ? (
                    <span className="size-[28px] rounded-full bg-[#17b26a] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 size={18} />
                    </span>
                  ) : step.state === 'active' ? (
                    <span className="size-[28px] rounded-full bg-[#155eef] text-white flex items-center justify-center shrink-0">
                      <Lock size={15} />
                    </span>
                  ) : (
                    <span className="size-[28px] rounded-full border border-[#d5d7da] bg-white text-[#717680] flex items-center justify-center shrink-0">
                      <Clock3 size={15} />
                    </span>
                  )}
                  {!last && (
                    <span
                      className={`w-[2px] flex-1 my-[4px] ${step.state === 'done' ? 'bg-[#17b26a]' : 'bg-[#e9eaeb]'}`}
                    />
                  )}
                </div>
                <div className={`min-w-0 ${last ? 'pb-0' : 'pb-[20px]'}`}>
                  <div className="flex items-center gap-[8px] flex-wrap">
                    <span className="text-[15px] font-semibold leading-[22px] text-[#181d27]">{step.title}</span>
                    {step.state === 'active' && (
                      <span className="rounded-full bg-[#eff4ff] px-[8px] py-[1px] text-[11px] font-medium leading-[16px] text-[#155eef]">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-[1px] text-[13px] leading-[18px] text-[#535862]">{step.meta}</p>
                  <p className="mt-[1px] text-[12px] leading-[18px] text-[#717680]">{step.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EarningsChartMock() {
  const months = [
    { label: 'Jan', value: 32 },
    { label: 'Feb', value: 48 },
    { label: 'Mar', value: 41 },
    { label: 'Apr', value: 67 },
    { label: 'May', value: 58 },
    { label: 'Jun', value: 84 },
  ]
  const max = 90

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Earnings this year</p>
          <p className="mt-[4px] font-semibold text-[28px] leading-[34px] text-[#181d27] tracking-[-0.4px]">
            $330,000
          </p>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <BadgeCheck size={13} /> +18% vs Q1
        </span>
      </div>

      <div className="mt-[24px] flex items-end justify-between gap-[10px] h-[120px]">
        {months.map((m, i) => {
          const current = i === months.length - 1
          return (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-[8px]">
              <div className="flex w-full items-end justify-center" style={{ height: '96px' }}>
                <span
                  className={`w-full max-w-[28px] rounded-[6px] ${current ? 'bg-[#155eef]' : 'bg-[#c7d7fe]'}`}
                  style={{ height: `${(m.value / max) * 100}%` }}
                />
              </div>
              <span className={`text-[12px] leading-[16px] ${current ? 'text-[#181d27] font-semibold' : 'text-[#717680]'}`}>
                {m.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-[18px] flex items-center justify-between border-t border-[#e9eaeb] pt-[14px]">
        <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
          <Landmark size={15} className="text-[#717680]" /> Next payout
        </span>
        <span className="text-[14px] font-semibold leading-[20px] text-[#181d27]">$24,000 · Jun 20</span>
      </div>
    </div>
  )
}

function ReleaseMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="size-[40px] rounded-full bg-[#155eef] text-white font-semibold flex items-center justify-center shrink-0">
          NL
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Acceptance received</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">dana@northwind.io approved go-live</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[6px] rounded-[8px] bg-[#17b26a] px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-white shrink-0">
          <ArrowDownToLine size={15} /> Released
        </span>
      </div>

      <div className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[14px] flex flex-col gap-[10px]">
        {[
          ['Milestone marked complete', true],
          ['Client accepted deliverable', true],
          ['Escrow released to your balance', true],
          ['Bank transfer initiated', false],
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

      <div className="flex items-center justify-between rounded-[10px] border border-[#a9efc5] bg-[#f6fef9] px-[14px] py-[12px]">
        <span className="text-[13px] leading-[18px] text-[#067647]">Landing in your account</span>
        <span className="text-[14px] font-semibold leading-[20px] text-[#067647]">$24,000</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function PaymentsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Payments"
        title="Get paid for implementation work, without the chasing"
        subtitle="Clients fund each milestone up front. Proploy holds it in escrow while you deliver and releases it to your account the moment work is accepted — so the only thing you follow up on is the next project."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'See how payouts work', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/payouts">
            <PayoutTimeline />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Funds committed before you start the work"
        body="No net-60 terms, no payment risk on a six-figure ERP rollout. The money is secured before kickoff and released on your schedule, not the client's accounts-payable cycle."
        cards={[
          {
            icon: <Lock size={24} className="text-white" />,
            title: 'Escrow on every milestone',
            body: 'Clients fund each phase up front. Funds sit in escrow while you implement, so you never carry the risk of a data migration that the client forgets to pay for.',
          },
          {
            icon: <Wallet size={24} className="text-white" />,
            title: 'Released on acceptance',
            body: 'When a milestone is accepted, the held amount moves to your balance automatically and a bank transfer is queued — no invoice to draft, no reminder to send.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Protected if scope shifts',
            body: 'Disputes and change orders reference the signed SOW. Escrow only releases against accepted work, so a mid-project pivot never costs you a payment.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Escrow lifecycle"
        title="From client payment to escrow to your account"
        body="Every milestone moves through the same three states — funded, held, paid out — so both sides always know exactly where the money is."
        bullets={[
          'Clients fund milestones before work begins',
          'Funds held securely until the deliverable is accepted',
          'Bank transfer lands 1–2 business days after release',
        ]}
        link={{ label: 'Become an expert', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ReleaseMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Earnings"
        title="See your payouts add up, month over month"
        body="Track funded, held, and paid-out amounts across every engagement in one view. Forecast cash flow from milestones you've already booked instead of guessing at invoices in flight."
        bullets={[
          'Earnings by month across all active projects',
          'Upcoming payouts with expected release dates',
          'Tax-ready statements exported in a click',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <EarningsChartMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '100%', label: 'Milestones funded up front', sub: 'Escrow is required before any phase of work starts.' },
          { value: '1–2 days', label: 'From release to your bank', sub: 'Transfers settle the business day after acceptance.' },
          { value: '0%', label: 'Withdrawal fees', sub: 'Move your released balance out at no cost, every time.' },
        ]}
      />

      <TestimonialWall
        heading="Payouts experts don't have to chase"
        testimonials={[
          {
            quote:
              'On a NetSuite rollout I used to invoice at the end and wait 45 days. Now each milestone is funded before I touch it, and the money lands two days after sign-off.',
            name: 'Jordan Avery',
            role: 'NetSuite implementation lead',
            color: '#155eef',
          },
          {
            quote:
              'Escrow ended the awkward payment conversations. The client funds the phase, I deliver, it releases. My cash flow is finally predictable.',
            name: 'Priya Raman',
            role: 'ERP & data migration consultant',
            color: '#079455',
          },
          {
            quote:
              'When a HubSpot scope change came up mid-project, the held funds stayed put until we agreed the change order. I never had to argue about an unpaid invoice.',
            name: 'Marco Vidal',
            role: 'HubSpot RevOps specialist',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How does escrow work on Proploy?',
            a: 'Before a milestone starts, the client funds it and Proploy holds the money in escrow. You deliver the work, the client accepts it, and the held amount is released to your balance — so you are never delivering unpaid against a promise to pay later.',
          },
          {
            q: 'When does money actually reach my bank account?',
            a: 'As soon as a milestone is accepted, the escrowed funds move to your Proploy balance and a transfer is queued. Bank transfers typically settle within 1–2 business days.',
          },
          {
            q: 'What happens if the client disputes a milestone?',
            a: 'Disputes are resolved against the signed statement of work. Escrow only releases for accepted deliverables, and unresolved amounts stay held until both sides agree or Proploy support steps in — neither party can unilaterally pull funds.',
          },
          {
            q: 'What are the fees on a payout?',
            a: 'Proploy charges a single platform fee on the engagement, shown before you accept the contract. There are no per-payout or withdrawal fees — moving your released balance to your bank is always free.',
          },
          {
            q: 'Can I get tax and earnings statements?',
            a: 'Yes. Your dashboard tracks earnings by month and by project, and you can export tax-ready statements covering funded, held, and paid-out amounts whenever you need them.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Deliver the work. Let the payouts take care of themselves."
        body="Join the Proploy expert network and get every milestone funded before you start."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
