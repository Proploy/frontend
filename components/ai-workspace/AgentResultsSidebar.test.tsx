import { act } from 'react'
import { render } from '@/test/render'
import type { EvaluationDetail, EvaluationProduct } from '@/features/ai-workspace'
import { AgentResultsSidebar } from './AgentResultsSidebar'

const base: EvaluationDetail = {
  evaluation_id: 'evaluation-1',
  agent_session_id: 'session-1',
  title: 'Project management tools',
  status: 'active',
  stage: 'discovering_products',
  attention_group: 'in_progress',
  next_action: 'continue',
  shortlist_count: 0,
  match_count: 0,
  recommendation_state: 'unavailable',
  regeneration_status: 'idle',
  milestones: {
    requirements_confirmed: false,
    products_discovered: false,
    shortlist_ready: false,
    recommendation_generated: false,
  },
  progress_percent: 0,
  comparison_product_ids: [],
  requirements: null,
  missing_critical_signals: [],
  matches: [],
  shortlist: [],
  recommendation: null,
  messages: [],
}

const first: EvaluationProduct = {
  product_id: 'asana',
  product_name: 'Asana',
  profile_href: '/products/asana',
  available: true,
  match_score: 75,
  reasons: ['Broad team fit'],
  is_agent_selected: true,
}
const second: EvaluationProduct = {
  product_id: 'linear',
  product_name: 'Linear',
  profile_href: '/products/linear',
  available: true,
  match_score: 92,
  is_agent_selected: true,
}
const noise: EvaluationProduct = {
  product_id: 'noise',
  product_name: 'Noise',
  profile_href: '/products/noise',
  available: true,
  match_score: 99,
}

describe('AgentResultsSidebar', () => {
  it('shows an empty state before Sam returns anything', async () => {
    const view = await render(<AgentResultsSidebar evaluation={base} />)
    expect(view.container.textContent).toContain('No products yet')
    await view.unmount()
  })

  it('lists only agent-returned products, best score first, with reasons and links', async () => {
    const view = await render(
      <AgentResultsSidebar evaluation={{ ...base, matches: [first, noise, second] }} />,
    )
    const text = view.container.textContent ?? ''
    expect(text).toContain('2 products')
    // Linear scores 92 to Asana's 75, so it leads regardless of turn order.
    expect(text.indexOf('Linear')).toBeLessThan(text.indexOf('Asana'))
    expect(text).toContain('Broad team fit')
    expect(text).not.toContain('Noise')
    expect(view.container.querySelector('a[href="/products/linear"]')).not.toBeNull()
    await view.unmount()
  })

  it('offers each suggestion to the shortlist, and shows what was kept', async () => {
    const onToggleShortlist = vi.fn()
    const view = await render(
      <AgentResultsSidebar
        evaluation={{ ...base, matches: [first, second], shortlist: [second] }}
        onToggleShortlist={onToggleShortlist}
      />,
    )
    const keep = buttons(view.container).find((b) => b.textContent?.trim() === 'Shortlist')
    expect(keep).toBeDefined()
    await act(async () => keep?.click())
    expect(onToggleShortlist).toHaveBeenCalledWith(expect.objectContaining({ product_id: 'asana' }))

    await act(async () => openLane(view.container, 'Shortlist'))
    const compare = view.container.querySelector<HTMLAnchorElement>('a[href^="/compare?products="]')
    expect(compare?.getAttribute('href')).toBe('/compare?products=linear')
    await view.unmount()
  })
})

const buttons = (root: Element) => Array.from(root.querySelectorAll('button'))

/** The board's lanes are tabs in the results column; open one by its label. */
const openLane = (root: Element, label: string) =>
  buttons(root)
    .find((b) => b.getAttribute('role') === 'tab' && b.textContent?.startsWith(label))
    ?.click()

