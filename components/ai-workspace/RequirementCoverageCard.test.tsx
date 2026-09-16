import { act } from 'react'
import { render } from '@/test/render'
import { RequirementCoverageCard } from './RequirementCoverageCard'
import type { EvaluationProduct } from '@/features/ai-workspace/evaluation-types'

function product(name: string, cells: Record<string, unknown>): EvaluationProduct {
  return {
    product_id: name.toLowerCase(),
    product_name: name,
    requirement_fit: { assessed_at: 'T', basis: {}, cells },
  } as unknown as EvaluationProduct
}

const profile = {
  goals: [{ text: 'improve visibility' }],
  pain_points: ['spreadsheets'],
  constraints: [{ type: 'team_size', value: '50' }],
}

/** The live shape today: catalog rows answered, judgement rows still empty
 *  because the deployed harness emits no verdicts. */
const products = [
  product('Asana', {
    team_size: { status: 'yes', source: 'catalog', note: 'Targets smb teams' },
    integrations: { status: 'unknown', source: 'catalog', note: 'No record of chat' },
  }),
  product('Smartsheet', {
    team_size: { status: 'partial', source: 'catalog' },
    integrations: { status: 'unknown', source: 'catalog' },
  }),
]

function segments(container: HTMLElement, label: string) {
  const row = Array.from(container.querySelectorAll('li')).find((li) =>
    li.textContent?.includes(label),
  )!
  return Array.from(row.querySelectorAll('button')).filter((b) => b.getAttribute('aria-label'))
}

describe('RequirementCoverageCard', () => {
  it('draws one segment per product on every requirement', async () => {
    const view = await render(<RequirementCoverageCard products={products} profile={profile} />)
    expect(segments(view.container, 'Team size')).toHaveLength(2)
    expect(segments(view.container, 'Goal')).toHaveLength(2)
  })

  it('names the product on hover instead of a left-to-right caption', async () => {
    // The caption asked the reader to count along the bar and hold the product
    // order in their head, on every row of the card.
    const view = await render(<RequirementCoverageCard products={products} profile={profile} />)
    expect(view.container.textContent).not.toContain('Left to right')

    const [asana] = segments(view.container, 'Team size')
    expect(asana.getAttribute('aria-label')).toBe('Asana: Meets on Team size')

    // Product names are nowhere on the card until a segment is pointed at.
    expect(view.container.textContent).not.toContain('Asana')

    await act(async () => asana.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })))
    expect(view.container.textContent).toContain('Asana')

    await act(async () => asana.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
    expect(view.container.textContent).not.toContain('Asana')
  })

  it('does not restate the requirement list — values appear only on expansion', async () => {
    const view = await render(<RequirementCoverageCard products={products} profile={profile} />)
    // The panel above already lists these; repeating them taught nothing.
    expect(view.container.textContent).not.toContain('improve visibility')

    const goalToggle = Array.from(view.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Goal'),
    )!
    await act(async () => goalToggle.click())
    expect(view.container.textContent).toContain('improve visibility')
    expect(goalToggle.getAttribute('aria-expanded')).toBe('true')
  })

  it('counts an unknown verdict as unanswered, not as a check', async () => {
    // "No record of chat" is the gateway saying it looked and could not tell.
    // Counting it made a row of blanks read as "Answered".
    const view = await render(<RequirementCoverageCard products={products} profile={profile} />)
    const header = view.container.textContent ?? ''
    expect(header).toContain('2 checked')
    expect(header).toContain('0 judged')
  })

  it('renders nothing without products to compare across', async () => {
    const view = await render(<RequirementCoverageCard products={[]} profile={profile} />)
    expect(view.container.textContent).toBe('')
  })
})
