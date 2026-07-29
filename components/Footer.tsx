import Link from 'next/link'

const socialIcons = [
  { name: 'X', src: '/figma-assets/75baadf3b77ef3d935aafa1c9b8e09f037efcfba.svg', href: '#' },
  { name: 'LinkedIn', src: '/figma-assets/6ca668074a1b41da89258516519648f14b0affd2.svg', href: 'https://www.linkedin.com/company/proploy' },
  { name: 'Instagram', src: '/figma-assets/6f1370b81e7c3c55c87030b09327de26081a1283.svg', href: '#' },
  { name: 'YouTube', src: '/figma-assets/51a8405e07fce0819eda7bb2ee0943fc1a1ec30b.svg', href: '#' },
  { name: 'TikTok', src: '/figma-assets/d8536413008fcdff809659ca63b7b960db7d7d3f.svg', href: '#' },
  { name: 'Dribbble', src: '/figma-assets/9dc208c39b518559e692e38c7f024a68f422cacb.svg', href: '#' },
]

const footerLinks = {
  Product: [
    { label: 'Explore by Category', href: '/product' },
    { label: 'Explore by Industry', href: '/product' },
    { label: 'Explore Vetted Experts', href: '/experts' },
    { label: 'Create a Listing', href: '/vendor-onboarding' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Become an Expert', href: '/become-expert' },
    { label: 'FAQs', href: '#' },
  ],
  Legal: [
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Licenses', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="pt-[64px] pb-[48px]">
      <div className="max-w-[1280px] mx-auto px-[32px]">
        {/* Top section: Logo + link columns */}
        <div className="flex flex-col gap-y-[48px] md:flex-row md:flex-wrap md:gap-x-[64px] md:gap-y-[48px] md:items-start">
          {/* Logo and tagline */}
          <div className="flex w-full flex-col gap-[24px] md:max-w-[320px] md:min-w-[280px] md:flex-1">
            <p
              className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#535862]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Discover, compare, and connect with the best software solutions for your business.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-col gap-[32px] flex-1 md:flex-row md:min-w-0">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="flex-1 flex flex-col gap-[16px] min-w-[96px]">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#717680]">
                  {title}
                </p>
                <div className="flex flex-col gap-[12px]">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#535862] hover:text-[#414651] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section: Copyright + Social icons */}
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
                <img src={icon.src} alt={icon.name} className="size-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