describe('AgentResultsSidebar next steps', () => {
  const withProducts = { ...base, matches: [first, second] }

  it('asks nothing of a match but keeping it', async () => {
    // A brief is worth writing once the buyer has said the product is worth
    // one, so the matches lane offers the shortlist and nothing else.
    const view = await render(
      <AgentResultsSidebar
        evaluation={withProducts}
        onToggleShortlist={() => undefined}
        onRequestImplementationBrief={() => undefined}
      />,
    )
    expect(buttons(view.container).some((b) => b.textContent?.trim() === 'Shortlist')).toBe(true)
    expect(view.container.textContent).not.toContain('Implementation brief')
    await view.unmount()
  })

  it('offers the implementation brief once the product is shortlisted', async () => {
    const onRequestImplementationBrief = vi.fn()
    const view = await render(
      <AgentResultsSidebar
        evaluation={{ ...withProducts, shortlist: [first] }}
        onRequestImplementationBrief={onRequestImplementationBrief}
      />,
    )
    await act(async () => openLane(view.container, 'Shortlist'))
    const action = buttons(view.container).find((b) => b.textContent?.trim() === 'Implementation brief')
    expect(action).toBeDefined()
    await act(async () => action?.click())
    expect(onRequestImplementationBrief).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: 'asana' }),
    )
    await view.unmount()
  })

  it('offers the comparison brief across the set the buyer kept', async () => {
    const onRequestComparisonBrief = vi.fn()
    const view = await render(
      <AgentResultsSidebar
        evaluation={{ ...withProducts, shortlist: [first, second] }}
        onRequestComparisonBrief={onRequestComparisonBrief}
      />,
    )
    await act(async () => openLane(view.container, 'Shortlist'))
    // Asked from Asana's card, so the brief leads with Asana and covers the
    // rest of the shortlist behind it.
    const cards = Array.from(view.container.querySelectorAll('article'))
    const asanaCard = cards.find((card) => card.textContent?.includes('Asana'))!
    const cta = buttons(asanaCard).find((b) => b.textContent?.trim() === 'Comparison brief')
    expect(cta).toBeDefined()
    await act(async () => cta?.click())
    expect(onRequestComparisonBrief).toHaveBeenCalledWith([
      expect.objectContaining({ product_id: 'asana' }),
      expect.objectContaining({ product_id: 'linear' }),
    ])
    await view.unmount()
  })

  it('keeps undoing a choice out of the row of things to do next', async () => {
    const onToggleShortlist = vi.fn()
    const view = await render(
      <AgentResultsSidebar
        evaluation={{ ...withProducts, shortlist: [first] }}
        onToggleShortlist={onToggleShortlist}
      />,
    )
    await act(async () => openLane(view.container, 'Shortlist'))
    // Removing is an icon in the card's corner, not a button competing with
    // the briefs, so no action in the row reads as "Remove".
    expect(buttons(view.container).some((b) => b.textContent?.trim() === 'Remove')).toBe(false)
    const corner = view.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove Asana from the shortlist"]',
    )
    expect(corner).not.toBeNull()
    await act(async () => corner?.click())
    expect(onToggleShortlist).toHaveBeenCalledWith(expect.objectContaining({ product_id: 'asana' }))
    await view.unmount()
  })

  it('dresses the two agent prompts apart from the comparison page link', async () => {
    const view = await render(
      <AgentResultsSidebar
        evaluation={{ ...withProducts, shortlist: [first, second] }}
        onRequestComparisonBrief={() => undefined}
        onRequestImplementationBrief={() => undefined}
      />,
    )
    await act(async () => openLane(view.container, 'Shortlist'))
    // The /compare page is a destination; the briefs are turns Sam has to
    // take. They must not read as the same kind of promise.
    const page = view.container.querySelector<HTMLAnchorElement>('a[href^="/compare?products="]')!
    const prompts = buttons(view.container).filter((b) =>
      b.textContent?.trim().endsWith('brief'),
    )
    expect(prompts).toHaveLength(4)
    expect(page.className).toContain('bg-ink')
    expect(prompts.every((b) => b.className.includes('ai-pill'))).toBe(true)
    expect(prompts.every((b) => b.className.includes('bg-ink'))).toBe(false)
    await view.unmount()
  })

  it('explains where generated artifacts will appear', async () => {
    const view = await render(<AgentResultsSidebar evaluation={withProducts} />)
    await act(async () => openLane(view.container, 'Artifacts'))
    expect(view.container.textContent).toContain('Comparison and implementation briefs')
    expect(view.container.textContent).not.toContain('Implementation brief')
    await view.unmount()
  })
})

describe('AgentResultsSidebar requirement coverage', () => {
  const profile = { goals: [{ text: 'Replace spreadsheets' }] }

  it('offers the gaps as chips that prefill the composer rather than sending', async () => {
    const onAsk = vi.fn()
    const view = await render(
      <AgentResultsSidebar evaluation={{ ...base, profile }} onAsk={onAsk} />,
    )
    expect(view.container.querySelector('[data-testid="requirements-panel"]')).not.toBeNull()
    expect(view.container.textContent).toContain('Add context')

    const chip = buttons(view.container).find((b) => b.textContent?.includes('Compliance'))
    expect(chip).toBeDefined()
    await act(async () => chip?.click())
    // A prompt starter, left mid-sentence for the buyer to finish.
    expect(onAsk).toHaveBeenCalledWith(expect.stringContaining('meet'))
    await view.unmount()
  })

  it('shows the meter from the first turn, when every row is still a gap', async () => {
    // An empty meter is the most useful state there is: it is the moment the
    // buyer can most improve the shortlist by telling Sam something.
    const view = await render(<AgentResultsSidebar evaluation={base} onAsk={() => undefined} />)
    expect(view.container.querySelector('[data-testid="requirements-panel"]')).not.toBeNull()
    expect(view.container.textContent).toContain('0 captured')
    expect(view.container.textContent).toContain('Add context')
    await view.unmount()
  })

  it('hides the chips when there is nowhere to put the text', async () => {
    const view = await render(<AgentResultsSidebar evaluation={{ ...base, profile }} />)
    expect(view.container.textContent).not.toContain('Tell Sam more')
    await view.unmount()
  })
})
