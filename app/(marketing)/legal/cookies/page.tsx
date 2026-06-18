import type { Metadata } from 'next'
import Link from 'next/link'
import { Cookie, Settings2, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Cookie Policy · Proploy',
  description:
    'How Proploy uses cookies and similar technologies across our marketplace — the categories we set, why we set them, and how to manage your preferences.',
}

const LAST_UPDATED = 'June 1, 2026'

/* ------------------------------------------------------------------ cookie data */

interface CookieCategory {
  name: string
  required: string
  purpose: string
  examples: string[]
  retention: string
}

const CATEGORIES: CookieCategory[] = [
  {
    name: 'Essential',
    required: 'Always on',
    purpose:
      'Keep the platform working — signing you in, securing your session, routing requests, and remembering where you are in a contract or invoice flow. The product cannot run without these.',
    examples: ['proploy_session', 'csrf_token', 'auth_state', 'lb_route'],
    retention: 'Session to 12 months',
  },
  {
    name: 'Functional',
    required: 'Optional',
    purpose:
      'Remember the choices you make so the workspace behaves the way you left it — language, timezone for milestone dates, saved expert filters, and dismissed onboarding tips.',
    examples: ['locale', 'tz_pref', 'saved_filters', 'ui_hints_dismissed'],
    retention: 'Up to 12 months',
  },
  {
    name: 'Analytics',
    required: 'Optional',
    purpose:
      'Help us understand how businesses and experts use Proploy in aggregate — which pages load slowly, where flows drop off, and which features get used — so we can improve the product.',
    examples: ['_ga', '_ga_*', 'amplitude_id', 'proploy_pageview'],
    retention: 'Up to 24 months',
  },
  {
    name: 'Marketing',
    required: 'Optional',
    purpose:
      'Measure which campaigns bring experts and businesses to Proploy and limit how often you see the same ad. Set by us and by advertising partners when you opt in.',
    examples: ['_fbp', 'li_fat_id', 'gclid', 'proploy_attribution'],
    retention: 'Up to 13 months',
  },
]

/* -------------------------------------------------------------------- subsections */

const SECTIONS: { id: string; heading: string; body: React.ReactNode }[] = [
  {
    id: 'what-are-cookies',
    heading: 'What cookies are',
    body: (
      <>
        <p>
          Cookies are small text files a website stores on your device. We also use closely related
          technologies — local storage, pixels, and SDKs — and refer to all of them as
          &ldquo;cookies&rdquo; in this policy. They let Proploy recognize your browser, keep you
          signed in, and remember your preferences between visits.
        </p>
        <p>
          Some cookies are set by Proploy directly (first-party). Others are set by services we rely
          on — for example, analytics and payment providers — when their code runs on our pages
          (third-party). We only set non-essential cookies after you allow them.
        </p>
      </>
    ),
  },
  {
    id: 'why-we-use-them',
    heading: 'Why we use them',
    body: (
      <>
        <p>
          Proploy is a marketplace where businesses hire vetted experts to implement software, which
          means we move sensitive things — scoped contracts, milestone payments, and invoices —
          between two parties. Essential cookies keep those sessions secure and uninterrupted.
        </p>
        <p>
          Everything beyond that is optional. Functional, analytics, and marketing cookies help us
          tailor the workspace and improve the product, but you can use the core of Proploy with
          them switched off.
        </p>
      </>
    ),
  },
]

/* --------------------------------------------------------------------------- page */

