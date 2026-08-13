import type { Metadata } from 'next'

import { LegalPage, type LegalSection } from '../legal-page'

export const metadata: Metadata = {
  title: 'Cookie Policy — Proploy',
  description: 'The cookies and similar technologies Proploy uses, and the choices you have about them.',
}

const COOKIE_ROWS: { name: string; category: string; purpose: string; duration: string }[] = [
  { name: 'pp_session', category: 'Strictly necessary', purpose: 'Keeps you signed in and secures your session', duration: 'Session' },
  { name: 'pp_csrf', category: 'Strictly necessary', purpose: 'Protects forms against cross-site request forgery', duration: 'Session' },
  { name: 'pp_prefs', category: 'Functional', purpose: 'Remembers workspace settings such as language and layout', duration: '12 months' },
  { name: 'pp_consent', category: 'Strictly necessary', purpose: 'Records your cookie choices', duration: '12 months' },
  { name: 'pp_analytics', category: 'Analytics', purpose: 'Helps us understand which pages and features are used', duration: '13 months' },
  { name: 'pp_campaign', category: 'Marketing', purpose: 'Attributes visits from campaigns we run', duration: '90 days' },
]

const SECTIONS: LegalSection[] = [
  {
    id: 'what-are-cookies',
    heading: 'What cookies are',
    body: (
      <p className="pp-body">
        Cookies are small text files placed on your device when you visit a website. Together with
        similar technologies — local storage, pixels and SDKs — they let a site remember your
        actions and preferences over time. This policy explains which of these technologies Proploy
        uses on its website and platform, and how you can control them.
      </p>
    ),
  },
  {
    id: 'categories',
    heading: 'Categories we use',
    body: (
      <>
        <p className="pp-body">
          <strong>Strictly necessary</strong> — required for the Platform to work: signing in,
          keeping sessions secure, remembering consent choices. These cannot be switched off.
        </p>
        <p className="pp-body">
          <strong>Functional</strong> — remember choices you make (like language or workspace
          layout) so the Platform behaves consistently between visits.
        </p>
        <p className="pp-body">
          <strong>Analytics</strong> — help us understand how the Platform is used in aggregate, so
          we can improve pages and features. These run only with your consent where required by law.
        </p>
        <p className="pp-body">
          <strong>Marketing</strong> — measure the campaigns we run and limit how often you see
          them. We use these sparingly, and only with consent where required.
        </p>
      </>
    ),
  },
  {
    id: 'cookie-table',
    heading: 'Cookies in detail',
    body: (
      <>
        <p className="pp-body">
          Representative cookies set by the Platform. Exact names and durations may vary as the
          product evolves; this table is refreshed with each update to this policy.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="pp-table">
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Category</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {COOKIE_ROWS.map((row) => (
                <tr key={row.name}>
                  <td className="pp-mono-num" style={{ whiteSpace: 'nowrap' }}>{row.name}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{row.category}</td>
                  <td>{row.purpose}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'third-parties',
    heading: 'Third-party cookies',
    body: (
      <p className="pp-body">
        Some cookies are set by third parties acting on our behalf — for example our analytics and
        payment providers. These providers process data under contracts that restrict use to the
        purposes we specify. We do not permit third parties to use cookie data collected on the
        Platform for their own advertising networks.
      </p>
    ),
  },
  {
    id: 'choices',
    heading: 'Your choices',
    body: (
      <>
        <p className="pp-body">
          Where a consent banner is shown, you can accept or decline non-essential cookies, and
          revisit that choice at any time from the cookie settings link in the footer.
        </p>
        <p className="pp-body">
          You can also control cookies through your browser — blocking or deleting them entirely.
          Note that blocking strictly necessary cookies will prevent parts of the Platform, such as
          sign-in, from working.
        </p>
      </>
    ),
  },
  {
    id: 'changes-contact',
    heading: 'Changes and contact',
    body: (
      <p className="pp-body">
        We may update this policy as our use of cookies changes; the &ldquo;Last updated&rdquo;
        date above reflects the current version. Questions can be sent to privacy@proploy.com.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="August 13, 2026"
      intro={
        <p className="pp-lede">
          This policy describes the cookies and similar technologies used on the Proploy website
          and platform, the categories they fall into, and how to control them.
        </p>
      }
      sections={SECTIONS}
    />
  )
}
