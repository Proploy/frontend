import type { Metadata } from 'next'
import {
  CTABanner,
  FAQAccordion,
  MarketingHero,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'FAQs · Proploy',
  description:
    'Answers for businesses hiring vetted software-implementation experts and for the experts and firms who deliver the work on Proploy.',
}

export default function FaqsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Help center"
        title="Questions about hiring and delivering implementation work"
        subtitle="Whether you’re scoping a rollout or delivering one, here’s how Proploy handles vetting, scope, payments, and the details in between."
        primary={{ label: 'Talk to our team', href: '/contact' }}
        secondary={{ label: 'See how Proploy works', href: '/for-businesses' }}
      />

      <FAQAccordion
        heading="For businesses"
        body="Hiring a vetted expert or firm to implement software you’ve already bought — or are about to."
        faqs={[
          {
            q: 'How does Proploy vet experts and firms?',
            a: 'Every expert and firm is reviewed before they can take work. We verify platform certifications, confirm reference implementations, and check delivery history on past engagements. Profiles surface the specific platforms — Salesforce, NetSuite, HubSpot, Workday, and more — where each provider has shipped real rollouts.',
          },
          {
            q: 'What does it cost to hire through Proploy?',
            a: 'Posting a project and reviewing matches is free. You pay the agreed engagement amount through the platform — fixed-bid by milestone or a monthly retainer — and Proploy adds a transparent service fee shown before you commit. There are no per-message or per-introduction charges.',
          },
          {
            q: 'How fast can I get matched with the right expert?',
            a: 'Most businesses see a shortlist of qualified, available providers within two business days of posting a scoped project. You review profiles, past work, and rates, then start a conversation with the ones that fit before committing to anything.',
          },
          {
            q: 'How are payments and milestones protected?',
            a: 'Work runs on a signed statement of work with milestones tied to payment amounts. Funds are released against accepted milestones, so you only pay for delivered, approved work. If scope changes, a change order keeps the agreement and the paper trail clean.',
          },
          {
            q: 'What if a project goes off track?',
            a: 'Every engagement has clear acceptance criteria written into the contract, so expectations are defined up front. If something stalls, our team can step in to mediate, and unreleased milestone funds stay protected until the work meets the agreed terms.',
          },
          {
            q: 'Can my own software vendor or implementation partner join?',
            a: 'Yes. If you already have a preferred firm, invite them to deliver through Proploy so you keep contracts, milestones, and payments in one auditable place. New providers go through the same vetting before they can transact.',
          },
        ]}
      />

      <FAQAccordion
        heading="For experts and firms"
        body="Independent consultants and implementation firms delivering software rollouts for clients."
        faqs={[
          {
            q: 'Who can join Proploy as an expert?',
            a: 'Independent implementation consultants and consulting firms with a proven track record on the platforms they work in. We review certifications, reference projects, and delivery history during onboarding — Proploy is a vetted network, not an open directory.',
          },
          {
            q: 'How do I get matched with projects?',
            a: 'Once your profile is approved, you’re surfaced to businesses whose projects match your platforms, industry experience, and availability. You can also browse open projects and submit proposals directly. You only take on the work you choose.',
          },
          {
            q: 'What fees does Proploy charge experts?',
            a: 'Creating a profile and submitting proposals is free. When you win and deliver an engagement, Proploy takes a flat service fee on payments processed through the platform — shown clearly before you accept a contract. There are no listing or subscription fees.',
          },
          {
            q: 'How and when do I get paid?',
            a: 'Payments are tied to the milestones in your signed statement of work. When a client accepts a milestone, the funds are released to your account on the platform’s payout schedule. Retainer engagements bill on a recurring cycle you set in the contract.',
          },
          {
            q: 'Do I keep ownership of my client relationships?',
            a: 'Yes. Proploy helps you win and run engagements, but the relationship is yours. You control your rates, your scope, and how you deliver. Contracts, milestones, and communication live in one workspace so nothing slips through email.',
          },
          {
            q: 'Can my whole firm work under one account?',
            a: 'Firms can onboard as an organization, add team members, and manage projects, contracts, and payouts together. Roles and permissions let leads handle proposals and contracts while delivery teams focus on the implementation.',
          },
        ]}
        contact={{ label: 'Apply to join the network', href: '/become-expert' }}
      />

      <CTABanner
        variant="dark"
        title="Still have a question we didn’t cover?"
        body="Tell us what you’re trying to ship and we’ll point you to the right answer — or the right expert."
        primary={{ label: 'Contact our team', href: '/contact' }}
        secondary={{ label: 'Browse experts', href: '/for-businesses' }}
      />
    </>
  )
}
