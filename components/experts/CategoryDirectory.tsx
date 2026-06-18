import Link from 'next/link'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import { Container, CTABanner, SectionHeading, btnPrimary, btnSecondary } from '@/components/marketing'

/**
 * Hire-by-category directory. Rendered at /experts/<category> via the experts/[id]
 * route, which dispatches to this when the slug is a known category. Pure presentational
 * (no data fetch) — the host route supplies page chrome + Footer.
 */

export interface Category {
  title: string
  blurb: string
  skills: string[]
}

export const CATEGORIES: Record<string, Category> = {
  top: {
    title: 'Top implementation experts',
    blurb:
      'The highest-rated, most-requested specialists on Proploy — vetted leads who have shipped enterprise rollouts end to end.',
    skills: ['Salesforce', 'NetSuite', 'Workday', 'SAP', 'Snowflake', 'HubSpot', 'Databricks'],
  },
  engineering: {
    title: 'Engineering & integration experts',
    blurb:
      'Hands-on engineers who connect, migrate, and harden the systems your business runs on — from API plumbing to data pipelines.',
    skills: ['API integration', 'Data migration', 'iPaaS', 'DevOps', 'Webhooks', 'SSO / SAML', 'ETL'],
  },
  'data-ai': {
    title: 'Data & AI experts',
    blurb:
      'Warehouse architects, analytics engineers, and ML practitioners who turn scattered data into governed, decision-ready systems.',
    skills: ['Snowflake', 'dbt', 'Databricks', 'BigQuery', 'LLM apps', 'MLOps', 'Looker'],
  },
  product: {
    title: 'Product & platform experts',
    blurb:
      'Configuration leads who tailor platforms to your workflows — building the objects, automations, and permissions your team actually uses.',
    skills: ['Salesforce admin', 'ServiceNow', 'Jira', 'Monday.com', 'Airtable', 'Notion', 'Zendesk'],
  },
  marketing: {
    title: 'Marketing operations experts',
    blurb:
      'RevOps and martech specialists who wire your campaigns, attribution, and lifecycle automation into one connected stack.',
    skills: ['HubSpot', 'Marketo', 'Segment', 'GA4', 'Braze', 'Customer.io', 'Attribution'],
  },
  'finance-ops': {
    title: 'Finance & operations experts',
    blurb:
      'ERP and back-office implementers who stand up clean financials, close processes, and reporting your auditors will sign off on.',
    skills: ['NetSuite', 'SAP', 'Workday', 'Oracle ERP', 'QuickBooks', 'Procurement', 'FP&A tooling'],
  },
  consulting: {
    title: 'Consulting firms',
    blurb:
      'Vetted boutique and mid-market firms that staff full delivery teams — program management, change management, and the engineers to ship.',
    skills: ['Program delivery', 'Change management', 'Discovery', 'Staff augmentation', 'PMO', 'Training', 'Audits'],
  },
}

export const CATEGORY_SLUGS = Object.keys(CATEGORIES)

interface MockExpert {
  initial: string
  name: string
  headline: string
  location: string
  years: number
  skills: [string, string, string]
  rating: number
  reviews: number
}

function buildExperts(category: Category): MockExpert[] {
  const [s0, s1, s2, s3, s4, s5, s6] = category.skills
  const k = (a: string, b: string, c: string): [string, string, string] => [a, b, c]
  return [
    { initial: 'A', name: 'Amara Okafor', headline: `Lead ${s0} architect for mid-market rollouts`, location: 'Austin, TX', years: 11, skills: k(s0, s1, s2), rating: 4.9, reviews: 38 },
    { initial: 'D', name: 'Daniel Reyes', headline: `${s1} implementation specialist, 40+ go-lives`, location: 'Madrid, Spain', years: 9, skills: k(s1, s3, s0), rating: 4.8, reviews: 27 },
    { initial: 'M', name: 'Mei Lin Chen', headline: `Senior consultant focused on ${s2} delivery`, location: 'Singapore', years: 13, skills: k(s2, s4, s1), rating: 5.0, reviews: 44 },
    { initial: 'J', name: 'Jonas Bergström', headline: `${s3} migration lead for regulated industries`, location: 'Stockholm, Sweden', years: 14, skills: k(s3, s0, s5), rating: 4.9, reviews: 31 },
    { initial: 'P', name: 'Priya Nair', headline: `Hands-on ${s4} engineer and program advisor`, location: 'Bengaluru, India', years: 8, skills: k(s4, s2, s6), rating: 4.7, reviews: 22 },
    { initial: 'T', name: 'Tomás Ferreira', headline: `Fractional ${s0} lead for scaling teams`, location: 'Lisbon, Portugal', years: 10, skills: k(s0, s5, s1), rating: 4.8, reviews: 19 },
    { initial: 'S', name: 'Sofia Romano', headline: `${s5} delivery manager and solution architect`, location: 'Toronto, Canada', years: 12, skills: k(s5, s1, s3), rating: 4.9, reviews: 35 },
    { initial: 'K', name: 'Kwame Asante', headline: `${s6} specialist for high-growth operations`, location: 'London, UK', years: 7, skills: k(s6, s4, s2), rating: 4.7, reviews: 16 },
    { initial: 'E', name: 'Elena Volkova', headline: `Principal consultant across ${s0} and ${s2}`, location: 'Berlin, Germany', years: 15, skills: k(s0, s2, s6), rating: 5.0, reviews: 52 },
  ]
}

