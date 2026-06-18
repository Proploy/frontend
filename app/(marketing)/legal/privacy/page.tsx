import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { Container } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Privacy Policy · Proploy',
  description:
    'How Proploy collects, uses, and protects personal data across our software-implementation marketplace for experts and businesses.',
}

const LAST_UPDATED = 'June 16, 2026'

interface Section {
  id: string
  title: string
  body: ReactNode
}

const SECTIONS: Section[] = [
  {
    id: 'data-we-collect',
    title: '1. Data we collect',
    body: (
      <>
        <p>
          We collect information you provide directly when you create an account, build an expert or
          vendor profile, post an implementation project, exchange messages, sign contracts, or
          process payments through Proploy. This includes your name, work email, company details,
          professional credentials, certifications, portfolio materials, and the scope and budget of
          engagements you publish or respond to.
        </p>
        <p>
          We also collect technical data automatically — device and browser information, IP address,
          and product usage events — to operate the marketplace, keep accounts secure, and improve
          how experts and businesses are matched. Placeholder text describing additional categories
          of collected data will be finalized before this policy takes effect.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-it',
    title: '2. How we use it',
    body: (
      <>
        <p>
          We use personal data to provide and operate the platform: to match businesses with vetted
          experts, surface relevant engagements, facilitate contracts and milestone payments, and
          provide customer support. We use aggregated and de-identified data to measure quality,
          detect fraud, and improve our vetting and matching models.
        </p>
        <p>
          With your consent where required, we may send product updates, engagement notifications,
          and marketing communications. You can opt out of marketing messages at any time without
          affecting transactional notifications tied to your active engagements.
        </p>
      </>
    ),
  },
  {
    id: 'legal-bases',
    title: '3. Legal bases',
    body: (
      <>
        <p>
          Where the GDPR or comparable laws apply, we rely on the following legal bases to process
          personal data: performance of a contract (to deliver the marketplace and the engagements
          you enter into), our legitimate interests (to secure, maintain, and improve the platform),
          your consent (for optional marketing and certain cookies), and compliance with legal
          obligations (such as tax, accounting, and anti-fraud requirements).
        </p>
        <p>
          Where we rely on legitimate interests, we balance those interests against your rights and
          freedoms. Placeholder detail on each processing activity and its corresponding legal basis
          will be provided in the final policy.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: '4. Sharing',
    body: (
      <>
        <p>
          Proploy is a two-sided marketplace, so certain profile and engagement details are shared
          between experts and businesses to make hiring possible — for example, an expert&apos;s
          profile is visible to businesses, and project details are shared with experts you invite or
          who apply.
        </p>
        <p>
          We share data with service providers who process it on our behalf under contract,
          including payment processors, e-signature providers, cloud hosting, and analytics vendors.
          We may also disclose data to comply with law, enforce our terms, or protect the rights and
          safety of our users. We do not sell personal data.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    body: (
      <>
        <p>
          We use cookies and similar technologies to keep you signed in, remember preferences,
          measure platform performance, and understand how the marketplace is used. Strictly
          necessary cookies are required for the service to function; analytics and preference
          cookies are optional.
        </p>
        <p>
          You can manage non-essential cookies through your browser settings or our cookie controls.
          Placeholder text describing each cookie category and its retention period will be
          completed before publication.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: '6. Security',
    body: (
      <>
        <p>
          We maintain administrative, technical, and physical safeguards designed to protect
          personal data, including encryption in transit, access controls, and routine security
          reviews. Payment and signature data is handled by certified processors under their own
          security programs.
        </p>
        <p>
          No method of transmission or storage is completely secure. While we work to protect your
          data, we cannot guarantee absolute security. Placeholder detail on our incident response
          and breach notification practices will be added in the final policy.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: '7. Retention',
    body: (
      <>
        <p>
          We retain personal data for as long as your account is active and as needed to provide the
          service, then for the period required to meet legal, tax, accounting, and dispute-
          resolution obligations. Contract and payment records associated with engagements are
          retained for the statutory periods that apply to financial documents.
        </p>
        <p>
          When data is no longer needed, we delete it or de-identify it. Specific retention windows
          for each data category are placeholders and will be finalized before this policy takes
          effect.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: '8. Your rights',
    body: (
      <>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or export
          your personal data, to object to or restrict certain processing, and to withdraw consent
          where processing is based on consent. You may also have the right to lodge a complaint with
          your local data protection authority.
        </p>
        <p>
          To exercise any of these rights, contact us using the details below. We will respond within
          the timeframe required by applicable law and may need to verify your identity before
          acting on a request.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    title: '9. International transfers',
    body: (
      <>
        <p>
          Proploy operates globally, so your personal data may be transferred to and processed in
          countries other than where you live, including countries that may not provide the same
          level of data protection as your jurisdiction.
        </p>
        <p>
          Where we transfer data internationally, we use appropriate safeguards such as Standard
          Contractual Clauses and equivalent mechanisms. Placeholder detail on the specific transfer
          mechanisms we rely on will be provided in the final policy.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: '10. Contact',
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy or how we handle your personal data, or if
          you would like to exercise your rights, please reach out and our privacy team will be glad
          to help.
        </p>
        <div className="mt-[20px] flex flex-col gap-[6px] rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[20px]">
          <span className="inline-flex items-center gap-[8px] font-semibold text-[16px] leading-[24px] text-[#181d27]">
            <Mail size={18} className="text-[#155eef]" />
            Privacy team
          </span>
          <a
            href="mailto:privacy@proploy.com"
            className="font-medium text-[16px] leading-[24px] text-[#155eef] hover:text-[#004eeb] transition-colors"
          >
            privacy@proploy.com
          </a>
          <p className="text-[15px] leading-[22px] text-[#717680]">
            Proploy, Inc. · Attn: Privacy · 548 Market Street, San Francisco, CA 94104
          </p>
        </div>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <section className="py-[96px]">
      <Container className="max-w-[768px]">
        <header className="flex flex-col gap-[16px] border-b border-[#e9eaeb] pb-[40px]">
          <h1
            className="font-semibold text-[40px] leading-[48px] text-[#181d27] tracking-[-0.8px]"
            style={{ textWrap: 'balance' }}
          >
            Privacy Policy
          </h1>
          <p className="text-[16px] leading-[24px] text-[#717680]">Last updated {LAST_UPDATED}</p>
          <p className="text-[18px] leading-[28px] text-[#535862]">
            This policy explains how Proploy collects, uses, shares, and protects personal data when
            experts, vendors, and businesses use our marketplace to scope, hire, and deliver software
            implementations.
          </p>
        </header>

        <div className="mt-[48px] flex flex-col gap-[40px]">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-[120px]">
              <h2 className="font-semibold text-[24px] leading-[32px] text-[#181d27] tracking-[-0.24px]">
                {section.title}
              </h2>
              <div className="mt-[16px] flex flex-col gap-[16px] text-[17px] leading-[28px] text-[#535862]">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
