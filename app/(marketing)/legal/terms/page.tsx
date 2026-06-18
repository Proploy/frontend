import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Container } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Terms of Service · Proploy',
  description:
    'The terms that govern use of Proploy — the marketplace for hiring vetted experts and consulting firms to implement software.',
}

interface Section {
  id: string
  number: number
  title: string
  body: ReactNode
}

const SECTIONS: Section[] = [
  {
    id: 'acceptance',
    number: 1,
    title: 'Acceptance of these terms',
    body: (
      <>
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) govern your access to and use of the
          Proploy marketplace, websites, and related services (collectively, the
          &ldquo;Platform&rdquo;), operated by Proploy, Inc. (&ldquo;Proploy,&rdquo; &ldquo;we,&rdquo;
          or &ldquo;us&rdquo;). By creating an account, browsing expert profiles, or otherwise using
          the Platform, you agree to be bound by these Terms.
        </p>
        <p>
          This is placeholder legal text and does not constitute legal advice. Final terms will be
          reviewed by counsel before publication. If you do not agree to these Terms, you may not
          access or use the Platform. If you are entering into these Terms on behalf of a company or
          other legal entity, you represent that you have authority to bind that entity.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    number: 2,
    title: 'Accounts and eligibility',
    body: (
      <>
        <p>
          To use most features of the Platform you must register for an account and provide accurate,
          current, and complete information. You are responsible for safeguarding your credentials and
          for all activity that occurs under your account. You must notify us promptly of any
          unauthorized use.
        </p>
        <p>
          You must be at least eighteen years old and able to form a binding contract to use the
          Platform. Accounts are designated as either an expert/vendor account or a business account,
          and certain obligations under these Terms apply based on the role you hold. We may suspend or
          terminate accounts that contain false information or that violate these Terms.
        </p>
      </>
    ),
  },
  {
    id: 'expert-obligations',
    number: 3,
    title: 'Expert and vendor obligations',
    body: (
      <>
        <p>
          Experts and consulting firms (&ldquo;Experts&rdquo;) listed on the Platform represent that
          they hold the certifications, qualifications, and authorizations they claim, and that their
          profiles, case studies, and references are truthful and not misleading. Experts agree to
          maintain the standards reviewed during Proploy&rsquo;s vetting process.
        </p>
        <p>
          Experts are independent contractors and not employees, partners, or agents of Proploy.
          Experts are solely responsible for the implementation services they deliver, for meeting the
          scope and milestones agreed with a business, and for complying with applicable laws,
          licensing requirements, and the software vendors&rsquo; partner and reseller policies.
        </p>
      </>
    ),
  },
  {
    id: 'business-obligations',
    number: 4,
    title: 'Business obligations',
    body: (
      <>
        <p>
          Businesses agree to engage Experts in good faith, to provide the access, data, and
          decision-makers reasonably required for an implementation to proceed, and to review and
          respond to deliverables and milestone submissions in a timely manner.
        </p>
        <p>
          Businesses are responsible for evaluating whether an Expert is suitable for their needs.
          While Proploy vets Experts, we do not guarantee any specific outcome of an engagement.
          Businesses agree not to solicit Experts off-platform to circumvent applicable fees during an
          active engagement or for a defined period following one, as described in your order or these
          Terms.
        </p>
      </>
    ),
  },
  {
    id: 'payments',
    number: 5,
    title: 'Payments and fees',
    body: (
      <>
        <p>
          Engagements are billed according to the scope, rate, or milestone schedule agreed between a
          business and an Expert. Proploy facilitates payments through a third-party payment processor
          and may hold milestone funds until acceptance criteria are met. Service fees and any
          applicable taxes will be disclosed before a transaction is confirmed.
        </p>
        <p>
          Fees are non-refundable except as expressly stated in these Terms or as required by law.
          Disputes over a milestone or deliverable should first be raised through the Platform&rsquo;s
          resolution process. You authorize Proploy and its payment processor to charge the payment
          method on file for amounts you owe under an engagement.
        </p>
      </>
    ),
  },
  {
    id: 'contracts',
    number: 6,
    title: 'Contracts and engagements',
    body: (
      <>
        <p>
          The Platform allows businesses and Experts to draft, send, and e-sign statements of work and
          related agreements. A contract executed on the Platform is between the business and the
          Expert. Proploy is not a party to those contracts and provides the tooling and records as a
          neutral facilitator.
        </p>
        <p>
          The parties to an engagement are responsible for the accuracy and enforceability of their
          contract terms, including scope, timeline, intellectual property assignment, and acceptance
          criteria. Where these Terms conflict with a fully executed engagement contract, the
          engagement contract controls for matters between the business and the Expert.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    number: 7,
    title: 'Intellectual property',
    body: (
      <>
        <p>
          The Platform, including its software, design, trademarks, and content, is owned by Proploy or
          its licensors and is protected by intellectual property laws. We grant you a limited,
          non-exclusive, non-transferable license to use the Platform in accordance with these Terms.
        </p>
        <p>
          Ownership of work product created during an engagement is governed by the contract between the
          business and the Expert. You retain rights to content you submit but grant Proploy a license
          to host, display, and process that content as needed to operate the Platform. You may not
          copy, scrape, or create derivative works of the Platform without our prior written consent.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    number: 8,
    title: 'Disclaimers and limitation of liability',
    body: (
      <>
        <p>
          The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
          warranties of any kind, whether express or implied, including warranties of merchantability,
          fitness for a particular purpose, and non-infringement. We do not warrant that the Platform
          will be uninterrupted, secure, or error-free.
        </p>
        <p>
          To the maximum extent permitted by law, Proploy will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or for any loss of profits, data, or
          goodwill arising from your use of the Platform or any engagement. Our aggregate liability for
          any claim will not exceed the fees you paid to Proploy in the twelve months preceding the
          claim.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    number: 9,
    title: 'Termination',
    body: (
      <>
        <p>
          You may stop using the Platform and close your account at any time. We may suspend or
          terminate your access, with or without notice, if you breach these Terms, if required by law,
          or if we discontinue the Platform. We may also remove content or listings that violate these
          Terms or our policies.
        </p>
        <p>
          Termination does not relieve you of obligations incurred before termination, including
          payment obligations for active engagements. Provisions that by their nature should survive,
          including those on payments, intellectual property, and limitation of liability, will survive
          termination.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    number: 10,
    title: 'Contact',
    body: (
      <>
        <p>
          Questions about these Terms can be directed to our team. We will update these Terms from time
          to time; material changes will be communicated through the Platform or by email, and your
          continued use after an update constitutes acceptance of the revised Terms.
        </p>
        <p>
          Proploy, Inc. — Legal. Reach us at{' '}
          <a
            href="mailto:legal@proploy.com"
            className="font-medium text-[#155eef] underline-offset-2 hover:text-[#004eeb] hover:underline"
          >
            legal@proploy.com
          </a>
          .
        </p>
      </>
    ),
  },
]

export default function TermsOfServicePage() {
  return (
    <section className="py-[96px]">
      <Container>
        <div className="mx-auto max-w-[768px]">
          {/* Title */}
          <div className="flex flex-col gap-[12px] border-b border-[#e9eaeb] pb-[40px]">
            <h1
              className="font-semibold text-[40px] leading-[48px] text-[#181d27] tracking-[-0.8px]"
              style={{ textWrap: 'balance' }}
            >
              Terms of Service
            </h1>
            <p className="text-[16px] leading-[24px] text-[#717680]">Last updated June 16, 2026</p>
          </div>

          {/* On-page section nav */}
          <nav aria-label="On this page" className="mt-[40px] rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[24px]">
            <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">On this page</p>
            <ol className="mt-[16px] grid grid-cols-1 gap-x-[24px] gap-y-[10px] sm:grid-cols-2">
              {SECTIONS.map((section) => (
                <li key={section.id} className="flex gap-[10px] text-[15px] leading-[22px]">
                  <span className="shrink-0 font-semibold text-[#717680] tabular-nums">{section.number}.</span>
                  <a
                    href={`#${section.id}`}
                    className="text-[#535862] underline-offset-2 transition-colors hover:text-[#155eef] hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <div className="mt-[56px] flex flex-col gap-[48px]">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-[120px]">
                <h2 className="font-semibold text-[24px] leading-[32px] text-[#181d27] tracking-[-0.36px]">
                  <span className="text-[#155eef]">{section.number}.</span> {section.title}
                </h2>
                <div className="mt-[16px] flex flex-col gap-[16px] text-[16px] leading-[26px] text-[#535862]">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
