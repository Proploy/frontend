import type { Metadata } from 'next'
import {
  BadgeCheck,
  Layers,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
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
  title: 'Proploy for agencies · Scale your consulting firm with on-demand experts',
  description:
    'Extend your implementation bench on demand. Win more software rollouts, staff them with vetted Salesforce, NetSuite, and data experts, and deliver at scale without growing headcount.',
}

/* --------------------------------------------------------------- snippets */

function BenchRosterMock() {
  const roster = [
    {
      initials: 'PR',
      name: 'Priya Raman',
      skill: 'NetSuite ERP · data migration',
      status: 'Available now',
      tone: 'open' as const,
      color: '#155eef',
    },
    {
      initials: 'MV',
      name: 'Marco Vidal',
      skill: 'Salesforce CPQ · revenue ops',
      status: 'Available now',
      tone: 'open' as const,
      color: '#079455',
    },
    {
      initials: 'AK',
      name: 'Aisha Khan',
      skill: 'Snowflake · analytics engineering',
      status: 'Frees up Jul 1',
      tone: 'soon' as const,
      color: '#dd2590',
    },
    {
      initials: 'TS',
      name: 'Tomas Silva',
      skill: 'HubSpot · CRM integration',
      status: 'Booked · Aug',
      tone: 'booked' as const,
      color: '#7a5af8',
    },
  ]

  const toneStyles = {
    open: 'bg-[#ecfdf3] text-[#067647]',
    soon: 'bg-[#fffaeb] text-[#b54708]',
    booked: 'bg-[#f5f5f5] text-[#717680]',
  }

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[16px]">
        <div className="min-w-0">
          <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Your bench</h3>
          <p className="text-[13px] leading-[18px] text-[#717680]">14 experts · 6 available this week</p>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-white">
          <UserPlus size={15} /> Add expert
        </span>
      </div>
      <div className="flex flex-col">
        {roster.map((r, i) => (
          <div
            key={r.name}
            className={`flex items-center gap-[12px] px-[20px] py-[14px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span
              className="size-[36px] shrink-0 rounded-full text-white text-[13px] font-semibold flex items-center justify-center"
              style={{ backgroundColor: r.color }}
            >
              {r.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-[6px]">
                <span className="text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{r.name}</span>
                <BadgeCheck size={15} className="shrink-0 text-[#155eef]" />
              </span>
              <span className="block text-[13px] leading-[18px] text-[#717680] truncate">{r.skill}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px] ${toneStyles[r.tone]}`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineMock() {
  const columns = [
    {
      title: 'Scoping',
      count: 3,
      deals: [
        { client: 'Northwind Logistics', work: 'NetSuite rollout', value: '$84k' },
        { client: 'Cedar & Co', work: 'Salesforce migration', value: '$48k' },
      ],
    },
    {
      title: 'Staffed',
      count: 2,
      deals: [
        { client: 'Brightside Health', work: 'Snowflake analytics', value: '$120k' },
        { client: 'Layers Inc', work: 'HubSpot integration', value: '$36k' },
      ],
    },
    {
      title: 'Delivering',
      count: 4,
      deals: [{ client: 'Quotient', work: 'Data warehouse + BI', value: '$210k' }],
    },
  ]

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="mb-[14px] flex items-center justify-between gap-[12px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Engagement pipeline</p>
        <span className="text-[13px] leading-[18px] text-[#717680]">9 active · $498k</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
        {columns.map((col) => (
          <div key={col.title} className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[12px]">
            <div className="mb-[10px] flex items-center justify-between">
              <span className="text-[13px] font-semibold leading-[18px] text-[#252b37]">{col.title}</span>
              <span className="size-[20px] rounded-full bg-white border border-[#e9eaeb] text-[12px] font-medium text-[#717680] flex items-center justify-center">
                {col.count}
              </span>
            </div>
            <div className="flex flex-col gap-[8px]">
              {col.deals.map((d) => (
                <div key={d.client} className="rounded-[8px] border border-[#e9eaeb] bg-white p-[10px]">
                  <p className="text-[13px] font-medium leading-[18px] text-[#181d27] truncate">{d.client}</p>
                  <p className="mt-[1px] text-[12px] leading-[18px] text-[#717680] truncate">{d.work}</p>
                  <p className="mt-[6px] text-[13px] font-semibold leading-[18px] text-[#155eef]">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StaffMatchMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="size-[40px] rounded-full bg-[#eff4ff] text-[#155eef] flex items-center justify-center">
          <Layers size={20} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Brightside Health · Snowflake analytics</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">Need: analytics engineer, 6-week sprint</p>
        </div>
      </div>
      <div className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[14px] flex flex-col gap-[12px]">
        {[
          { name: 'Aisha Khan', skill: 'Snowflake · dbt · Looker', match: '98%' },
          { name: 'Devon Pryce', skill: 'BigQuery · analytics eng', match: '91%' },
        ].map((c, i) => (
          <div key={c.name} className="flex items-center gap-[10px]">
            <span className="size-[32px] shrink-0 rounded-full bg-white border border-[#e9eaeb] text-[12px] font-semibold text-[#252b37] flex items-center justify-center">
              {c.name.split(' ').map((p) => p[0]).join('')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{c.name}</span>
              <span className="block text-[12px] leading-[18px] text-[#717680] truncate">{c.skill}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${
                i === 0 ? 'bg-[#ecfdf3] text-[#067647]' : 'bg-[#f5f5f5] text-[#717680]'
              }`}
            >
              {c.match} match
            </span>
          </div>
        ))}
      </div>
      <span className="inline-flex items-center justify-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[10px] text-[13px] font-semibold leading-[18px] text-white">
        Assign to engagement
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ForAgenciesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For agencies & firms"
        title="Scale your consulting firm with on-demand experts"
        subtitle="Extend your implementation bench the moment a deal closes. Win bigger Salesforce, NetSuite, and data engagements, staff them with vetted specialists, and deliver at scale without carrying the headcount."
        primary={{ label: 'Build your bench', href: '/become-expert' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/agency/bench">
            <BenchRosterMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why firms join"
        heading="Take on the work you used to turn away"
        body="Bid on rollouts beyond your current capacity, then flex specialists in and out as engagements move through delivery."
        cards={[
          {
            icon: <Users size={24} className="text-white" />,
            title: 'Bench on demand',
            body: 'Pull from a network of vetted implementation specialists — ERP, CRM, data migration, analytics, and security — without adding to payroll.',
          },
          {
            icon: <TrendingUp size={24} className="text-white" />,
            title: 'Win more work',
            body: 'Say yes to larger and parallel engagements. Staff a NetSuite rollout and a Snowflake build in the same month without overcommitting your core team.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Deliver at scale',
            body: 'Every expert is reference-checked and skill-verified, so the work that ships under your name holds the standard your clients expect.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Staffing"
        title="Match the right specialist to every engagement"
        body="Describe the work and the platform surfaces verified experts ranked by fit — by tool, certification, and availability — so you staff in hours, not weeks of recruiting."
        bullets={[
          'Ranked matches by platform, certification, and timezone',
          'Availability shown before you reach out — no chasing',
          'Assign to an engagement and onboarding starts the same day',
        ]}
        link={{ label: 'Browse the expert network', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <StaffMatchMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Delivery"
        title="Run your whole pipeline from one board"
        body="Track every engagement from scoping to delivery, see which experts are staffed where, and spot the gap before a client ever feels it."
        bullets={[
          'Pipeline view across scoping, staffed, and delivering work',
          'Bench availability synced to live engagements',
          'Contracts, milestones, and invoicing handled in-platform',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <PipelineMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '3x', label: 'Engagement capacity', sub: 'Firms staff parallel rollouts without growing core headcount.' },
          { value: '48h', label: 'Median time to staff', sub: 'From engagement won to a verified expert assigned.' },
          { value: '100%', label: 'Vetted specialists', sub: 'Every expert is reference-checked and skill-verified.' },
        ]}
      />

      <TestimonialWall
        heading="Firms scaling on Proploy"
        testimonials={[
          {
            quote:
              'We bid on a NetSuite rollout twice the size of anything we’d delivered. Staffed two ERP specialists in a week and shipped on time. That deal alone reset our pipeline.',
            name: 'Elena Ross',
            role: 'Founder, Meridian Consulting',
            color: '#155eef',
          },
          {
            quote:
              'The bench view is the part I didn’t know I needed. I can see exactly who frees up next month and scope the next engagement around it.',
            name: 'David Okonkwo',
            role: 'Delivery lead, Northstar Systems',
            color: '#079455',
          },
          {
            quote:
              'Every expert we pulled in was vetted before we ever saw them. No bad hires, no client-facing surprises — the work held our standard.',
            name: 'Sara Lindqvist',
            role: 'Partner, Halden Advisory',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How are experts vetted before they reach my bench?',
            a: 'Every specialist is reference-checked and skill-verified against the platforms they list — Salesforce, NetSuite, HubSpot, Snowflake, and more. You only see experts who have cleared that bar.',
          },
          {
            q: 'Can experts work under our brand on client engagements?',
            a: 'Yes. Experts you bring onto an engagement deliver as an extension of your firm. You stay the client relationship owner; the platform handles staffing, contracts, and payment behind the scenes.',
          },
          {
            q: 'How fast can I staff a new engagement?',
            a: 'Most firms assign a verified expert within 48 hours. Availability is shown up front, so you reach out only to specialists who can actually start when you need them.',
          },
          {
            q: 'What types of implementation work does the network cover?',
            a: 'ERP and CRM rollouts, data migration, analytics and data-warehouse builds, integration work, and security tooling — across the major platforms your clients run on.',
          },
          {
            q: 'How do contracts and payments work across the bench?',
            a: 'Engagements run on statements of work with milestone payment terms inside Proploy, so scope, invoicing, and payouts to experts are tracked in one place — no separate paperwork per specialist.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Build a bench that scales with your pipeline"
        body="Bring vetted implementation experts onto your next engagement and take on the work you used to turn away."
        primary={{ label: 'Build your bench', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-businesses' }}
      />
    </>
  )
}
