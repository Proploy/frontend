import type { Metadata } from 'next'

import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { LogoMarquee } from '@/components/site/LogoMarquee'
import { ValueProps } from '@/components/site/ValueProps'
import { Industries } from '@/components/site/Industries'
import { HowItWorks } from '@/components/site/HowItWorks'
import { Integrations } from '@/components/site/Integrations'
import { ClosingCTA } from '@/components/site/ClosingCTA'
import { Footer } from '@/components/site/Footer'

export const metadata: Metadata = {
  title: 'Proploy — AI software marketplace with vetted implementation experts',
  description:
    'Proploy matches your business with the right software and the vetted experts who deploy it. Pre-negotiated pricing, full spend visibility, guaranteed execution.',
}

// New homepage design (ported from the "proploy-ai-expert-match" prototype).
// The global marketing Navbar and SiteFooter are suppressed on this route
// (see lib/site-chrome.ts) so this page owns its own Nav + Footer. The AI
// chatbot (ProployAgentShell) and CompareTray remain mounted from the root layout.
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
