import type { Metadata } from 'next'
import {
  ArrowDownRight,
  BadgePercent,
  Eye,
  Landmark,
  Receipt,
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
  title: 'Transparent pricing for experts · Proploy',
  description:
    'One low, clearly-labelled platform fee — no markup on your rate, no hidden margin. See exactly what you bill, what Proploy takes, and what lands in your account.',
}

/* --------------------------------------------------------------- snippets */

function EarningsBreakdown() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <div className="min-w-0">
          <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Milestone payout</h3>
          <p className="text-[13px] leading-[18px] text-[#717680]">
            NetSuite go-live · Cedar &amp; Co
          </p>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <span className="size-[6px] rounded-full bg-[#17b26a]" /> Released
        </span>
      </div>

      <div className="px-[24px] py-[20px]">
        <div className="flex items-baseline justify-between gap-[12px]">
          <span className="text-[14px] leading-[20px] text-[#535862]">Your invoice (gross)</span>
          <span className="text-[16px] font-semibold leading-[24px] text-[#181d27] tabular-nums">$24,000.00</span>
        </div>

        <div className="mt-[14px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[16px] py-[14px]">
          <div className="flex items-center justify-between gap-[12px]">
            <span className="flex items-center gap-[8px] min-w-0">
              <span className="size-[28px] rounded-[8px] bg-[#eff4ff] text-[#155eef] flex items-center justify-center shrink-0">
                <BadgePercent size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium leading-[20px] text-[#252b37]">
                  Proploy platform fee
                </span>
                <span className="block text-[12px] leading-[18px] text-[#717680]">
                  Flat 8% · no markup on your rate
                </span>
              </span>
            </span>
            <span className="flex items-center gap-[4px] text-[15px] font-semibold leading-[22px] text-[#535862] tabular-nums shrink-0">
              <ArrowDownRight size={15} className="text-[#717680]" />
              $1,920.00
            </span>
          </div>
        </div>

        <div className="mt-[16px] flex items-center justify-between gap-[12px] border-t border-[#e9eaeb] pt-[16px]">
          <span className="text-[15px] font-semibold leading-[22px] text-[#181d27]">Net payout to you</span>
          <span className="text-[24px] font-semibold leading-[32px] text-[#067647] tracking-[-0.4px] tabular-nums">
            $22,080.00
          </span>
        </div>

        <div className="mt-[16px] flex items-center gap-[8px] rounded-[8px] bg-[#f5f8ff] px-[12px] py-[10px]">
          <Landmark size={15} className="text-[#155eef] shrink-0" />
          <span className="text-[13px] leading-[18px] text-[#252b37]">
            Arrives in •••• 4417 in 1–2 business days. No transfer fee.
          </span>
        </div>
      </div>
    </div>
  )
}

