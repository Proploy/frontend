// @vitest-environment jsdom

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  WorkspaceAccountMenu,
  type DashboardUser,
} from '@/components/dashboard/DashboardChrome'

const signOutMock = vi.fn(async () => undefined)

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => React.createElement(
    'a',
    {
      href,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        onClick?.(event)
      },
      ...props,
    },
    children,
  ),
}))

vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    signOut: signOutMock,
  }),
}))

const user: DashboardUser = {
  name: 'Priyanshu Kumar',
  email: 'priyanshu@example.com',
}

describe('WorkspaceAccountMenu', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    signOutMock.mockClear()
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function renderMenu(onNavigate = vi.fn()) {
    act(() => {
      root.render(React.createElement(WorkspaceAccountMenu, { user, onNavigate }))
    })
    return onNavigate
  }

  function getTrigger(): HTMLButtonElement {
    const trigger = container.querySelector<HTMLButtonElement>(
      'button[aria-haspopup="menu"]',
    )
    if (!trigger) throw new Error('Account menu trigger was not rendered')
    return trigger
  }

  function click(element: Element) {
    act(() => {
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
  }

  it('opens from the avatar and closes with Escape', () => {
    renderMenu()
    const trigger = getTrigger()

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('a[href="/profile"]')?.textContent).toContain('Profile')
    expect(container.textContent).toContain('Sign out')

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes on outside interaction', () => {
    renderMenu()
    const trigger = getTrigger()
    click(trigger)

    act(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('navigates to Profile and signs out from the same menu', async () => {
    const onNavigate = renderMenu()
    const trigger = getTrigger()
    click(trigger)

    const profile = container.querySelector<HTMLAnchorElement>('a[href="/profile"]')
    if (!profile) throw new Error('Profile link was not rendered')
    click(profile)

    expect(onNavigate).toHaveBeenCalledOnce()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    click(trigger)
    const signOut = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Sign out'),
    )
    if (!signOut) throw new Error('Sign out button was not rendered')

    await act(async () => {
      signOut.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await Promise.resolve()
    })

    expect(signOutMock).toHaveBeenCalledOnce()
    expect(onNavigate).toHaveBeenCalledTimes(2)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
})
