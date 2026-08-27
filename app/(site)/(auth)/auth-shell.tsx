import Link from 'next/link'
import Image from 'next/image'

// Shared v2 shell for the auth flow: dark brand panel on the left (lg+),
// centered form column on the right. The global Navbar/SiteFooter are
// suppressed on these routes via lib/site-chrome.ts (AUTH_ROUTES), so this
// shell owns the full viewport.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pp-scope flex min-h-dvh lg:h-dvh" style={{ background: 'var(--paper)' }}>
      <div
        className="pp-dark hidden lg:flex"
        style={{
          borderRadius: 0,
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--sp-16)',
        }}
      >
        <div className="pp-stack pp-gap-12" style={{ maxWidth: 560 }}>
          <Image alt="Proploy" src="/proploy-logomark-white.png" width={44} height={44} />

          <div className="pp-stack pp-gap-6">
            <p className="pp-label">AI software marketplace</p>
            <h1 className="pp-display pp-d2">
              Discover. Decide.
              <br />
              Deploy. Done.
            </h1>
            <p className="pp-lede" style={{ maxWidth: '44ch' }}>
              The marketplace that matches your business with the right software —
              and the vetted experts who make it work.
            </p>
          </div>

          <ul className="pp-stack pp-gap-3">
            {[
              'Products scored against your stack and sector',
              'Specialists vetted before they ever see a brief',
              'Contracts, invoices and payments in one workspace',
            ].map((line) => (
              <li key={line} className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                <span className="pp-yes" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="pp-body">{line}</span>
              </li>
            ))}
          </ul>
        </div>
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
