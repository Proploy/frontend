import fs from 'node:fs'
import path from 'node:path'

function readSource(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8')
}

describe('Landing page navbar ownership', () => {
  it('ships the v2 Nav on the landing page with the global navbar suppressed', () => {
    const layoutSource = readSource('app/(site)/layout.tsx')
    const pageSource = readSource('app/(site)/(landing-page)/page.tsx')
    const chromeSource = readSource('lib/site-chrome.ts')

    // The root layout still mounts the global Navbar for legacy routes...
    expect(layoutSource).toContain('<Navbar />')
    // ...but the landing page owns its own v2 chrome (Nav + Footer)...
    expect(pageSource).toContain('@/components/site/Nav')
    expect(pageSource).toContain('<Nav />')
    expect(pageSource).toContain('<Footer />')
    // ...and site-chrome suppresses the global chrome on "/" so the two never
    // stack (the "twin navbars" regression).
    expect(chromeSource).toContain("pathname === '/'")
  })
})

describe('V2 section Logo component (used by Footer)', () => {
  it('renders the same /PROPLOY.svg lockup as the global navbar', () => {
    const navSource = readSource('components/site/Nav.tsx')
    const footerSource = readSource('components/Footer.tsx')
    expect(navSource).toContain('src="/PROPLOY.svg"')
    expect(footerSource).toContain('src="/PROPLOY.svg"')
  })
})

describe('Role-aware expert navigation', () => {
  it('uses the server-supplied account role to control the expert CTA', () => {
    const navbarSource = readSource('components/Navbar.tsx')
    const rolesSource = readSource('lib/auth/roles.ts')

    expect(navbarSource).toContain('canSeeExpertJoinLink')
    expect(navbarSource).toContain('isExpertRole')
    expect(navbarSource).toContain("label: 'Join Us'")
    expect(navbarSource).toContain("link.href !== '/for-experts'")
    expect(navbarSource).toContain('canJoinAsExpert')
    expect(navbarSource).toContain("href=\"/for-experts\"")
    expect(navbarSource).toContain('aria-label="Join Us"')
    expect(navbarSource).toContain('<ToggleLeft')
    expect(navbarSource).toContain('Join us as an expert')
    expect(navbarSource).toContain('role="tooltip"')
    expect(navbarSource).toContain(": 'Find an Expert'")
    expect(navbarSource).toContain(": '/experts'")
    expect(navbarSource).toContain('{showAiWorkspace && (')
    expect(rolesSource).toContain("role === 'user'")
    expect(rolesSource).toContain('!isAuthenticated')
  })
})
