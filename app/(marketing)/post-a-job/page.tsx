import type { Metadata } from 'next'
import {
  ArrowRight,
  ClipboardList,
  GitCompareArrows,
  ShieldCheck,
  Star,
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
  title: 'Post a job · Proploy',
  description:
    'Post a software-implementation job and meet vetted experts in days. Describe the scope once, receive only screened applicants, then shortlist and compare on match, rate, and track record.',
}

/* --------------------------------------------------------------- snippets */

function PostJobMock() {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[16px]">
        <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Post a job</h3>
        <span className="text-[13px] leading-[18px] text-[#717680]">Draft · saved</span>
      </div>
      <div className="flex flex-col gap-[16px] px-[24px] py-[20px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium leading-[18px] text-[#414651]">Role title</label>
          <div className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27]">
            NetSuite implementation lead
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium leading-[18px] text-[#414651]">Software / category</label>
            <div className="flex items-center justify-between rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px]">
              <span className="text-[14px] leading-[20px] text-[#181d27]">NetSuite ERP</span>
              <span className="text-[#717680] text-[12px]">▾</span>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium leading-[18px] text-[#414651]">Timeline</label>
            <div className="flex items-center justify-between rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px]">
              <span className="text-[14px] leading-[20px] text-[#181d27]">10–14 weeks</span>
              <span className="text-[#717680] text-[12px]">▾</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium leading-[18px] text-[#414651]">Scope</label>
          <div className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#535862]">
            Migrate finance and inventory from QuickBooks, configure approval
            workflows, and train a 12-person ops team before quarter close.
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium leading-[18px] text-[#414651]">Budget</label>
          <div className="flex items-center gap-[10px]">
            <div className="flex-1 rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27]">
              $40,000 – $60,000
            </div>
            <span className="rounded-full bg-[#eff4ff] px-[10px] py-[6px] text-[12px] font-medium leading-[18px] text-[#155eef]">
              Fixed bid
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#e9eaeb] pt-[16px]">
          <span className="text-[13px] leading-[18px] text-[#717680]">Visible to vetted experts only</span>
          <span className="inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white">
            Post job <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </div>
  )
}

function ApplicantListMock() {
  const applicants = [
    {
      initials: 'PR',
      name: 'Priya Raman',
      title: 'NetSuite ERP consultant · 9 yrs',
      match: 96,
      rating: '5.0',
      reviews: 31,
      color: '#155eef',
      top: true,
    },
    {
      initials: 'DK',
      name: 'Devlin & Klein',
      title: 'ERP implementation firm · 14 experts',
      match: 91,
      rating: '4.9',
      reviews: 48,
      color: '#079455',
      top: false,
    },
    {
      initials: 'MA',
      name: 'Marcus Aoki',
      title: 'Finance systems lead · 7 yrs',
      match: 88,
      rating: '4.8',
      reviews: 22,
      color: '#dd2590',
      top: false,
    },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] leading-[22px] text-[#181d27]">NetSuite implementation lead</h3>
          <p className="text-[13px] leading-[18px] text-[#717680]">12 applicants · sorted by match</p>
        </div>
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
          <span className="size-[6px] rounded-full bg-[#155eef]" /> Open
        </span>
      </div>
      <div className="flex flex-col">
        {applicants.map((a, i) => (
          <div
            key={a.name}
            className={`flex items-center gap-[14px] px-[20px] py-[16px] ${i > 0 ? 'border-t border-[#e9eaeb]' : ''}`}
          >
            <span
              className="flex size-[40px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
              style={{ backgroundColor: a.color }}
            >
              {a.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[8px]">
                <span className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{a.name}</span>
                {a.top && (
                  <span className="shrink-0 rounded-full bg-[#ecfdf3] px-[8px] py-[2px] text-[11px] font-medium leading-[16px] text-[#067647]">
                    Top match
                  </span>
                )}
              </div>
              <p className="truncate text-[13px] leading-[18px] text-[#535862]">{a.title}</p>
              <span className="mt-[4px] inline-flex items-center gap-[5px] text-[12px] leading-[16px] text-[#717680]">
                <Star size={13} className="fill-[#f79009] text-[#f79009]" />
                {a.rating} · {a.reviews} reviews
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-[6px]">
              <span className="text-[15px] font-semibold leading-[22px] text-[#155eef]">{a.match}%</span>
              <div className="h-[6px] w-[64px] overflow-hidden rounded-full bg-[#eff4ff]">
                <div className="h-full rounded-full bg-[#155eef]" style={{ width: `${a.match}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShortlistCompareMock() {
  const candidates = [
    {
      initials: 'PR',
      name: 'Priya Raman',
      color: '#155eef',
      match: '96%',
      rate: '$48,000',
      timeline: '11 wks',
      rating: '5.0',
    },
    {
      initials: 'DK',
      name: 'Devlin & Klein',
      color: '#079455',
      match: '91%',
      rate: '$56,000',
      timeline: '10 wks',
      rating: '4.9',
    },
  ]
  const rows: { label: string; key: 'match' | 'rate' | 'timeline' | 'rating' }[] = [
    { label: 'Match', key: 'match' },
    { label: 'Bid', key: 'rate' },
    { label: 'Timeline', key: 'timeline' },
    { label: 'Rating', key: 'rating' },
  ]
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white">
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[14px]">
        <h3 className="font-semibold text-[15px] leading-[22px] text-[#181d27]">Compare shortlist</h3>
        <span className="text-[13px] leading-[18px] text-[#717680]">2 of 4 selected</span>
      </div>
      <div className="grid grid-cols-[120px_1fr_1fr]">
        <div className="border-b border-[#e9eaeb] px-[16px] py-[14px]" />
        {candidates.map((c) => (
          <div key={c.name} className="flex flex-col items-center gap-[8px] border-b border-l border-[#e9eaeb] px-[12px] py-[14px] text-center">
            <span
              className="flex size-[36px] items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ backgroundColor: c.color }}
            >
              {c.initials}
            </span>
            <span className="text-[13px] font-semibold leading-[18px] text-[#181d27]">{c.name}</span>
          </div>
        ))}
        {rows.map((row, ri) => (
          <div key={row.key} className="contents">
            <div
              className={`px-[16px] py-[12px] text-[13px] font-medium leading-[18px] text-[#717680] ${ri < rows.length - 1 ? 'border-b border-[#e9eaeb]' : ''}`}
            >
              {row.label}
            </div>
            {candidates.map((c) => (
              <div
                key={c.name + row.key}
                className={`border-l border-[#e9eaeb] px-[12px] py-[12px] text-center text-[14px] leading-[20px] text-[#181d27] ${ri < rows.length - 1 ? 'border-b' : ''}`}
              >
                {row.key === 'match' ? (
                  <span className="font-semibold text-[#155eef]">{c[row.key]}</span>
                ) : (
                  c[row.key]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-[12px] border-t border-[#e9eaeb] px-[20px] py-[14px]">
        <span className="text-[13px] leading-[18px] text-[#717680]">Invite to interview</span>
        <span className="inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[9px] text-[13px] font-semibold leading-[18px] text-white">
          Message Priya <ArrowRight size={15} />
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function PostAJobPage() {
  return (
    <>
      <MarketingHero
        eyebrow="For businesses"
        title="Post a job and meet vetted experts in days."
        subtitle="Describe your software rollout once. Receive applications only from screened implementation experts and firms — then shortlist and compare without sifting through cold outreach."
        primary={{ label: 'Post a job', href: '/contact' }}
        secondary={{ label: 'See how it works', href: '#how' }}
      >
        <div className="mx-auto max-w-[680px]">
          <UISnippetFrame title="proploy.com/jobs/new">
            <PostJobMock />
          </UISnippetFrame>
        </div>
      </MarketingHero>

      <LogoMarquee logos={['Northwind', 'Brightside', 'Cedar & Co', 'Layers', 'Sisyphus', 'Capsule', 'Quotient']} />

      <ThreeUpCards
        heading="Hire on signal, not guesswork"
        body="One job post reaches the right experts, screens out the noise, and gives you a clean way to choose."
        cards={[
          {
            icon: <ClipboardList size={24} className="text-white" />,
            title: 'Write it once',
            body: 'Set role, software, scope, budget, and timeline in a single form. Your post is structured so experts answer the questions that actually decide the engagement.',
          },
          {
            icon: <ShieldCheck size={24} className="text-white" />,
            title: 'Only vetted applicants',
            body: 'Every expert and firm is reference-checked and reviewed before they can apply. No cold agencies, no unproven generalists in your inbox.',
          },
          {
            icon: <GitCompareArrows size={24} className="text-white" />,
            title: 'Shortlist and compare',
            body: 'Stack applicants side by side on match, bid, timeline, and track record — then move your top picks straight to a conversation.',
          },
        ]}
      />

      <div id="how" />
      <StackedFeatureBlock
        eyebrow="Applicants"
        title="See who fits before you read a single proposal"
        body="Applications land ranked by how closely each expert maps to your software, scope, and budget — with ratings and verified review counts in view from the first glance."
        bullets={[
          'Match score from software, scope, and budget signals',
          'Verified ratings and review counts on every applicant',
          'Individual experts and implementation firms, side by side',
        ]}
        link={{ label: 'Post a job', href: '/contact' }}
        visual={
          <UISnippetFrame chrome={false}>
            <ApplicantListMock />
          </UISnippetFrame>
        }
      />

      <StackedFeatureBlock
        eyebrow="Shortlist"
        title="Compare your top picks on what matters"
        body="Pull your best applicants into one view and weigh match, bid, timeline, and rating against each other — then open a conversation with the right one in a click."
        bullets={[
          'Line up candidates on match, bid, and timeline',
          'Keep a short shortlist instead of an endless thread',
          'Message and move to interview without leaving the page',
        ]}
        imagePosition="left"
        tint
        visual={
          <UISnippetFrame chrome={false}>
            <ShortlistCompareMock />
          </UISnippetFrame>
        }
      />

      <MetricStat
        metrics={[
          { value: '3 days', label: 'Median time to a shortlist', sub: 'From posting a job to comparing qualified applicants.' },
          { value: '100%', label: 'Applicants pre-vetted', sub: 'Reference-checked and reviewed before they can apply.' },
          { value: '8', label: 'Avg. qualified applicants', sub: 'Per implementation role, not hundreds of cold pitches.' },
        ]}
      />

      <TestimonialWall
        heading="Hiring teams move faster on Proploy"
        testimonials={[
          {
            quote:
              'I posted our NetSuite migration on a Monday and had four serious, vetted firms to compare by Thursday. No agency cold calls, no guesswork.',
            name: 'Dana Okafor',
            role: 'VP Operations, Northwind Logistics',
            color: '#155eef',
          },
          {
            quote:
              'The match scores were the difference. I could tell at a glance who actually understood our stack instead of reading twenty near-identical proposals.',
            name: 'Liam Carter',
            role: 'Head of RevOps, Brightside',
            color: '#079455',
          },
          {
            quote:
              'Comparing the shortlist side by side made the decision obvious. We picked our implementation partner in one meeting.',
            name: 'Sofia Mendez',
            role: 'Director of IT, Cedar & Co',
            color: '#dd2590',
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          {
            q: 'How long does it take to receive applicants?',
            a: 'Most jobs draw their first vetted applicants within a day and a comparable shortlist within three. Niche software or tight timelines can take a little longer, and our team can help surface fits.',
          },
          {
            q: 'What does "vetted" actually mean?',
            a: 'Every expert and firm passes reference checks and a review of their implementation track record before they can apply. You only ever see applicants who have cleared that screen.',
          },
          {
            q: 'How is the match score calculated?',
            a: 'It weighs how closely an applicant maps to your post — the specific software, the scope of work, your budget range, and their verified history with similar implementations.',
          },
          {
            q: 'Can I hire an individual expert and a firm for the same job?',
            a: 'Yes. Both individual experts and implementation firms apply to the same post, and you can compare them side by side on match, bid, timeline, and rating.',
          },
          {
            q: 'What does it cost to post a job?',
            a: 'Posting a job and reviewing applicants is free. You only pay once you hire and work begins, with terms agreed in the contract you sign on Proploy.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Post your software job and meet experts this week"
        body="Describe the rollout once and start comparing vetted applicants in days."
        primary={{ label: 'Post a job', href: '/contact' }}
        secondary={{ label: 'Explore the platform', href: '/for-businesses' }}
      />
    </>
  )
}
