import type { Metadata } from 'next'
import {
  BadgeCheck,
  Building2,
  Check,
  Filter,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
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
  title: 'Discover implementation experts · Proploy',
  description:
    'Search a vetted network of software-implementation experts and firms. Filter by platform, industry, and rate to shortlist the right team in days, not months.',
}

/* --------------------------------------------------------------- snippets */

type Expert = {
  initials: string
  color: string
  name: string
  title: string
  rating: string
  reviews: string
  rate: string
  availability: string
  verified: boolean
  tags: string[]
}

const EXPERTS: Expert[] = [
  {
    initials: 'DM',
    color: '#155eef',
    name: 'Devi Menon',
    title: 'NetSuite ERP lead · 11 yrs',
    rating: '5.0',
    reviews: '34',
    rate: '$165/hr',
    availability: 'Available Jul 1',
    verified: true,
    tags: ['NetSuite', 'Data migration', 'Manufacturing'],
  },
  {
    initials: 'RC',
    color: '#7a5af8',
    name: 'Rivera Consulting',
    title: 'Salesforce CRM rollouts',
    rating: '4.9',
    reviews: '58',
    rate: '$140/hr',
    availability: 'Available now',
    verified: true,
    tags: ['Salesforce', 'CPQ', 'SaaS'],
  },
  {
    initials: 'TB',
    color: '#dd2590',
    name: 'Theo Brandt',
    title: 'HubSpot RevOps architect',
    rating: '4.8',
    reviews: '41',
    rate: '$120/hr',
    availability: 'Available Jun 23',
    verified: true,
    tags: ['HubSpot', 'Marketing ops', 'B2B'],
  },
  {
    initials: 'LS',
    color: '#079455',
    name: 'Lin Shaw',
    title: 'Snowflake & analytics eng.',
    rating: '5.0',
    reviews: '22',
    rate: '$185/hr',
    availability: 'Available Jul 15',
    verified: true,
    tags: ['Snowflake', 'dbt', 'Analytics'],
  },
]

const FILTERS: { label: string; options: { name: string; count: string; on?: boolean }[] }[] = [
  {
    label: 'Software',
    options: [
      { name: 'Salesforce', count: '214', on: true },
      { name: 'NetSuite', count: '96', on: true },
      { name: 'HubSpot', count: '141' },
      { name: 'Snowflake', count: '63' },
    ],
  },
  {
    label: 'Industry',
    options: [
      { name: 'Manufacturing', count: '88', on: true },
      { name: 'Financial services', count: '72' },
      { name: 'Healthcare', count: '54' },
    ],
  },
]

function DiscoveryMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white overflow-hidden">
      {/* search bar */}
      <div className="flex items-center gap-[10px] border-b border-[#e9eaeb] px-[16px] py-[14px]">
        <span className="flex flex-1 items-center gap-[8px] rounded-[10px] border border-[#d5d7da] bg-white px-[12px] py-[8px]">
          <Search size={16} className="text-[#717680] shrink-0" />
          <span className="text-[14px] leading-[20px] text-[#252b37]">
            Salesforce migration
          </span>
          <span className="ml-auto h-[16px] w-px bg-[#e9eaeb]" />
          <span className="text-[13px] leading-[18px] text-[#717680] whitespace-nowrap">United States</span>
        </span>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-white">
          Search
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
        {/* filter rail */}
        <aside className="border-b sm:border-b-0 sm:border-r border-[#e9eaeb] px-[16px] py-[16px]">
          <div className="flex items-center gap-[6px] text-[#181d27]">
            <SlidersHorizontal size={15} />
            <span className="text-[13px] font-semibold leading-[18px]">Filters</span>
          </div>

          <div className="mt-[8px] flex flex-wrap gap-[6px]">
            {['Salesforce', 'NetSuite', 'Manufacturing'].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-[5px] rounded-full bg-[#eff4ff] px-[8px] py-[3px] text-[12px] font-medium leading-[16px] text-[#155eef]"
              >
                {chip}
                <span className="text-[#84adff]">×</span>
              </span>
            ))}
          </div>

          {FILTERS.map((group) => (
            <div key={group.label} className="mt-[16px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#717680]">
                {group.label}
              </p>
              <div className="mt-[8px] flex flex-col gap-[8px]">
                {group.options.map((opt) => (
                  <span key={opt.name} className="flex items-center gap-[8px]">
                    <span
                      className={`flex size-[16px] items-center justify-center rounded-[4px] border ${
                        opt.on ? 'border-[#155eef] bg-[#155eef]' : 'border-[#d5d7da] bg-white'
                      }`}
                    >
                      {opt.on && <Check size={11} className="text-white" strokeWidth={3} />}
                    </span>
                    <span className="text-[13px] leading-[18px] text-[#252b37]">{opt.name}</span>
                    <span className="ml-auto text-[12px] leading-[16px] text-[#a4a7ae]">{opt.count}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-[16px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#717680]">
              Rate / hr
            </p>
            <div className="mt-[10px] h-[4px] rounded-full bg-[#e9eaeb]">
              <span className="block h-full w-[62%] rounded-full bg-[#155eef]" />
            </div>
            <div className="mt-[6px] flex justify-between text-[12px] leading-[16px] text-[#717680]">
              <span>$80</span>
              <span>$200+</span>
            </div>
          </div>
        </aside>

        {/* results grid */}
        <div className="px-[16px] py-[16px]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] leading-[18px] text-[#535862]">
              <span className="font-semibold text-[#181d27]">142 experts</span> match your filters
            </p>
            <span className="inline-flex items-center gap-[5px] rounded-[8px] border border-[#e9eaeb] px-[8px] py-[4px] text-[12px] leading-[16px] text-[#535862]">
              <Filter size={13} /> Top rated
            </span>
          </div>

          <div className="mt-[12px] grid grid-cols-1 md:grid-cols-2 gap-[10px]">
            {EXPERTS.map((e) => (
              <div key={e.name} className="rounded-[10px] border border-[#e9eaeb] bg-white p-[14px]">
                <div className="flex items-start gap-[10px]">
                  <span
                    className="flex size-[36px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                    style={{ background: e.color }}
                  >
                    {e.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-[5px] text-[14px] font-semibold leading-[20px] text-[#181d27]">
                      <span className="truncate">{e.name}</span>
                      {e.verified && <BadgeCheck size={15} className="shrink-0 text-[#155eef]" />}
                    </p>
                    <p className="truncate text-[12px] leading-[16px] text-[#717680]">{e.title}</p>
                  </div>
                </div>

                <div className="mt-[10px] flex flex-wrap gap-[5px]">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-[6px] bg-[#fafafa] border border-[#e9eaeb] px-[7px] py-[2px] text-[11px] leading-[16px] text-[#535862]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-[12px] flex items-center justify-between border-t border-[#e9eaeb] pt-[10px]">
                  <span className="flex items-center gap-[4px] text-[12px] leading-[16px] text-[#535862]">
                    <Star size={13} className="fill-[#fdb022] text-[#fdb022]" />
                    <span className="font-semibold text-[#181d27]">{e.rating}</span>
                    <span className="text-[#a4a7ae]">({e.reviews})</span>
                  </span>
                  <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">{e.rate}</span>
                </div>

                <p className="mt-[8px] flex items-center gap-[5px] text-[12px] leading-[16px] text-[#067647]">
                  <span className="size-[6px] rounded-full bg-[#17b26a]" />
                  {e.availability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ShortlistMock() {
  const rows = [
    ['Rivera Consulting', 'Salesforce CRM rollouts', 'Shortlisted'],
    ['Devi Menon', 'NetSuite ERP lead', 'Intro sent'],
    ['Theo Brandt', 'HubSpot RevOps architect', 'Reviewing'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        Salesforce migration · shortlist
      </p>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {rows.map(([name, role, status], i) => (
          <div
            key={name}
            className={`flex items-center justify-between gap-[12px] rounded-[10px] border px-[14px] py-[12px] ${
              i === 0 ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb]'
            }`}
          >
            <span className="flex min-w-0 items-center gap-[10px]">
              <Building2 size={18} className={i === 0 ? 'text-[#155eef]' : 'text-[#717680]'} />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium leading-[20px] text-[#252b37]">{name}</span>
                <span className="block truncate text-[12px] leading-[16px] text-[#717680]">{role}</span>
              </span>
            </span>
            <span
              className={`shrink-0 rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
                i === 0 ? 'bg-[#eff4ff] text-[#155eef]' : 'bg-[#fafafa] text-[#535862] border border-[#e9eaeb]'
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function VettingMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="flex size-[40px] items-center justify-center rounded-full bg-[#7a5af8] text-[14px] font-semibold text-white">
          RC
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-[5px] text-[14px] font-semibold leading-[20px] text-[#181d27]">
            Rivera Consulting <BadgeCheck size={15} className="text-[#155eef]" />
          </p>
          <p className="text-[13px] leading-[18px] text-[#535862]">Salesforce partner · 58 reviews</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[5px] rounded-full bg-[#f6fef9] border border-[#a9efc5] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <ShieldCheck size={13} /> Vetted
        </span>
      </div>
      <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px] flex flex-col gap-[10px]">
        {[
          'Identity & business verified',
          'Salesforce certifications confirmed',
          '12 client references checked',
          'Background screening',
        ].map((label) => (
          <div key={label} className="flex items-center gap-[10px]">
            <Check size={16} className="text-[#17b26a]" strokeWidth={3} />
            <span className="text-[14px] leading-[20px] text-[#252b37]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function DiscoverExpertsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Discovery"
        title="Find the right implementation expert in days"
        subtitle="Search a vetted network of software-implementation specialists and firms. Filter by platform, industry, and rate to build a shortlist you can trust — without a months-long RFP."
        primary={{ label: 'Browse experts', href: '/for-businesses' }}
        secondary={{ label: 'See how vetting works', href: '#vetting' }}
      >
        <div className="mx-auto max-w-[860px]">
          <UISnippetFrame title="proploy.com/discover">
            <DiscoveryMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="Stop guessing whether a vendor can actually deliver"
        body="Most implementation searches start with a referral and a leap of faith. Proploy gives you a structured way to find, compare, and qualify experts before a single call."
        cards={[
          {
            icon: <Search size={24} className="text-white" />,
            title: 'Search by what you run',
            body: 'Look up experts by the exact platform you are rolling out — Salesforce, NetSuite, HubSpot, Snowflake — and the migration or integration work you need done.',
          },
          {
            icon: <SlidersHorizontal size={24} className="text-white" />,
            title: 'Filter to a real shortlist',
            body: 'Narrow by industry, hourly rate, availability, and team size, so the results you see are the experts who actually fit your project and budget.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Trust the profiles you see',
            body: 'Every expert is identity-verified with confirmed certifications and checked client references — the vetting is done before they reach your shortlist.',
          },
        ]}
      />

      <StackedFeatureBlock
        eyebrow="Search & filter"
        title="Filters built for software implementation, not generic gigs"
        body="Proploy indexes experts by platform expertise and delivery history, so a search for a NetSuite data migration surfaces people who have run one — not a directory of generalists."
        bullets={[
          'Filter chips for software, industry, rate, and availability',
          'Sort by rating, recent delivery, or time to start',
          'Side-by-side profiles with certifications and review history',
        ]}
        link={{ label: 'Start a search', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ShortlistMock />
          </UISnippetFrame>
        }
      />

      <div id="vetting" />
      <StackedFeatureBlock
        eyebrow="Vetting"
        title="Shortlist with confidence, because the checks are already done"
        body="Identity, business registration, platform certifications, and client references are verified before an expert is listed. The vetted badge means the diligence happened before you started looking."
        bullets={[
          'Identity and business verification on every profile',
          'Platform certifications confirmed, not self-reported',
          'Real client references and reviews from past rollouts',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <VettingMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '3 days', label: 'Median time to a shortlist', sub: 'From first search to three qualified experts ready to talk.' },
          { value: '2,400+', label: 'Vetted experts and firms', sub: 'Across Salesforce, NetSuite, HubSpot, ERP, and analytics.' },
          { value: '100%', label: 'Verified before listing', sub: 'Identity, certifications, and references checked up front.' },
        ]}
      />

      <TestimonialWall
        heading="How buyers find their implementation team"
        testimonials={[
          {
            quote:
              'We needed a NetSuite partner with manufacturing experience. Two filters got us to a shortlist of four — and we signed one of them the same week.',
            name: 'Hannah Cole',
            role: 'VP Operations, Northwind Logistics',
            color: '#155eef',
          },
          {
            quote:
              'The certifications and references being verified up front saved us an entire round of vetting calls. We went straight to scoping the work.',
            name: 'Marcus Idris',
            role: 'CFO, Brightside Health',
            color: '#079455',
          },
          {
            quote:
              'Rate and availability filters meant every profile we opened was actually in budget and free to start. No more chasing dead ends.',
            name: 'Sofia Lund',
            role: 'Head of RevOps, Capsule',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        heading="Questions about finding experts"
        faqs={[
          {
            q: 'How are experts vetted before they appear in search?',
            a: 'Every expert and firm completes identity and business verification, has their platform certifications confirmed, and passes a client-reference check before being listed. The vetted badge means that diligence is already complete.',
          },
          {
            q: 'Which software platforms can I search by?',
            a: 'You can filter by the major implementation platforms — Salesforce, NetSuite, HubSpot, Snowflake — as well as ERP, data migration, analytics, and security tooling, plus the industry the expert has delivered in.',
          },
          {
            q: 'Can I compare experts side by side?',
            a: 'Yes. Add experts to a shortlist as you search and compare certifications, hourly rate, availability, and review history in one view before you reach out.',
          },
          {
            q: 'Does it cost anything to search and shortlist?',
            a: 'Searching the network, filtering, and building a shortlist are free. You only engage commercial terms once you choose an expert and scope the work together on Proploy.',
          },
          {
            q: 'What if I cannot find the right fit?',
            a: 'If filters do not surface the right team, our team can hand-match you to vetted experts for your specific rollout. Reach out and we will help you scope the search.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Find your implementation team this week"
        body="Search the vetted Proploy network and build a shortlist for your next software rollout in days."
        primary={{ label: 'Browse experts', href: '/for-businesses' }}
        secondary={{ label: 'How Proploy works', href: '/for-businesses' }}
      />
    </>
  )
}
