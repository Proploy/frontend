import type { Metadata } from 'next'
import { Check, Gift, Link2, Send, UserPlus } from 'lucide-react'
import {
  CTABanner,
  Container,
  FAQAccordion,
  MarketingHero,
  SectionHeading,
  ThreeUpCards,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Referral program · Proploy',
  description:
    'Earn when you refer a vetted implementation expert or a business with a software rollout to Proploy. Track every referral and get paid when their first project closes.',
}

/* -------------------------------------------------------------- reward tiers */

interface RewardRow {
  type: string
  detail: string
  qualifies: string
  reward: string
  highlight?: boolean
}

const rewardRows: RewardRow[] = [
  {
    type: 'Refer an expert',
    detail: 'Independent consultant or boutique firm',
    qualifies: 'Passes vetting and signs their first contract',
    reward: '$500',
  },
  {
    type: 'Refer a business',
    detail: 'Team with a live implementation to staff',
    qualifies: 'Kicks off their first paid engagement',
    reward: '5% of first invoice',
    highlight: true,
  },
  {
    type: 'Refer a firm',
    detail: 'Multi-seat agency or consultancy',
    qualifies: 'Onboards 3+ experts to the network',
    reward: '$2,000',
  },
]

function RewardTiers() {
  return (
    <section className="py-[96px] bg-[#fafafa] border-y border-[#e9eaeb]">
      <Container className="flex flex-col gap-[48px]">
        <SectionHeading
          title="One simple reward for every kind of referral"
          body="No tiers to unlock, no caps to hit. You get paid the moment the person you referred starts real work on Proploy."
        />

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white">
          <div className="grid grid-cols-[1.4fr_1.6fr_0.8fr] border-b border-[#e9eaeb] bg-[#fafafa]">
            <div className="px-[24px] py-[16px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
              You refer
            </div>
            <div className="px-[24px] py-[16px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
              Reward unlocks when
            </div>
            <div className="px-[24px] py-[16px] text-right text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
              You earn
            </div>
          </div>
          {rewardRows.map((row, i) => (
            <div
              key={row.type}
              className={`grid grid-cols-[1.4fr_1.6fr_0.8fr] items-center ${
                i > 0 ? 'border-t border-[#e9eaeb]' : ''
              } ${row.highlight ? 'bg-[#f5f8ff]' : ''}`}
            >
              <div className="px-[24px] py-[20px]">
                <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{row.type}</p>
                <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">{row.detail}</p>
              </div>
              <div className="px-[24px] py-[20px] text-[15px] leading-[22px] text-[#535862]">{row.qualifies}</div>
              <div className="px-[24px] py-[20px] text-right">
                <span className="font-semibold text-[20px] leading-[28px] text-[#155eef] tracking-[-0.2px]">
                  {row.reward}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col gap-[16px] md:hidden">
          {rewardRows.map((row) => (
            <div
              key={row.type}
              className={`rounded-[12px] border p-[20px] ${
                row.highlight ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb] bg-white'
              }`}
            >
              <div className="flex items-baseline justify-between gap-[12px]">
                <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{row.type}</p>
                <span className="font-semibold text-[18px] leading-[26px] text-[#155eef]">{row.reward}</span>
              </div>
              <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">{row.detail}</p>
              <p className="mt-[12px] border-t border-[#e9eaeb] pt-[12px] text-[14px] leading-[20px] text-[#535862]">
                Unlocks when {row.qualifies.charAt(0).toLowerCase() + row.qualifies.slice(1)}.
              </p>
            </div>
          ))}
        </div>

        <p className="text-[14px] leading-[20px] text-[#717680]">
          Rewards are paid out 30 days after the referred engagement clears its first milestone, once the
          standard guarantee window has passed.
        </p>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------ referral link mock */

function ReferralLinkBlock() {
  return (
    <section className="py-[96px]">
      <Container className="flex flex-col gap-[48px]">
        <SectionHeading
          align="center"
          className="mx-auto items-center text-center"
          title="Your link is the whole setup"
          body="Every member gets a unique referral link the day they join. Share it anywhere — we attribute the signup automatically and credit it to your account."
        />

        <div className="mx-auto w-full max-w-[640px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
          <div className="flex items-center justify-between gap-[12px]">
            <span className="inline-flex items-center gap-[8px] text-[14px] font-medium leading-[20px] text-[#252b37]">
              <Link2 size={16} className="text-[#155eef]" />
              Your referral link
            </span>
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f6fef9] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#067647]">
              <span className="size-[6px] rounded-full bg-[#17b26a]" /> Active
            </span>
          </div>

          <div className="mt-[12px] flex flex-col gap-[8px] sm:flex-row sm:items-center">
            <div className="flex-1 rounded-[8px] border border-[#d5d7da] bg-[#fafafa] px-[14px] py-[11px] font-mono text-[14px] leading-[20px] text-[#414651] truncate">
              proploy.com/r/dana-okoro-4f2a
            </div>
            <span className="inline-flex items-center justify-center gap-[6px] rounded-[8px] bg-[#155eef] px-[16px] py-[11px] text-[14px] font-semibold leading-[20px] text-white">
              <Check size={16} /> Copied
            </span>
          </div>

          <div className="mt-[20px] grid grid-cols-3 gap-[12px] border-t border-[#e9eaeb] pt-[20px]">
            {[
              ['7', 'Clicks this week'],
              ['3', 'Signed up'],
              ['$1,000', 'Paid out'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-semibold text-[20px] leading-[28px] text-[#181d27] tracking-[-0.2px]">{value}</p>
                <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[13px] leading-[18px] text-[#717680]">
          Preview only — your live link and dashboard appear once you join the program.
        </p>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------- page */

export default function ReferPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Referral program"
        title="Refer an expert or a business. Get paid when they start."
        subtitle="Know a sharp implementation consultant or a team with a software rollout to staff? Send them to Proploy and earn a reward the moment their first engagement begins."
        primary={{ label: 'Get your referral link', href: '/become-expert' }}
        secondary={{ label: 'See reward tiers', href: '#rewards' }}
      />

      <ThreeUpCards
        heading="How referring works"
        body="Three steps, no spreadsheets. Share your link, we handle attribution, and the reward lands once the work is real."
        cards={[
          {
            icon: <Send size={24} className="text-white" />,
            title: '1 · Share your link',
            body: 'Grab your unique referral link from your dashboard and send it to an expert or a business — email, Slack, or a quick intro.',
          },
          {
            icon: <UserPlus size={24} className="text-white" />,
            title: '2 · They join Proploy',
            body: 'Anyone who signs up through your link is automatically attributed to you. Track every click and signup in one place.',
          },
          {
            icon: <Gift size={24} className="text-white" />,
            title: '3 · You get rewarded',
            body: 'Once your referral passes vetting or kicks off their first paid engagement, your reward is queued for payout — no follow-up needed.',
          },
        ]}
      />

      <div id="rewards" />
      <RewardTiers />

      <ReferralLinkBlock />

      <FAQAccordion
        heading="Referral program questions"
        body="The details on who qualifies, when rewards pay out, and how attribution works."
        faqs={[
          {
            q: 'Who can join the referral program?',
            a: 'Any Proploy member — experts, vendors, and businesses — gets a referral link automatically. You can refer both experts joining the network and businesses bringing implementation work.',
          },
          {
            q: 'When does a referral reward pay out?',
            a: 'Rewards are confirmed once your referral passes vetting or starts their first paid engagement, then paid out 30 days after that engagement clears its first milestone and the guarantee window closes.',
          },
          {
            q: 'How is a referral attributed to me?',
            a: 'Your link carries a unique code. Anyone who signs up through it is tied to your account, and you can see clicks, signups, and payouts live in your referral dashboard.',
          },
          {
            q: 'Is there a limit to how much I can earn?',
            a: 'No cap. Refer one expert or twenty businesses — every qualifying referral earns its full reward, paid the same way each time.',
          },
        ]}
        contact={{ label: 'Talk to our team', href: '/contact' }}
      />

      <CTABanner
        variant="dark"
        title="Turn your network into your next payout"
        body="Get your referral link in minutes and start earning when the people you trust start real work on Proploy."
        primary={{ label: 'Get your referral link', href: '/become-expert' }}
        secondary={{ label: 'Explore the platform', href: '/for-experts' }}
      />
    </>
  )
}
