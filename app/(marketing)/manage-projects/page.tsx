import type { Metadata } from 'next'
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Flag,
  KanbanSquare,
  Timer,
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
  title: 'Manage implementation projects · Proploy',
  description:
    'Run every software implementation from one workspace — kanban delivery, billable time tracking, and client-visible milestones in a single view.',
}

/* --------------------------------------------------------------- snippets */

function KanbanBoardMock() {
  const columns: { title: string; tone: string; cards: { label: string; tag?: string }[] }[] = [
    {
      title: 'To do',
      tone: '#717680',
      cards: [
        { label: 'Map legacy account fields', tag: 'Migration' },
        { label: 'Draft SSO config plan' },
      ],
    },
    {
      title: 'In progress',
      tone: '#155eef',
      cards: [
        { label: 'Build Salesforce flows', tag: 'Config' },
        { label: 'Sandbox data load' },
      ],
    },
    {
      title: 'Review',
      tone: '#f79009',
      cards: [{ label: 'UAT script for finance', tag: 'Client' }],
    },
    {
      title: 'Done',
      tone: '#17b26a',
      cards: [{ label: 'Kickoff & discovery' }],
    },
  ]

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <div className="min-w-0">
          <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27] tracking-[-0.2px] truncate">
            Northwind · Salesforce rollout
          </h3>
          <p className="text-[13px] leading-[18px] text-[#717680]">Phase 2 — Configuration & data migration</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <Timer size={13} /> 6.5h billable today
        </span>
      </div>

      <div className="px-[20px] pt-[16px]">
        <div className="flex items-center justify-between gap-[12px]">
          <span className="text-[13px] font-medium leading-[18px] text-[#252b37]">Phase progress</span>
          <span className="text-[13px] leading-[18px] text-[#717680]">62%</span>
        </div>
        <div className="mt-[8px] h-[8px] w-full overflow-hidden rounded-full bg-[#f2f4f7]">
          <div className="h-full rounded-full bg-[#155eef]" style={{ width: '62%' }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[12px] p-[20px] md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-[10px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-[7px] text-[13px] font-semibold leading-[18px] text-[#252b37]">
                <span className="size-[7px] rounded-full" style={{ backgroundColor: col.tone }} />
                {col.title}
              </span>
              <span className="text-[12px] leading-[18px] text-[#a4a7ae]">{col.cards.length}</span>
            </div>
            <div className="flex flex-col gap-[8px]">
              {col.cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[10px]"
                >
                  <p className="text-[13px] leading-[18px] text-[#252b37]">{card.label}</p>
                  {card.tag && (
                    <span className="mt-[8px] inline-flex rounded-full bg-[#eff4ff] px-[8px] py-[1px] text-[11px] font-medium leading-[18px] text-[#155eef]">
                      {card.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimeLogMock() {
  const entries = [
    ['Data mapping — accounts object', '2h 15m', true],
    ['Pair session w/ client admin', '1h 00m', true],
    ['Validation rules & flows', '3h 15m', true],
    ['Internal QA pass', '45m', false],
  ] as const

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Time · this week</p>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <CheckCircle2 size={13} /> 6.5h billable
        </span>
      </div>

      <div className="mt-[14px] flex flex-col gap-[8px]">
        {entries.map(([label, dur, billable]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[12px] py-[10px]"
          >
            <span className="flex min-w-0 items-center gap-[10px]">
              <Clock3 size={16} className={billable ? 'text-[#155eef]' : 'text-[#a4a7ae]'} />
              <span className="truncate text-[14px] leading-[20px] text-[#252b37]">{label}</span>
            </span>
            <span className="flex shrink-0 items-center gap-[10px]">
              <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">{dur}</span>
              <span
                className={`rounded-full px-[8px] py-[1px] text-[11px] font-medium leading-[18px] ${
                  billable ? 'bg-[#eff4ff] text-[#155eef]' : 'bg-[#f2f4f7] text-[#717680]'
                }`}
              >
                {billable ? 'Billable' : 'Internal'}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[14px] flex items-center justify-between rounded-[10px] bg-[#fafafa] px-[12px] py-[11px]">
        <span className="text-[13px] leading-[18px] text-[#535862]">Ready to invoice · Milestone 2</span>
        <span className="text-[15px] font-semibold leading-[22px] text-[#181d27]">$2,275</span>
      </div>
    </div>
  )
}

function MilestoneTimelineMock() {
  const milestones = [
    ['Discovery & migration plan', 'Approved', 'done'],
    ['Configuration & data load', 'In review', 'active'],
    ['UAT & training', 'Jul 22', 'todo'],
    ['Go-live & handoff', 'Aug 8', 'todo'],
  ] as const

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Milestones</p>
      <div className="mt-[14px] flex flex-col">
        {milestones.map(([label, status, state], i) => (
          <div key={label} className="flex gap-[12px]">
            <div className="flex flex-col items-center">
              {state === 'done' ? (
                <CheckCircle2 size={20} className="text-[#17b26a]" />
              ) : state === 'active' ? (
                <span className="flex size-[20px] items-center justify-center rounded-full border-2 border-[#155eef]">
                  <span className="size-[8px] rounded-full bg-[#155eef]" />
                </span>
              ) : (
                <Flag size={20} className="text-[#d5d7da]" />
              )}
              {i < milestones.length - 1 && <span className="w-[2px] flex-1 bg-[#e9eaeb]" />}
            </div>
            <div className={`min-w-0 ${i < milestones.length - 1 ? 'pb-[18px]' : ''}`}>
              <p className="text-[14px] font-medium leading-[20px] text-[#252b37]">{label}</p>
              <span
                className={`mt-[4px] inline-flex items-center gap-[6px] text-[13px] leading-[18px] ${
                  state === 'done'
                    ? 'text-[#067647]'
                    : state === 'active'
                      ? 'text-[#155eef]'
                      : 'text-[#717680]'
                }`}
              >
                {state === 'todo' && <CalendarCheck size={13} />}
                {status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ManageProjectsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Project workspace"
        title="Run every implementation from one workspace"
        subtitle="Track delivery on a kanban board, log billable time as you work, and keep clients aligned on milestones — without stitching together five tools per engagement."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[860px]">
          <UISnippetFrame title="proploy.com/experts/dashboard/projects">
            <KanbanBoardMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="One workspace"
        heading="Delivery, time, and milestones in a single view"
        body="Every Proploy engagement opens a workspace built for implementation work — so you spend your hours delivering, not reconciling spreadsheets."
        cards={[
          {
            icon: <KanbanSquare size={24} className="text-white" />,
            title: 'A board built for rollouts',
            body: 'Move work across To do, In progress, Review, and Done — with phase progress that mirrors how migrations and config actually ship.',
          },
          {
            icon: <Timer size={24} className="text-white" />,
            title: 'Billable time, captured in place',
            body: 'Log hours against tasks as you work and flag what is billable. Your weekly total rolls straight toward the next invoice.',
          },
          {
            icon: <Flag size={24} className="text-white" />,
            title: 'Milestones clients can see',
            body: 'Share a live milestone timeline so stakeholders always know what is approved, in review, and coming next.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Kanban delivery"
        title="A board that maps to how implementations ship"
        body="Break a Salesforce or NetSuite rollout into discovery, configuration, migration, and go-live — then watch phase progress update as cards move to Done."
        bullets={[
          'Columns tuned for implementation workflows, not generic to-dos',
          'Tag cards by workstream — migration, config, client, security',
          'Phase progress bar keeps scope and timeline honest',
        ]}
        link={{ label: 'Explore the workspace', href: '/become-expert' }}
        visual={
          <UISnippetFrame chrome={false}>
            <KanbanBoardMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Time tracking"
        title="Log billable hours where the work happens"
        body="Start a timer against the task in front of you, mark it billable or internal, and let the week’s total flow into milestone invoicing — no copy-paste at month end."
        bullets={[
          'Time logged against real tasks, not a blank sheet',
          'Billable vs. internal split so invoices stay defensible',
          'Weekly total maps straight to the next milestone payment',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <TimeLogMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Milestones"
        title="Keep every stakeholder on the same timeline"
        body="A shared milestone view shows what is approved, what is in review, and what is next — so your weekly status update is already written before the call."
        bullets={[
          'Live status from discovery through go-live and handoff',
          'Client-visible without exposing your internal board',
          'Approved milestones unlock invoicing automatically',
        ]}
        visual={
          <UISnippetFrame chrome={false}>
            <MilestoneTimelineMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '1 workspace',
            label: 'Per engagement',
            sub: 'Board, time, and milestones in one place — no tool sprawl.',
          },
          {
            value: '5 hrs',
            label: 'Saved per week',
            sub: 'Experts cut status reporting and time reconciliation.',
          },
          {
            value: '0',
            label: 'Spreadsheets to reconcile',
            sub: 'Billable time rolls straight into milestone invoices.',
          },
        ]}
      />

      <TestimonialWall
        heading="The workspace experts run their projects in"
        testimonials={[
          {
            quote:
              'My NetSuite rollouts used to live across Trello, a timesheet, and a deck. Now the board, my hours, and the client timeline are one screen.',
            name: 'Priya Raman',
            role: 'NetSuite implementation lead',
            color: '#155eef',
          },
          {
            quote:
              'Logging billable time against the actual task means my invoices are never a guess. The weekly total just becomes the milestone.',
            name: 'Marco Vidal',
            role: 'HubSpot & RevOps consultant',
            color: '#079455',
          },
          {
            quote:
              'Clients stopped asking “where are we?” The shared milestone view answers it before the standup even starts.',
            name: 'Jordan Avery',
            role: 'Salesforce solution architect',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'Does every project get its own workspace?',
            a: 'Yes. Each engagement you win on Proploy opens a dedicated workspace with its own kanban board, time log, and milestone timeline — already linked to the signed contract.',
          },
          {
            q: 'How does time tracking connect to getting paid?',
            a: 'You log hours against tasks and mark them billable or internal. Billable time rolls up by week and maps to the milestone it belongs to, so invoicing is one click from the same screen.',
          },
          {
            q: 'Can clients see my internal board?',
            a: 'No. Clients see the shared milestone timeline — approved, in review, and upcoming — while your kanban board and internal tasks stay private to your team.',
          },
          {
            q: 'Can I customize the board columns?',
            a: 'The board ships with To do, In progress, Review, and Done tuned for implementation work, and you can tag cards by workstream like migration, config, or security to fit your delivery process.',
          },
          {
            q: 'Does this replace my project management tool?',
            a: 'For Proploy engagements, it removes the need to stitch together a separate board, timesheet, and status deck. Everything for the project — delivery, time, and milestones — lives in one workspace.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Run your next implementation in one workspace"
        body="Join the Proploy expert network and manage delivery, time, and milestones without the tool sprawl."
        primary={{ label: 'Become an expert', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
