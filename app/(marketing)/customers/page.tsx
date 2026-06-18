import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Container,
  CTABanner,
  MarketingHero,
  MetricStat,
  SectionHeading,
  TestimonialWall,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Customer stories · Proploy',
  description:
    'How businesses ship software rollouts with vetted Proploy experts — measured by time to go-live, adoption, and outcomes that stuck.',
}

/* --------------------------------------------------------------- case data */

interface CaseStudy {
  company: string
  industry: string
  result: string
  statValue: string
  statLabel: string
  href: string
}

const cases: CaseStudy[] = [
  {
    company: 'Northwind Logistics',
    industry: 'Freight & supply chain',
    result: 'Migrated 14 years of order data to Salesforce without a day of downtime.',
    statValue: '3 weeks',
    statLabel: 'to go-live',
    href: '/customers/northwind',
  },
  {
    company: 'Brightside Health',
    industry: 'Healthcare',
    result: 'Rolled out Workday across 1,200 staff with HIPAA-aligned data handling.',
    statValue: '96%',
    statLabel: 'employee adoption',
    href: '/customers/brightside',
  },
  {
    company: 'Cedar & Co',
    industry: 'Professional services',
    result: 'Replaced spreadsheets with a HubSpot CRM their partners actually use daily.',
    statValue: '4.5x',
    statLabel: 'pipeline visibility',
    href: '/customers/cedar',
  },
  {
    company: 'Layers Design',
    industry: 'SaaS',
    result: 'Stood up a NetSuite ERP and closed their first month-end in two days.',
    statValue: '11 days',
    statLabel: 'from kickoff to live',
    href: '/customers/layers',
  },
  {
    company: 'Quotient Capital',
    industry: 'Financial services',
    result: 'Integrated Snowflake and dbt to retire a fragile nightly reporting pipeline.',
    statValue: '62%',
    statLabel: 'lower reporting cost',
    href: '/customers/quotient',
  },
  {
    company: 'Capsule Retail',
    industry: 'Retail & e-commerce',
    result: 'Connected Shopify, Klaviyo, and NetSuite ahead of their peak holiday season.',
    statValue: '5 stores',
    statLabel: 'cut over in one weekend',
    href: '/customers/capsule',
  },
]

/* ------------------------------------------------------------------- cards */

function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={study.href}
      className="group flex flex-col rounded-[12px] border border-[#e9eaeb] bg-white p-[28px] transition-colors hover:border-[#d5d7da] hover:bg-[#fafafa]"
    >
      <div className="flex items-baseline justify-between gap-[12px]">
        <h3 className="font-semibold text-[20px] leading-[30px] text-[#181d27] tracking-[-0.2px]">
          {study.company}
        </h3>
      </div>
      <p className="mt-[2px] text-[14px] leading-[20px] text-[#717680]">{study.industry}</p>

      <p className="mt-[20px] flex-1 text-[16px] leading-[24px] text-[#535862]">{study.result}</p>

      <div className="mt-[24px] flex items-end justify-between gap-[16px] border-t border-[#e9eaeb] pt-[20px]">
        <div className="flex flex-col">
          <span className="font-semibold text-[28px] leading-[36px] text-[#155eef] tracking-[-0.56px]">
            {study.statValue}
          </span>
          <span className="text-[14px] leading-[20px] text-[#717680]">{study.statLabel}</span>
        </div>
        <span className="inline-flex items-center gap-[6px] pb-[2px] text-[14px] font-semibold leading-[20px] text-[#155eef]">
          Read story
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-[2px]" />
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------- page */

export default function CustomersPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Customer stories"
        title="Software rollouts that actually went live"
        subtitle="Every engagement on Proploy starts with a vetted expert and ends with software in production. Here is what that looks like — measured in weeks, adoption, and outcomes that held."
        primary={{ label: 'Find an expert', href: '/for-businesses' }}
        secondary={{ label: 'Talk to our team', href: '/contact' }}
      />

      <MetricStat
        tint
        metrics={[
          {
            value: '4.2 wk',
            label: 'Median time to go-live',
            sub: 'From signed statement of work to software running in production.',
          },
          {
            value: '94%',
            label: 'Projects shipped on scope',
            sub: 'Delivered against the milestones agreed at kickoff, without scope creep.',
          },
          {
            value: '600+',
            label: 'Implementations delivered',
            sub: 'Across CRM, ERP, data, and HR platforms by the Proploy network.',
          },
        ]}
      />

      <section className="py-[96px]">
        <Container className="flex flex-col gap-[64px]">
          <SectionHeading
            title="Read how teams shipped their implementation"
            body="Real rollouts from the Proploy network — the platform, the timeline, and the result that mattered to the business."
          />
          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
            {cases.map((study) => (
              <CaseCard key={study.company} study={study} />
            ))}
          </div>
        </Container>
      </section>

      <TestimonialWall
        heading="In their words"
        testimonials={[
          {
            quote:
              'We had been quoted six months by a Big Four firm. Our Proploy expert had the CRM migrated and our reps trained in three weeks, and the data came across clean.',
            name: 'Dana Whitfield',
            role: 'VP Operations, Northwind Logistics',
            color: '#155eef',
          },
          {
            quote:
              'The difference was accountability. Milestones were signed, payments were tied to delivery, and we went into go-live knowing exactly what was done. Adoption did the rest.',
            name: 'Marcus Lin',
            role: 'CIO, Brightside Health',
            color: '#079455',
          },
        ]}
      />

      <CTABanner
        variant="dark"
        title="Your rollout could be the next story here"
        body="Tell us what you are implementing and we will match you with a vetted expert who has shipped it before."
        primary={{ label: 'Find an expert', href: '/for-businesses' }}
        secondary={{ label: 'Browse the network', href: '/experts' }}
      />
    </>
  )
}
