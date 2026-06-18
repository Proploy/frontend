import type { Metadata } from 'next'
import { ClipboardCheck, Compass, Handshake, ShieldCheck, Sparkles, Target } from 'lucide-react'
import {
  CTABanner,
  Container,
  MarketingHero,
  MetricStat,
  SectionHeading,
  ThreeUpCards,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Our mission · Proploy',
  description:
    'Proploy exists to make software rollouts succeed — by matching businesses with vetted implementation experts who do the work and stand behind it.',
}

/* ------------------------------------------------------------- founding story */

function FoundingStory() {
  return (
    <section className="py-[96px]">
      <Container className="flex flex-col gap-[48px]">
        <SectionHeading
          title="Why we started Proploy"
          body="Buying software is easy now. Making it work is still the hard part — and it is where most of the value, and most of the failure, lives."
        />
        <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-2 lg:gap-[64px]">
          <div className="flex flex-col gap-[20px] text-[18px] leading-[28px] text-[#535862]">
            <p>
              We spent years on the inside of software rollouts — as operators signing the contract, and
              as the consultants brought in to fix the rollout after it stalled. The pattern rarely
              changed. A business buys a capable platform, then loses six months hunting for someone who
              can actually configure it, migrate the data, and train the team without breaking what works.
            </p>
            <p>
              The good implementation experts existed. They were just impossible to find with any
              confidence. References were thin, scopes were vague, and the first real signal of whether
              someone was any good arrived halfway through a project that was already over budget.
            </p>
          </div>
          <div className="flex flex-col gap-[20px] text-[18px] leading-[28px] text-[#535862]">
            <p>
              So we built the marketplace we wished we had. Proploy vets the experts before they ever
              reach a buyer — checking real implementation history, platform certifications, and outcomes
              on engagements that look like yours. Businesses describe the rollout; we surface the people
              and firms who have done it before.
            </p>
            <p className="text-[#181d27]">
              Our mission is simple to say and hard to earn: make software rollouts succeed by matching
              businesses with vetted experts who do the work, and stand behind it. Everything we ship —
              vetting, scoped contracts, milestone payments — exists to move the odds in the buyer&apos;s
              favor.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ----------------------------------------------------------------- team row */

const TEAM = [
  { initials: 'EZ', name: 'Edward Zhang', role: 'Co-founder & CEO', color: '#155eef' },
  { initials: 'MR', name: 'Mara Reyes', role: 'Co-founder & Head of Network', color: '#079455' },
  { initials: 'DK', name: 'Devin Kapoor', role: 'Head of Trust & Vetting', color: '#dd2590' },
  { initials: 'SL', name: 'Sofia Laurent', role: 'Head of Product', color: '#7a5af8' },
]

function TeamRow() {
  return (
    <section className="bg-[#fafafa] py-[96px]">
      <Container className="flex flex-col gap-[48px]">
        <SectionHeading
          title="The people behind the work"
          body="A small team of former operators, consultants, and platform specialists — the people who used to live inside these rollouts."
        />
        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col gap-[16px] rounded-[12px] border border-[#e9eaeb] bg-white p-[24px]"
            >
              <span
                className="flex size-[48px] items-center justify-center rounded-full text-[16px] font-semibold text-white"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </span>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[18px] font-semibold leading-[28px] text-[#181d27]">{member.name}</p>
                <p className="text-[15px] leading-[22px] text-[#717680]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------- page */

export default function MissionPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Our mission"
        title="Make software rollouts succeed."
        subtitle="Proploy matches businesses with vetted implementation experts — so the platform you bought actually gets configured, migrated, adopted, and delivered."
        primary={{ label: 'Find an expert', href: '/for-businesses' }}
        secondary={{ label: 'Join the network', href: '/become-expert' }}
      />

      <FoundingStory />

      <ThreeUpCards
        heading="What we hold ourselves to"
        body="Six commitments that decide what we build, who we let in, and how we measure whether we are doing our job."
        cards={[
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Vetting before reach',
            body: 'No expert reaches a buyer unvetted. We verify implementation history, certifications, and references first — so the marketplace earns trust by default, not on review.',
          },
          {
            icon: <Target size={24} className="text-white" />,
            title: 'Outcomes over hours',
            body: 'We optimize for rollouts that go live and get adopted, not for time logged. Scoped contracts and milestones keep both sides pointed at the same finish line.',
          },
          {
            icon: <Handshake size={24} className="text-white" />,
            title: 'Both sides protected',
            body: 'Experts get clear scope and on-time payment. Businesses get accountability and acceptance criteria. A good marketplace cannot favor one side over the other.',
          },
          {
            icon: <ClipboardCheck size={24} className="text-white" />,
            title: 'Honest about fit',
            body: 'The right match sometimes means telling a buyer the project is not ready, or that no one in the network is the right call yet. We would rather lose the deal than the trust.',
          },
          {
            icon: <Compass size={24} className="text-white" />,
            title: 'Earned credibility',
            body: 'We make claims we can back with data — engagements delivered, signatures, satisfaction. Trust-first is not a tagline; it is the bar every surface has to clear.',
          },
          {
            icon: <Sparkles size={24} className="text-white" />,
            title: 'Built by practitioners',
            body: 'Everyone here has shipped or salvaged a rollout. We build for the realities of implementation work because we have lived inside them.',
          },
        ]}
      />

      <MetricStat
        tint
        metrics={[
          {
            value: '3,400+',
            label: 'Experts vetted',
            sub: 'Independent specialists and consulting firms reviewed before joining the network.',
          },
          {
            value: '1,900',
            label: 'Rollouts delivered',
            sub: 'Implementations matched, scoped, and taken live through Proploy.',
          },
          {
            value: '40+',
            label: 'Countries covered',
            sub: 'Experts working across regions, platforms, and regulatory environments.',
          },
        ]}
      />

      <TeamRow />

      <CTABanner
        variant="dark"
        title="Help us make the next rollout succeed"
        body="Whether you are buying software or implementing it, there is a place for you in the Proploy network."
        primary={{ label: 'Find an expert', href: '/for-businesses' }}
        secondary={{ label: 'Become an expert', href: '/become-expert' }}
      />
    </>
  )
}
