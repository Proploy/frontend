import type { Metadata } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import Navbar from '@/components/Navbar'
import ProployAgentShell from '@/components/agent/ProployAgentShell'
import { AuthProvider } from '@/components/providers/auth-provider'
import { MotionProvider } from '@/components/providers/motion-provider'
import { AuthBootstrapSplash } from '@/components/ui/AuthBootstrapSplash'
import { CompareSelectionProvider } from '@/features/compare/selection-store'
import { InterestCaptureProvider } from '@/features/interests/InterestCaptureProvider'
import { FavoritesProvider } from '@/features/users'
import CompareTray from '@/components/compare/CompareTray'

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

export const metadata: Metadata = {
  title: 'Proploy - Procurement Solutions',
  description: 'Smart procurement platform for your business needs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <body className="antialiased font-inter flex flex-col min-h-screen">
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
                    <ProployAgentShell>
                      <Navbar />
                      <main className="flex-1 w-full">{children}</main>
                      <CompareTray />
                    </ProployAgentShell>
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