function RateLadderMock() {
  const rows: Array<[string, string, string]> = [
    ['Salesforce CRM rollout', '$180/hr', '$165.60'],
    ['HubSpot migration (fixed)', '$9,000', '$8,280'],
    ['ERP data migration', '$220/hr', '$202.40'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center justify-between gap-[12px] px-[8px] pb-[10px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Engagement</p>
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">You keep (after 8%)</p>
      </div>
      <div className="flex flex-col gap-[8px]">
        {rows.map(([label, rate, net]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
          >
            <span className="flex items-center gap-[10px] min-w-0">
              <span className="size-[28px] rounded-[8px] bg-[#eff4ff] text-[#155eef] flex items-center justify-center shrink-0">
                <Receipt size={15} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{label}</span>
                <span className="block text-[12px] leading-[18px] text-[#717680]">Set your rate · {rate}</span>
              </span>
            </span>
            <span className="text-[14px] font-semibold leading-[20px] text-[#067647] tabular-nums shrink-0">{net}</span>
          </div>
        ))}
      </div>
      <p className="mt-[12px] px-[8px] text-[12px] leading-[18px] text-[#717680]">
        The client is never quoted more than your rate. The fee comes out of your side — and it&apos;s the only fee.
      </p>
    </div>
  )
}

function PayoutLedgerMock() {
  const rows: Array<[string, string, string]> = [
    ['Discovery & scoping', 'May 14', '$11,040'],
    ['Config & integration', 'Jun 02', '$22,080'],
    ['Training & go-live', 'Jun 16', '$22,080'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center justify-between gap-[12px]">
        <div>
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Earnings ledger</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">Last 30 days</p>
        </div>
        <span className="text-right">
          <span className="block text-[12px] leading-[18px] text-[#717680]">Net released</span>
          <span className="block text-[18px] font-semibold leading-[26px] text-[#181d27] tabular-nums">$55,200</span>
        </span>
      </div>
      <div className="rounded-[10px] border border-[#e9eaeb] overflow-hidden">
        {rows.map(([label, date, amt], i) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-[12px] px-[14px] py-[12px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span className="flex items-center gap-[10px] min-w-0">
              <span className="size-[8px] rounded-full bg-[#17b26a] shrink-0" />
              <span className="text-[14px] leading-[20px] text-[#252b37] truncate">{label}</span>
            </span>
            <span className="flex items-center gap-[14px] shrink-0">
              <span className="text-[13px] leading-[18px] text-[#717680]">{date}</span>
              <span className="w-[72px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27] tabular-nums">
                {amt}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-[8px] rounded-[8px] bg-[#f6fef9] border border-[#a9efc5] px-[12px] py-[10px]">
        <Wallet size={15} className="text-[#067647] shrink-0" />
        <span className="text-[13px] leading-[18px] text-[#252b37]">
          Every line shows gross, the 8% fee, and net — nothing reconciled after the fact.
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function CommissionPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Pricing for experts"
        title="Transparent pricing. You keep what you earn."
        subtitle="One low platform fee, labelled in plain numbers on every payout. No markup on your rate, no margin skimmed from the client, no surprise deductions."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'See the fee breakdown', href: '#breakdown' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/payouts">
            <EarningsBreakdown />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="How our pricing works"
        heading="One fee. Shown in full. Taken from our side, not yours."
        body="Most marketplaces bury their take in a marked-up client price or a stack of service charges. Proploy charges a single platform fee — and you see it on every line."
        cards={[
          {
            icon: <BadgePercent size={24} className="text-white" />,
            title: 'A flat 8% platform fee',
            body: 'One percentage, applied to your invoice. No tiered cuts that shrink as the project grows, no separate processing or payout charges layered on top.',
          },
          {
            icon: <Eye size={24} className="text-white" />,
            title: 'Labelled on every payout',
            body: 'Gross, fee, and net are spelled out before a single dollar moves. What you see in the dashboard is exactly what hits your account.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'No markup on your rate',
            body: 'The client pays the rate you set — not your rate plus a hidden margin. Your pricing stays yours, and you stay competitive.',
          },
        ]}
      />

      <div id="breakdown" />
      <StackedFeatureBlock
        eyebrow="Your rate, your number"
        title="Set your rate. The client sees it. We don’t mark it up."
        body="Whether you bill hourly for a Salesforce rollout or fixed-bid a HubSpot migration, the price the client agrees to is the price you set. The 8% fee comes out of your side — and it’s the only deduction."
        bullets={[
          'No client-facing markup that prices you out of deals',
          'Hourly or fixed-bid — the fee math is identical',
          'Your net is shown the moment you name a rate',
        ]}
        link={{ label: 'Start setting your rates', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <RateLadderMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Nothing hidden, nothing reconciled later"
        title="Every payout reconciles to the penny, up front"
        body="When a milestone is approved, the platform fee is already accounted for. There are no end-of-month adjustments, no withheld reserves, and no per-transfer charges — just gross in, fee out, net to your account."
        bullets={[
          'Per-milestone gross, fee, and net in one ledger',
          'No payout or bank-transfer fees on top',
          'Export-ready records for your bookkeeping',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <PayoutLedgerMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '8%', label: 'Flat platform fee', sub: 'One rate, every engagement — it never tiers up or down.' },
          { value: '$0', label: 'Added to the client price', sub: 'No markup on your rate, so you keep winning the work.' },
          { value: '1–2 days', label: 'From release to bank', sub: 'Net payout lands in your account with no transfer fee.' },
        ]}
      />

      <TestimonialWall
        heading="Experts who finally trust the math"
        testimonials={[
          {
            quote:
              'I know my net before I send the quote. The 8% is right there on the payout — no reconciling, no “where did that charge come from.”',
            name: 'Priya Raman',
            role: 'NetSuite implementation lead',
            color: '#155eef',
          },
          {
            quote:
              'Other platforms marked up my rate to the client, so I lost deals on price. Here the client sees exactly what I set. The fee is mine to carry, and it’s small.',
            name: 'Marco Vidal',
            role: 'HubSpot & RevOps consultant',
            color: '#079455',
          },
          {
            quote:
              'Fixed-bid ERP work used to mean chasing surprise deductions. Now every milestone shows gross, fee, and net before it releases.',
            name: 'Dana Okafor',
            role: 'ERP data-migration specialist',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'What exactly is the platform fee?',
            a: 'A flat 8% of your invoice, taken from your side of each payout. It covers payments, contracts, escrow protection, and dispute support. There are no separate processing, payout, or transfer fees added on top.',
          },
          {
            q: 'Do you mark up my rate to the client?',
            a: 'No. The client agrees to the exact rate you set — hourly or fixed-bid. We never add a margin to your price. The 8% fee comes out of what you bill, not on top of it.',
          },
          {
            q: 'Does the fee change as my projects get larger?',
            a: 'No. It stays a flat 8% whether the milestone is $2,000 or $200,000. There are no tiers, no minimums, and no per-transaction surcharges.',
          },
          {
            q: 'When is the fee deducted, and can I see it?',
            a: 'It’s calculated up front. Before any milestone releases, your dashboard shows the gross invoice, the 8% fee on its own line, and the net payout — so the number that hits your account is never a surprise.',
          },
          {
            q: 'Are there any other charges I should expect?',
            a: 'None. No subscription to join, no listing fees, and no bank-transfer charge on payouts. The 8% platform fee is the only deduction Proploy takes.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Keep more of every engagement"
        body="Join the Proploy expert network and price your work on terms you can see in full."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
