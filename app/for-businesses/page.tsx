'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, MessageSquareMore, Zap, BarChart3, MessageCircle } from 'lucide-react'
import Footer from '@/components/Footer'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

const METRICS = [
  { value: '400+', label: 'Software products curated' },
  { value: '600%', label: 'Faster implementation cycles' },
  { value: '10k', label: 'Buyers & operators served' },
]

type Cell = boolean | string

interface ComparisonRow {
  label: string
  values: [Cell, Cell, Cell]
}

interface ComparisonSection {
  title: string
  rows: ComparisonRow[]
}

const COMPARISON_COLUMNS = ['Traditional Platforms', 'Solo Hires', 'Proploy'] as const

const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    title: 'Discovery & matching',
    rows: [
      { label: 'Curated software shortlist', values: [false, false, true] },
      { label: 'Vetted implementation experts', values: [false, true, true] },
      { label: 'Match based on team context', values: [false, false, true] },
      { label: 'Free initial consultation', values: ['—', '—', 'Included'] },
      { label: 'Searchable, filterable directory', values: [true, false, true] },
      { label: 'Pricing transparency', values: [false, false, true] },
    ],
  },
  {
    title: 'Implementation experience',
    rows: [
      { label: 'Single workspace for kickoff', values: [false, false, true] },
      { label: 'Milestone tracking', values: ['Limited', 'Manual', 'Built-in'] },
      { label: 'Live status updates', values: [false, false, true] },
      { label: 'In-platform comms with expert', values: [false, false, true] },
      { label: 'Document hand-off', values: ['Email', 'Email', 'In-app'] },
      { label: 'Standardised SOWs', values: [false, false, true] },
      { label: 'Outcome-based check-ins', values: [false, false, true] },
      { label: 'Dedicated success owner', values: [false, false, true] },
      { label: 'Centralised vendor invoicing', values: [false, false, true] },
    ],
  },
  {
    title: 'Trust & accountability',
    rows: [
      { label: 'Verified expert credentials', values: [false, true, true] },
      { label: 'Public expert ratings', values: [false, false, true] },
      { label: 'Money-back guarantee window', values: [false, false, true] },
      { label: 'Escalation pathway', values: ['Support ticket', 'None', 'White-glove'] },
      { label: 'Data ownership clarity', values: [false, false, true] },
    ],
  },
]

const SOLUTION_CARDS = [
  {
    icon: <MessageSquareMore size={24} className="text-white" />,
    title: 'Brief us once',
    body:
      "Share your team's stage, stack, and budget. Proploy turns it into a tailored shortlist of software and experts in days, not weeks.",
  },
  {
    icon: <Zap size={24} className="text-white" />,
    title: 'Match with vetted experts',
    body:
      "Every implementation expert is interviewed, reference-checked, and graded against the playbook for the software you're rolling out.",
  },
  {
    icon: <BarChart3 size={24} className="text-white" />,
    title: 'Track to go-live',
    body:
      'Milestones, status, and approvals live in one workspace — so finance, ops, and the expert stay aligned through rollout.',
  },
  {
    icon: <MessageCircle size={24} className="text-white" />,
    title: 'Stay supported post-launch',
    body:
      'A dedicated success owner keeps the expert engaged through training, cutover, and the first 90 days of adoption.',
  },
]

const CASE_STUDIES = [
  {
    company: 'Layers',
    color: '#155eef',
    quote: '“Proploy shortlisted three tools in two days. We picked one and were live in three weeks.”',
  },
  {
    company: 'Sisyphus',
    color: '#079455',
    quote: '“The matched implementation expert knew our CRM better than the vendor sales team did.”',
  },
  {
    company: 'Capsule',
    color: '#1570ef',
    quote: '“One workspace from RFP to rollout. Procurement stopped chasing email threads.”',
  },
  {
    company: 'Catalog',
    color: '#444ce7',
    quote: '“We replaced a six-month evaluation with a four-week Proploy engagement. Same outcome.”',
  },
]

const LOGOS = ['Fruition', 'Layers', 'Sisyphus', 'Capsule', 'Catalog', 'Coreos', 'Quotient', 'Hourglass', 'Wildcraft']

