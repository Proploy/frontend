import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Clock, MapPin, Monitor, Users } from 'lucide-react'
import { CTABanner, Container, MarketingHero, SectionHeading, btnPrimary, btnSecondary } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Events · Proploy',
  description:
    'Webinars, implementation workshops, and expert AMAs for teams buying software implementation and the experts who deliver it.',
}

/* --------------------------------------------------------------------- data */

interface UpcomingEvent {
  type: 'Webinar' | 'Workshop' | 'Expert AMA'
  title: string
  description: string
  date: string
  time: string
  format: 'online' | 'in-person'
  location: string
  href: string
  spotsNote?: string
}

const UPCOMING: UpcomingEvent[] = [
  {
    type: 'Webinar',
    title: 'Scoping a Salesforce rollout that actually ships on time',
    description:
      'Two Proploy-vetted CRM leads break down a real implementation plan — milestones, acceptance criteria, and the scope traps that blow up timelines.',
    date: 'Tue, Jun 24, 2026',
    time: '11:00 AM EDT · 45 min',
    format: 'online',
    location: 'Live on Zoom',
    href: '/events/salesforce-rollout-scoping',
    spotsNote: 'Free · recording sent to all registrants',
  },
  {
    type: 'Workshop',
    title: 'Implementation buyer workshop: writing a brief experts will bid on',
    description:
      'A working session for businesses. Bring a project; leave with a scoped brief, a realistic budget range, and a shortlist of vetted vendors to invite.',
    date: 'Thu, Jul 10, 2026',
    time: '1:00 PM EDT · 90 min',
    format: 'in-person',
    location: 'Proploy HQ · New York, NY',
    href: '/events/buyer-brief-workshop',
    spotsNote: '30 seats · application required',
  },
  {
    type: 'Expert AMA',
    title: 'Ask me anything: scaling a NetSuite practice on Proploy',
    description:
      'An open AMA with a top-rated ERP firm on pricing fixed-bid work, structuring milestone payments, and turning one engagement into a referral pipeline.',
    date: 'Wed, Jul 16, 2026',
    time: '2:00 PM EDT · 60 min',
    format: 'online',
    location: 'Live on Proploy',
    href: '/events/netsuite-practice-ama',
    spotsNote: 'Free for the expert network',
  },
  {
    type: 'Workshop',
    title: 'Data migration clinic: moving off legacy systems without downtime',
    description:
      'A hands-on clinic for implementation teams. Walk through migration plans, cutover rehearsals, and rollback strategy with experts who have run them at scale.',
    date: 'Tue, Jul 29, 2026',
    time: '10:00 AM EDT · 2 hr',
    format: 'online',
    location: 'Live on Zoom',
    href: '/events/data-migration-clinic',
    spotsNote: '120 seats · first come, first served',
  },
]

interface PastEvent {
  type: string
  title: string
  date: string
  href: string
}

const PAST: PastEvent[] = [
  {
    type: 'Webinar',
    title: 'How vetted experts price fixed-bid implementations',
    date: 'May 2026',
    href: '/events/pricing-fixed-bid',
  },
  {
    type: 'Expert AMA',
    title: 'Switching from agency overhead to solo consulting',
    date: 'May 2026',
    href: '/events/agency-to-solo',
  },
  {
    type: 'Workshop',
    title: 'Building an acceptance-criteria checklist that holds up',
    date: 'Apr 2026',
    href: '/events/acceptance-criteria',
  },
  {
    type: 'Webinar',
    title: 'Choosing between a freelancer, a firm, and a partner',
    date: 'Apr 2026',
    href: '/events/freelancer-vs-firm',
  },
  {
    type: 'Expert AMA',
    title: 'Winning your first three clients on a new marketplace',
    date: 'Mar 2026',
    href: '/events/first-three-clients',
  },
  {
    type: 'Workshop',
    title: 'Running a HubSpot migration discovery in 90 minutes',
    date: 'Mar 2026',
    href: '/events/hubspot-discovery',
  },
]

/* --------------------------------------------------------------------- page */

