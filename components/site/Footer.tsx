import Link from "next/link";
import { Logo } from "./Nav";

// Full site IA carried over from the legacy global Footer — nothing dropped.
// Layout keeps the ported 4-column spacing rhythm (~149px columns, 32px gaps)
// by widening the container to 1440px and running five columns instead of four:
//   1240px / [1.2fr 2fr] / 4 cols -> 149.8px   (before)
//   1440px / [1fr 2fr]   / 5 cols -> 149.3px   (now)
// From xl up the columns are pinned to 149px rather than fr units, so the
// rhythm is identical at every desktop width and the brand block absorbs the
// slack — otherwise columns compress to ~128px at 1280 and long labels wrap.
// Column gaps step up with available room (32 -> 40 -> 48 -> 64 -> 80px) so the
// five columns breathe on wide screens without starving the brand block at 1280
// (custom 1400/1520 stops keep the brand ≥215px at every width).
// Legal links live in the bottom bar so the Company column stays balanced.
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "For experts",
    links: [
      { label: "For experts", href: "/for-experts" },
      { label: "Become an expert", href: "/become-expert" },
      { label: "Find work", href: "/find-work" },
      { label: "Get discovered", href: "/get-discovered" },
      { label: "Manage projects", href: "/manage-projects" },
      { label: "Sign contracts", href: "/sign-contracts" },
      { label: "Send invoices", href: "/send-invoices" },
      { label: "Payments", href: "/payments" },
      { label: "Global payments", href: "/global-payments" },
      { label: "Transparent pricing", href: "/commission" },
    ],
  },
  {
    title: "For businesses",
    links: [
      { label: "For businesses", href: "/for-businesses" },
      { label: "Discover experts", href: "/discover-experts" },
      { label: "Post a job", href: "/post-a-job" },
      { label: "Hiring workspace", href: "/hiring-workspace" },
      { label: "Manage team projects", href: "/manage-team-projects" },
      { label: "Sign contracts", href: "/sign-contracts" },
      { label: "Approve invoices", href: "/approve-invoices" },
      { label: "Global payments & tax", href: "/global-payments-tax" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Explore products", href: "/products" },
      { label: "Compare products", href: "/compare" },
      { label: "Explore all experts", href: "/experts" },
      { label: "Top experts", href: "/experts/top" },
      { label: "Engineering", href: "/experts/engineering" },
      { label: "Data & AI", href: "/experts/data-ai" },
      { label: "Product", href: "/experts/product" },
      { label: "Marketing ops", href: "/experts/marketing" },
      { label: "Finance & ops", href: "/experts/finance-ops" },
      { label: "Business consulting", href: "/experts/consulting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Proploy agent", href: "/proploy-agent" },
      { label: "Hiring calculator", href: "/hiring-calculator" },
      { label: "Customer stories", href: "/customers" },
      { label: "Guides", href: "/guides" },
      { label: "Events", href: "/events" },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Referrals", href: "/refer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Mission", href: "/mission" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Help center", href: "/help" },
      { label: "For consulting firms", href: "/for-agencies" },
      { label: "For partners", href: "/for-partners" },
      { label: "For investors", href: "/for-investors" },
    ],
  },
];

const LEGAL = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Cookies", href: "/legal/cookies" },
];

// Only LinkedIn had a real destination in the legacy footer; the other five
// icons pointed at "#", so they are dropped rather than shipped dead.
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/proploy",
    path: "M4.5 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM3 8.5h3v12H3v-12Zm5.5 0h2.9v1.7h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2 3.8 4.7v7.3h-3v-6.5c0-1.6 0-3.6-2.2-3.6s-2.6 1.7-2.6 3.5v6.6h-3v-12Z",
  },
];

export function Footer() {
  return (
    <footer className="rule-x bg-paper">
      <div className="mx-auto max-w-[1520px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_auto]">
          <div>
            <Link href="/" aria-label="Proploy home" className="inline-flex items-center">
              <Logo className="h-8" />
            </Link>
            <p className="mt-4 max-w-[30ch] text-[0.875rem] leading-relaxed text-ink-soft">
              The vetted network for choosing, implementing, and launching the right software — built
              for experts and the businesses that hire them.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-soft transition-colors duration-300 hover:border-cobalt hover:text-cobalt"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-[repeat(5,149px)] min-[640px]:gap-x-10 min-[1280px]:gap-x-12 min-[1400px]:gap-x-16 min-[1520px]:gap-x-20"
          >
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h3 className="label">{c.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={`${c.title}-${l.href}`}>
                      <Link
                        href={l.href}
                        className="text-[0.875rem] text-ink-soft transition-colors hover:text-cobalt"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="rule-x mt-14 flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-[0.8125rem] text-ink-soft">© 2026 Proploy. All rights reserved.</p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.8125rem] text-ink-soft transition-colors hover:text-cobalt"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="label">Discover · Decide · Deploy · Done</p>
        </div>
      </div>
    </footer>
  );
}
