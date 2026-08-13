import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'

// Shared chrome for v2 design-system pages (the footer-linked marketing,
// resource, company, and legal pages). Provides the pp-scope wrapper with the
// v2 Nav + Footer once, so each page only renders its own <main>. The global
// legacy Navbar/SiteFooter are suppressed on these routes via
// lib/site-chrome.ts (V2_CHROME_PREFIXES / V2_CHROME_EXACT).
export default function V2PagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
