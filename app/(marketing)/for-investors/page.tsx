import type { Metadata } from 'next'
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Network,
  ShieldCheck,
  Star,
  TrendingUp,
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
  title: 'Proploy for investors · An implementation bench for your portfolio',
  description:
    'Give every portfolio company a vetted network of software-implementation experts — Salesforce, NetSuite, ERP, and data teams they can tap to ship faster.',
}

/* --------------------------------------------------------------- snippets */

function PortfolioGridMock() {
  const companies = [
    { name: 'Northwind Logistics', stage: 'Series A', work: 'NetSuite ERP rollout', status: 'In progress' },
    { name: 'Brightside Health', stage: 'Seed', work: 'Salesforce Health Cloud', status: 'Sourcing' },
    { name: 'Cedar & Co', stage: 'Series B', work: 'Snowflake data migration', status: 'Live' },
    { name: 'Layers AI', stage: 'Seed', work: 'HubSpot RevOps setup', status: 'In progress' },
  ]
  const dot: Record<string, string> = {
    'In progress': '#155eef',
    Sourcing: '#f79009',
    Live: '#17b26a',
  }
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <div className="flex items-center gap-[10px]">
          <span className="size-[28px] rounded-[8px] bg-[#eff4ff] text-[#155eef] flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </span>
          <span className="font-semibold text-[15px] leading-[22px] text-[#181d27]">Meridian Ventures · Portfolio</span>
        </div>
        <span className="text-[13px] leading-[18px] text-[#717680]">24 companies</span>
      </div>
      <div className="px-[24px] py-[20px]">
        <div className="overflow-hidden rounded-[10px] border border-[#e9eaeb]">
          {companies.map((c, i) => (
            <div
              key={c.name}
              className={`flex items-center justify-between gap-[12px] px-[16px] py-[14px] ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              }`}
            >
              <span className="flex items-center gap-[12px] min-w-0">
                <span className="size-[34px] rounded-[8px] bg-[#181d27] text-white text-[13px] font-semibold flex items-center justify-center shrink-0">
                  {c.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{c.name}</span>
                  <span className="text-[13px] leading-[18px] text-[#717680] truncate">{c.work}</span>
                </span>
              </span>
              <span className="flex items-center gap-[16px] shrink-0">
                <span className="hidden sm:inline rounded-full bg-[#fafafa] border border-[#e9eaeb] px-[10px] py-[2px] text-[12px] font-medium leading-[18px] text-[#535862]">
                  {c.stage}
                </span>
                <span className="inline-flex items-center gap-[6px] text-[13px] leading-[18px] text-[#535862] w-[96px] justify-end">
                  <span className="size-[7px] rounded-full" style={{ background: dot[c.status] }} />
                  {c.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExpertShortlistMock() {
  const experts = [
    { name: 'Jordan Avery', focus: 'Salesforce · Health Cloud', rate: '$185/hr', score: '4.9' },
    { name: 'Priya Raman', focus: 'NetSuite ERP · Finance ops', rate: '$210/hr', score: '5.0' },
    { name: 'Marco Vidal', focus: 'Snowflake · Data migration', rate: '$165/hr', score: '4.8' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center justify-between gap-[12px] px-[2px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Shared shortlist · NetSuite ERP</p>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          <BadgeCheck size={13} /> Vetted
        </span>
      </div>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {experts.map((e) => (
          <div
            key={e.name}
            className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
          >
            <span className="flex items-center gap-[10px] min-w-0">
              <span className="size-[36px] rounded-full bg-[#155eef] text-white text-[13px] font-semibold flex items-center justify-center shrink-0">
                {e.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{e.name}</span>
                <span className="text-[13px] leading-[18px] text-[#717680] truncate">{e.focus}</span>
              </span>
            </span>
            <span className="flex items-center gap-[14px] shrink-0">
              <span className="hidden sm:inline-flex items-center gap-[4px] text-[13px] font-medium leading-[18px] text-[#181d27]">
                <Star size={13} className="text-[#f79009] fill-[#f79009]" />
                {e.score}
              </span>
              <span className="w-[64px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">{e.rate}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-[12px] flex items-center justify-between gap-[12px] rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] px-[14px] py-[12px]">
        <span className="text-[13px] leading-[18px] text-[#535862]">Shared with 6 portfolio companies</span>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[7px] text-[13px] font-semibold leading-[18px] text-white">
          Share shortlist
        </span>
      </div>
    </div>
  )
}

function IntroFlowMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="size-[40px] rounded-full bg-[#181d27] text-white font-semibold flex items-center justify-center">
          BH
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Brightside Health</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">Intro requested · Salesforce Health Cloud</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          Warm intro
        </span>
      </div>
      <div className="rounded-[10px] bg-[#fafafa] border border-[#e9eaeb] p-[14px] flex flex-col gap-[10px]">
        {[
          ['Founder requested an expert', true],
          ['Matched from your shared bench', true],
          ['Scoped discovery call booked', true],
          ['Statement of work signed', false],
        ].map(([label, done]) => (
          <div key={label as string} className="flex items-center gap-[10px]">
            {done ? (
              <CheckCircle2 size={18} className="text-[#17b26a]" />
            ) : (
              <span className="size-[18px] rounded-full border-2 border-[#d5d7da]" />
            )}
            <span className="text-[14px] leading-[20px] text-[#252b37]">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-[13px] leading-[18px] text-[#717680]">
        You stay looped in on every engagement — without becoming the bottleneck.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ForInvestorsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For investors"
        title="Give your portfolio companies an implementation bench"
        subtitle="Stand up a curated network of vetted software-implementation experts your founders can tap on day one — so Salesforce, NetSuite, and data rollouts ship in weeks, not quarters."
        primary={{ label: 'Talk to our team', href: '/contact' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/networks/meridian-ventures">
            <PortfolioGridMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee
        logos={['Meridian Ventures', 'Halcyon Capital', 'Foundry Labs', 'Northstar', 'Atlas Seed', 'Cedar Partners', 'Quotient']}
      />

      <ThreeUpCards
        eyebrow="Why a shared bench"
        heading="The implementation help every portfolio company needs — minus the search"
        body="Most early-stage teams burn a quarter finding the right Salesforce admin or ERP consultant. A shared Proploy network turns that into a warm intro."
        cards={[
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Pre-vetted, not pre-listed',
            body: 'Every expert is reference-checked and scored on real implementation outcomes — so a founder’s first intro is a credible one, not a cold marketplace search.',
          },
          {
            icon: <Network size={24} className="text-white" />,
            title: 'One bench, every company',
            body: 'Curate shortlists once and share them across the portfolio. The HubSpot specialist who delivered for one founder is a click away for the next.',
          },
          {
            icon: <TrendingUp size={24} className="text-white" />,
            title: 'Faster time-to-value',
            body: 'When systems go live sooner, founders hit revenue and reporting milestones sooner — and your next round has cleaner numbers behind it.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Curated shortlists"
        title="Build shortlists once, share them across the portfolio"
        body="Assemble a bench by capability — ERP, CRM, data migration, analytics, security tooling — and publish it to the founders who need it most."
        bullets={[
          'Filter experts by stack, vertical, and implementation track record',
          'Every profile carries references, rates, and outcome scores',
          'Share a shortlist with one company or your whole cohort',
        ]}
        link={{ label: 'Talk to our team', href: '/contact' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ExpertShortlistMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Warm intros, real outcomes"
        title="From founder request to signed SOW — with you in the loop"
        body="A founder asks for help, gets matched from your shared bench, and scopes the work on Proploy. You see momentum without managing the engagement."
        bullets={[
          'Founders request experts directly from your network',
          'Engagements run on scoped contracts and milestone payments',
          'Portfolio-level visibility into what’s shipping, and where it’s stuck',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <IntroFlowMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '5 days', label: 'Median time to first intro', sub: 'From founder request to a vetted expert on a call.' },
          { value: '60%', label: 'Faster system go-lives', sub: 'Versus founders sourcing implementation help on their own.' },
          { value: '0', label: 'Hours of partner sourcing', sub: 'The bench does the matching, so your team doesn’t.' },
        ]}
      />

      <TestimonialWall
        heading="Why funds run their bench on Proploy"
        testimonials={[
          {
            quote:
              'Every seed founder asks us “who do we use for Salesforce?” Now the answer is a shared shortlist instead of a forwarded email thread.',
            name: 'Dana Okafor',
            role: 'Partner, Meridian Ventures',
            color: '#155eef',
          },
          {
            quote:
              'Our cohort stood up NetSuite and clean financial reporting before demo day. That changed the quality of the raises that followed.',
            name: 'Sam Whitfield',
            role: 'Managing Director, Foundry Labs accelerator',
            color: '#079455',
          },
          {
            quote:
              'I get portfolio-level visibility into implementation work without sitting in the middle of every contract. That’s the part I never had before.',
            name: 'Lena Cho',
            role: 'Platform lead, Halcyon Capital',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        heading="Investor network FAQ"
        body="How a shared implementation bench works for your fund and your founders."
        faqs={[
          {
            q: 'How are experts on the network vetted?',
            a: 'Every expert is reference-checked and scored on real implementation outcomes — completed Salesforce, NetSuite, ERP, data-migration, and analytics projects — before they appear on a shortlist. You can also nominate firms you already trust.',
          },
          {
            q: 'Does this replace our platform team?',
            a: 'No — it scales it. Instead of personally sourcing a HubSpot or Snowflake consultant for each company, your team curates a bench once and founders self-serve warm intros from it.',
          },
          {
            q: 'What does it cost our portfolio companies?',
            a: 'Founders engage experts on standard Proploy terms — scoped statements of work and milestone payments. There are no per-intro fees for being part of your network.',
          },
          {
            q: 'How much visibility do we get into engagements?',
            a: 'You see portfolio-level status: which companies are sourcing, in progress, or live on a given system, without having to manage any individual contract.',
          },
          {
            q: 'Can we co-brand the network for our fund or accelerator?',
            a: 'Yes. Networks can carry your fund’s name and a curated bench, so founders experience it as your platform offering — backed by Proploy’s vetting and contracts.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Stand up an implementation bench for your portfolio"
        body="Give every founder a vetted network for their next software rollout — and watch systems ship faster across the fund."
        primary={{ label: 'Talk to our team', href: '/contact' }}
        secondary={{ label: 'Explore Proploy', href: '/for-businesses' }}
      />
    </>
  )
}
