import type { Metadata } from 'next'
import {
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  Globe2,
  Landmark,
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
  title: 'Global payments for experts · Proploy',
  description:
    'Bill implementation clients anywhere and get paid in your currency. International payouts, local rails, and tax-document compliance built into every engagement.',
}

/* --------------------------------------------------------------- snippets */

function PayoutSelectorMock() {
  const rows: { country: string; flag: string; method: string; eta: string; active?: boolean }[] = [
    { country: 'Singapore', flag: '🇸🇬', method: 'Local bank — SGD', eta: 'Same day', active: true },
    { country: 'United States', flag: '🇺🇸', method: 'ACH — USD', eta: '1–2 days' },
    { country: 'Germany', flag: '🇩🇪', method: 'SEPA — EUR', eta: 'Next day' },
    { country: 'India', flag: '🇮🇳', method: 'IMPS — INR', eta: 'Same day' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <span className="inline-flex items-center gap-[8px] text-[14px] font-semibold leading-[20px] text-[#181d27]">
          <Globe2 size={18} className="text-[#155eef]" /> Payout method
        </span>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          <span className="size-[6px] rounded-full bg-[#155eef]" /> Pays in your currency
        </span>
      </div>
      <div className="px-[24px] py-[20px]">
        <p className="text-[13px] leading-[18px] text-[#717680]">
          Northwind Logistics is invoiced in USD. You receive payout in your chosen rail.
        </p>
        <div className="mt-[16px] overflow-hidden rounded-[10px] border border-[#e9eaeb]">
          {rows.map((r, i) => (
            <div
              key={r.country}
              className={`flex items-center justify-between gap-[12px] px-[16px] py-[12px] ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              } ${r.active ? 'bg-[#f5f8ff]' : ''}`}
            >
              <span className="flex items-center gap-[12px] min-w-0">
                <span className="text-[20px] leading-none">{r.flag}</span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium leading-[20px] text-[#252b37] truncate">
                    {r.country}
                  </span>
                  <span className="block text-[13px] leading-[18px] text-[#717680] truncate">{r.method}</span>
                </span>
              </span>
              <span className="flex items-center gap-[12px] shrink-0">
                <span className="text-[13px] leading-[18px] text-[#717680]">{r.eta}</span>
                <span
                  className={`flex size-[18px] items-center justify-center rounded-full border ${
                    r.active ? 'border-[#155eef] bg-[#155eef]' : 'border-[#d5d7da] bg-white'
                  }`}
                >
                  {r.active && <span className="size-[7px] rounded-full bg-white" />}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[16px] flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[16px] py-[14px]">
          <span className="text-[13px] leading-[18px] text-[#535862]">
            Next payout · NetSuite rollout, milestone 2
          </span>
          <span className="text-[16px] font-semibold leading-[24px] text-[#181d27]">S$16,420.00</span>
        </div>
      </div>
    </div>
  )
}

function FxRouteMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Conversion preview</p>
      <div className="flex items-center justify-between gap-[12px]">
        <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[16px] py-[12px]">
          <span className="block text-[13px] leading-[18px] text-[#717680]">Client invoiced</span>
          <span className="block text-[18px] font-semibold leading-[26px] text-[#181d27]">$12,000.00 USD</span>
        </div>
        <Banknote size={20} className="text-[#717680] shrink-0" />
        <div className="rounded-[10px] border border-[#155eef] bg-[#f5f8ff] px-[16px] py-[12px]">
          <span className="block text-[13px] leading-[18px] text-[#155eef]">You receive</span>
          <span className="block text-[18px] font-semibold leading-[26px] text-[#181d27]">S$16,196.40 SGD</span>
        </div>
      </div>
      <div className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[14px] flex flex-col gap-[10px]">
        {[
          ['Locked rate', '1 USD = 1.3497 SGD'],
          ['Conversion fee', '0.4% · S$64.78'],
          ['Wire to local account', 'No fee'],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-[12px]">
            <span className="text-[14px] leading-[20px] text-[#535862]">{label}</span>
            <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TaxChecklistMock() {
  const items: { label: string; sub: string; done: boolean }[] = [
    { label: 'W-8BEN-E on file', sub: 'Entity tax status confirmed', done: true },
    { label: 'Local tax ID verified', sub: 'Singapore UEN · 53XXXXXXX', done: true },
    { label: 'VAT/GST registration', sub: 'GST charged where required', done: true },
    { label: 'Year-end summary', sub: 'Generated for FY2026', done: false },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <span className="inline-flex items-center gap-[8px] text-[14px] font-semibold leading-[20px] text-[#181d27]">
          <FileText size={18} className="text-[#155eef]" /> Tax compliance
        </span>
        <span className="text-[13px] leading-[18px] text-[#717680]">3 of 4 complete</span>
      </div>
      <div className="px-[24px] py-[20px] flex flex-col gap-[10px]">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[14px] py-[12px]"
          >
            {it.done ? (
              <CheckCircle2 size={20} className="text-[#17b26a] shrink-0" />
            ) : (
              <Clock3 size={20} className="text-[#f79009] shrink-0" />
            )}
            <span className="min-w-0">
              <span className="block text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{it.label}</span>
              <span className="block text-[13px] leading-[18px] text-[#717680] truncate">{it.sub}</span>
            </span>
            {it.done ? (
              <span className="ml-auto rounded-full bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#067647] shrink-0">
                Verified
              </span>
            ) : (
              <span className="ml-auto rounded-full bg-[#fffaeb] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#b54708] shrink-0">
                Pending
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function GlobalPaymentsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Global payments"
        title="Bill clients anywhere, get paid in your currency."
        subtitle="Take Salesforce, NetSuite, and ERP work from clients in any market — and receive your payout on local rails, in the currency you bank in, with tax compliance handled."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'See how payouts work', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/payouts">
            <PayoutSelectorMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Get paid like a local, wherever your clients are"
        body="Your clients pay in their currency. You receive in yours — without spreadsheets, surprise FX spreads, or a tax surprise in April."
        cards={[
          {
            icon: <Landmark size={24} className="text-white" />,
            title: 'Payouts on local rails',
            body: 'ACH, SEPA, IMPS, and same-day local transfers in 40+ countries — money lands in the account you already use, not a holding wallet.',
          },
          {
            icon: <Banknote size={24} className="text-white" />,
            title: 'Currency on your terms',
            body: 'Invoice a client in USD or EUR and receive SGD, INR, or GBP at a rate locked before you accept — no guessing what the wire will become.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Tax compliance built in',
            body: 'W-8/W-9 forms, local tax IDs, and GST/VAT handling are collected once and applied to every engagement automatically.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Currency & rails"
        title="Pick the rail and currency that fit how you actually bank"
        body="Set a default payout method per country, see the locked conversion before you accept work, and keep more of every milestone with transparent FX."
        bullets={[
          'Per-country payout rows — ACH, SEPA, IMPS, local wire',
          'Rate locked the moment you accept a milestone',
          'One flat conversion fee, shown line by line before payout',
        ]}
        link={{ label: 'See supported countries', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <FxRouteMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Tax documents"
        title="Cross-border tax handled before the first payout"
        body="Submit your tax forms once. Proploy applies the right withholding, charges GST or VAT where it’s due, and produces a clean year-end summary for your accountant."
        bullets={[
          'W-8BEN-E / W-9 collected and stored per entity',
          'GST/VAT charged automatically on qualifying invoices',
          'Year-end earnings summary, ready to export',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <TaxChecklistMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '40+', label: 'Countries paid', sub: 'Local payout rails for implementation experts worldwide.' },
          { value: '0.4%', label: 'Flat FX fee', sub: 'One transparent conversion rate — no hidden mid-market spread.' },
          { value: '1 day', label: 'Median payout', sub: 'From signed milestone to money in your local account.' },
        ]}
      />

      <TestimonialWall
        heading="Experts who bill across borders, paid without the friction"
        testimonials={[
          {
            quote:
              'My NetSuite clients are mostly in the US, but I bank in Singapore. Proploy locks the rate when I accept the milestone, so the payout is exactly what I planned for.',
            name: 'Wei Lin Tan',
            role: 'NetSuite implementation consultant',
            color: '#155eef',
          },
          {
            quote:
              'GST used to be the part I dreaded on every invoice. Now it’s applied automatically and the year-end summary goes straight to my accountant.',
            name: 'Priya Raman',
            role: 'ERP & data migration lead',
            color: '#079455',
          },
          {
            quote:
              'I run a three-person HubSpot practice across two currencies. Per-country payout rules mean each of us gets paid locally without me touching a spreadsheet.',
            name: 'Marco Vidal',
            role: 'HubSpot rollout firm, founder',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'Which countries and currencies can I get paid in?',
            a: 'Proploy supports local payout rails in 40+ countries — including ACH in the US, SEPA across the EU, IMPS in India, and same-day local transfers elsewhere — with payout in your home currency.',
          },
          {
            q: 'How is the exchange rate decided?',
            a: 'The conversion rate is locked the moment you accept a milestone, and shown alongside a single flat conversion fee. You see the exact amount you’ll receive before any work begins.',
          },
          {
            q: 'What tax documents do I need to provide?',
            a: 'You submit the relevant form for your entity once — typically a W-8BEN-E or W-9 — plus your local tax ID. Proploy applies the correct withholding and stores the documents for every future engagement.',
          },
          {
            q: 'Does Proploy handle GST or VAT on my invoices?',
            a: 'Yes. Where GST or VAT applies, it’s calculated and added to qualifying invoices automatically, and itemized so your records stay clean.',
          },
          {
            q: 'Can I get a year-end summary for my accountant?',
            a: 'Every expert can export a year-end earnings summary covering all payouts, fees, and tax collected — formatted for handoff to an accountant or filing software.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Take work from anywhere — and keep what you earn"
        body="Join the Proploy expert network and set up your first global payout this week."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
