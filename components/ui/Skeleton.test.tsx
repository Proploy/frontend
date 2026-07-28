import { render } from '@/test/render'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a basic block with aria-hidden and the pulse classes', async () => {
    const view = await render(<Skeleton className="h-4 w-32" data-testid="sk" />)
    const node = view.container.querySelector('[data-testid="sk"]') as HTMLElement
    expect(node).toBeTruthy()
    expect(node.getAttribute('aria-hidden')).toBe('true')
    expect(node.className).toContain('rounded-md')
    expect(node.className).toContain('bg-[var(--color-gray-100,#f5f5f5)]')
    // animation gated behind motion-safe: — Tailwind only emits the class
    // when the variant is referenced, so we assert the static "motion-safe:animate-pulse" substring
    expect(node.className).toContain('motion-safe:animate-pulse')
    await view.unmount()
  })

  it('forwards custom className and extra attributes', async () => {
    const view = await render(
      <Skeleton
        className="h-12 w-12 rounded-full"
        data-testid="sk"
        role="presentation"
      />,
    )
    const node = view.container.querySelector('[data-testid="sk"]') as HTMLElement
    expect(node.className).toContain('h-12')
    expect(node.className).toContain('w-12')
    expect(node.className).toContain('rounded-full')
    expect(node.getAttribute('role')).toBe('presentation')
    await view.unmount()
  })

  it('switches to a circle shape when shape="circle"', async () => {
    const view = await render(<Skeleton shape="circle" data-testid="sk" />)
    const node = view.container.querySelector('[data-testid="sk"]') as HTMLElement
    expect(node.className).toContain('rounded-full')
    await view.unmount()
  })

  it('exposes compound variants on the default export', async () => {
    expect(typeof Skeleton.Text).toBe('function')
    expect(typeof Skeleton.Circle).toBe('function')
    expect(typeof Skeleton.Card).toBe('function')
    expect(typeof Skeleton.Row).toBe('function')
  })
})

describe('Skeleton.Text', () => {
  it('renders the requested number of lines', async () => {
    const view = await render(<Skeleton.Text lines={4} data-testid="t" />)
    const wrapper = view.container.querySelector('[data-testid="t"]') as HTMLElement
    const blocks = wrapper.querySelectorAll(':scope > div')
    expect(blocks.length).toBe(4)
    await view.unmount()
  })

  it('clamps lines to a minimum of 1', async () => {
    const view = await render(<Skeleton.Text lines={0} data-testid="t" />)
    const wrapper = view.container.querySelector('[data-testid="t"]') as HTMLElement
    expect(wrapper.querySelectorAll(':scope > div').length).toBe(1)
    await view.unmount()
  })

  it('clamps lines to a maximum of 10', async () => {
    const view = await render(<Skeleton.Text lines={99} data-testid="t" />)
    const wrapper = view.container.querySelector('[data-testid="t"]') as HTMLElement
    expect(wrapper.querySelectorAll(':scope > div').length).toBe(10)
    await view.unmount()
  })
})

describe('Skeleton.Circle', () => {
  it('applies the requested size as inline width/height', async () => {
    const view = await render(<Skeleton.Circle size={56} data-testid="c" />)
    const node = view.container.querySelector('[data-testid="c"]') as HTMLElement
    expect(node.style.width).toBe('56px')
    expect(node.style.height).toBe('56px')
    expect(node.className).toContain('rounded-full')
    await view.unmount()
  })
})

describe('Skeleton.Card', () => {
  it('renders default body (heading + text lines)', async () => {
    const view = await render(<Skeleton.Card data-testid="card" />)
    const node = view.container.querySelector('[data-testid="card"]') as HTMLElement
    expect(node.getAttribute('role')).toBe('status')
    expect(node.getAttribute('aria-busy')).toBe('true')
    // 1 heading block + 3 text lines by default
    const blocks = node.querySelectorAll(':scope [aria-hidden="true"]')
    expect(blocks.length).toBeGreaterThanOrEqual(4)
    await view.unmount()
  })

  it('renders custom children when provided', async () => {
    const view = await render(
      <Skeleton.Card data-testid="card">
        <span data-testid="custom">custom</span>
      </Skeleton.Card>,
    )
    expect(view.container.querySelector('[data-testid="custom"]')).toBeTruthy()
    await view.unmount()
  })
})

describe('Skeleton.Row', () => {
  it('renders an avatar circle plus a text block', async () => {
    const view = await render(<Skeleton.Row avatarSize={32} data-testid="row" />)
    const wrapper = view.container.querySelector('[data-testid="row"]') as HTMLElement
    expect(wrapper.getAttribute('role')).toBe('status')
    const circles = wrapper.querySelectorAll('.rounded-full')
    expect(circles.length).toBeGreaterThanOrEqual(1)
    await view.unmount()
  })
})
