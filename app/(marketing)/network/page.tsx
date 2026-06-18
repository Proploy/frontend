import type { Metadata } from 'next'
import { CheckCircle2, FolderHeart, RotateCcw, Search, Star, Tag } from 'lucide-react'
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
  title: 'Build a network of experts you trust · Proploy',
  description:
    'Save the implementation experts and firms who delivered, tag them by stack and outcome, and rehire in one click — your private talent network on Proploy.',
}

/* --------------------------------------------------------------- snippets */

type Saved = {
  initials: string
  name: string
  role: string
  color: string
  tags: string[]
  lastWorked: string
  rating: string
}

function NetworkListMock() {
  const people: Saved[] = [
    {
      initials: 'JA',
      name: 'Jordan Avery',
      role: 'Salesforce implementation lead',
      color: '#155eef',
      tags: ['Salesforce', 'CPQ', 'Migration'],
      lastWorked: 'Apr 2026',
      rating: '5.0',
    },
    {
      initials: 'PR',
      name: 'Priya Raman',
      role: 'NetSuite ERP consultant',
      color: '#079455',
      tags: ['NetSuite', 'ERP', 'Finance'],
      lastWorked: 'Feb 2026',
      rating: '4.9',
    },
    {
      initials: 'MV',
      name: 'Marco Vidal',
      role: 'HubSpot RevOps specialist',
      color: '#dd2590',
      tags: ['HubSpot', 'RevOps'],
      lastWorked: 'Nov 2025',
      rating: '4.8',
    },
  ]

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <div className="flex items-center gap-[10px] min-w-0">
          <FolderHeart size={18} className="text-[#155eef] shrink-0" />
          <span className="font-semibold text-[15px] leading-[22px] text-[#181d27] truncate">
            Saved experts
          </span>
          <span className="rounded-full bg-[#f5f5f5] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#717680]">
            18
          </span>
        </div>
        <span className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[6px] text-[13px] leading-[18px] text-[#717680]">
          <Search size={14} /> Search network
        </span>
      </div>

      <div>
        {people.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center gap-[16px] px-[24px] py-[16px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span
              className="size-[40px] shrink-0 rounded-full text-white text-[14px] font-semibold flex items-center justify-center"
              style={{ backgroundColor: p.color }}
            >
              {p.initials}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[8px]">
                <span className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">
                  {p.name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-[3px] text-[12px] leading-[18px] text-[#717680]">
                  <Star size={12} className="fill-[#fdb022] text-[#fdb022]" />
                  {p.rating}
                </span>
              </div>
              <p className="text-[13px] leading-[18px] text-[#535862] truncate">{p.role}</p>
              <div className="mt-[6px] flex flex-wrap items-center gap-[6px]">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-[6px] bg-[#eff4ff] px-[8px] py-[2px] text-[11px] font-medium leading-[16px] text-[#155eef]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-[2px] shrink-0">
              <span className="text-[11px] uppercase tracking-[0.04em] text-[#a4a7ae]">Last worked</span>
              <span className="text-[13px] leading-[18px] text-[#717680]">{p.lastWorked}</span>
            </div>

            <span className="inline-flex shrink-0 items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-white">
              <RotateCcw size={14} /> Rehire
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TagsMock() {
  const lists = [
    ['Salesforce bench', 7, '#155eef'],
    ['ERP & finance', 5, '#079455'],
    ['Data migration', 4, '#7a5af8'],
    ['Security & compliance', 2, '#dd2590'],
  ] as const

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        Organize by stack &amp; outcome
      </p>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {lists.map(([label, count, color], i) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-[12px] rounded-[10px] border px-[14px] py-[12px] ${
              i === 0 ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb]'
            }`}
          >
            <span className="flex items-center gap-[10px] min-w-0">
              <span className="size-[10px] shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{label}</span>
            </span>
            <span className="flex items-center gap-[6px] shrink-0 text-[13px] leading-[18px] text-[#717680]">
              <Tag size={13} /> {count} experts
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RehireMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="size-[40px] rounded-full bg-[#155eef] text-white font-semibold flex items-center justify-center">
          JA
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Rehire Jordan Avery</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">Salesforce · 3 prior engagements</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-white">
          <RotateCcw size={15} /> Start
        </span>
      </div>

      <div className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[14px] flex flex-col gap-[10px]">
        {[
          'Prior scope & rates pre-filled',
          'Past SOW and notes attached',
          'Vetting & references already cleared',
          'Available from Jul 1',
        ].map((label) => (
          <div key={label} className="flex items-center gap-[10px]">
            <CheckCircle2 size={18} className="text-[#17b26a]" />
            <span className="text-[14px] leading-[20px] text-[#252b37]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function NetworkPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Talent network"
        title="Build a network of experts you trust"
        subtitle="Save the implementation experts and firms who delivered, organize them by stack and outcome, and rehire in one click — no re-sourcing, no re-vetting."
        primary={{ label: 'Start your network', href: '/for-businesses' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/dashboard/network">
            <NetworkListMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="The experts who delivered, one click away next time"
        body="Most software work is repeat work — a new module, a second region, the next migration. Your network keeps the people who already know your environment within reach."
        cards={[
          {
            icon: <FolderHeart size={24} className="text-white" />,
            title: 'Save who delivered',
            body: 'Add any expert or firm to your network after an engagement, with their role, ratings, and your private notes kept alongside.',
          },
          {
            icon: <Tag size={24} className="text-white" />,
            title: 'Organize by stack',
            body: 'Group your bench by platform and outcome — Salesforce, NetSuite, data migration, security tooling — so the right shortlist is one filter away.',
          },
          {
            icon: <RotateCcw size={24} className="text-white" />,
            title: 'Rehire in one click',
            body: 'Start the next project with scope, rates, and prior context pre-filled. No reposting a brief, no re-vetting people you already trust.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Relationship management"
        title="A private bench, organized the way you actually hire"
        body="Sort saved experts into lists by platform, region, or outcome — so when the next HubSpot rollout or ERP phase lands, your shortlist is already built."
        bullets={[
          'Group experts into named lists like “Salesforce bench” or “ERP & finance”',
          'Filter by stack, certification, last-worked-with date, and rating',
          'Keep private notes and past SOWs attached to every relationship',
        ]}
        link={{ label: 'Explore the dashboard', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <TagsMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Rehire"
        title="Pick up exactly where the last project left off"
        body="Rehiring a known expert carries forward everything you established the first time — scope, rates, references, and the context that made the work go smoothly."
        bullets={[
          'Prior scope and rates pre-filled into a fresh engagement',
          'Past statements of work and notes attached automatically',
          'Vetting and references already cleared — start without the ramp-up',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <RehireMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '64%', label: 'Of projects are repeat hires', sub: 'Teams come back to experts already in their network.' },
          { value: '1 click', label: 'From shortlist to kickoff', sub: 'Rehire with scope and rates carried forward.' },
          { value: '11 days', label: 'Saved per re-engagement', sub: 'No reposting, re-sourcing, or re-vetting known experts.' },
        ]}
      />

      <TestimonialWall
        heading="A bench teams keep coming back to"
        testimonials={[
          {
            quote:
              'After our Salesforce rollout we saved the whole team. When the CPQ phase came up, rehiring took a click and they already knew our org.',
            name: 'Dana Whitfield',
            role: 'VP Operations, Northwind Logistics',
            color: '#155eef',
          },
          {
            quote:
              'My network is sorted by platform. For the NetSuite expansion I filtered to my ERP list and had a shortlist of people I trusted in seconds.',
            name: 'Samuel Okafor',
            role: 'Head of IT, Brightside Health',
            color: '#079455',
          },
          {
            quote:
              'Being saved to a client’s network is the best lead source I have. Repeat work finds me instead of me chasing new briefs.',
            name: 'Priya Raman',
            role: 'NetSuite ERP consultant',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How do experts get added to my network?',
            a: 'After any engagement you can save the expert or firm to your network with one click. You can also add anyone you’ve shortlisted, and your saved list is private to your team.',
          },
          {
            q: 'Can I organize experts into lists?',
            a: 'Yes. Group saved experts into named lists by platform, region, or outcome — like “Salesforce bench” or “Data migration” — and filter by stack, rating, or last-worked-with date.',
          },
          {
            q: 'What does “rehire in one click” actually carry over?',
            a: 'A rehire pre-fills prior scope and rates, attaches the past statement of work and your notes, and skips re-vetting since references and credentials are already cleared.',
          },
          {
            q: 'Is my network visible to other businesses or experts?',
            a: 'No. Your saved experts, lists, and notes are private to your team. Experts can see when they’ve been saved, but never who else is in your network.',
          },
          {
            q: 'What if an expert isn’t available when I want to rehire?',
            a: 'Their profile shows current availability. If they’re booked, Proploy surfaces similar vetted experts on the same stack so you can keep the project moving.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Keep your best experts within reach"
        body="Build your private talent network on Proploy and rehire the people who already know your stack."
        primary={{ label: 'Start your network', href: '/for-businesses' }}
        secondary={{ label: 'Browse experts', href: '/for-experts' }}
      />
    </>
  )
}
