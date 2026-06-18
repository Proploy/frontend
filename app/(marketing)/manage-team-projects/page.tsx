import type { Metadata } from 'next'
import {
  AlertTriangle,
  CalendarClock,
  Filter,
  FolderKanban,
  LayoutGrid,
  ShieldCheck,
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
  title: 'Manage team projects · Proploy',
  description:
    'See every software rollout your team has in flight — owners, status, and progress for every Salesforce, NetSuite, and analytics engagement in one portfolio view.',
}

/* --------------------------------------------------------------- snippets */

type Status = 'On track' | 'At risk' | 'Blocked' | 'Launched'

const STATUS_STYLES: Record<Status, { dot: string; text: string; bg: string }> = {
  'On track': { dot: '#17b26a', text: '#067647', bg: '#f6fef9' },
  'At risk': { dot: '#f79009', text: '#b54708', bg: '#fffaeb' },
  Blocked: { dot: '#f04438', text: '#b42318', bg: '#fef3f2' },
  Launched: { dot: '#155eef', text: '#155eef', bg: '#eff4ff' },
}

function StatusPill({ status }: { status: Status }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="size-[6px] rounded-full" style={{ background: s.dot }} /> {status}
    </span>
  )
}

function Owner({ initials, color, name }: { initials: string; color: string; name: string }) {
  return (
    <span className="flex items-center gap-[8px] min-w-0">
      <span
        className="size-[28px] shrink-0 rounded-full text-white text-[11px] font-semibold flex items-center justify-center"
        style={{ background: color }}
        aria-hidden
      >
        {initials}
      </span>
      <span className="text-[13px] leading-[18px] text-[#535862] truncate hidden sm:block">{name}</span>
    </span>
  )
}

function ProgressBar({ pct, status }: { pct: number; status: Status }) {
  const fill = status === 'Blocked' ? '#f04438' : status === 'At risk' ? '#f79009' : '#155eef'
  return (
    <span className="flex items-center gap-[10px]">
      <span className="relative h-[6px] w-[72px] overflow-hidden rounded-full bg-[#e9eaeb]">
        <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: fill }} />
      </span>
      <span className="w-[34px] text-right text-[13px] font-medium leading-[18px] text-[#181d27]">{pct}%</span>
    </span>
  )
}

