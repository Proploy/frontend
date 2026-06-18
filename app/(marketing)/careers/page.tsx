import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Compass,
  Globe2,
  HeartPulse,
  Laptop,
  PiggyBank,
  Plane,
  Scale,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import {
  CTABanner,
  Container,
  MarketingHero,
  SectionHeading,
  ThreeUpCards,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Careers · Proploy',
  description:
    'Help build the marketplace where businesses hire vetted experts to implement software. See open roles across engineering, trust, and go-to-market.',
}

/* ----------------------------------------------------------------- content */

interface Role {
  title: string
  location: string
  type: string
}

interface RoleGroup {
  team: string
  blurb: string
  roles: Role[]
}

const ROLE_GROUPS: RoleGroup[] = [
  {
    team: 'Engineering & Product',
    blurb: 'The marketplace, matching, and the dashboards experts and businesses run their work on.',
    roles: [
      {
        title: 'Senior Full-Stack Engineer, Marketplace',
        location: 'Remote (US / EU)',
        type: 'Full-time',
      },
      {
        title: 'Product Designer, Expert Experience',
        location: 'Remote (US / EU)',
        type: 'Full-time',
      },
      {
        title: 'Engineering Manager, Payments & Contracts',
        location: 'New York, NY · Hybrid',
        type: 'Full-time',
      },
    ],
  },
  {
    team: 'Trust & Vetting',
    blurb: 'How we keep the bar high — assessing experts, scoping engagements, and protecting both sides of every deal.',
    roles: [
      {
        title: 'Implementation Vetting Lead',
        location: 'Remote (US)',
        type: 'Full-time',
      },
      {
        title: 'Trust & Safety Operations Manager',
        location: 'New York, NY · Hybrid',
        type: 'Full-time',
      },
    ],
  },
  {
    team: 'Go-to-Market',
    blurb: 'Bringing vetted experts and the businesses that need them onto the platform.',
    roles: [
      {
        title: 'Founding Account Executive, Enterprise',
        location: 'Remote (US)',
        type: 'Full-time',
      },
    ],
  },
]

const PERKS: { icon: React.ReactNode; title: string; body: string }[] = [
  {
    icon: <Globe2 size={20} className="text-[#155eef]" />,
    title: 'Remote-first, by default',
    body: 'Work from anywhere in the US or EU. We hire for judgment, not for proximity to an office.',
  },
  {
    icon: <Stethoscope size={20} className="text-[#155eef]" />,
    title: 'Full medical, dental & vision',
    body: 'Premiums covered for you and your dependents, with no waiting period from day one.',
  },
  {
    icon: <PiggyBank size={20} className="text-[#155eef]" />,
    title: 'Meaningful equity',
    body: 'Every full-time hire owns a real stake in what we are building, with a 10-year exercise window.',
  },
  {
    icon: <Plane size={20} className="text-[#155eef]" />,
    title: 'Time off you actually take',
    body: 'A four-week minimum, company-wide recharge weeks, and a culture that protects them.',
  },
  {
    icon: <Laptop size={20} className="text-[#155eef]" />,
    title: 'Home-office & learning budget',
    body: '$2,000 to set up your workspace and $1,500 a year toward courses, certs, and conferences.',
  },
  {
    icon: <HeartPulse size={20} className="text-[#155eef]" />,
    title: 'Parental leave & retirement',
    body: '16 weeks of fully paid leave for every new parent, plus a 401(k) match to back your future.',
  },
]

/* -------------------------------------------------------------------- page */

