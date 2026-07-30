import Link from 'next/link'

const socialIcons = [
  { name: 'X', src: '/figma-assets/75baadf3b77ef3d935aafa1c9b8e09f037efcfba.svg', href: '#' },
  { name: 'LinkedIn', src: '/figma-assets/6ca668074a1b41da89258516519648f14b0affd2.svg', href: 'https://www.linkedin.com/company/proploy' },
  { name: 'Instagram', src: '/figma-assets/6f1370b81e7c3c55c87030b09327de26081a1283.svg', href: '#' },
  { name: 'YouTube', src: '/figma-assets/51a8405e07fce0819eda7bb2ee0943fc1a1ec30b.svg', href: '#' },
  { name: 'TikTok', src: '/figma-assets/d8536413008fcdff809659ca63b7b960db7d7d3f.svg', href: '#' },
  { name: 'Dribbble', src: '/figma-assets/9dc208c39b518559e692e38c7f024a68f422cacb.svg', href: '#' },
]

/**
 * Full site IA — single source of truth for which marketing pages exist.
 * Mapped from Contra's footer to Proploy's software-implementation marketplace.
 * Adding a page? Add its link here.
 */
const footerColumns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'For Experts',
    links: [
      { label: 'Become an expert', href: '/become-expert' },
      { label: 'Manage projects', href: '/manage-projects' },
      { label: 'Get discovered', href: '/get-discovered' },
      { label: 'Find work', href: '/find-work' },
      { label: 'Sign contracts', href: '/sign-contracts' },
      { label: 'Send invoices', href: '/send-invoices' },
      { label: 'Payments', href: '/payments' },
      { label: 'Global payments', href: '/global-payments' },
      { label: 'Transparent pricing', href: '/commission' },
    ],
  },
  {
    title: 'For Businesses',
    links: [
      { label: 'For businesses', href: '/for-businesses' },
      { label: 'Discover experts', href: '/discover-experts' },
      { label: 'Manage team projects', href: '/manage-team-projects' },
      { label: 'Hiring workspace', href: '/hiring-workspace' },
      { label: 'Post a job', href: '/post-a-job' },
      { label: 'Sign contracts', href: '/sign-contracts' },
      { label: 'Approve invoices', href: '/approve-invoices' },
      { label: 'Global payments & tax', href: '/global-payments-tax' },
    ],
  },
  {
    title: 'Use cases',
    links: [
      { label: 'For businesses', href: '/for-businesses' },
      { label: 'For experts', href: '/for-experts' },
      { label: 'For consulting firms', href: '/for-agencies' },
      { label: 'For partners', href: '/for-partners' },
      { label: 'For investors', href: '/for-investors' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Proploy agent', href: '/proploy-agent' },
      { label: 'Hiring calculator', href: '/hiring-calculator' },
      { label: 'Customer stories', href: '/customers' },
      { label: 'Guides', href: '/guides' },
      { label: 'Events', href: '/events' },
      { label: 'Partnerships', href: '/partnerships' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Referrals', href: '/refer' },
    ],
  },
  {
    title: 'Hire experts',
    links: [
      { label: 'Explore all', href: '/experts' },
      { label: 'Top experts', href: '/experts/top' },
      { label: 'Engineering', href: '/experts/engineering' },
      { label: 'Data & AI', href: '/experts/data-ai' },
      { label: 'Product', href: '/experts/product' },
      { label: 'Marketing ops', href: '/experts/marketing' },
      { label: 'Finance & ops', href: '/experts/finance-ops' },
      { label: 'Business consulting', href: '/experts/consulting' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Mission', href: '/mission' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Help center', href: '/help' },
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="w-full pt-[64px] pb-[48px] border-t border-[#e9eaeb] bg-[#f5f8ff]">
      <div className="max-w-[1280px] mx-auto px-[32px]">
        {/* Top: brand + link columns */}
        <div className="flex flex-col lg:flex-row gap-x-[64px] gap-y-[48px]">
          <div className="flex flex-col gap-[24px] lg:max-w-[280px]">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/proploy-logo.png" alt="Proploy" className="h-[32px] w-auto" />
            </Link>
            <p
              className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#535862]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              The vetted network for choosing, implementing, and launching the right software — built for experts and the
              businesses that hire them.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-[32px] gap-y-[40px]">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-[16px]">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#717680]">
                  {col.title}
                </p>
                <div className="flex flex-col gap-[12px]">
                  {col.links.map((link) => (
                    <Link
                      key={`${col.title}-${link.label}`}
                      href={link.href}
                      className="font-[family-name:var(--font-dm-sans)] font-medium text-[15px] leading-[22px] text-[#535862] hover:text-[#155eef] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom: copyright + social */}
        <div className="flex flex-wrap items-center justify-between gap-y-[24px] border-t border-[#e9eaeb] pt-[32px] mt-[64px]">
          <p
            className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#717680]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            © 2026 Proploy. All rights reserved.
          </p>
          <div className="flex items-center gap-[24px]">
            {socialIcons.map((icon) => (
              <a
                key={icon.name}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className="size-[24px] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                aria-label={icon.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon.src} alt={icon.name} className="size-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
