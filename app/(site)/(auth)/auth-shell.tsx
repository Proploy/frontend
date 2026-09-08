import Link from 'next/link'
import Image from 'next/image'

import { AuthPanel } from './auth-panels'
import type { AuthPanelVariant } from './auth-panel-variant'

// Shared v2 shell for the auth flow: dark brand panel on the left (lg+),
// centered form column on the right. The global Navbar/SiteFooter are
// suppressed on these routes via lib/site-chrome.ts (AUTH_ROUTES), so this
// shell owns the full viewport.
//
// `variant` picks which brand panel fills the left column — it reflects the
// route the user was gated from, so someone bounced off Sam sees what Sam
// does rather than a generic marketplace pitch. The pages resolve it from
// their `searchParams` on the server, so the correct panel is in the first
// paint with no post-hydration swap. See auth-panel-variant.ts.
export function AuthShell({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: AuthPanelVariant
}) {
  return (
    <div className="pp-scope flex min-h-dvh lg:h-dvh" style={{ background: 'var(--paper)' }}>
      {/* The panel never scrolls — it is scenery, not content. The body centres
          itself with `margin: auto` (see `.ap-body`) and `.pp-dark` clips any
          overflow, so a short viewport crops the panel rather than putting a
          scrollbar beside the form. */}
      <div
        className="pp-dark hidden lg:flex"
        style={{
          borderRadius: 0,
          flex: 3,
          padding: 'var(--sp-16)',
        }}
      >
        <AuthPanel variant={variant} />
      </div>

      <div
        className="flex w-full flex-col"
        style={{ flex: 2, padding: 'var(--sp-8) var(--sp-6)', overflowY: 'auto', minHeight: 0 }}
      >
        {/* `margin: auto` (rather than justify-content) centres the form against
            the brand panel when there is room, and degrades to normal flow —
            no clipped top edge — once the form is taller than the column. */}
        <div style={{ maxWidth: 420, width: '100%', margin: 'auto' }}>
          {/* Only shown on small screens, where the brand panel (with its own
              logo) is hidden — on lg+ the left panel already carries the mark. */}
          <Link href="/" aria-label="Proploy home" className="inline-flex lg:hidden" style={{ marginBottom: 'var(--sp-12)' }}>
            <Image alt="Proploy" src="/proploy-logomark.png" width={44} height={44} />
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
