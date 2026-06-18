import type { Metadata } from 'next'
import {
  FileText,
  MessageSquare,
  Star,
  ThumbsUp,
  Users,
  ListChecks,
  CheckCircle2,
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
  title: 'A shared hiring workspace · Proploy',
  description:
    'Run software-implementation hiring as a team. Write the brief once, build a shortlist of vetted experts, and let stakeholders comment and react in one shared workspace — from brief to kickoff.',
}

/* --------------------------------------------------------------- snippets */

function WorkspaceBoard() {
  const shortlist = [
    {
      initials: 'PR',
      name: 'Priya Raman',
      role: 'NetSuite ERP lead · 6 implementations',
      tint: '#155eef',
      rating: '4.9',
      tag: 'Top match',
      tagged: true,
      note: { who: 'Dana, Finance', body: 'Migrated a books-close just like ours. My pick.' },
      reactions: '4',
    },
    {
      initials: 'MV',
      name: 'Marco Vidal & Co',
      role: 'NetSuite + data migration firm',
      tint: '#079455',
      rating: '4.8',
      tag: 'Shortlisted',
      tagged: false,
      note: { who: 'Sam, IT', body: 'Strong on the data-cleanup phase. Wants a discovery call.' },
      reactions: '2',
    },
    {
      initials: 'JA',
      name: 'Jordan Avery',
      role: 'ERP analyst · subledger specialist',
      tint: '#dd2590',
      rating: '4.7',
      tag: 'Reviewing',
      tagged: false,
      note: null,
      reactions: '1',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      {/* Brief panel */}
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
        <div className="flex items-center gap-[8px] border-b border-[#e9eaeb] px-[16px] py-[12px]">
          <FileText size={16} className="text-[#155eef]" />
          <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">Project brief</span>
        </div>
        <div className="flex flex-col gap-[14px] px-[16px] py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#717680]">Goal</p>
            <p className="mt-[3px] text-[14px] leading-[20px] text-[#252b37]">
              Migrate from QuickBooks to NetSuite before FY close.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            <div className="rounded-[8px] bg-[#fafafa] px-[10px] py-[8px]">
              <p className="text-[11px] leading-[16px] text-[#717680]">Budget</p>
              <p className="text-[13px] font-semibold leading-[18px] text-[#181d27]">$60–90k</p>
            </div>
            <div className="rounded-[8px] bg-[#fafafa] px-[10px] py-[8px]">
              <p className="text-[11px] leading-[16px] text-[#717680]">Go-live</p>
              <p className="text-[13px] font-semibold leading-[18px] text-[#181d27]">Sep 30</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#717680]">Must-haves</p>
            <div className="mt-[6px] flex flex-wrap gap-[6px]">
              {['NetSuite', 'Data migration', 'Multi-entity', 'Avalara tax'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#e9eaeb] bg-white px-[8px] py-[2px] text-[12px] leading-[18px] text-[#535862]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-[6px] border-t border-[#e9eaeb] pt-[12px]">
            <span className="flex -space-x-[6px]">
              {['#155eef', '#079455', '#dd2590'].map((c) => (
                <span
                  key={c}
                  className="size-[22px] rounded-full border-2 border-white"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
            <span className="text-[12px] leading-[18px] text-[#717680]">3 teammates on this hire</span>
          </div>
        </div>
      </div>

      {/* Shortlist with comments */}
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
        <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[16px] py-[12px]">
          <span className="flex items-center gap-[8px]">
            <Users size={16} className="text-[#155eef]" />
            <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">Shortlist · 3 experts</span>
          </span>
          <span className="rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
            Brief → Kickoff
          </span>
        </div>

        <div className="flex flex-col">
          {shortlist.map((x, i) => (
            <div
              key={x.name}
              className={`flex flex-col gap-[12px] px-[16px] py-[16px] ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              }`}
            >
              <div className="flex items-start gap-[12px]">
                <span
                  className="flex size-[36px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                  style={{ backgroundColor: x.tint }}
                >
                  {x.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-[8px]">
                    <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{x.name}</p>
                    <span className="inline-flex items-center gap-[3px] text-[12px] leading-[18px] text-[#717680]">
                      <Star size={12} className="fill-[#f79009] text-[#f79009]" />
                      {x.rating}
                    </span>
                  </div>
                  <p className="truncate text-[13px] leading-[18px] text-[#535862]">{x.role}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px] ${
                    x.tagged ? 'bg-[#155eef] text-white' : 'border border-[#e9eaeb] bg-white text-[#535862]'
                  }`}
                >
                  {x.tag}
                </span>
              </div>

              {x.note && (
                <div className="ml-[48px] rounded-[10px] bg-[#fafafa] px-[12px] py-[10px]">
                  <div className="flex items-center justify-between gap-[8px]">
                    <span className="flex items-center gap-[6px] text-[12px] font-medium leading-[18px] text-[#252b37]">
                      <MessageSquare size={13} className="text-[#717680]" />
                      {x.note.who}
                    </span>
                    <span className="inline-flex items-center gap-[4px] rounded-full border border-[#e9eaeb] bg-white px-[8px] py-[1px] text-[12px] leading-[18px] text-[#535862]">
                      <ThumbsUp size={12} className="text-[#155eef]" />
                      {x.reactions}
                    </span>
                  </div>
                  <p className="mt-[4px] text-[13px] leading-[19px] text-[#535862]">{x.note.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommentThreadMock() {
  const comments = [
    {
      initials: 'DA',
      who: 'Dana · Finance',
      tint: '#155eef',
      when: '2h ago',
      body: 'Priya’s multi-entity experience is exactly our gap. Can we get her on a scoping call this week?',
      reacts: ['3', '1'],
    },
    {
      initials: 'SK',
      who: 'Sam · IT',
      tint: '#079455',
      when: '1h ago',
      body: 'Agreed. Ask how she handles the Avalara tax cutover — that burned us last time.',
      reacts: ['2'],
    },
    {
      initials: 'YOU',
      who: 'You · Hiring owner',
      tint: '#181d27',
      when: 'just now',
      body: 'Added to the scoping agenda. Sending the brief and shortlist to both for visibility.',
      reacts: [],
    },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center gap-[8px] border-b border-[#e9eaeb] px-[16px] py-[12px]">
        <MessageSquare size={16} className="text-[#155eef]" />
        <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">
          Discussion · Priya Raman
        </span>
        <span className="ml-auto text-[12px] leading-[18px] text-[#717680]">3 comments</span>
      </div>
      <div className="flex flex-col gap-[16px] px-[16px] py-[16px]">
        {comments.map((c) => (
          <div key={c.who} className="flex items-start gap-[10px]">
            <span
              className="flex size-[28px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: c.tint }}
            >
              {c.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-[8px]">
                <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">{c.who}</span>
                <span className="text-[12px] leading-[18px] text-[#717680]">{c.when}</span>
              </div>
              <p className="mt-[2px] text-[13px] leading-[19px] text-[#535862]">{c.body}</p>
              {c.reacts.length > 0 && (
                <div className="mt-[8px] flex gap-[6px]">
                  {c.reacts.map((r, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-[4px] rounded-full border border-[#e9eaeb] bg-[#fafafa] px-[8px] py-[1px] text-[12px] leading-[18px] text-[#535862]"
                    >
                      <ThumbsUp size={12} className="text-[#155eef]" />
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BriefBuilderMock() {
  const fields = [
    ['Software', 'NetSuite ERP'],
    ['Scope', 'Implementation + data migration'],
    ['Entities', '3 subsidiaries, multi-currency'],
    ['Timeline', 'Kickoff Jul 1 · live by Sep 30'],
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Build your brief</p>
        <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <CheckCircle2 size={13} /> Ready to match
        </span>
      </div>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[11px]"
          >
            <span className="text-[13px] leading-[18px] text-[#717680]">{label}</span>
            <span className="truncate text-[14px] font-medium leading-[20px] text-[#252b37]">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-[12px] rounded-[10px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[14px] py-[12px]">
        <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
          <Users size={15} className="text-[#155eef]" />
          Invite Dana, Sam, and 1 other to review the shortlist
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function HiringWorkspacePage() {
  return (
    <>
      <MarketingHero
        eyebrow="Hiring workspace"
        title="A shared workspace from brief to kickoff"
        subtitle="Hiring an implementation partner is a team decision. Write the brief once, build a shortlist of vetted experts, and let finance, IT, and ops weigh in — all in one place, before anyone signs."
        primary={{ label: 'Start a hire', href: '/for-businesses' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[920px]">
          <UISnippetFrame title="proploy.com/workspace/netsuite-migration">
            <WorkspaceBoard />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="Why a shared workspace"
        heading="The whole buying team, on the same page"
        body="Implementation hires touch finance, IT, security, and the team that lives in the tool. Proploy keeps that group aligned instead of scattered across email threads and spreadsheets."
        cards={[
          {
            icon: <ListChecks size={24} className="text-white" />,
            title: 'One brief, not five versions',
            body: 'Capture the goal, scope, budget, and must-have skills once. Everyone reviewing the hire works from the same source of truth.',
          },
          {
            icon: <Users size={24} className="text-white" />,
            title: 'A shortlist you build together',
            body: 'Save vetted experts and firms to a shared shortlist. Stakeholders compare credentials side by side instead of forwarding PDFs.',
          },
          {
            icon: <MessageSquare size={24} className="text-white" />,
            title: 'Decisions made in the open',
            body: 'Teammates comment, react, and tag a favorite right on each candidate — so the why behind the pick is never lost.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Start with the brief"
        title="Turn a vague need into a brief experts can answer"
        body="A guided brief captures the software, scope, and timeline that implementation partners actually need — a NetSuite migration reads very differently from a Salesforce rollout, and the brief reflects that."
        bullets={[
          'Structured fields for software, scope, entities, and go-live date',
          'Must-have skills become the match criteria for your shortlist',
          'Invite finance, IT, and ops to review before anything goes out',
        ]}
        link={{ label: 'Start a brief', href: '/for-businesses' }}
        visual={
          <UISnippetFrame chrome={false}>
            <BriefBuilderMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Decide together"
        title="Comments and reactions on every candidate"
        body="No more forwarding resumes and chasing replies. Stakeholders leave notes, react to each other, and surface the questions that matter — like how a partner handled a tax-engine cutover — right where the shortlist lives."
        bullets={[
          'Threaded comments and reactions per expert',
          'Tag a top match so the recommendation is clear',
          'A full record of who weighed in and why, before kickoff',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <CommentThreadMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '1 brief',
            label: 'Replaces the email chain',
            sub: 'Scope, budget, and skills captured once for the whole team.',
          },
          {
            value: '4 days',
            label: 'Median brief to shortlist',
            sub: 'From a finished brief to vetted experts ready to review.',
          },
          {
            value: '100%',
            label: 'Decisions on record',
            sub: 'Every comment and pick stays attached to the hire.',
          },
        ]}
      />

      <TestimonialWall
        heading="Hiring teams that finally agreed on a partner"
        testimonials={[
          {
            quote:
              'Our NetSuite migration touched finance and IT. The shared workspace meant Sam and I were reviewing the same shortlist instead of trading screenshots.',
            name: 'Dana Whitfield',
            role: 'Controller, Northwind Logistics',
            color: '#155eef',
          },
          {
            quote:
              'I could leave a comment about the data-migration risk right on the candidate. The whole team saw it before we booked the scoping call.',
            name: 'Sam Okafor',
            role: 'Head of IT, Brightside',
            color: '#079455',
          },
          {
            quote:
              'When leadership asked why we picked this firm, the reasoning was already in the workspace — comments, reactions, and the tagged top match.',
            name: 'Lena Cho',
            role: 'VP Operations, Cedar & Co',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'Who can I invite to the hiring workspace?',
            a: 'Anyone on the buying team — finance, IT, security, and the people who will use the tool. Invite them to a hire and they can review the brief, the shortlist, and the discussion in one place.',
          },
          {
            q: 'Do experts see our internal comments?',
            a: 'No. The brief, shortlist, comments, and reactions are private to your team. Experts only see what you choose to share when you invite them to a scoping call or send a request.',
          },
          {
            q: 'How does the shortlist get built?',
            a: 'Your brief’s must-have skills become match criteria. You save vetted experts and firms to a shared shortlist, then your team compares them side by side and comments on each.',
          },
          {
            q: 'What happens after we pick a partner?',
            a: 'The workspace carries the same context straight into kickoff — the brief, the shortlist decision, and the discussion stay attached, so the engagement starts with everyone aligned.',
          },
          {
            q: 'Are the experts on Proploy vetted?',
            a: 'Yes. Every expert and consulting firm is reviewed for proven implementation experience in their software before they appear in your shortlist — so the team is comparing real specialists, not generic generalists.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Bring your whole team into the next hire"
        body="Write the brief, build the shortlist, and decide together — from first idea to kickoff."
        primary={{ label: 'Start a hire', href: '/for-businesses' }}
        secondary={{ label: 'Explore the platform', href: '/for-businesses' }}
      />
    </>
  )
}
