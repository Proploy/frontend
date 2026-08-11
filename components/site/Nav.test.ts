import fs from 'node:fs'
import path from 'node:path'

function readSource(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8')
}

describe('Landing page navbar ownership', () => {
  it('uses the established global marketplace navbar on the landing page', () => {
    const layoutSource = readSource('app/(site)/layout.tsx')
    const pageSource = readSource('app/(site)/(landing-page)/page.tsx')
    const navbarSource = readSource('components/Navbar.tsx')

    // The root layout owns the navbar, and the landing page no longer
    // double-mounts a V2-only header on top of it.
    expect(layoutSource).toContain('<Navbar />')
    expect(pageSource).not.toContain('@/components/site/Nav')
    expect(pageSource).not.toContain('<Nav />')

    // The established global navbar uses the /PROPLOY.svg lockup.
    expect(navbarSource).toContain('src="/PROPLOY.svg"')
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