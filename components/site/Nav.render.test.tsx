// @vitest-environment jsdom

import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { render } from '@/test/render'

// Mutable per-test auth + expert-application state for the mocked hooks.
const state: {
  user: { id: string; email: string; role?: string } | null
  expertStatus: string | null
} = { user: null, expertStatus: null }

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    const imageProps = { ...props }
    delete imageProps.priority
    return React.createElement('img', imageProps)
  },
}))

vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({ user: state.user, isLoading: false, signOut: vi.fn() }),
}))

vi.mock('@/features/users/use-user-profile-picture', () => ({
  useUserProfilePicture: () => null,
}))

// Nav's effect depends on `getApplication`, so the mock must hand back the
// same function reference every render or the effect re-fires forever.
const getApplication = async () => ({
  ok: true,
  data: state.expertStatus ? { status: state.expertStatus } : null,
})

vi.mock('@/features/experts/use-expert-application', () => ({
  useExpertApplication: () => ({ getApplication }),
}))

import { Nav } from './Nav'

async function renderNav() {
  const result = await render(<Nav />)
  // Let the expert-status effect resolve.
  await new Promise((r) => setTimeout(r, 0))
  return result
}

function ctaOf(container: HTMLElement) {
  // Desktop CTA pill is the anchor right after "Log in"/avatar; match by label.
  const anchors = Array.from(container.querySelectorAll('a'))
  return anchors.find((a) =>
    /Join as Expert|Find an Expert|Workspace|Application Pending|Complete Application/.test(a.textContent ?? ''),
  )
}

describe('v2 Nav CTA is role-aware', () => {
  beforeEach(() => {
    state.user = null
    state.expertStatus = null
  })

  it('invites a signed-out visitor to join as an expert', async () => {
    const { container, unmount } = await renderNav()
    const cta = ctaOf(container)
    expect(cta?.textContent).toContain('Join as Expert')
    expect(cta?.getAttribute('href')).toBe('/become-expert')
    await unmount()
  })

  it('invites a buyer ("user" role) to join as an expert', async () => {
    state.user = { id: 'u1', email: 'buyer@example.com', role: 'user' }
    const { container, unmount } = await renderNav()
    const cta = ctaOf(container)
    expect(cta?.textContent).toContain('Join as Expert')
    expect(cta?.getAttribute('href')).toBe('/become-expert')
    await unmount()
  })

  it('keeps "Workspace" for an approved expert and still shows the Ask SAM tab', async () => {
    state.user = { id: 'e1', email: 'expert@example.com', role: 'expert' }
    state.expertStatus = 'approved'
    const { container, unmount } = await renderNav()
    const cta = ctaOf(container)
    expect(cta?.textContent).toContain('Workspace')
    expect(cta?.getAttribute('href')).toBe('/workspace')
    // /ask-sam is the public page describing Sam, so everyone can read it.
    // The workspace itself is what experts are kept out of, and that is
    // enforced on the route rather than by hiding this tab.
    expect(container.querySelector('a[href="/ask-sam"]')).not.toBeNull()
    expect(container.querySelector('a[href="/AI_workspace"]')).toBeNull()
    await unmount()
  })

  it('falls back to the marketplace CTA for other roles', async () => {
    state.user = { id: 'b1', email: 'ops@example.com', role: 'business' }
    const { container, unmount } = await renderNav()
    const cta = ctaOf(container)
    expect(cta?.textContent).toContain('Find an Expert')
    expect(cta?.getAttribute('href')).toBe('/experts')
    await unmount()
  })

  it('links the Ask SAM tab to the branding page for buyers', async () => {
    state.user = { id: 'u1', email: 'buyer@example.com', role: 'user' }
    const { container, unmount } = await renderNav()
    const tab = container.querySelector('a[href="/ask-sam"]')
    expect(tab).not.toBeNull()
    expect(tab!.textContent).toContain('Ask SAM')
    expect(container.querySelector('a[href="/AI_workspace"]')).toBeNull()
    await unmount()
  })
})

describe('v2 Nav hover flyouts', () => {
  beforeEach(() => {
    state.user = null
    state.expertStatus = null
  })

  it('renders an orientation panel with quick links under Products and Experts', async () => {
    const { container, unmount } = await renderNav()

    const products = container.querySelector('[data-testid="products-flyout"]')
    expect(products).not.toBeNull()
    expect(products!.textContent).toContain('Curated B2B software')
    expect(products!.querySelector('a[href="/products"]')).not.toBeNull()
    expect(products!.querySelector('a[href="/compare"]')).not.toBeNull()
    expect(products!.textContent).not.toContain('Browse by')

    const experts = container.querySelector('[data-testid="experts-flyout"]')
    expect(experts).not.toBeNull()
    expect(experts!.textContent).toContain('Vetted implementation specialists')
    expect(experts!.querySelector('a[href="/experts"]')).not.toBeNull()
    expect(experts!.querySelector('a[href="/for-experts"]')).not.toBeNull()
    expect(experts!.textContent).not.toContain('Browse by')

    await unmount()
  })
})
