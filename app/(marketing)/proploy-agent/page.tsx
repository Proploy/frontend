import type { Metadata } from 'next'
import {
  ArrowUp,
  BadgeCheck,
  ClipboardList,
  Compass,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Workflow,
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
  title: 'Proploy Agent · Scope software and find experts, conversationally',
  description:
    'Proploy Agent is an AI assistant that helps businesses scope their software needs and surface vetted implementation experts — in a chat, not a 12-tab research spiral.',
}

/* --------------------------------------------------------------- snippets */

function ChatBubble({
  role,
  children,
}: {
  role: 'user' | 'agent'
  children: React.ReactNode
}) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-[12px] rounded-br-[4px] bg-[#155eef] px-[14px] py-[10px] text-[14px] leading-[20px] text-white">
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-[10px]">
      <span className="mt-[2px] flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff]">
        <Sparkles size={15} className="text-[#155eef]" />
      </span>
      <div className="max-w-[82%] rounded-[12px] rounded-tl-[4px] border border-[#e9eaeb] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#252b37]">
        {children}
      </div>
    </div>
  )
}

function HeroChatMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-[#fafafa]">
      <div className="flex items-center gap-[10px] border-b border-[#e9eaeb] bg-white px-[20px] py-[14px]">
        <span className="flex size-[30px] items-center justify-center rounded-[8px] bg-[#155eef]">
          <Sparkles size={16} className="text-white" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Proploy Agent</p>
          <p className="text-[12px] leading-[16px] text-[#717680]">Scoping your project</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-[6px] rounded-full bg-[#f6fef9] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <span className="size-[6px] rounded-full bg-[#17b26a]" /> Online
        </span>
      </div>

      <div className="flex flex-col gap-[14px] px-[20px] py-[20px]">
        <ChatBubble role="user">
          We&apos;re replacing spreadsheets for our 40-person field team. Where do we even start?
        </ChatBubble>
        <ChatBubble role="agent">
          Let&apos;s scope it. Three quick questions: what does the field team do day to day, what systems hold the
          data today, and is there a go-live date you&apos;re working back from?
        </ChatBubble>
        <ChatBubble role="user">Scheduling and job reports. Data lives in Excel + QuickBooks. Live by Q4.</ChatBubble>
        <ChatBubble role="agent">
          Got it — that points to a field-service platform with a QuickBooks sync. I&apos;ve drafted a scope and lined
          up 3 vetted experts who&apos;ve shipped this exact rollout. Want to see them?
        </ChatBubble>

        <div className="flex items-center gap-[10px] rounded-[10px] border border-[#e9eaeb] bg-white px-[14px] py-[10px]">
          <Search size={16} className="shrink-0 text-[#717680]" />
          <span className="text-[14px] leading-[20px] text-[#717680]">Ask anything about your software project…</span>
          <span className="ml-auto flex size-[28px] items-center justify-center rounded-[8px] bg-[#155eef]">
            <ArrowUp size={15} className="text-white" />
          </span>
        </div>
      </div>
    </div>
  )
}

function CrmFitMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex flex-col gap-[12px]">
        <ChatBubble role="user">Which CRM fits a 200-person ops team?</ChatBubble>
        <div className="flex items-start gap-[10px]">
          <span className="mt-[2px] flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff]">
            <Sparkles size={15} className="text-[#155eef]" />
          </span>
          <div className="min-w-0 rounded-[12px] rounded-tl-[4px] border border-[#e9eaeb] bg-[#fafafa] px-[14px] py-[12px]">
            <p className="text-[14px] leading-[20px] text-[#252b37]">
              For a 200-person ops team with heavy internal workflows, here&apos;s how the main options trade off:
            </p>
            <div className="mt-[12px] overflow-hidden rounded-[10px] border border-[#e9eaeb] bg-white">
              {[
                ['Salesforce', 'Best for complex, custom workflows', 'Strong fit'],
                ['HubSpot', 'Faster to launch, lighter admin', 'Good fit'],
                ['Microsoft Dynamics', 'If you already run the Microsoft stack', 'Worth a look'],
              ].map(([name, note, verdict], i) => (
                <div
                  key={name}
                  className={`flex items-start justify-between gap-[12px] px-[14px] py-[10px] ${
                    i > 0 ? 'border-t border-[#e9eaeb]' : ''
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold leading-[20px] text-[#181d27]">{name}</span>
                    <span className="block text-[13px] leading-[18px] text-[#535862]">{note}</span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
                      i === 0 ? 'bg-[#eff4ff] text-[#155eef]' : 'bg-[#fafafa] text-[#717680]'
                    }`}
                  >
                    {verdict}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-[12px] text-[13px] leading-[18px] text-[#717680]">
              For your team size, Salesforce is the safest long-term fit — but it needs a strong implementation
              partner. Want me to find one?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MatchedExpertsMock() {
  const experts = [
    { initials: 'PR', name: 'Priya Raman', focus: 'Salesforce ops · 200–500 seats', rating: '4.9', jobs: '38' },
    { initials: 'MV', name: 'Marco Vidal', focus: 'CRM + RevOps migrations', rating: '4.8', jobs: '24' },
    { initials: 'JA', name: 'Jordan Avery', focus: 'Salesforce → field workflows', rating: '5.0', jobs: '19' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div className="flex items-center gap-[8px]">
        <BadgeCheck size={16} className="text-[#155eef]" />
        <p className="text-[13px] font-medium leading-[18px] text-[#252b37]">
          3 vetted experts matched to your scope
        </p>
      </div>
      <div className="mt-[12px] flex flex-col gap-[8px]">
        {experts.map((e) => (
          <div
            key={e.name}
            className="flex items-center gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[14px] py-[12px]"
          >
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[13px] font-semibold text-[#155eef]">
              {e.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{e.name}</span>
              <span className="block truncate text-[13px] leading-[18px] text-[#535862]">{e.focus}</span>
            </span>
            <span className="flex shrink-0 items-center gap-[10px]">
              <span className="inline-flex items-center gap-[3px] text-[13px] font-medium leading-[18px] text-[#252b37]">
                <Star size={13} className="fill-[#f79009] text-[#f79009]" />
                {e.rating}
              </span>
              <span className="hidden text-[12px] leading-[18px] text-[#717680] sm:inline">{e.jobs} projects</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-[12px] flex items-center justify-between gap-[12px] rounded-[10px] bg-[#fafafa] px-[14px] py-[10px]">
        <span className="text-[13px] leading-[18px] text-[#535862]">Shortlist ready to message</span>
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[12px] py-[7px] text-[13px] font-semibold leading-[18px] text-white">
          <MessageSquare size={14} /> Introduce me
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ProployAgentPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Proploy Agent"
        title="Scope your software project, then meet the experts to build it."
        subtitle="Proploy Agent is an AI assistant for software buyers. Describe what you’re trying to fix in plain language — it scopes the work, recommends the right tools, and surfaces vetted experts who’ve done it before."
        primary={{ label: 'Try the agent', href: '/sign-up' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/agent">
            <HeroChatMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        eyebrow="What the agent does"
        heading="From a vague problem to a fundable plan"
        body="Most software projects stall before they start — buyers don't know what to buy, who to hire, or what good looks like. Proploy Agent closes that gap in a conversation."
        cards={[
          {
            icon: <ClipboardList size={24} className="text-white" />,
            title: 'Scopes the work for you',
            body: 'Answer a few questions and the agent turns a fuzzy ask into a clear scope — objectives, systems involved, and a realistic phasing of the rollout.',
          },
          {
            icon: <Compass size={24} className="text-white" />,
            title: 'Recommends the right software',
            body: 'It compares tools against your team size, stack, and budget — and tells you the trade-offs in plain terms, not a vendor pitch.',
          },
          {
            icon: <Workflow size={24} className="text-white" />,
            title: 'Finds experts who fit',
            body: 'Every recommendation maps to vetted implementation experts on Proploy who have shipped that exact kind of project before.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Software selection"
        title="Ask “which CRM fits a 200-person ops team?” and get a real answer"
        body="The agent reasons over your team size, existing stack, and where data lives today — then lays out the options with honest trade-offs, so you walk into procurement already knowing the shortlist."
        bullets={[
          'Side-by-side trade-offs, not a feature dump',
          'Grounded in your team size, budget, and current tools',
          'Flags where an implementation partner is non-negotiable',
        ]}
        link={{ label: 'Start a scoping chat', href: '/sign-up' }}
        visual={
          <UISnippetFrame chrome={false}>
            <CrmFitMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Expert matching"
        title="The moment you know what to build, you meet who can build it"
        body="As soon as a scope is clear, the agent surfaces a shortlist of vetted experts matched to it — ranked by relevant project history, ratings, and fit — and offers a warm intro in one click."
        bullets={[
          'Matched to your scope, not a generic keyword search',
          'Every expert is vetted, rated, and reviewed on Proploy',
          'Introduce yourself without leaving the conversation',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <MatchedExpertsMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '11 min',
            label: 'Median time to a scoped plan',
            sub: 'From first message to a shortlist of experts ready to message.',
          },
          {
            value: '3x',
            label: 'Faster vendor shortlisting',
            sub: 'Versus assembling options across review sites and sales calls.',
          },
          {
            value: '100%',
            label: 'Vetted experts',
            sub: 'Every match comes from Proploy’s reviewed implementation network.',
          },
        ]}
      />

      <TestimonialWall
        heading="Buyers stop guessing and start scoping"
        testimonials={[
          {
            quote:
              'I described our mess in two sentences and the agent came back with a scope I could actually take to my CFO — plus three people who had built it before.',
            name: 'Dana Okafor',
            role: 'Head of Operations, Northwind Logistics',
            color: '#155eef',
          },
          {
            quote:
              'It talked me out of the flashier CRM and into the one that fit our team. That kind of straight answer is rare from anything trying to sell you software.',
            name: 'Liam Chen',
            role: 'COO, Brightside Health',
            color: '#079455',
          },
          {
            quote:
              'We went from “we should probably modernize this” to a signed expert engagement in under a week. The agent did the messy middle part.',
            name: 'Sofia Marquez',
            role: 'VP Finance, Cedar & Co',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'Is Proploy Agent just a chatbot?',
            a: 'No. It’s a scoping assistant grounded in Proploy’s network of vetted implementation experts. It reasons about your project, recommends software, and connects each recommendation to people who can actually deliver it.',
          },
          {
            q: 'Does the agent sell me a specific tool?',
            a: 'It isn’t a vendor. The agent weighs options against your team size, stack, and budget, and tells you the trade-offs plainly — including when a cheaper or simpler tool is the right call.',
          },
          {
            q: 'How does it pick which experts to surface?',
            a: 'It matches the scope it builds with you against expert profiles — relevant project history, ratings, reviews, and specialization — rather than running a keyword search. You always see why each expert was matched.',
          },
          {
            q: 'What information do I need to start?',
            a: 'Just a description of the problem. The agent asks follow-up questions to fill in your team size, current systems, and timeline as it goes.',
          },
          {
            q: 'Do I have to hire through Proploy?',
            a: 'No. The scope and software recommendations are yours to keep. If you do want to move forward, the agent can introduce you to matched experts and hand off into a contract.',
          },
          {
            q: 'Is my project information kept private?',
            a: 'Yes. Your scoping conversation is private to your account and is only shared with an expert when you choose to make an introduction.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Describe the problem. Leave with a plan and a shortlist."
        body="Open Proploy Agent, scope your next software project in a conversation, and meet the experts who can ship it."
        primary={{ label: 'Try the agent', href: '/sign-up' }}
        secondary={{ label: 'Explore Proploy', href: '/for-businesses' }}
      />
    </>
  )
}