function PortfolioTable() {
  const rows: {
    project: string
    sub: string
    owner: { initials: string; color: string; name: string }
    status: Status
    pct: number
  }[] = [
    {
      project: 'Salesforce CRM migration',
      sub: 'Sales Ops · Northwind',
      owner: { initials: 'DA', color: '#155eef', name: 'Dana Acosta' },
      status: 'On track',
      pct: 72,
    },
    {
      project: 'NetSuite ERP rollout',
      sub: 'Finance · Phase 2',
      owner: { initials: 'PR', color: '#dd2590', name: 'Priya Raman' },
      status: 'At risk',
      pct: 48,
    },
    {
      project: 'HubSpot → Marketo migration',
      sub: 'Marketing Ops',
      owner: { initials: 'MV', color: '#079455', name: 'Marco Vidal' },
      status: 'Blocked',
      pct: 31,
    },
    {
      project: 'Snowflake analytics warehouse',
      sub: 'Data Platform',
      owner: { initials: 'JL', color: '#7a5af8', name: 'Jordan Lee' },
      status: 'On track',
      pct: 64,
    },
    {
      project: 'Okta SSO + provisioning',
      sub: 'Security · IT',
      owner: { initials: 'SK', color: '#ee46bc', name: 'Sana Khan' },
      status: 'Launched',
      pct: 100,
    },
  ]

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[16px]">
        <div className="flex items-center gap-[10px] min-w-0">
          <FolderKanban size={18} className="text-[#155eef] shrink-0" />
          <span className="font-semibold text-[15px] leading-[22px] text-[#181d27] truncate">Active rollouts</span>
          <span className="rounded-full bg-[#f5f5f5] px-[8px] py-[1px] text-[12px] font-medium leading-[18px] text-[#717680]">
            5
          </span>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#e9eaeb] px-[10px] py-[5px] text-[12px] font-medium leading-[18px] text-[#535862]">
          <Filter size={14} /> All teams
        </span>
      </div>

      <div className="hidden sm:grid grid-cols-[1.6fr_0.9fr_0.9fr_1fr] gap-[12px] border-b border-[#e9eaeb] bg-[#fafafa] px-[20px] py-[10px]">
        {['Project', 'Owner', 'Status', 'Progress'].map((h) => (
          <span key={h} className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
            {h}
          </span>
        ))}
      </div>

      <div>
        {rows.map((r, i) => (
          <div
            key={r.project}
            className={`grid grid-cols-[1.4fr_1fr] sm:grid-cols-[1.6fr_0.9fr_0.9fr_1fr] items-center gap-[12px] px-[20px] py-[14px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span className="flex flex-col min-w-0">
              <span className="text-[14px] font-medium leading-[20px] text-[#181d27] truncate">{r.project}</span>
              <span className="text-[12px] leading-[18px] text-[#717680] truncate">{r.sub}</span>
            </span>
            <Owner {...r.owner} />
            <span className="hidden sm:flex">
              <StatusPill status={r.status} />
            </span>
            <span className="flex justify-end sm:justify-start">
              <ProgressBar pct={r.pct} status={r.status} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamLoadMock() {
  const people = [
    { initials: 'DA', color: '#155eef', name: 'Dana Acosta', role: 'Sales Ops lead', active: 3, cap: 'Balanced' },
    { initials: 'PR', color: '#dd2590', name: 'Priya Raman', role: 'Finance systems', active: 4, cap: 'At capacity' },
    { initials: 'JL', color: '#7a5af8', name: 'Jordan Lee', role: 'Data platform', active: 2, cap: 'Has room' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Workload by owner</p>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {people.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
          >
            <span
              className="size-[36px] shrink-0 rounded-full text-white text-[12px] font-semibold flex items-center justify-center"
              style={{ background: p.color }}
              aria-hidden
            >
              {p.initials}
            </span>
            <span className="flex flex-col min-w-0 flex-1">
              <span className="text-[14px] font-medium leading-[20px] text-[#181d27] truncate">{p.name}</span>
              <span className="text-[12px] leading-[18px] text-[#717680] truncate">{p.role}</span>
            </span>
            <span className="flex items-center gap-[10px] shrink-0">
              <span className="text-[13px] leading-[18px] text-[#535862]">{p.active} active</span>
              <span
                className={`rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
                  p.cap === 'At capacity'
                    ? 'bg-[#fffaeb] text-[#b54708]'
                    : p.cap === 'Has room'
                      ? 'bg-[#f6fef9] text-[#067647]'
                      : 'bg-[#eff4ff] text-[#155eef]'
                }`}
              >
                {p.cap}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AttentionMock() {
  const items = [
    {
      icon: <AlertTriangle size={16} className="text-[#b42318]" />,
      ring: '#fee4e2',
      title: 'HubSpot → Marketo migration is blocked',
      detail: 'Waiting on API credentials from IT · 6 days',
      tone: '#b42318',
    },
    {
      icon: <CalendarClock size={16} className="text-[#b54708]" />,
      ring: '#fef0c7',
      title: 'NetSuite go-live milestone slipping',
      detail: 'UAT sign-off due Jun 20 · 4 tasks open',
      tone: '#b54708',
    },
    {
      icon: <Users size={16} className="text-[#155eef]" />,
      ring: '#d1e0ff',
      title: 'Priya Raman is at capacity',
      detail: '4 concurrent rollouts · reassign discovery work',
      tone: '#155eef',
    },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center justify-between gap-[12px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Needs attention</p>
        <span className="rounded-full bg-[#fef3f2] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#b42318]">
          3 flagged
        </span>
      </div>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex items-start gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-[14px] py-[12px]"
          >
            <span
              className="mt-[1px] size-[28px] shrink-0 rounded-full flex items-center justify-center"
              style={{ background: it.ring }}
            >
              {it.icon}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-[14px] font-medium leading-[20px] text-[#181d27]">{it.title}</span>
              <span className="text-[13px] leading-[18px] text-[#535862]">{it.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ManageTeamProjectsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Portfolio view"
        title="See every rollout your team has in flight"
        subtitle="Track every Salesforce, NetSuite, and analytics engagement your team is running with outside experts — owners, status, and progress in one portfolio view, not twelve status threads."
        primary={{ label: 'Get started', href: '/for-businesses' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[860px]">
          <UISnippetFrame title="proploy.com/dashboard/projects">
            <PortfolioTable />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why it matters"
        heading="One source of truth for every engagement"
        body="When implementation work is spread across vendors, teams, and tools, status lives in too many places. Proploy pulls it into a single portfolio you can scan in seconds."
        cards={[
          {
            icon: <LayoutGrid size={24} className="text-white" />,
            title: 'Every project, one screen',
            body: 'See active, at-risk, and launched rollouts side by side — across Salesforce, ERP, data migration, and security tooling — without opening a single status doc.',
          },
          {
            icon: <Users size={24} className="text-white" />,
            title: 'Owners and load, at a glance',
            body: 'Know who owns each engagement and how much they are carrying, so you can rebalance before a key person becomes the bottleneck.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Risks surface early',
            body: 'Blocked tasks, slipping milestones, and stalled vendors get flagged automatically — so the first time you hear about a delay isn’t at go-live.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Workload"
        title="Balance who owns what before it becomes a fire drill"
        body="Each engagement has a named owner on your side. Proploy rolls up how many active rollouts each person is carrying, so capacity is a decision you make — not one you discover."
        bullets={[
          'Active project count per owner, updated in real time',
          'Capacity signals when someone is stretched thin',
          'Reassign discovery or UAT work in a click',
        ]}
        link={{ label: 'Explore for businesses', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <TeamLoadMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Risk"
        title="Catch the rollout that’s about to slip"
        body="Blocked tasks, missed UAT sign-offs, and overloaded owners are pulled into one “needs attention” feed — so a stalled HubSpot migration or a slipping NetSuite go-live never hides in someone’s inbox."
        bullets={[
          'Blockers and slipping milestones flagged automatically',
          'See the reason and how long it has been stuck',
          'Jump straight into the engagement to unblock it',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <AttentionMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '1 view',
            label: 'For your whole portfolio',
            sub: 'Every active rollout across teams and vendors, in one place.',
          },
          {
            value: '4 days',
            label: 'Earlier risk visibility',
            sub: 'Teams catch slipping milestones before they hit go-live.',
          },
          {
            value: '40%',
            label: 'Fewer status meetings',
            sub: 'Leads check the portfolio instead of chasing updates.',
          },
        ]}
      />

      <TestimonialWall
        heading="Visibility leaders actually use"
        testimonials={[
          {
            quote:
              'I have six implementations running with three different firms. Before Proploy, “where are we?” took a day to answer. Now it’s one screen before my exec sync.',
            name: 'Elena Brooks',
            role: 'VP Business Systems',
            color: '#155eef',
          },
          {
            quote:
              'The needs-attention feed flagged a blocked data migration before the vendor even raised it. We re-sequenced and still hit our quarter-end go-live.',
            name: 'Tom Castellano',
            role: 'Director of IT, mid-market SaaS',
            color: '#dd2590',
          },
          {
            quote:
              'Seeing workload per owner stopped us from quietly burning out our best systems analyst. We rebalanced two rollouts the same afternoon.',
            name: 'Aisha Rahman',
            role: 'Head of Revenue Operations',
            color: '#079455',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'What counts as a project in the portfolio view?',
            a: 'Any engagement you run on Proploy — a Salesforce rollout, a NetSuite migration, an analytics build, a security tooling deployment — appears as a row with its owner, status, and percent complete.',
          },
          {
            q: 'Where does status and progress come from?',
            a: 'Status and progress roll up from each engagement’s milestones and tasks. As experts mark work complete and milestones move, the portfolio updates without anyone filing a separate report.',
          },
          {
            q: 'Can I see projects across multiple vendors and internal teams?',
            a: 'Yes. The portfolio spans every engagement regardless of which expert or firm is delivering it, and you can filter by team, owner, or status.',
          },
          {
            q: 'Who on my side can see the portfolio?',
            a: 'You control access by role. Program leads and executives can see the full portfolio, while individual owners can be scoped to the engagements they run.',
          },
          {
            q: 'How does it flag a project as at risk?',
            a: 'Proploy flags engagements with blocked tasks, milestones past their target date, or owners over capacity, and surfaces them in a single needs-attention feed so issues are visible early.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Put every rollout on one screen"
        body="Bring your software implementations into a single portfolio your whole leadership team can trust."
        primary={{ label: 'Get started', href: '/for-businesses' }}
        secondary={{ label: 'Explore the platform', href: '/for-businesses' }}
      />
    </>
  )
}