export default function EventsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Events"
        title="Workshops, webinars, and AMAs for the people behind every implementation."
        subtitle="Practical sessions for businesses buying software implementation and the vetted experts who deliver it — scoping, pricing, migration, and go-live, from people who have shipped the work."
        primary={{ label: 'Browse upcoming events', href: '#upcoming' }}
        secondary={{ label: 'Host an event with us', href: '/contact' }}
      />

      {/* ------------------------------------------------------------ upcoming */}
      <section id="upcoming" className="py-[96px]">
        <Container className="flex flex-col gap-[48px]">
          <SectionHeading
            title="Upcoming events"
            body="Live and in-person sessions over the next few weeks. Seats are limited — register to hold your spot and get the recording."
          />
          <div className="flex flex-col gap-[20px]">
            {UPCOMING.map((event) => (
              <article
                key={event.title}
                className="flex flex-col gap-[24px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:border-[#d5d7da] sm:p-[32px] lg:flex-row lg:items-center lg:gap-[40px]"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
                  <div className="flex flex-wrap items-center gap-[10px]">
                    <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
                      {event.type === 'Webinar' && <Monitor size={13} />}
                      {event.type === 'Workshop' && <Users size={13} />}
                      {event.type === 'Expert AMA' && <Users size={13} />}
                      {event.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px] ${
                        event.format === 'online'
                          ? 'bg-[#fafafa] text-[#535862]'
                          : 'bg-[#fdf2fa] text-[#c11574]'
                      }`}
                    >
                      {event.format === 'online' ? <Monitor size={13} /> : <MapPin size={13} />}
                      {event.format === 'online' ? 'Online' : 'In person'}
                    </span>
                  </div>
                  <h3
                    className="font-semibold text-[24px] leading-[32px] text-[#181d27] tracking-[-0.3px]"
                    style={{ textWrap: 'balance' }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-[16px] leading-[24px] text-[#535862]">{event.description}</p>
                  <div className="mt-[2px] flex flex-wrap items-center gap-x-[20px] gap-y-[8px]">
                    <span className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] text-[#414651]">
                      <CalendarDays size={16} className="text-[#717680]" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] text-[#414651]">
                      <Clock size={16} className="text-[#717680]" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] text-[#414651]">
                      <MapPin size={16} className="text-[#717680]" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-[12px] lg:items-end lg:text-right">
                  <Link href={event.href} className={btnPrimary}>
                    Register
                  </Link>
                  {event.spotsNote && (
                    <span className="text-[13px] leading-[18px] text-[#717680]">{event.spotsNote}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- past */}
      <section className="bg-[#fafafa] py-[96px]">
        <Container className="flex flex-col gap-[40px]">
          <div className="flex flex-col items-start justify-between gap-[20px] sm:flex-row sm:items-end">
            <SectionHeading
              title="Past events"
              body="Missed one? Recordings and recaps from recent sessions, on demand."
            />
            <Link href="/contact" className={`${btnSecondary} shrink-0`}>
              Request a recording
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
            {PAST.map((event) => (
              <Link
                key={event.title}
                href={event.href}
                className="group flex flex-col gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] transition-colors hover:border-[#d5d7da]"
              >
                <div className="flex items-center justify-between gap-[12px]">
                  <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
                    {event.type}
                  </span>
                  <span className="text-[13px] leading-[18px] text-[#717680]">{event.date}</span>
                </div>
                <h3 className="font-semibold text-[18px] leading-[26px] text-[#181d27] tracking-[-0.18px]">
                  {event.title}
                </h3>
                <span className="mt-[2px] inline-flex items-center gap-[6px] text-[14px] font-medium leading-[20px] text-[#155eef]">
                  Watch the recap
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title="Never miss a session"
        body="Get new workshops, webinars, and expert AMAs in your inbox — plus recordings of the ones you can’t make live."
        primary={{ label: 'Subscribe to event updates', href: '/contact' }}
        secondary={{ label: 'Propose an event', href: '/contact' }}
      />
    </>
  )
}
