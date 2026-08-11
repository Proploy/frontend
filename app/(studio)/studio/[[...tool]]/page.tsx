import { NextStudio } from 'next-sanity/studio'

import config from '@/sanity.config'

/**
 * Embedded Sanity Studio.
 *
 * This is a Server Component that renders the client-side Studio. It must NOT
 * be marked 'use client' — that would break the metadata/viewport re-exports
 * below, which next-sanity provides to set the correct Studio title, theme
 * colour and mobile viewport behaviour.
 *
 * The route lives under the (studio) route group so it uses the bare root
 * layout in app/(studio)/layout.tsx rather than the site shell.
 */

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
