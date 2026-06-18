import type { Metadata } from 'next'
import { BadgeCheck, Boxes, Building2, Plug, TrendingUp } from 'lucide-react'
import {
  CTABanner,
  FAQAccordion,
  MetricStat,
  MarketingHero,
  StackedFeatureBlock,
  ThreeUpCards,
  UISnippetFrame,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Partnership program · Proploy',
  description:
    'Partner with Proploy to reach businesses ready to implement software. A program for software vendors, agencies, and technology partners — co-sell, refer, and grow with a vetted delivery network.',
}

/* --------------------------------------------------------------- snippets */

function PartnerDirectoryMock() {
  const partners = [
    { name: 'Helix Data Group', tag: 'Snowflake · ETL', region: 'North America', badge: 'Premier' },
    { name: 'Northwind Cloud', tag: 'NetSuite ERP', region: 'EMEA', badge: 'Certified' },
    { name: 'Vector Studio', tag: 'HubSpot · RevOps', region: 'North America', badge: 'Certified' },
    { name: 'Cedar & Co', tag: 'Salesforce CPQ', region: 'APAC', badge: 'Certified' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Partner directory</p>
        <span className="rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          412 listed
        </span>
      </div>
      <div className="flex flex-col">
        {partners.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center gap-[12px] px-[20px] py-[14px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[13px] font-semibold text-[#155eef]">
              {p.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                {p.name}
              </span>
              <span className="block truncate text-[13px] leading-[18px] text-[#717680]">
                {p.tag} · {p.region}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full border border-[#e9eaeb] bg-[#fafafa] px-[9px] py-[3px] text-[12px] font-medium leading-[18px] text-[#414651]">
              <BadgeCheck size={13} className="text-[#155eef]" />
              {p.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReferralDashboardMock() {
  const deals = [
    ['Acme Manufacturing', 'Won', '$8,400', '#067647', '#f6fef9', '#a9efc5'],
    ['Brightside Health', 'In delivery', '$5,250', '#155eef', '#eff4ff', '#b2ccff'],
    ['Quotient Labs', 'Qualifying', '$0', '#717680', '#fafafa', '#e9eaeb'],
  ] as const
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-end justify-between gap-[12px]">
        <div>
          <p className="text-[13px] leading-[18px] text-[#717680]">Referral earnings · YTD</p>
          <p className="mt-[2px] font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.4px]">
            $13,650
          </p>
        </div>
        <span className="inline-flex items-center gap-[5px] rounded-full bg-[#f6fef9] px-[10px] py-[4px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <TrendingUp size={14} /> +22% QoQ
        </span>
      </div>
      <div className="mt-[18px] overflow-hidden rounded-[10px] border border-[#e9eaeb]">
        {deals.map(([name, status, amt, fg, bg, br], i) => (
          <div
            key={name}
            className={`flex items-center justify-between gap-[12px] px-[14px] py-[12px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span className="min-w-0 truncate text-[14px] font-medium leading-[20px] text-[#252b37]">{name}</span>
            <span className="flex shrink-0 items-center gap-[12px]">
              <span
                className="rounded-full border px-[9px] py-[2px] text-[12px] font-medium leading-[18px]"
                style={{ color: fg, backgroundColor: bg, borderColor: br }}
              >
                {status}
              </span>
              <span className="w-[64px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">
                {amt}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function PartnershipsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Partnership program"
        title="Grow your software business on a vetted delivery network."
        subtitle="Partner with Proploy to reach businesses actively scoping implementations — co-sell with vetted experts, refer customers to certified delivery partners, and put your product in front of the firms that roll it out."
        primary={{ label: 'Apply to partner', href: '/contact' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/partners/directory">
            <PartnerDirectoryMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <ThreeUpCards
        heading="One program, three ways to partner"
        body="Whether you build the software, deliver it, or connect the systems around it, there's a defined track with shared pipeline, co-marketing, and revenue."
        cards={[
          {
            icon: <Boxes size={24} className="text-white" />,
            title: 'Software vendors',
            body: 'List your product and route implementation demand to certified delivery partners. Customers reach value faster, and your services pipeline stops being a bottleneck to closing.',
          },
          {
            icon: <Building2 size={24} className="text-white" />,
            title: 'Agencies & consultancies',
            body: 'Get matched with businesses already qualified and ready to start. Earn certified placement in the directory and a steady stream of scoped engagements that fit your practice.',
          },
          {
            icon: <Plug size={24} className="text-white" />,
            title: 'Technology & integration partners',
            body: 'iPaaS, data, and middleware teams plug into live projects where integration work is already in scope — and get referred the moment a build needs your stack.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Get listed"
        title="Earn a certified place in the partner directory"
        body="Businesses browse the directory the way buyers vet vendors — by stack, region, and proof of delivery. Certification puts your team in front of demand you didn't have to source."
        bullets={[
          'Profiles ranked by verified delivery history, not ad spend',
          'Tier badges (Certified, Premier) that signal vetting at a glance',
          'Filterable by platform, industry, region, and engagement size',
        ]}
        link={{ label: 'View certification tracks', href: '/contact' }}
        visual={
          <UISnippetFrame chrome={false}>
            <PartnerDirectoryMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Refer & co-sell"
        title="Track every referral from intro to paid"
        body="Send a customer to a delivery partner, or accept inbound demand, and watch each deal move through qualification, delivery, and payout — with attribution that holds up in a QBR."
        bullets={[
          'Clear referral attribution and a transparent revenue share',
          'Live deal stages from first intro to signed statement of work',
          'Quarterly payouts reconciled against delivered milestones',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <ReferralDashboardMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '412',
            label: 'Active delivery partners',
            sub: 'Vetted agencies and firms across the major implementation platforms.',
          },
          {
            value: '15%',
            label: 'Standard referral share',
            sub: 'Paid on delivered engagements you source into the network.',
          },
          {
            value: '11 days',
            label: 'Median time to first match',
            sub: 'From approved application to your first qualified introduction.',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'Who is the partnership program for?',
            a: 'Three partner types: software vendors who need a delivery network for their product, agencies and consultancies that implement software, and technology or integration partners whose tooling sits alongside those projects. You can join more than one track if it fits your business.',
          },
          {
            q: 'How does Proploy vet delivery partners?',
            a: 'Every agency in the directory is reviewed for verified delivery history, client references, and platform expertise before they receive a Certified badge. Premier tier requires a sustained track record of completed engagements and consistently strong outcomes on the platform.',
          },
          {
            q: 'How does the referral revenue share work?',
            a: 'When you refer a customer that converts into a delivered engagement, you earn a standard 15% share of platform revenue on that work. Attribution is tracked from the first introduction, and payouts are reconciled quarterly against milestones the partner actually delivered.',
          },
          {
            q: 'What does it cost to join?',
            a: 'There is no fee to apply or to be listed in the directory. Partners earn through referral share and the engagements the network sends them — Proploy only makes money when delivered work does.',
          },
          {
            q: 'Can software vendors route their own customers here?',
            a: 'Yes. Vendors commonly use the program to hand implementation demand to certified partners instead of staffing services internally. Your customers reach a vetted delivery team faster, and you keep visibility into how each rollout is progressing.',
          },
          {
            q: 'How long does the application take?',
            a: 'Most applications are reviewed within a week. Once approved, partners are onboarded into the directory and matching engine, with a median of eleven days to a first qualified introduction.',
          },
        ]}
        contact={{ label: 'Talk to partnerships', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Build a bigger software business, together"
        body="Apply to the Proploy partnership program and start receiving qualified implementation demand."
        primary={{ label: 'Apply to partner', href: '/contact' }}
        secondary={{ label: 'Explore the network', href: '/for-businesses' }}
      />
    </>
  )
}
