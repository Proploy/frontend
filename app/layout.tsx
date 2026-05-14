import type { Metadata } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import ProployAgentShell from '@/components/agent/ProployAgentShell'
import { AuthProvider } from '@/components/providers/auth-provider'

import './globals.css'

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
        <AuthProvider>
          <ProployAgentShell>
            <Navbar />
            <main className="flex-1">{children}</main>
          </ProployAgentShell>
        </AuthProvider>
      </body>
    </html>
  )
}
