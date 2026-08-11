import type { Metadata, Viewport } from 'next'

/**
 * Root layout for the embedded Sanity Studio.
 *
 * This is a SECOND root layout (see `app/(site)/layout.tsx` for the first),
 * made possible by Next.js route groups. It deliberately renders its own
 * <html>/<body> and shares nothing with the site shell:
 *
 *  - No `globals.css` import. Tailwind v4's preflight would reset Studio's
 *    own styles. Studio ships its own CSS via `next-sanity/studio`.
 *  - No next/font loaders, no providers, no Navbar/CompareTray.
 *  - No <SanityLive /> or <VisualEditing /> — those belong to the site only.
 */

export const metadata: Metadata = {
  title: 'Proploy Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default function StudioRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
