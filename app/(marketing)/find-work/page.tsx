import type { Metadata } from 'next'
import {
  ArrowUpRight,
  Briefcase,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  MessageSquare,
  Sparkles,
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
  title: 'Find implementation work · Proploy',
  description:
    'Get matched to scoped software-implementation projects that fit your stack — with budget and timeline up front, and a one-click application.',
}

/* --------------------------------------------------------------- snippets */

function JobBoardMock() {
  const jobs = [
    {
      company: 'Northwind Logistics',
      role: 'Salesforce CRM migration',
      stack: ['Salesforce', 'Data migration'],
      budget: '$36k–$48k',
      timeline: '6 weeks',
      match: 96,
      featured: true,
    },
    {
      company: 'Brightside Health',
      role: 'NetSuite ERP rollout',
      stack: ['NetSuite', 'Finance ops'],
      budget: '$60k–$80k',
      timeline: '10 weeks',
      match: 91,
      featured: false,
    },
    {
      company: 'Cedar & Co',
      role: 'HubSpot → Marketo handoff',
      stack: ['Marketo', 'Lifecycle'],
      budget: '$18k–$24k',
      timeline: '4 weeks',
      match: 88,
      featured: false,
    },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <span className="inline-flex items-center gap-[8px] text-[14px] font-semibold leading-[20px] text-[#181d27]">
          <Briefcase size={16} className="text-[#155eef]" /> Matched projects
        </span>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] px-[10px] py-[5px] text-[12px] font-medium leading-[18px] text-[#535862]">
          <Filter size={13} /> Salesforce · Remote
        </span>
      </div>
      <div className="flex flex-col">
        {jobs.map((job, i) => (
          <div
            key={job.company}
            className={`flex flex-col gap-[14px] px-[20px] py-[18px] ${i > 0 ? 'border-t border-[#e9eaeb]' : ''} ${
              job.featured ? 'bg-[#f5f8ff]' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-[12px]">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-[22px] text-[#181d27] truncate">{job.role}</p>
                <p className="mt-[1px] text-[13px] leading-[18px] text-[#717680]">{job.company}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                <span className="size-[6px] rounded-full bg-[#17b26a]" /> {job.match}% match
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-[6px]">
              {job.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[6px] border border-[#e9eaeb] bg-white px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#535862]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-[12px]">
              <span className="flex items-center gap-[16px] text-[13px] leading-[18px] text-[#535862]">
                <span className="font-semibold text-[#181d27]">{job.budget}</span>
                <span className="inline-flex items-center gap-[5px] text-[#717680]">
                  <Clock3 size={14} /> {job.timeline}
                </span>
              </span>
              <span
                className={`inline-flex items-center gap-[6px] rounded-[8px] px-[14px] py-[7px] text-[13px] font-semibold leading-[18px] ${
                  job.featured
                    ? 'bg-[#155eef] text-white'
                    : 'border border-[#d5d7da] bg-white text-[#414651]'
                }`}
              >
                Apply
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectBriefMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <span className="inline-flex items-center gap-[8px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] text-[#067647]">
          <span className="size-[6px] rounded-full bg-[#17b26a]" /> 96% match to your profile
        </span>
        <span className="text-[13px] leading-[18px] text-[#717680]">Posted 2 days ago</span>
      </div>
      <div className="px-[24px] py-[20px]">
        <h3 className="font-semibold text-[20px] leading-[30px] text-[#181d27] tracking-[-0.2px]">
          Salesforce CRM migration
        </h3>
        <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">
          Northwind Logistics · 220 seats · remote
        </p>

        <div className="mt-[20px] grid grid-cols-2 gap-[12px]">
          <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
            <p className="text-[12px] font-medium leading-[18px] text-[#717680]">Budget range</p>
            <p className="mt-[2px] text-[18px] font-semibold leading-[26px] text-[#181d27]">$36k–$48k</p>
          </div>
          <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
            <p className="text-[12px] font-medium leading-[18px] text-[#717680]">Timeline</p>
            <p className="mt-[2px] text-[18px] font-semibold leading-[26px] text-[#181d27]">6 weeks</p>
          </div>
        </div>

        <p className="mt-[20px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
          Scope of work
        </p>
        <ul className="mt-[10px] flex flex-col gap-[10px]">
          {[
            'Migrate accounts, contacts, and 18 months of activity from legacy CRM',
            'Rebuild lead-routing and approval flows for the ops team',
            'Train 12 admins and document the new configuration',
          ].map((item) => (
            <li key={item} className="flex items-start gap-[10px]">
              <span className="mt-[2px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff]">
                <Check size={11} className="text-[#155eef]" />
              </span>
              <span className="text-[14px] leading-[20px] text-[#252b37]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ApplicationTrackerMock() {
  const apps = [
    {
      company: 'Northwind Logistics',
      role: 'Salesforce CRM migration',
      status: 'Shortlisted',
      tone: 'green' as const,
      note: 'Intro call requested',
    },
    {
      company: 'Brightside Health',
      role: 'NetSuite ERP rollout',
      status: 'Under review',
      tone: 'amber' as const,
      note: 'Proposal viewed',
    },
    {
      company: 'Cedar & Co',
      role: 'Marketo handoff',
      status: 'Submitted',
      tone: 'gray' as const,
      note: 'Sent 1 hour ago',
    },
  ]
  const toneMap = {
    green: { dot: 'bg-[#17b26a]', text: 'text-[#067647]', bg: 'bg-[#ecfdf3]' },
    amber: { dot: 'bg-[#f79009]', text: 'text-[#b54708]', bg: 'bg-[#fffaeb]' },
    gray: { dot: 'bg-[#717680]', text: 'text-[#414651]', bg: 'bg-[#f5f5f5]' },
  }
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-center justify-between gap-[12px]">
        <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">Your applications</p>
        <span className="text-[13px] leading-[18px] text-[#717680]">3 active</span>
      </div>
      <div className="mt-[14px] flex flex-col gap-[10px]">
        {apps.map((app) => {
          const tone = toneMap[app.tone]
          return (
            <div
              key={app.company}
              className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
            >
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-[20px] text-[#181d27] truncate">{app.role}</p>
                <p className="mt-[1px] flex items-center gap-[6px] text-[12px] leading-[18px] text-[#717680]">
                  <Eye size={13} /> {app.note}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${tone.bg} ${tone.text}`}
              >
                <span className={`size-[6px] rounded-full ${tone.dot}`} /> {app.status}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-[14px] flex items-center gap-[10px] rounded-[10px] bg-[#f5f8ff] px-[14px] py-[12px]">
        <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#155eef]">
          <MessageSquare size={15} className="text-white" />
        </span>
        <p className="text-[13px] leading-[18px] text-[#252b37]">
          <span className="font-semibold text-[#181d27]">Northwind</span> replied — pick a time for a 30-min intro.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function FindWorkPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For experts"
        title="Find implementation work that fits your expertise."
        subtitle="Proploy matches you to scoped software projects in your stack — with budget and timeline up front, so you spend time delivering, not chasing leads."
        primary={{ label: 'Join as an expert', href: '/become-expert' }}
        secondary={{ label: 'See how matching works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/experts/find-work">
            <JobBoardMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee
        label="Experts on Proploy implement tools teams rely on"
        logos={['Salesforce', 'NetSuite', 'Workday', 'HubSpot', 'Snowflake', 'ServiceNow', 'Marketo']}
      />

      <ThreeUpCards
        eyebrow="Why experts apply on Proploy"
        heading="Work that fits — without the proposal grind"
        body="No cold outreach, no vague RFPs. Every project that reaches you is scoped, funded, and matched to what you actually do."
        cards={[
          {
            icon: <Sparkles size={24} className="text-white" />,
            title: 'Matched to your skills',
            body: 'Tell us your platforms, industries, and engagement size. We surface projects where you are a strong fit — and rank them by match.',
          },
          {
            icon: <Briefcase size={24} className="text-white" />,
            title: 'Clear scope and budget up front',
            body: 'Every brief shows the work, the budget range, and the timeline before you apply. No discovery calls just to learn the project is out of range.',
          },
          {
            icon: <CheckCircle2 size={24} className="text-white" />,
            title: 'Apply in one click',
            body: 'Your verified profile is your application. Send it with a short note and track exactly where every submission stands.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Scoped briefs"
        title="Read the whole project before you spend a minute on it"
        body="Each matched brief lays out the scope of work, budget range, and timeline — so you know whether it is worth your time before you apply."
        bullets={[
          'Budget range and timeline stated on every project',
          'Scope of work and acceptance criteria written by the client',
          'Match score shows how well the project fits your profile',
        ]}
        link={{ label: 'Browse open projects', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ProjectBriefMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Application tracking"
        title="Know where every application stands"
        body="Submit with one click, then follow each project from submitted to shortlisted to intro call — without refreshing your inbox or guessing."
        bullets={[
          'Live status on every application you send',
          'See when a client has viewed your proposal',
          'Message and schedule intro calls in the same place',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <ApplicationTrackerMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '48h',
            label: 'Median time to first match',
            sub: 'A complete profile starts surfacing fitting projects within two days.',
          },
          {
            value: '3×',
            label: 'Higher reply rate',
            sub: 'Pre-scoped, matched applications get answered far more often than cold bids.',
          },
          {
            value: '$0',
            label: 'To apply or get matched',
            sub: 'No subscriptions or per-bid fees — you keep what you earn on delivered work.',
          },
        ]}
      />

      <TestimonialWall
        heading="Experts who found their next project here"
        testimonials={[
          {
            quote:
              'I stopped writing speculative proposals. Projects show up already scoped, in my stack, with a budget I can say yes to.',
            name: 'Jordan Avery',
            role: 'Salesforce implementation lead',
            color: '#155eef',
          },
          {
            quote:
              'The match score is accurate. The ERP rollouts that reach me are the ones I would have hand-picked anyway.',
            name: 'Priya Raman',
            role: 'NetSuite & ERP consultant',
            color: '#079455',
          },
          {
            quote:
              'Seeing when a client opens my proposal changed how I follow up. I won two projects in my first month.',
            name: 'Marco Vidal',
            role: 'Marketing-ops specialist',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How does Proploy match me to projects?',
            a: 'You tell us your platforms, industries, and the engagement sizes you take on. Each new project is scored against your profile, and the highest-fit briefs are surfaced first — so you see relevant work rather than a generic feed.',
          },
          {
            q: 'Do I see the budget before I apply?',
            a: 'Yes. Every brief states a budget range, timeline, and scope of work before you apply. You decide whether a project is worth your time without a discovery call.',
          },
          {
            q: 'What does it cost to apply?',
            a: 'Nothing. Matching and applications are free — there are no subscriptions and no per-bid fees. Proploy only earns when you are engaged and delivering work.',
          },
          {
            q: 'How do I stand out when I apply?',
            a: 'Your verified Proploy profile is your application. A complete profile with past implementations, certifications, and reviews lets you apply in one click and still make a strong case.',
          },
          {
            q: 'Can I see whether a client has read my application?',
            a: 'Yes. The application tracker shows each submission moving from submitted to under review to shortlisted, and tells you when a client has viewed your proposal so you know when to follow up.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Get matched to your next implementation project"
        body="Join the Proploy expert network and start seeing scoped, funded work in your stack this week."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
