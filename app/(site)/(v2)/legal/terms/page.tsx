import type { Metadata } from 'next'

import { LegalPage, type LegalSection } from '../legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — Proploy',
  description: 'The terms that govern use of the Proploy marketplace and engagement workspace.',
}

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    heading: 'Acceptance of these terms',
    body: (
      <>
        <p className="pp-body">
          These Terms of Service (the &ldquo;Terms&rdquo;) govern your access to and use of the
          Proploy website, marketplace and engagement workspace (together, the
          &ldquo;Platform&rdquo;). By creating an account or using the Platform, you agree to be
          bound by these Terms and by any policies referenced in them, including our Privacy Policy
          and Cookie Policy.
        </p>
        <p className="pp-body">
          If you use the Platform on behalf of a company or other legal entity, you represent that
          you have authority to bind that entity, and &ldquo;you&rdquo; refers to the entity.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    heading: 'Accounts and eligibility',
    body: (
      <>
        <p className="pp-body">
          You must be at least 18 years old and able to form a binding contract to use the Platform.
          You are responsible for the accuracy of the information in your account, for maintaining
          the confidentiality of your credentials, and for all activity that occurs under your
          account.
        </p>
        <p className="pp-body">
          Expert and vendor accounts are subject to vetting and may be approved, declined or
          suspended at Proploy&rsquo;s reasonable discretion. Firm accounts are responsible for the
          conduct of the consultants they list.
        </p>
      </>
    ),
  },
  {
    id: 'marketplace-role',
    heading: 'Proploy’s role in the marketplace',
    body: (
      <>
        <p className="pp-body">
          Proploy operates a marketplace that connects businesses with software products and
          independent implementation experts, and provides workspace tooling for the resulting
          engagements — including contracts, invoicing and payment facilitation.
        </p>
        <p className="pp-body">
          Except where expressly stated, Proploy is not a party to the service agreements formed
          between businesses and experts, does not employ experts, and does not itself provide
          implementation services or software products listed by vendors. Businesses and experts are
          responsible for the content of their engagements, including scope, deliverables and
          professional standards.
        </p>
      </>
    ),
  },
  {
    id: 'engagements',
    heading: 'Engagements, contracts and conduct',
    body: (
      <>
        <p className="pp-body">
          Engagements initiated through the Platform should be contracted, invoiced and paid through
          the Platform. Circumventing the Platform to avoid applicable fees is a material breach of
          these Terms.
        </p>
        <p className="pp-body">
          You agree not to misuse the Platform — including by posting false or misleading
          information, infringing the rights of others, interfering with the Platform&rsquo;s
          operation, or using it for any unlawful purpose.
        </p>
      </>
    ),
  },
  {
    id: 'fees-payments',
    heading: 'Fees and payments',
    body: (
      <>
        <p className="pp-body">
          Proploy charges fees on engagements transacted through the Platform, as described on our
          pricing pages or in a separate agreement. Fees are exclusive of taxes unless stated
          otherwise; you are responsible for taxes applicable to you.
        </p>
        <p className="pp-body">
          Payments are processed by third-party payment providers. By transacting on the Platform
          you also agree to the applicable provider&rsquo;s terms. Invoices are due as stated in the
          relevant engagement; late or disputed amounts are handled through the workspace&rsquo;s
          dispute process.
        </p>
      </>
    ),
  },
  {
    id: 'ip',
    heading: 'Intellectual property',
    body: (
      <>
        <p className="pp-body">
          The Platform, including its software, design and content provided by Proploy, is owned by
          Proploy or its licensors and protected by intellectual-property laws. We grant you a
          limited, non-exclusive, non-transferable licence to use the Platform in accordance with
          these Terms.
        </p>
        <p className="pp-body">
          You retain ownership of the content you submit to the Platform, and grant Proploy a
          licence to host, display and process it as needed to operate the Platform. Ownership of
          work product created within an engagement is determined by the agreement between the
          business and the expert.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers-liability',
    heading: 'Disclaimers and limitation of liability',
    body: (
      <>
        <p className="pp-body">
          The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the
          maximum extent permitted by law, Proploy disclaims all warranties, express or implied,
          including fitness for a particular purpose, and does not warrant that any expert, vendor
          or engagement outcome will meet your requirements.
        </p>
        <p className="pp-body">
          To the maximum extent permitted by law, Proploy&rsquo;s aggregate liability arising out of
          or relating to the Platform is limited to the fees you paid to Proploy in the twelve
          months preceding the claim, and Proploy is not liable for indirect, incidental, special or
          consequential damages. Nothing in these Terms excludes liability that cannot be excluded
          by law.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    heading: 'Suspension and termination',
    body: (
      <>
        <p className="pp-body">
          You may close your account at any time. We may suspend or terminate access to the
          Platform where these Terms are breached, where required by law, or where continued access
          creates risk for other users — with notice where reasonably practicable.
        </p>
        <p className="pp-body">
          Provisions that by their nature should survive termination — including fee obligations,
          intellectual-property provisions and limitations of liability — survive.
        </p>
      </>
    ),
  },
  {
    id: 'changes-law',
    heading: 'Changes, governing law and contact',
    body: (
      <>
        <p className="pp-body">
          We may update these Terms from time to time. Material changes will be notified through the
          Platform or by email, and the &ldquo;Last updated&rdquo; date above will change.
          Continued use after changes take effect constitutes acceptance.
        </p>
        <p className="pp-body">
          The governing law and venue for disputes will be identified in the executed version of
          these Terms once legal review is complete. Questions may be directed to
          legal@proploy.com.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="August 13, 2026"
      intro={
        <p className="pp-lede">
          These Terms describe the rules of the road for the Proploy marketplace — how accounts
          work, what role Proploy plays between businesses, experts and vendors, and what each side
          can expect from the other.
        </p>
      }
      sections={SECTIONS}
    />
  )
}