export default function CookiePolicyPage() {
  return (
    <>
      {/* header */}
      <section className="border-b border-[#e9eaeb] bg-[#fafafa] py-[72px]">
        <Container className="flex max-w-[820px] flex-col gap-[20px]">
          <span className="inline-flex w-fit items-center gap-[8px] rounded-full border border-[#e9eaeb] bg-white px-[12px] py-[5px] text-[13px] font-medium leading-[18px] text-[#535862]">
            <Cookie size={15} className="text-[#155eef]" />
            Legal
          </span>
          <h1
            className="font-semibold text-[40px] leading-[48px] text-[#181d27] tracking-[-0.8px]"
            style={{ textWrap: 'balance' }}
          >
            Cookie Policy
          </h1>
          <p className="text-[18px] leading-[28px] text-[#535862]">
            This policy explains how Proploy uses cookies and similar technologies across our
            websites and platform, the categories we set, and how you can manage your preferences.
          </p>
          <p className="text-[14px] leading-[20px] text-[#717680]">Last updated {LAST_UPDATED}</p>
        </Container>
      </section>

      {/* body */}
      <section className="py-[96px]">
        <Container className="flex max-w-[820px] flex-col gap-[56px]">
          {/* intro */}
          <p className="text-[18px] leading-[28px] text-[#535862]">
            We keep this policy plain and specific. Below you&apos;ll find what cookies are, why
            Proploy uses them, the exact categories we set with examples and how long each lasts, and
            the controls available to you at any time.
          </p>

          {/* narrative subsections */}
          {SECTIONS.map((section) => (
            <div key={section.id} className="flex flex-col gap-[16px]">
              <h2 className="font-semibold text-[26px] leading-[34px] text-[#181d27] tracking-[-0.4px]">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-[16px] text-[17px] leading-[27px] text-[#535862]">
                {section.body}
              </div>
            </div>
          ))}

          {/* categories table */}
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-semibold text-[26px] leading-[34px] text-[#181d27] tracking-[-0.4px]">
                Cookie categories we use
              </h2>
              <p className="text-[17px] leading-[27px] text-[#535862]">
                Cookie names can change as our providers update their tools, so treat the examples
                below as representative rather than exhaustive. Essential cookies are always active;
                the rest run only with your consent.
              </p>
            </div>

            {/* table — scrollable on small screens, full grid on desktop */}
            <div className="overflow-x-auto rounded-[12px] border border-[#e9eaeb]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="border-b border-[#e9eaeb] px-[20px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                      Category
                    </th>
                    <th className="border-b border-[#e9eaeb] px-[20px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                      Purpose
                    </th>
                    <th className="border-b border-[#e9eaeb] px-[20px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                      Examples
                    </th>
                    <th className="border-b border-[#e9eaeb] px-[20px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                      Retention
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat) => (
                    <tr key={cat.name} className="align-top">
                      <td className="border-b border-[#e9eaeb] px-[20px] py-[18px]">
                        <span className="font-semibold text-[15px] leading-[22px] text-[#181d27]">
                          {cat.name}
                        </span>
                        <span
                          className={`mt-[8px] inline-flex w-fit items-center rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
                            cat.required === 'Always on'
                              ? 'bg-[#eff4ff] text-[#155eef]'
                              : 'border border-[#d5d7da] bg-white text-[#535862]'
                          }`}
                        >
                          {cat.required}
                        </span>
                      </td>
                      <td className="border-b border-[#e9eaeb] px-[20px] py-[18px] text-[14px] leading-[22px] text-[#535862]">
                        {cat.purpose}
                      </td>
                      <td className="border-b border-[#e9eaeb] px-[20px] py-[18px]">
                        <div className="flex flex-col gap-[6px]">
                          {cat.examples.map((ex) => (
                            <code
                              key={ex}
                              className="w-fit rounded-[6px] bg-[#fafafa] px-[8px] py-[2px] text-[13px] leading-[20px] text-[#252b37]"
                            >
                              {ex}
                            </code>
                          ))}
                        </div>
                      </td>
                      <td className="border-b border-[#e9eaeb] px-[20px] py-[18px] text-[14px] leading-[22px] text-[#535862] whitespace-nowrap">
                        {cat.retention}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* managing cookies */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="font-semibold text-[26px] leading-[34px] text-[#181d27] tracking-[-0.4px]">
              Managing your cookies
            </h2>
            <p className="text-[17px] leading-[27px] text-[#535862]">
              You stay in control of every non-essential cookie. There are two ways to change what
              Proploy stores on your device.
            </p>

            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
              <div className="flex flex-col gap-[10px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
                <span className="flex size-[36px] items-center justify-center rounded-[8px] bg-[#eff4ff]">
                  <Settings2 size={18} className="text-[#155eef]" />
                </span>
                <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                  Proploy preferences
                </h3>
                <p className="text-[14px] leading-[22px] text-[#535862]">
                  Use the cookie banner shown on your first visit, or reopen it any time from
                  &ldquo;Cookie preferences&rdquo; in the site footer, to turn functional, analytics,
                  and marketing cookies on or off. Essential cookies remain active because the
                  platform depends on them.
                </p>
              </div>
              <div className="flex flex-col gap-[10px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
                <span className="flex size-[36px] items-center justify-center rounded-[8px] bg-[#eff4ff]">
                  <ShieldCheck size={18} className="text-[#155eef]" />
                </span>
                <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                  Browser controls
                </h3>
                <p className="text-[14px] leading-[22px] text-[#535862]">
                  Most browsers let you block or delete cookies and clear stored data from their
                  privacy settings. Blocking essential cookies may sign you out or break parts of the
                  workspace, such as contract signing and invoicing.
                </p>
              </div>
            </div>

            <p className="text-[15px] leading-[24px] text-[#535862]">
              Where required by law, we ask for your consent before setting non-essential cookies and
              honor recognized opt-out signals such as Global Privacy Control. Withdrawing consent
              does not affect activity that happened before you changed your choice.
            </p>
          </div>

          {/* changes + contact */}
          <div className="flex flex-col gap-[16px] rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[24px]">
            <h2 className="font-semibold text-[20px] leading-[30px] text-[#181d27] tracking-[-0.2px]">
              Changes and questions
            </h2>
            <p className="text-[15px] leading-[24px] text-[#535862]">
              We may update this policy as our product, providers, or the law change. When we do,
              we&apos;ll revise the &ldquo;Last updated&rdquo; date above. For questions about cookies
              or how we handle your data, contact our privacy team at{' '}
              <a href="mailto:privacy@proploy.com" className="font-medium text-[#155eef] hover:text-[#004eeb]">
                privacy@proploy.com
              </a>{' '}
              or read our{' '}
              <Link href="/legal/privacy" className="font-medium text-[#155eef] hover:text-[#004eeb]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
