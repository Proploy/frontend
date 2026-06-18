import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Compass, Map, Users } from 'lucide-react'
import { CTABanner, Container, MarketingHero, SectionHeading } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Implementation guides · Proploy',
  description:
    'Practical, vendor-neutral guides for choosing software, running an implementation, and working with vetted experts — written by people who ship rollouts.',
}

interface Guide {
  title: string
  desc: string
  tag: string
  href: string
}

interface GuideTopic {
  id: string
  label: string
  blurb: string
  icon: typeof Compass
  guides: Guide[]
}

const TOPICS: GuideTopic[] = [
  {
    id: 'choosing-software',
    label: 'Choosing software',
    blurb: 'Cut through the demo theater and pick the platform that fits how your team actually works.',
    icon: Compass,
    guides: [
      {
        title: 'Build vs. buy vs. configure',
        desc: 'A decision framework for when to extend off-the-shelf software, when to integrate, and when custom is the only honest answer.',
        tag: 'Strategy',
        href: '/guides/build-vs-buy',
      },
      {
        title: 'Writing an RFP that vendors respect',
        desc: 'Requirements that surface real fit instead of feature checkboxes — plus the questions that expose hidden implementation cost.',
        tag: 'Procurement',
        href: '/guides/writing-an-rfp',
      },
      {
        title: 'Total cost of ownership, honestly',
        desc: 'License price is the smallest line item. Model the data migration, integration, and change-management spend before you sign.',
        tag: 'Budgeting',
        href: '/guides/total-cost-of-ownership',
      },
    ],
  },
  {
    id: 'running-an-implementation',
    label: 'Running an implementation',
    blurb: 'Keep scope, timeline, and stakeholders aligned from kickoff through go-live and beyond.',
    icon: Map,
    guides: [
      {
        title: 'Scoping a phase-one rollout',
        desc: 'How to draw the line around a first phase that ships in weeks, proves value, and earns budget for the rest of the program.',
        tag: 'Planning',
        href: '/guides/scoping-phase-one',
      },
      {
        title: 'A data migration that does not slip',
        desc: 'Cleansing, mapping, and dry-run cutovers — the sequence that keeps a migration off the critical path to go-live.',
        tag: 'Data',
        href: '/guides/data-migration-playbook',
      },
      {
        title: 'Driving adoption after go-live',
        desc: 'Enablement, internal champions, and the metrics that tell you whether the software is actually being used a month in.',
        tag: 'Change management',
        href: '/guides/driving-adoption',
      },
    ],
  },
  {
    id: 'working-with-experts',
    label: 'Working with experts',
    blurb: 'Hire, brief, and manage implementation partners so the engagement stays on track and on budget.',
    icon: Users,
    guides: [
      {
        title: 'How to vet an implementation partner',
        desc: 'References that matter, certifications that do not, and the discovery-call questions that separate operators from order-takers.',
        tag: 'Hiring',
        href: '/guides/vetting-a-partner',
      },
      {
        title: 'Structuring a statement of work',
        desc: 'Milestones, acceptance criteria, and payment terms that protect both sides and leave no room for scope ambiguity.',
        tag: 'Contracts',
        href: '/guides/structuring-a-sow',
      },
      {
        title: 'Fixed-bid vs. retainer engagements',
        desc: 'When a fixed scope serves you and when ongoing capacity does — and how to price each without surprising your finance team.',
        tag: 'Engagements',
        href: '/guides/fixed-bid-vs-retainer',
      },
    ],
  },
]

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={guide.href}
      className="group flex flex-col rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:border-[#d5d7da] hover:bg-[#fafafa]"
    >
      <span className="inline-flex w-fit items-center rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
        {guide.tag}
      </span>
      <h3 className="mt-[16px] font-semibold text-[20px] leading-[28px] text-[#181d27] tracking-[-0.2px]">
        {guide.title}
      </h3>
      <p className="mt-[8px] grow text-[16px] leading-[24px] text-[#535862]">{guide.desc}</p>
      <span className="mt-[20px] inline-flex items-center gap-[6px] text-[15px] font-semibold leading-[22px] text-[#155eef] transition-colors group-hover:text-[#004eeb]">
        Read guide
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-[2px]" />
      </span>
    </Link>
  )
}

export default function GuidesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Resource library"
        title="Implementation guides, written by people who ship rollouts"
        subtitle="Vendor-neutral playbooks on choosing software, running an implementation, and working with vetted experts — so your next project starts on solid ground."
        primary={{ label: 'Find an expert', href: '/for-businesses' }}
        secondary={{ label: 'Browse by topic', href: '#choosing-software' }}
      />

      {TOPICS.map((topic) => {
        const Icon = topic.icon
        return (
          <section key={topic.id} id={topic.id} className="scroll-mt-[96px] py-[64px] first:pt-[32px]">
            <Container className="flex flex-col gap-[40px]">
              <div className="flex items-start gap-[16px]">
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] text-[#155eef]">
                  <Icon size={22} />
                </span>
                <SectionHeading title={topic.label} body={topic.blurb} />
              </div>
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
                {topic.guides.map((guide) => (
                  <GuideCard key={guide.href} guide={guide} />
                ))}
              </div>
            </Container>
          </section>
        )
      })}

      <CTABanner
        variant="dark"
        title="Ready to move from reading to shipping?"
        body="Tell us about your project and we’ll match you with vetted experts who have run it before."
        primary={{ label: 'Find an expert', href: '/for-businesses' }}
        secondary={{ label: 'How Proploy works', href: '/how-it-works' }}
      />
    </>
  )
}