export default function CareersPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Careers"
        title="Build the trusted way to implement software."
        subtitle="Proploy is the marketplace where businesses hire vetted experts and consulting firms to get software live — on scope, on time, with both sides protected. Come help us raise the bar for an entire industry."
        primary={{ label: 'See open roles', href: '#open-roles' }}
        secondary={{ label: 'Read about us', href: '/about' }}
      />

      <ThreeUpCards
        heading="What we hold ourselves to"
        body="Three principles shape how we hire, what we ship, and the standard every engagement on Proploy is held to."
        cards={[
          {
            icon: <Scale size={24} className="text-white" />,
            title: 'Trust is the product',
            body: 'A marketplace lives or dies on the quality of its vetting. We make the rigorous choice even when the easy one would grow faster this quarter.',
          },
          {
            icon: <Compass size={24} className="text-white" />,
            title: 'Own the outcome',
            body: 'We hire people who take a problem from ambiguous to shipped without waiting to be told how. Title and tenure matter less than judgment.',
          },
          {
            icon: <Sparkles size={24} className="text-white" />,
            title: 'Sharp, never sloppy',
            body: 'Clear writing, clear scope, clear decisions. The care we ask experts to bring to an implementation is the care we bring to our own work.',
          },
        ]}
      />

      {/* ------------------------------------------------------------- perks */}
      <section className="py-[96px] bg-[#fafafa] border-y border-[#e9eaeb]">
        <Container className="flex flex-col gap-[64px]">
          <SectionHeading
            title="The benefits behind the work"
            body="We want the people raising the bar for software implementation to be supported well enough to do their best work for years."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex flex-col gap-[12px]">
                <div className="size-[40px] rounded-[10px] border border-[#e9eaeb] bg-white flex items-center justify-center">
                  {perk.icon}
                </div>
                <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{perk.title}</p>
                <p className="font-normal text-[16px] leading-[24px] text-[#535862]">{perk.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- open roles */}
      <section id="open-roles" className="py-[96px]">
        <Container className="flex flex-col gap-[56px]">
          <SectionHeading
            title="Open roles"
            body="We hire deliberately and in small numbers. If you do not see your exact role, tell us where you would make a difference."
          />

          <div className="flex flex-col gap-[48px]">
            {ROLE_GROUPS.map((group) => (
              <div key={group.team} className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <h3 className="font-semibold text-[24px] leading-[32px] text-[#181d27] tracking-[-0.4px]">
                    {group.team}
                  </h3>
                  <p className="font-normal text-[16px] leading-[24px] text-[#535862] max-w-[640px]">
                    {group.blurb}
                  </p>
                </div>

                <div className="overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white">
                  {group.roles.map((role, i) => (
                    <Link
                      key={role.title}
                      href="/contact"
                      className={`group flex flex-col gap-[12px] px-[24px] py-[20px] transition-colors hover:bg-[#fafafa] sm:flex-row sm:items-center sm:justify-between sm:gap-[24px] ${
                        i > 0 ? 'border-t border-[#e9eaeb]' : ''
                      }`}
                    >
                      <div className="flex min-w-0 flex-col gap-[6px]">
                        <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{role.title}</p>
                        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[4px] text-[14px] leading-[20px] text-[#717680]">
                          <span>{role.location}</span>
                          <span className="hidden sm:inline text-[#d5d7da]">·</span>
                          <span>{role.type}</span>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-[8px] font-semibold text-[16px] leading-[24px] text-[#155eef] group-hover:text-[#004eeb] transition-colors">
                        Apply
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-[2px]" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[24px] py-[20px] flex flex-col gap-[6px] sm:flex-row sm:items-center sm:justify-between sm:gap-[24px]">
            <div className="flex flex-col gap-[2px]">
              <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                Don&apos;t see the right fit?
              </p>
              <p className="font-normal text-[15px] leading-[22px] text-[#535862]">
                We are always glad to meet sharp people early. Send us a note about the work you want to do.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-[8px] font-semibold text-[16px] leading-[24px] text-[#155eef] hover:text-[#004eeb] transition-colors"
            >
              Introduce yourself
              <ArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title="Bring your judgment to a marketplace built on trust"
        body="If raising the bar for how software gets implemented sounds like your kind of problem, we should talk."
        primary={{ label: 'See open roles', href: '#open-roles' }}
        secondary={{ label: 'Learn how Proploy works', href: '/for-businesses' }}
      />
    </>
  )
}
