import type { Metadata } from 'next'
import {
  ArrowUpRight,
  BadgeCheck,
  Eye,
  Filter,
  MessageSquare,
  Search,
  Sparkles,
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
  title: 'Get discovered by buyers · Proploy',
  description:
    'Put your implementation expertise in front of businesses actively scoping software rollouts — and turn profile views into qualified inbound requests.',
}

/* --------------------------------------------------------------- snippets */

function ProfileVisibilityMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-start gap-[16px] border-b border-[#e9eaeb] px-[24px] py-[20px]">
        <span className="size-[56px] shrink-0 rounded-[12px] bg-[#155eef] text-white text-[20px] font-semibold flex items-center justify-center">
          MR
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[8px]">
            <h3 className="font-semibold text-[18px] leading-[28px] text-[#181d27] tracking-[-0.2px] truncate">
              Meridian Rollouts
            </h3>
            <BadgeCheck size={18} className="shrink-0 text-[#155eef]" />
          </div>
          <p className="mt-[1px] text-[14px] leading-[20px] text-[#535862]">
            NetSuite &amp; Salesforce implementation · 5-person firm
          </p>
          <div className="mt-[8px] flex items-center gap-[10px]">
            <span className="inline-flex items-center gap-[5px] text-[14px] leading-[20px] text-[#181d27]">
              <Star size={15} className="fill-[#f79009] text-[#f79009]" />
              <span className="font-semibold">4.9</span>
              <span className="text-[#717680]">(38 reviews)</span>
            </span>
            <span className="size-[3px] rounded-full bg-[#d5d7da]" />
            <span className="text-[14px] leading-[20px] text-[#717680]">37 rollouts delivered</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-[12px] bg-[#f5f8ff] px-[24px] py-[12px]">
        <span className="inline-flex items-center gap-[8px] text-[13px] leading-[18px] text-[#155eef]">
          <Eye size={16} />
          <span className="font-medium">Viewed by 14 buyers this week</span>
        </span>
        <span className="inline-flex items-center gap-[6px] text-[12px] leading-[18px] text-[#067647]">
          <span className="size-[6px] rounded-full bg-[#17b26a]" /> Open to new projects
        </span>
      </div>

      <div className="px-[24px] py-[18px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
          Specializes in
        </p>
        <div className="mt-[10px] flex flex-wrap gap-[8px]">
          {['NetSuite ERP', 'Data migration', 'Salesforce CPQ', 'Finance ops', 'Go-live support'].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[10px] py-[4px] text-[13px] leading-[18px] text-[#252b37]"
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-[#e9eaeb] px-[24px] py-[16px]">
        <div className="flex items-center justify-between gap-[12px]">
          <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[#717680]">
            Recent inbound
          </p>
          <span className="rounded-full bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#155eef]">
            3 new
          </span>
        </div>
        <div className="mt-[12px] flex flex-col gap-[10px]">
          {[
            ['Northwind Logistics', 'NetSuite migration · 80 seats', 'Salesforce → NetSuite, Q3'],
            ['Brightside Health', 'Finance module rollout', 'Budget set · ready to start'],
            ['Cedar & Co', 'Data cleanup before go-live', 'Scoping call requested'],
          ].map(([name, project, note], i) => (
            <div
              key={name}
              className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[11px]"
            >
              <span className="flex items-center gap-[10px] min-w-0">
                <span className="size-[28px] shrink-0 rounded-full bg-[#eff4ff] text-[#155eef] text-[12px] font-semibold flex items-center justify-center">
                  {name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium leading-[18px] text-[#181d27] truncate">
                    {name}
                  </span>
                  <span className="block text-[12px] leading-[16px] text-[#717680] truncate">
                    {project}
                  </span>
                </span>
              </span>
              <span
                className={`shrink-0 text-[12px] leading-[16px] text-right ${
                  i === 0 ? 'text-[#155eef] font-medium' : 'text-[#717680]'
                }`}
              >
                {note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchRankingMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center gap-[10px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[9px]">
        <Search size={16} className="text-[#717680]" />
        <span className="text-[14px] leading-[20px] text-[#252b37]">NetSuite migration · &lt; 12 weeks</span>
        <span className="ml-auto inline-flex items-center gap-[5px] rounded-[6px] border border-[#e9eaeb] bg-white px-[8px] py-[3px] text-[12px] font-medium leading-[16px] text-[#535862]">
          <Filter size={13} /> 4 filters
        </span>
      </div>
      <div className="mt-[14px] flex flex-col gap-[8px]">
        {[
          ['Meridian Rollouts', '4.9', 'Top match', true],
          ['Atlas Data Partners', '4.8', 'Strong match', false],
          ['Greenline Consulting', '4.7', 'Strong match', false],
        ].map(([name, rating, tag, top]) => (
          <div
            key={name as string}
            className={`flex items-center justify-between gap-[12px] rounded-[10px] border px-[14px] py-[12px] ${
              top ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb]'
            }`}
          >
            <span className="flex items-center gap-[10px] min-w-0">
              <span
                className={`size-[34px] shrink-0 rounded-[8px] text-[13px] font-semibold flex items-center justify-center ${
                  top ? 'bg-[#155eef] text-white' : 'bg-[#eff4ff] text-[#155eef]'
                }`}
              >
                {(name as string).slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-[18px] text-[#181d27] truncate">
                  {name}
                </span>
                <span className="flex items-center gap-[5px] text-[12px] leading-[16px] text-[#717680]">
                  <Star size={12} className="fill-[#f79009] text-[#f79009]" />
                  {rating} · NetSuite ERP
                </span>
              </span>
            </span>
            <span
              className={`shrink-0 rounded-full px-[9px] py-[3px] text-[12px] font-medium leading-[16px] ${
                top ? 'bg-[#155eef] text-white' : 'bg-[#fafafa] text-[#717680] border border-[#e9eaeb]'
              }`}
            >
              {tag}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-[12px] flex items-center gap-[6px] text-[12px] leading-[16px] text-[#717680]">
        <Sparkles size={13} className="text-[#155eef]" />
        Ranked on verified reviews, delivery history, and stack fit.
      </p>
    </div>
  )
}

function InboundInboxMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="size-[40px] rounded-full bg-[#eff4ff] text-[#155eef] flex items-center justify-center">
          <MessageSquare size={18} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Inbound request</p>
          <p className="text-[13px] leading-[18px] text-[#535862]">Brightside Health · posted 2h ago</p>
        </div>
        <span className="ml-auto rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          Verified buyer
        </span>
      </div>

      <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
        <p className="text-[14px] leading-[20px] text-[#252b37]">
          &ldquo;We&rsquo;re moving finance off spreadsheets onto NetSuite and need help with the data
          migration and go-live. Can you scope a 10-week engagement?&rdquo;
        </p>
        <div className="mt-[12px] grid grid-cols-2 gap-[10px]">
          {[
            ['Budget', '$45k–$60k'],
            ['Timeline', 'Start in 3 weeks'],
            ['Stack', 'NetSuite + Fivetran'],
            ['Decision', 'CFO + RevOps'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-[#e9eaeb] bg-white px-[12px] py-[8px]">
              <p className="text-[11px] uppercase tracking-[0.04em] text-[#717680]">{label}</p>
              <p className="mt-[1px] text-[13px] font-medium leading-[18px] text-[#181d27]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <span className="inline-flex items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[14px] py-[9px] text-[13px] font-semibold leading-[18px] text-white">
          <ArrowUpRight size={15} /> Send a proposal
        </span>
        <span className="inline-flex items-center rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[9px] text-[13px] font-semibold leading-[18px] text-[#414651]">
          Ask a question
        </span>
        <span className="ml-auto text-[12px] leading-[16px] text-[#717680]">Expires in 5 days</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function GetDiscoveredPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For experts"
        title="Get discovered by buyers who are ready to implement"
        subtitle="Your Proploy profile puts your delivery history in front of businesses actively scoping rollouts — so the qualified projects come to you, not the other way around."
        primary={{ label: 'Create your profile', href: '/become-expert' }}
        secondary={{ label: 'See how ranking works', href: '#ranking' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/profile">
            <ProfileVisibilityMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee
        logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']}
      />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="A profile that works while you deliver"
        body="Buyers come to Proploy with budget and a deadline already set. Your profile is how they shortlist — and how the right engagements reach your inbox."
        cards={[
          {
            icon: <Eye size={24} className="text-white" />,
            title: 'Show up in real searches',
            body: 'When a business filters for a NetSuite migration or a Salesforce CPQ build, a complete, well-reviewed profile is what surfaces first.',
          },
          {
            icon: <BadgeCheck size={24} className="text-white" />,
            title: 'Lead with proof, not pitch',
            body: 'Verified reviews, delivered rollouts, and the exact stacks you work in do the convincing before a buyer ever messages you.',
          },
          {
            icon: <MessageSquare size={24} className="text-white" />,
            title: 'Inbound, not cold outreach',
            body: 'Buyers send scoped requests with budget and timeline attached, so you spend time on proposals instead of chasing leads.',
          },
        ]}
      />

      <div id="ranking" />
      <StackedFeatureBlock
        eyebrow="Search visibility"
        title="Rank for the rollouts you actually want to win"
        body="Proploy matches experts to projects on verified delivery history and stack fit — not who paid for placement. Strong, specific profiles rise to the top of buyer search."
        bullets={[
          'Tag the platforms and modules you implement — NetSuite, Salesforce, HubSpot, ERP',
          'Verified reviews and completed engagements weight your ranking',
          'Set your status to “open to new projects” to surface in active searches',
        ]}
        link={{ label: 'Build a ranking profile', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <SearchRankingMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Qualified inbound"
        title="Requests arrive scoped, not vague"
        body="Every inbound request carries budget, timeline, stack, and decision-makers up front. Reply with a proposal, or ask one clarifying question — from the same inbox."
        bullets={[
          'Verified-buyer badges so you know the budget is real',
          'Budget, stack, and start date attached to every request',
          'Send a proposal in a click — no discovery-call ping-pong to qualify',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <InboundInboxMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '14',
            label: 'Buyer views a week',
            sub: 'Average profile reach for experts marked open to new projects.',
          },
          {
            value: '3.2x',
            label: 'More inbound',
            sub: 'Complete profiles with verified reviews versus bare listings.',
          },
          {
            value: '< 48h',
            label: 'To first request',
            sub: 'Median time from a published profile to a scoped inbound request.',
          },
        ]}
      />

      <TestimonialWall
        heading="Experts who stopped chasing leads"
        testimonials={[
          {
            quote:
              'I filled out my NetSuite delivery history and within a week three migrations landed in my inbox — all with budgets already set.',
            name: 'Dana Okafor',
            role: 'NetSuite implementation lead',
            color: '#155eef',
          },
          {
            quote:
              'The “viewed by 14 buyers this week” signal told me my profile was working. Two of those views became proposals I closed.',
            name: 'Priya Raman',
            role: 'ERP & data migration consultant',
            color: '#079455',
          },
          {
            quote:
              'No more cold outreach. Buyers come to me with the stack and timeline spelled out, so every conversation starts on real terms.',
            name: 'Marco Vidal',
            role: 'Salesforce CPQ specialist',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How does Proploy decide which experts rank first?',
            a: 'Ranking is driven by verified reviews, completed engagements, and how closely your tagged stack matches the buyer’s request — not paid placement. Specific, well-documented profiles consistently surface higher.',
          },
          {
            q: 'What does “viewed by 14 buyers this week” actually measure?',
            a: 'It counts unique businesses that opened your profile from search or a shortlist in the last seven days. It is a signal of reach, so you can see when your profile is landing in front of active buyers.',
          },
          {
            q: 'Do I have to pitch for every project?',
            a: 'No. Buyers send scoped inbound requests with budget, timeline, and stack attached. You respond with a proposal only when the engagement is a fit, so your time goes to qualified work.',
          },
          {
            q: 'How do I get more visibility?',
            a: 'Complete your delivery history, tag the exact platforms and modules you implement, gather verified reviews, and set your status to open to new projects. Those are the inputs ranking rewards.',
          },
          {
            q: 'Are the buyers vetted?',
            a: 'Yes. Businesses are verified before they can post requests, and verified-buyer badges appear on inbound so you know the budget and intent are real.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Let the right rollouts find you"
        body="Publish your Proploy profile and start showing up in buyer searches this week."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
