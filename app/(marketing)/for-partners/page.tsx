import type { Metadata } from 'next'
import { BadgeCheck, Boxes, Handshake, Megaphone, Search, TrendingUp } from 'lucide-react'
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
  title: 'Partner with Proploy · Proploy',
  description:
    'List your software in the Proploy partner directory and connect customers with vetted implementation experts. Get your product deployed right, co-market with us, and earn on every referral.',
}

/* --------------------------------------------------------------- snippets */

function PartnerDirectoryMock() {
  const partners: Array<{
    name: string
    category: string
    experts: string
    tint: string
    ink: string
    featured?: boolean
  }> = [
    { name: 'Salesforce', category: 'CRM', experts: '48 experts', tint: '#eff4ff', ink: '#155eef', featured: true },
    { name: 'NetSuite', category: 'ERP', experts: '31 experts', tint: '#f5f3ff', ink: '#6938ef' },
    { name: 'HubSpot', category: 'Marketing', experts: '37 experts', tint: '#fff4ed', ink: '#e04f16' },
    { name: 'Snowflake', category: 'Data', experts: '22 experts', tint: '#effbf9', ink: '#0e9384' },
    { name: 'Okta', category: 'Security', experts: '18 experts', tint: '#fef3f2', ink: '#d92d20' },
    { name: 'Workday', category: 'HRIS', experts: '14 experts', tint: '#fdf2fa', ink: '#dd2590' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <div className="flex items-center gap-[8px] min-w-0">
          <Boxes size={18} className="text-[#155eef] shrink-0" />
          <span className="font-semibold text-[15px] leading-[22px] text-[#181d27] truncate">
            Partner directory
          </span>
        </div>
        <span className="flex items-center gap-[8px] rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[10px] py-[6px] text-[13px] leading-[18px] text-[#717680]">
          <Search size={14} /> Search 200+ tools
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] p-[16px]">
        {partners.map((p) => (
          <div
            key={p.name}
            className={`flex items-center gap-[12px] rounded-[10px] border p-[14px] ${
              p.featured ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb] bg-white'
            }`}
          >
            <span
              className="size-[40px] shrink-0 rounded-[10px] flex items-center justify-center font-semibold text-[16px] leading-none"
              style={{ background: p.tint, color: p.ink }}
            >
              {p.name[0]}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="flex items-center gap-[6px]">
                <span className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{p.name}</span>
                <BadgeCheck size={15} className="text-[#155eef] shrink-0" />
              </span>
              <span className="text-[13px] leading-[18px] text-[#717680]">
                {p.category} · {p.experts}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoMarketingMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[18px]">
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px]">
          <span className="size-[40px] rounded-[10px] bg-[#eff4ff] flex items-center justify-center">
            <Megaphone size={20} className="text-[#155eef]" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Featured listing</p>
            <p className="text-[13px] leading-[18px] text-[#535862]">NetSuite implementation hub</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
          <span className="size-[6px] rounded-full bg-[#17b26a]" /> Live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-[10px]">
        {[
          ['Profile views', '4,210', '30d'],
          ['Expert intros', '86', '30d'],
          ['Sourced ARR', '$1.2M', 'pipeline'],
        ].map(([label, value, sub]) => (
          <div key={label} className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[12px]">
            <p className="text-[12px] leading-[18px] text-[#717680]">{label}</p>
            <p className="mt-[2px] font-semibold text-[18px] leading-[26px] text-[#181d27]">{value}</p>
            <p className="text-[12px] leading-[18px] text-[#717680]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[10px] border border-[#e9eaeb] p-[14px] flex flex-col gap-[10px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Co-marketing kit</p>
        {[
          ['Joint launch webinar — Q3 rollout playbook', 'Scheduled'],
          ['Co-branded implementation guide', 'Published'],
          ['Directory spotlight placement', 'Active'],
        ].map(([label, status]) => (
          <div key={label} className="flex items-center justify-between gap-[12px]">
            <span className="text-[14px] leading-[20px] text-[#252b37] min-w-0 truncate">{label}</span>
            <span className="shrink-0 rounded-full bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-medium leading-[18px] text-[#155eef]">
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReferralMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-col gap-[16px]">
      <div className="flex items-center justify-between gap-[12px]">
        <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">Referrals this quarter</p>
        <span className="flex items-center gap-[6px] text-[13px] leading-[18px] text-[#067647]">
          <TrendingUp size={15} /> +18%
        </span>
      </div>

      <div className="rounded-[12px] bg-[#155eef] p-[18px] text-white">
        <p className="text-[13px] leading-[18px] text-[#d1e0ff]">Referral payouts earned</p>
        <p className="mt-[2px] font-semibold text-[32px] leading-[40px] tracking-[-0.6px]">$38,400</p>
        <p className="mt-[6px] text-[13px] leading-[18px] text-[#d1e0ff]">Across 12 closed implementations</p>
      </div>

      <div className="rounded-[10px] border border-[#e9eaeb] overflow-hidden">
        {[
          ['Meridian Health', 'Workday HRIS migration', '$6,200'],
          ['Atlas Freight', 'NetSuite ERP rollout', '$9,800'],
          ['Bluewave SaaS', 'Snowflake data warehouse', '$4,500'],
        ].map(([client, project, payout], i) => (
          <div
            key={client}
            className={`flex items-center justify-between gap-[12px] px-[14px] py-[12px] ${
              i > 0 ? 'border-t border-[#e9eaeb]' : ''
            }`}
          >
            <span className="flex flex-col min-w-0">
              <span className="text-[14px] font-medium leading-[20px] text-[#252b37] truncate">{client}</span>
              <span className="text-[13px] leading-[18px] text-[#717680] truncate">{project}</span>
            </span>
            <span className="shrink-0 text-[14px] font-semibold leading-[20px] text-[#181d27]">{payout}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function ForPartnersPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For partners"
        title="Partner with Proploy to grow your software ecosystem"
        subtitle="List your product in the Proploy directory and put a network of vetted implementation experts behind every deployment. Customers get rollouts that stick — you get adoption, references, and revenue."
        primary={{ label: 'Become a partner', href: '/contact' }}
        secondary={{ label: 'Browse the directory', href: '/discover-experts' }}
      >
        <div className="mx-auto max-w-[760px]">
          <UISnippetFrame title="proploy.com/directory">
            <PartnerDirectoryMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee
        label="Software vendors and integration partners building on Proploy"
        logos={['Salesforce', 'NetSuite', 'HubSpot', 'Snowflake', 'Okta', 'Workday', 'Segment']}
      />

      <ThreeUpCards
        eyebrow="Why partner with us"
        heading="Turn implementation from a bottleneck into a growth channel"
        body="Most churn after a software sale traces back to a botched rollout. Proploy connects your customers with experts who deploy your product the way it was meant to be used — so adoption holds and renewals follow."
        cards={[
          {
            icon: <BadgeCheck size={24} className="text-white" />,
            title: 'Vetted experts, not a lead list',
            body: 'Every expert in your category is reference-checked and rated on real implementations — Salesforce admins, NetSuite consultants, data engineers — so your customers land with someone who has shipped your product before.',
          },
          {
            icon: <Megaphone size={24} className="text-white" />,
            title: 'Co-marketing that drives pipeline',
            body: 'Featured directory placement, joint launch content, and co-branded implementation guides put your product in front of buyers who are actively scoping a rollout.',
          },
          {
            icon: <Handshake size={24} className="text-white" />,
            title: 'Referrals both ways',
            body: 'Send customers who need help to a trusted expert, and earn on engagements your product sources. The flow works in both directions, tracked end to end.',
          },
        ]}
      />

      <StackedFeatureBlock
        eyebrow="Directory"
        title="A storefront where buyers find experts for your product"
        body="Claim a partner profile and your tool sits alongside the experts certified to deploy it. When a business searches for a Salesforce migration or a NetSuite rollout, your ecosystem is the answer they find."
        bullets={[
          'Verified profile with category, integrations, and expert count',
          'Filter by product, region, and implementation specialty',
          'Direct intros to experts who have shipped your software',
        ]}
        link={{ label: 'See the directory', href: '/discover-experts' }}
        visual={
          <UISnippetFrame chrome={false}>
            <PartnerDirectoryMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Co-marketing"
        title="Launch together and measure what it sources"
        body="Run joint webinars, ship co-branded rollout playbooks, and take featured placement in the categories you care about — then watch the profile views, expert intros, and sourced pipeline in one view."
        bullets={[
          'Featured listings and category spotlights',
          'Co-branded launch content and implementation guides',
          'Attribution from profile view to sourced ARR',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <CoMarketingMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Referrals"
        title="Earn on every implementation your product sends our way"
        body="When you refer a customer who needs hands-on help, Proploy matches them with a vetted expert and pays you on the engagement. Track referrals, closed projects, and payouts without spreadsheets."
        bullets={[
          'Tracked referral links for your sales and CS teams',
          'Payouts on closed implementations, not just intros',
          'A clear ledger of clients, projects, and earnings',
        ]}
        link={{ label: 'Talk to partnerships', href: '/contact' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ReferralMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          {
            value: '200+',
            label: 'Tools in the directory',
            sub: 'CRM, ERP, data, security, and analytics products with dedicated expert pools.',
          },
          {
            value: '3.4x',
            label: 'Higher 12-month retention',
            sub: 'Customers who deploy with a vetted expert versus self-serve rollouts.',
          },
          {
            value: '14 days',
            label: 'Median time to first expert intro',
            sub: 'From claimed profile to a matched implementation lead.',
          },
        ]}
      />

      <TestimonialWall
        heading="What partners say about building with Proploy"
        testimonials={[
          {
            quote:
              'Our self-serve customers were churning at renewal because nobody owned the rollout. Routing them to vetted experts on Proploy turned implementation from our biggest risk into a retention lever.',
            name: 'Lena Ortiz',
            role: 'VP Partnerships, ERP platform',
            color: '#155eef',
          },
          {
            quote:
              'The featured directory placement paid for itself in a quarter. Buyers scoping a data warehouse migration find our listing and the experts certified on it in the same search.',
            name: 'Devin Park',
            role: 'Head of Ecosystem, analytics vendor',
            color: '#0e9384',
          },
          {
            quote:
              'Referrals used to live in a spreadsheet nobody trusted. Now our CS team drops a tracked link and we actually get paid when the implementation closes.',
            name: 'Aisha Khan',
            role: 'Director of Channel, security tooling',
            color: '#dd2590',
          },
          {
            quote:
              'We vetted the experts ourselves before we believed it. Every one had shipped our product in production — that is the bar that makes us comfortable sending customers their way.',
            name: 'Tomas Reuter',
            role: 'Partner Manager, CRM platform',
            color: '#6938ef',
          },
        ]}
      />

      <FAQAccordion
        heading="Partner program questions"
        faqs={[
          {
            q: 'Who should join the Proploy partner program?',
            a: 'Software vendors and integration partners whose products need real implementation work — CRM, ERP, data, analytics, security, and HRIS platforms — where a strong rollout drives adoption and retention.',
          },
          {
            q: 'How are the experts behind my product vetted?',
            a: 'Every expert is reference-checked and rated on completed implementations. Experts in your category have shipped your product in production before, and you can review their profiles and track records before any customer intro.',
          },
          {
            q: 'How does the referral program pay out?',
            a: 'You get tracked referral links for your sales and CS teams. When a referred customer closes an implementation with a Proploy expert, you earn a payout on the engagement — visible in a clear ledger of clients, projects, and earnings.',
          },
          {
            q: 'What does co-marketing actually include?',
            a: 'Featured directory listings, category spotlight placement, joint launch webinars, and co-branded implementation guides — each with attribution from profile views through to sourced pipeline so you can see what it returns.',
          },
          {
            q: 'How long does it take to get listed?',
            a: 'Most partners go from a claimed profile to their first matched expert intro within about two weeks. Our partnerships team helps set up your listing, category, and co-marketing plan.',
          },
        ]}
        contact={{ label: 'Talk to partnerships', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Put a vetted expert behind every deployment"
        body="List your product, co-market with Proploy, and earn on the implementations your ecosystem sources."
        primary={{ label: 'Become a partner', href: '/contact' }}
        secondary={{ label: 'Browse the directory', href: '/discover-experts' }}
      />
    </>
  )
}