function ExpertCard({ expert }: { expert: MockExpert }) {
  return (
    <div className="bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] hover:shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)] transition-shadow">
      <div className="flex items-start gap-[16px]">
        <div className="size-[48px] rounded-full bg-[#155eef] flex items-center justify-center shrink-0">
          <span className="font-semibold text-[20px] text-white">{expert.initial}</span>
        </div>
        <div className="flex flex-col gap-[4px] min-w-0">
          <h3 className="font-semibold text-[18px] leading-[28px] text-[#181d27] truncate">{expert.name}</h3>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862] line-clamp-2" style={{ fontVariationSettings: "'opsz' 14" }}>
            {expert.headline}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[16px] flex-wrap">
        <div className="flex items-center gap-[4px]">
          <MapPin size={16} className="text-[#717680] shrink-0" />
          <span className="font-normal text-[14px] leading-[20px] text-[#535862]" style={{ fontVariationSettings: "'opsz' 14" }}>
            {expert.location}
          </span>
        </div>
        <span className="font-normal text-[14px] leading-[20px] text-[#535862]" style={{ fontVariationSettings: "'opsz' 14" }}>
          {expert.years} yrs exp
        </span>
        <div className="flex items-center gap-[4px]">
          <Star size={16} className="text-[#f79009] fill-[#f79009] shrink-0" />
          <span className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{expert.rating.toFixed(1)}</span>
          <span className="font-normal text-[14px] leading-[20px] text-[#717680]" style={{ fontVariationSettings: "'opsz' 14" }}>
            ({expert.reviews})
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-[8px]">
        {expert.skills.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center bg-[#eff8ff] border border-[#b2ddff] rounded-full px-[10px] py-[2px] font-medium text-[14px] leading-[20px] text-[#175cd3]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <Link href="/experts" className="flex items-center gap-[4px] mt-auto">
        <span className="font-semibold text-[14px] leading-[20px] text-[#004eeb]">View profile</span>
        <ArrowRight size={20} className="text-[#004eeb]" />
      </Link>
    </div>
  )
}

export function CategoryDirectory({ slug }: { slug: string }) {
  const data = CATEGORIES[slug]
  if (!data) return null
  const experts = buildExperts(data)

  return (
    <>
      <section className="pt-[72px] pb-[48px]">
        <Container>
          <div className="flex flex-col gap-[24px] max-w-[768px]">
            <SectionHeading title={data.title} body={data.blurb} />
            <div className="flex flex-wrap gap-[12px]">
              <Link href="/experts" className={btnPrimary}>
                Browse all experts
              </Link>
              <Link href="/become-expert" className={btnSecondary}>
                Join as an expert
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-[40px]">
        <Container>
          <div className="flex flex-wrap items-center gap-[10px] border-t border-[#e9eaeb] pt-[32px]">
            <span className="font-medium text-[14px] leading-[20px] text-[#717680] mr-[4px]" style={{ fontVariationSettings: "'opsz' 14" }}>
              Filter by skill
            </span>
            <span className="inline-flex items-center rounded-full bg-[#155eef] px-[14px] py-[6px] font-medium text-[14px] leading-[20px] text-white">
              All
            </span>
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full border border-[#d5d7da] bg-white px-[14px] py-[6px] font-medium text-[14px] leading-[20px] text-[#414651]"
              >
                {skill}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-[80px]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {experts.map((expert) => (
              <ExpertCard key={expert.name} expert={expert} />
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title={`Hire a vetted ${data.title.replace(/ experts?$/i, '').replace(/ firms$/i, '').toLowerCase()} expert this week`}
        body="Post your project once and get matched with specialists who have already shipped what you need."
        primary={{ label: 'Browse all experts', href: '/experts' }}
        secondary={{ label: 'Post a project', href: '/post-a-job' }}
      />
    </>
  )
}
