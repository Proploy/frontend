import type { Metadata } from 'next'

import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/Hero'
import { LogoMarquee } from '@/components/site/LogoMarquee'
import { ValueProps } from '@/components/site/ValueProps'
import { Industries } from '@/components/site/Industries'
import { HowItWorks } from '@/components/site/HowItWorks'
import { Integrations } from '@/components/site/Integrations'
import { ClosingCTA } from '@/components/site/ClosingCTA'

export const metadata: Metadata = {
  title: 'Proploy — AI software marketplace with vetted implementation experts',
  description:
    'Proploy matches your business with the right software and the vetted experts who deploy it. Pre-negotiated pricing, full spend visibility, guaranteed execution.',
}

// The homepage ships the v2 Nav + Footer (design-system chrome). The global
// legacy Navbar/SiteFooter are suppressed on "/" via hidesGlobalChrome in
// lib/site-chrome.ts, so there is still exactly one navbar on this route.
// The AI chatbot (ProployAgentShell) and CompareTray are still mounted from
// the root layout.
export default function LandingPage() {
  return (
    <div className="font-inter overflow-x-clip bg-paper text-ink">
      <Nav />
      <Hero />
      <LogoMarquee />
      <ValueProps />
      <Industries />
      <HowItWorks />
      <Integrations />
      <ClosingCTA />
      <Footer />
    </div>
  )
}