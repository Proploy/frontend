import type { Metadata } from 'next'

import { LegalPage, type LegalSection } from '../legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — Proploy',
  description: 'How Proploy collects, uses, shares and protects personal data across the marketplace.',
}

const SECTIONS: LegalSection[] = [
  {
    id: 'scope',
    heading: 'Who this policy covers',
    body: (
      <p className="pp-body">
        This Privacy Policy explains how Proploy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
        uses, shares and protects personal data when you visit our website, create an account, or
        transact on the marketplace — whether as a business user, an implementation expert, a
        consulting firm or a software vendor. It also covers data we receive about you from other
        users in the course of an engagement, for example when a teammate adds you to a workspace.
      </p>
    ),
  },
  {
    id: 'data-collected',
    heading: 'Data we collect',
    body: (
      <>
        <p className="pp-body">We collect three broad categories of data:</p>
        <p className="pp-body">
          <strong>Data you provide</strong> — account details (name, email, company, role), expert
          profile information (skills, credentials, references, rates), briefs and messages,
          contract and invoice contents, and support requests.
        </p>
        <p className="pp-body">
          <strong>Data collected automatically</strong> — device and log information such as IP
          address, browser type, pages viewed and actions taken on the Platform, collected via
          cookies and similar technologies described in our Cookie Policy.
        </p>
        <p className="pp-body">
          <strong>Data from third parties</strong> — verification and vetting inputs (for example
          reference checks for experts), payment status from our payment processors, and business
          contact information from service providers used to keep records accurate.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    heading: 'How we use data',
    body: (
      <>
        <p className="pp-body">We use personal data to:</p>
        <p className="pp-body">
          operate the marketplace — matching briefs with experts and products, running engagement
          workspaces, and processing contracts, invoices and payments; maintain trust — vetting
          experts, verifying credentials, preventing fraud and enforcing our Terms; improve the
          Platform — understanding how features are used and developing new ones; and communicate
          with you — service messages, engagement notifications and, with your consent where
          required, product updates you can opt out of at any time.
        </p>
        <p className="pp-body">
          Where data-protection law applies, we rely on the legal bases of contract performance,
          legitimate interests, consent and legal obligation, as appropriate to each processing
          activity.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    heading: 'How we share data',
    body: (
      <>
        <p className="pp-body">
          <strong>With other users</strong> — profile and engagement information is shared as needed
          to run the marketplace: businesses see expert profiles and ratings; matched parties see
          the workspace content relevant to their engagement.
        </p>
        <p className="pp-body">
          <strong>With service providers</strong> — hosting, analytics, communications and payment
          processing providers who process data on our behalf under contractual safeguards.
        </p>
        <p className="pp-body">
          <strong>For legal reasons</strong> — where required by law, to protect the rights and
          safety of users, or as part of a corporate transaction such as a merger or acquisition,
          with notice where required. We do not sell personal data.
        </p>
      </>
    ),
  },
  {
    id: 'retention-security',
    heading: 'Retention and security',
    body: (
      <>
        <p className="pp-body">
          We keep personal data for as long as needed for the purposes described above — typically
          for the life of your account plus the period required for legal, tax and dispute-handling
          obligations. Engagement records (contracts, invoices) may be retained longer where the law
          requires.
        </p>
        <p className="pp-body">
          We protect data with administrative, technical and organisational measures appropriate to
          its sensitivity, including encryption in transit, access controls and audit logging. No
          system is perfectly secure; we encourage strong, unique passwords and prompt reporting of
          any suspected compromise.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    heading: 'Your rights and choices',
    body: (
      <>
        <p className="pp-body">
          Depending on where you live, you may have rights to access, correct, delete, export or
          restrict the processing of your personal data, and to object to certain processing or
          withdraw consent. You can exercise most of these directly from account settings, or by
          contacting privacy@proploy.com. We respond within the timelines required by applicable
          law, and you may also lodge a complaint with your local supervisory authority.
        </p>
        <p className="pp-body">
          Marketing emails include an unsubscribe link; service and engagement notifications are
          controlled from workspace settings.
        </p>
      </>
    ),
  },
  {
    id: 'transfers-children',
    heading: 'International transfers and children',
    body: (
      <>
        <p className="pp-body">
          Where personal data is transferred across borders, we use recognised safeguards such as
          standard contractual clauses or transfers to jurisdictions with adequate protection.
        </p>
        <p className="pp-body">
          The Platform is a business tool and is not directed at children under 16. We do not
          knowingly collect data from children; if you believe a child has provided us data, contact
          us and we will delete it.
        </p>
      </>
    ),
  },
  {
    id: 'changes-contact',
    heading: 'Changes and contact',
    body: (
      <p className="pp-body">
        We may update this policy from time to time; material changes will be notified through the
        Platform or by email, and the &ldquo;Last updated&rdquo; date above will change. Questions
        or requests can be sent to privacy@proploy.com.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 13, 2026"
      intro={
        <p className="pp-lede">
          This policy explains what personal data Proploy collects across the marketplace and
          engagement workspace, why we collect it, who we share it with, and the rights you have
          over it.
        </p>
      }
      sections={SECTIONS}
    />
  )
}
