import type { Metadata } from 'next'
import { DM_Sans, Inter, IBM_Plex_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import { AuthProvider } from '@/components/providers/auth-provider'
import { MotionProvider } from '@/components/providers/motion-provider'
import { AuthBootstrapSplash } from '@/components/ui/AuthBootstrapSplash'
import { CompareSelectionProvider } from '@/features/compare/selection-store'
import { InterestCaptureProvider } from '@/features/interests/InterestCaptureProvider'
import { FavoritesProvider } from '@/features/users'
import CompareTray from '@/components/compare/CompareTray'
import { FeedbackWidget } from '@/features/feedback/FeedbackWidget'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'

import '../globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

// Pages write their own full title ("Blog — Proploy"), so there is no title
// template here: one would brand every existing title twice. These values are
// the fallback for routes that set nothing, and `metadataBase` is what turns
// relative canonical and OG URLs into absolute ones on the canonical host.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Proploy — Software marketplace with implementation experts',
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased font-inter flex flex-col min-h-dvh">
        <NextTopLoader
          color="#155eef"
          height={3}
          showSpinner={false}
          shadow="0 0 8px #155eef"
          crawlSpeed={400}
          speed={300}
        />
        <MotionProvider>
          <AuthProvider>
            <AuthBootstrapSplash>
              <FavoritesProvider>
                <CompareSelectionProvider>
                  <InterestCaptureProvider>
                    <Navbar />
                      <main className="flex-1 w-full">{children}</main>
                      <SiteFooter />
                      <CompareTray />
                      <FeedbackWidget />
                    </InterestCaptureProvider>
                </CompareSelectionProvider>
              </FavoritesProvider>
            </AuthBootstrapSplash>
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  )
}