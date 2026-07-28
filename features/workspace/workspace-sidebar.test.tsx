// @vitest-environment jsdom

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { WorkspaceShell } from '@/components/workspace/WorkspaceShell'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

vi.mock('next/navigation', () => ({
  usePathname: () => '/workspace/engagements',
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => React.createElement(
    'a',
    { href, ...props },
    children,
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    const imageProps = { ...props }
    delete imageProps.priority
    return React.createElement('img', imageProps)
  },
}))

vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: {
      name: 'Priyanshu Kumar',
      email: 'priyanshu@example.com',
    },
    signOut: vi.fn(async () => undefined),
  }),
}))

describe('WorkspaceShell sidebar', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function renderSidebar(): HTMLElement {
    act(() => {
      root.render(
        <WorkspaceShell role="expert">
          <main>Workspace content</main>
        </WorkspaceShell>,
      )
    })

    const sidebar = container.querySelector<HTMLElement>('aside')
    if (!sidebar) throw new Error('Desktop sidebar was not rendered')
    return sidebar
  }

  function click(element: Element) {
    act(() => {
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
  }

  it('uses global chevrons, hides the collapsed brand, and omits Support', () => {
    const sidebar = renderSidebar()
    const collapseButton = sidebar.querySelector<HTMLButtonElement>(
      'button[aria-label="Collapse sidebar"]',
    )
    if (!collapseButton) throw new Error('Collapse control was not rendered')

    expect(sidebar.querySelector('.lucide-chevron-left')).not.toBeNull()
    expect(sidebar.textContent).not.toContain('Support')
    expect(sidebar.querySelector('img[alt="Proploy"]')).not.toBeNull()

    click(collapseButton)

    expect(sidebar.querySelector('a[aria-label="Proploy"]')).toBeNull()
    expect(sidebar.querySelector('img[alt="Proploy"]')).toBeNull()
    expect(sidebar.querySelector('.lucide-chevron-right')).not.toBeNull()
    expect(sidebar.querySelector('button[aria-label="Expand sidebar"]')).not.toBeNull()
  })
})
