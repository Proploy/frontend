import type { Metadata } from 'next'
import {
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  Receipt,
  ShieldCheck,
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
  title: 'Global payments & tax · Proploy',
  description:
    'One invoice for every expert, every country. Proploy consolidates global payments and handles tax forms, contracts, and compliance for your implementation engagements.',
}

/* --------------------------------------------------------------- snippets */

function ConsolidatedBillingMock() {
  const lines: Array<[string, string, string, string]> = [
    ['Altura Partners', 'United Kingdom', 'NetSuite ERP rollout', '$48,200'],
    ['Sora Data Group', 'Germany', 'Data migration · phase 2', '$31,750'],
    ['Marisol Vega', 'Spain', 'HubSpot RevOps build', '$18,400'],
    ['Northbeam Labs', 'Singapore', 'Security tooling rollout', '$26,900'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <div className="min-w-0">
          <h3 className="font-semibold text-[18px] leading-[26px] text-[#181d27] tracking-[-0.2px]">
            June statement
          </h3>
          <p className="text-[13px] leading-[18px] text-[#717680]">4 experts · 4 countries · 1 invoice</p>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          <Globe size={13} /> Multi-currency
        </span>
      </div>

      <div className="px-[24px] py-[20px]">
        <div className="overflow-hidden rounded-[10px] border border-[#e9eaeb]">
          {lines.map(([name, country, project, amount], i) => (
            <div
              key={name}
              className={`flex items-center justify-between gap-[12px] px-[16px] py-[12px] ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              }`}
            >
              <span className="flex min-w-0 items-center gap-[10px]">
                <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#f5f8ff] text-[12px] font-semibold text-[#155eef]">
                  {name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium leading-[20px] text-[#252b37]">{name}</span>
                  <span className="block truncate text-[12px] leading-[16px] text-[#717680]">{project}</span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-[14px]">
                <span className="hidden text-[12px] leading-[18px] text-[#717680] sm:inline">{country}</span>
                <span className="w-[78px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">
                  {amount}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[16px] flex items-center justify-between rounded-[10px] bg-[#fafafa] px-[16px] py-[14px]">
          <span className="text-[13px] leading-[18px] text-[#535862]">Total due · settled in USD</span>
          <span className="text-[18px] font-semibold leading-[26px] text-[#181d27] tracking-[-0.2px]">$125,250</span>
        </div>
      </div>
    </div>
  )
}

function ComplianceChecklistMock() {
  const items: Array<[string, string, boolean]> = [
    ['W-8BEN on file', 'Marisol Vega · Spain', true],
    ['W-9 on file', 'Northbeam Labs · US entity', true],
    ['Master services agreement signed', 'Altura Partners · UK', true],
    ['Local invoice generated', 'Sora Data Group · Germany', false],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center justify-between gap-[12px] px-[2px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Compliance checklist</p>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <ShieldCheck size={13} /> 3 of 4 cleared
        </span>
      </div>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {items.map(([label, sub, done]) => (
          <div
            key={label}
            className="flex items-center gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
          >
            {done ? (
              <CheckCircle2 size={20} className="shrink-0 text-[#17b26a]" />
            ) : (
              <Clock3 size={20} className="shrink-0 text-[#f79009]" />
            )}
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium leading-[20px] text-[#252b37]">{label}</span>
              <span className="block truncate text-[12px] leading-[16px] text-[#717680]">{sub}</span>
            </span>
            <span
              className={`ml-auto shrink-0 rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
                done ? 'bg-[#ecfdf3] text-[#067647]' : 'bg-[#fffaeb] text-[#b54708]'
              }`}
            >
              {done ? 'Verified' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExpertOnboardingMock() {
  return (
    <div className="flex flex-col gap-[16px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-center gap-[12px]">
        <span className="flex size-[40px] items-center justify-center rounded-full bg-[#155eef] font-semibold text-white">
          MV
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">Marisol Vega</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">HubSpot RevOps · Madrid, Spain</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          Payable
        </span>
      </div>

      <div className="flex flex-col gap-[10px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
        {[
          ['Tax form collected', 'W-8BEN', true],
          ['Identity verified', 'Passport · matched', true],
          ['Payout method linked', 'EUR · IBAN ••• 4417', true],
        ].map(([label, detail, done]) => (
          <div key={label as string} className="flex items-center gap-[10px]">
            {done ? (
              <CheckCircle2 size={18} className="text-[#17b26a]" />
            ) : (
              <Clock3 size={18} className="text-[#f79009]" />
            )}
            <span className="text-[14px] leading-[20px] text-[#252b37]">{label}</span>
            <span className="ml-auto text-[12px] leading-[18px] text-[#717680]">{detail}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]">
        <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
          <Receipt size={16} className="text-[#717680]" /> Next payout
        </span>
        <span className="text-[14px] font-semibold leading-[20px] text-[#181d27]">Jul 5 · €17,030</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function GlobalPaymentsTaxPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Global payments & tax"
        title="One bill for global experts. Compliance handled."
        subtitle="Hire implementation experts and consulting firms anywhere, and pay them all from a single invoice. Proploy collects tax forms, signs contracts, and keeps every engagement compliant — so your team ships the rollout instead of chasing paperwork."
        primary={{ label: 'Talk to our team', href: '/contact' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/businesses/billing">
            <ConsolidatedBillingMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Altura', 'Sora Data', 'Northbeam', 'Cedar & Co', 'Brightside', 'Quotient', 'Layers']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Pay a global bench without the back-office drag"
        body="A NetSuite rollout in London, a data migration in Berlin, a RevOps build in Madrid — different experts, different countries, one settled invoice with the compliance already done."
        cards={[
          {
            icon: <Receipt size={24} className="text-white" />,
            title: 'One consolidated invoice',
            body: 'Every expert and firm you engage rolls up into a single monthly statement, settled in your currency — no per-vendor wire runs or FX guesswork.',
          },
          {
            icon: <FileText size={24} className="text-white" />,
            title: 'Tax forms collected for you',
            body: 'W-8 and W-9 forms are gathered at onboarding and stored against each payee, so 1099 and year-end reporting are ready before you ask.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Contracts and classification handled',
            body: 'Signed agreements and contractor classification sit on file for every engagement, keeping audit and legal review a click away.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Compliance"
        title="Every engagement, audit-ready before kickoff"
        body="Proploy verifies each expert and firm before a dollar moves — tax forms, signed contracts, and identity checks tracked on one checklist you can hand straight to finance or legal."
        bullets={[
          'W-8/W-9 collected and matched to each payee',
          'Master services agreements signed and stored',
          'Contractor vs. firm classification recorded per engagement',
        ]}
        link={{ label: 'Talk to our team', href: '/contact' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ComplianceChecklistMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Onboarding & payouts"
        title="Experts get paid right, in their own currency"
        body="When you bring an implementation partner onto Proploy, we handle their tax form, identity check, and payout setup. You see one cleared line item; they receive a local-currency payout on schedule."
        bullets={[
          'Local payout rails across 40+ countries',
          'Identity and tax checks before the first invoice',
          'Payout status visible alongside every milestone',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <ExpertOnboardingMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '40+',
            label: 'Countries with local payouts',
            sub: 'Engage experts and firms where the work is, paid in their currency.',
          },
          {
            value: '1',
            label: 'Invoice per billing cycle',
            sub: 'Every expert and engagement consolidated into one settled statement.',
          },
          {
            value: '100%',
            label: 'Tax forms on file',
            sub: 'W-8/W-9 collected at onboarding — never chased at year-end.',
          },
        ]}
      />

      <TestimonialWall
        heading="Finance teams stop chasing paperwork"
        testimonials={[
          {
            quote:
              'We had six implementation partners across four countries on a NetSuite program. Proploy turned that into one invoice and saved our AP team a week every month.',
            name: 'Hannah Brooks',
            role: 'Director of Finance, Altura Partners',
            color: '#155eef',
          },
          {
            quote:
              'The W-8 and W-9 forms are collected before anyone gets paid. Our first audit since switching took half the time because every contract was already on file.',
            name: 'Daniel Okafor',
            role: 'Controller, Northbeam Labs',
            color: '#079455',
          },
          {
            quote:
              'I never worry about whether a contractor in Spain or Germany is set up correctly. Compliance is handled, so I can pick the best expert regardless of where they are.',
            name: 'Priya Raman',
            role: 'VP Operations, Sora Data Group',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How does one consolidated invoice work?',
            a: 'Every expert and firm you engage in a billing cycle rolls up into a single statement. Proploy pays each payee in their local currency and bills you once, settled in your currency — no per-vendor wires or FX reconciliation.',
          },
          {
            q: 'Which tax forms do you collect?',
            a: 'We collect W-9 from US payees and the relevant W-8 series (W-8BEN, W-8BEN-E) from non-US experts and firms at onboarding. Forms are stored against each payee and surfaced for 1099 and year-end reporting.',
          },
          {
            q: 'Who is responsible for contractor classification?',
            a: 'Proploy records contractor-versus-firm classification and stores the signed agreement for each engagement. You keep a clean, exportable trail for legal and audit review, with our team available for edge cases.',
          },
          {
            q: 'Which countries can you pay experts in?',
            a: 'We support local payout rails in 40+ countries across the Americas, Europe, and Asia-Pacific. Experts receive payouts in their own currency while you continue to settle in yours.',
          },
          {
            q: 'Can our finance team export records for audit?',
            a: 'Yes. Statements, tax forms, and signed contracts are all exportable per engagement or per payee, so finance and legal can pull a complete, audit-ready trail on demand.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Hire experts anywhere. Bill it once."
        body="Bring your global implementation bench onto Proploy and let us handle payments, tax, and compliance."
        primary={{ label: 'Talk to our team', href: '/contact' }}
        secondary={{ label: 'Explore for businesses', href: '/for-businesses' }}
      />
    </>
  )
}
