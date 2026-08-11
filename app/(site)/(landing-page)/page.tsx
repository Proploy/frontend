import type { Metadata } from 'next'

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

// The global marketing Navbar (mounted from `app/(site)/layout.tsx`) is the
// only header on this route — keeping a single navbar across the site avoids
// the "twin navbars" regression where the V2 compact header layered on top
// of the global one. The AI chatbot (ProployAgentShell) and CompareTray are
// still mounted from the root layout.
export default function LandingPage() {
  return (
    <div className="font-inter overflow-x-clip bg-paper text-ink">
      <Hero />
      <LogoMarquee />
      <ValueProps />
      <Industries />
      <HowItWorks />
      <Integrations />
      <ClosingCTA />
    </div>
  )
}