export default function ForBusinessesPage() {
  return (
    <div className="min-h-screen bg-white pt-[80px] font-[family-name:var(--font-dm-sans)] flex flex-col">
      {/* Hero */}
      <section className="py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[12px]">
          <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">For Business</p>
          <div className="flex flex-wrap gap-[32px] items-start w-full">
            <div className="flex-1 min-w-[480px] max-w-[768px]">
              <h1 className="font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]">
                Find the software and the expert <br /> to make it work, together
              </h1>
            </div>
            <div className="flex-1 min-w-[300px] max-w-[480px] pt-[12px]">
              <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
                Proploy helps growing businesses discover best-fit software, get matched with vetted implementation experts, and launch with confidence.
              </p>
            </div>
          </div>
          <div className="flex gap-[12px] mt-[36px]">
            <Link
              href="/experts"
              className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
            >
              Explore experts
            </Link>
            <Link
              href="/sign-up"
              className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}
            >
              Get matched
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          <div className="flex flex-wrap gap-[32px] justify-center bg-[#fafafa] rounded-[16px] p-[64px]">
            {METRICS.map((m) => (
              <div key={m.label} className="flex-1 min-w-[240px] flex flex-col items-center gap-[12px]">
                <p className="font-semibold text-[60px] leading-[72px] text-[#155eef] text-center tracking-[-1.2px]">
                  {m.value}
                </p>
                <p className="font-semibold text-[18px] leading-[28px] text-[#181d27] text-center">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] flex flex-col gap-[20px]">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">The problem</p>
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              Software buying is broken for growing teams
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Stacks fall apart between sales calls, agency hand-offs, and Slack threads. Proploy puts discovery,
              experts, and rollout in one place.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div
              className="grid min-w-[960px]"
              style={{ gridTemplateColumns: '304px repeat(3, 1fr)' }}
            >
              <div />
              {COMPARISON_COLUMNS.map((col, idx) => (
                <div
                  key={col}
                  className={`flex items-center justify-center font-semibold text-[20px] leading-[30px] py-[8px] ${
                    idx === COMPARISON_COLUMNS.length - 1 ? 'text-[#004eeb]' : 'text-[#181d27]'
                  }`}
                >
                  {col}
                </div>
              ))}

              {COMPARISON_SECTIONS.map((section) => (
                <div key={section.title} className="contents">
                  <div className="col-span-4 py-[8px] font-semibold text-[16px] leading-[24px] text-[#004eeb]">
                    {section.title}
                  </div>
                  {section.rows.map((row, rowIdx) => (
                    <div key={row.label} className="contents">
                      <div
                        className={`flex items-center px-[16px] py-[16px] font-normal text-[16px] leading-[24px] text-[#414651] ${
                          rowIdx % 2 === 0 ? 'bg-[#fafafa]' : ''
                        }`}
                      >
                        {row.label}
                      </div>
                      {row.values.map((v, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-center px-[16px] py-[16px] font-normal text-[16px] leading-[24px] text-[#414651] ${
                            rowIdx % 2 === 0 ? 'bg-[#fafafa]' : ''
                          }`}
                        >
                          {typeof v === 'boolean' ? (
                            v ? (
                              <span className="size-[24px] rounded-full bg-[#dcfae6] flex items-center justify-center">
                                <Check size={14} className="text-[#079455]" strokeWidth={3} />
                              </span>
                            ) : (
                              <span className="text-[#717680]">—</span>
                            )
                          ) : (
                            <span>{v}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution cards */}
      <section className="pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] flex flex-col gap-[20px]">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">The solution</p>
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              One workflow from software decision to successful launch.
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Browse, match, and ship — all in a single thread, with the right experts plugged in from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {SOLUTION_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-[#fafafa] flex flex-col gap-[64px] p-[24px] min-h-[328px]"
              >
                <div className={`size-[48px] rounded-[10px] bg-[#155eef] border-2 border-white/[0.12] flex items-center justify-center ${BUTTON_SKEUO_SHADOW}`}>
                  {card.icon}
                </div>
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{card.title}</p>
                    <p className="font-normal text-[16px] leading-[24px] text-[#535862]">{card.body}</p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-[6px] font-semibold text-[16px] leading-[24px] text-[#004eeb] hover:underline self-start">
                    Learn more <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] flex flex-col gap-[20px]">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">Our story</p>
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              We&apos;re just getting started
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              We&apos;ve already helped over 4,000 companies achieve remarkable results.
            </p>
          </div>
          <div className="flex flex-wrap gap-[64px] items-start">
            <div className="flex-1 min-w-[420px] max-w-[720px] flex flex-col gap-[18px] font-normal text-[18px] leading-[28px] text-[#535862]">
              <p>Proploy started in a back room of a procurement consultancy where every other deal hit the same wall — a strong shortlist, a strong vendor, and no one who could actually take it live for the team.</p>
              <p>So we built the bridge. A directory of software the way buyers actually compare it, paired with a roster of implementation experts who have shipped it before. One brief, one conversation, one rollout.</p>
              <p>Today we help operators, founders, and procurement leads at growing companies match with the right software and the right hands — and stay on the same thread through cutover, training, and the first 90 days.</p>
            </div>
            <div className="flex-1 min-w-[420px] max-w-[720px] flex flex-col gap-[18px] font-normal text-[18px] leading-[28px] text-[#535862]">
              <p>What it actually feels like:</p>
              <ul className="list-disc ms-[24px] flex flex-col gap-[8px]">
                <li>A shortlist tuned to your stage, stack, and budget — not a vendor leaderboard.</li>
                <li>Implementation partners interviewed and graded against the same playbook every time.</li>
                <li>One workspace from first call to go-live, so nothing falls between calendars.</li>
              </ul>
              <p>If the rollout misses the mark, we keep working. The product, the expert, and the outcome live on the same line item.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-[#e9eaeb]" />

      {/* Case studies */}
      <section className="py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-y-[32px]">
            <div className="flex-1 min-w-[480px] max-w-[768px] flex flex-col gap-[20px]">
              <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                We&apos;re proud of our success stories
              </h2>
              <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
                Case studies from some of our amazing customers who are building faster.
              </p>
            </div>
            <div className="flex gap-[12px]">
              <Link href="#" className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}>
                Our customers
              </Link>
              <Link href="/sign-up" className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}>
                Create account
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-[32px]">
            <div className="flex gap-[32px] overflow-x-auto pb-[8px]">
              {CASE_STUDIES.map((cs) => (
                <article
                  key={cs.company}
                  className="relative flex flex-col h-[504px] w-[384px] shrink-0 p-[20px] justify-end"
                  style={{ backgroundColor: cs.color }}
                >
                  <div className="absolute top-[32px] left-[32px] font-semibold text-white text-[24px] leading-[32px]">
                    {cs.company}
                  </div>
                  <div className="backdrop-blur-[12px] bg-white/30 border border-white/30 px-[24px] py-[32px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[12px] text-white">
                      <p className="font-semibold text-[24px] leading-[32px]">{cs.company}</p>
                      <p className="font-medium text-[18px] leading-[28px]">{cs.quote}</p>
                    </div>
                    <button type="button" className="inline-flex items-center gap-[6px] font-semibold text-[16px] leading-[24px] text-white self-start">
                      Read case study <ArrowUpRight size={20} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex gap-[32px]">
              <button type="button" aria-label="Previous" className="size-[56px] rounded-full border border-[#e9eaeb] flex items-center justify-center text-[#414651] hover:bg-gray-50">
                <ArrowLeft size={24} />
              </button>
              <button type="button" aria-label="Next" className="size-[56px] rounded-full border border-[#e9eaeb] flex items-center justify-center text-[#414651] hover:bg-gray-50">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote testimonial */}
      <section className="py-[96px] bg-[#fafafa]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col items-center gap-[32px]">
          <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">— Untitled</p>
          <p className="max-w-[1024px] font-medium text-[30px] leading-[44px] text-[#181d27] text-center tracking-[-0.6px]">
            “Finding the right implementation partner for a new platform is a daunting task. Proploy matched us with a vetted expert who shipped on time and on scope — we&apos;ll keep using them for every rollout.”
          </p>
          <div className="flex items-center gap-[16px]">
            <div className="size-[48px] rounded-full bg-[#155eef] text-white font-bold flex items-center justify-center">A</div>
            <div className="flex flex-col">
              <span className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Adam Wathan</span>
              <span className="font-normal text-[14px] leading-[20px] text-[#535862]">Head of Operations, Fruition</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-wrap items-start gap-[64px]">
          <div className="flex-1 min-w-[360px] flex flex-col gap-[48px]">
            <div className="max-w-[768px] flex flex-col gap-[20px]">
              <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                Join 4,000+ teams choosing software with Proploy
              </h2>
              <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
                Get matched with a vetted implementation expert — first consultation is free.
              </p>
            </div>
            <div className="flex gap-[12px]">
              <Link href="#" className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}>
                Learn more
              </Link>
              <Link href="/sign-up" className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}>
                Get started
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[360px] grid grid-cols-3 gap-x-[32px] gap-y-[24px] items-center justify-items-center">
            {LOGOS.map((l) => (
              <div key={l} className="font-semibold text-[14px] leading-[20px] text-[#717680] uppercase tracking-[1px]">
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
