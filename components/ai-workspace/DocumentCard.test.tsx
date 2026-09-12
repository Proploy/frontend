import { act } from 'react'
import { render } from '@/test/render'
import { normalizeDocument } from '@/features/ai-workspace/journey'
import { DocumentCard } from './DocumentCard'

describe('DocumentCard', () => {
  it('renders the sanitized brief inline with its type and export action', async () => {
    const onExportPdf = vi.fn().mockResolvedValue(true)
    const doc = normalizeDocument(
      {
        doc_id: 'doc_bc_1',
        doc_type: 'battle_card',
        title: 'Linear vs Asana',
        html: '<h2 class="font-bold">Overview</h2><script>alert(1)</script><table><tr><td>Linear</td></tr></table>',
      },
      [],
    )
    const view = await render(<DocumentCard document={doc} onExportPdf={onExportPdf} />)
    const text = view.container.textContent ?? ''
    expect(text).toContain('Comparison brief')
    expect(text).toContain('Linear vs Asana')
    expect(text).toContain('Overview')
    expect(view.container.innerHTML).not.toContain('<script')
    expect(view.container.querySelector('.doc-prose table')).not.toBeNull()

    const exportButton = Array.from(view.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Export PDF'),
    )
    await act(async () => exportButton?.click())
    expect(onExportPdf).toHaveBeenCalledWith('doc_bc_1')
    await view.unmount()
  })

  it('labels implementation briefs with their product', async () => {
    const doc = normalizeDocument(
      { doc_id: 'doc_pb_1', doc_type: 'project_brief', title: 'Rollout plan for Asana', html: '<p>plan</p>' },
      [{ product_id: 'asana', product_name: 'Asana', profile_href: null, available: true, is_agent_selected: true }],
    )
    const view = await render(<DocumentCard document={doc} />)
    expect(view.container.textContent).toContain('Implementation brief · Asana')
    await view.unmount()
  })
})

describe('DocumentCard structured briefs', () => {
  it('renders a battle card as a requirements matrix instead of raw HTML', async () => {
    const doc = normalizeDocument(
      {
        doc_id: 'doc_bc_2',
        doc_type: 'battle_card',
        title: 'Linear vs Asana',
        html: '<p>fallback</p>',
        data: {
          title: 'Linear vs Asana',
          products: [{ product_id: 'linear', product_name: 'Linear' }, { product_id: 'asana', product_name: 'Asana' }],
          requirements: [
            { requirement: 'GitHub sync', why_it_matters: 'Engineers live there', fit: { linear: { status: 'yes', note: 'Native' }, asana: { status: 'partial' } } },
            { requirement: 'Offline mode', fit: { linear: { status: 'no' }, asana: { status: 'unknown' } } },
          ],
          strengths: { linear: ['Fast'] },
          weaknesses: {},
          community: {},
          recommendation: { product_id: 'linear', reason: 'Best for engineering teams' },
          next_steps: ['Start a trial'],
        },
      },
      [],
    )
    const view = await render(<DocumentCard document={doc} />)
    const text = view.container.textContent ?? ''
    expect(view.container.querySelector('[data-testid="battle-card-view"]')).not.toBeNull()
    expect(text).not.toContain('fallback')
    expect(text).toContain('GitHub sync')
    expect(text).toContain('Meets')
    expect(text).toContain('Partial')
    expect(text).toContain('Missing')
    expect(text).toContain('Not assessed')
    expect(text).toContain("Sam's pick")
    expect(text).toContain('Best for engineering teams')
    // Linear: 1 met + 1 missing → 50%; Asana: 1 partial of 1 assessed → 50%.
    expect(text).toContain('1 met · 0 partial · 1 missing')
    await view.unmount()
  })

  it('renders an implementation brief as a plan around the chosen product', async () => {
    const doc = normalizeDocument(
      {
        doc_id: 'doc_pb_2',
        doc_type: 'project_brief',
        title: 'Rollout plan',
        html: '<p>fallback</p>',
        data: {
          title: 'Rollout plan',
          recommended_product: { product_id: 'asana', product_name: 'Asana' },
          use_case: 'A 45-person field team needs offline scheduling.',
          business_objectives: ['Stop double entry'],
          key_requirements: ['Two-way accounting sync'],
          shortlist: [{ product_id: 'asana', product_name: 'Asana', is_recommended: true }],
          recommendation: { product_id: 'asana', rationale: 'Only option with offline mode' },
          success_criteria: ['Invoices within 24h'],
          implementation_plan: [{ phase: 'Setup', duration: '1 week', activities: ['Create workspace'] }],
          risks: [{ risk: 'Adoption', mitigation: 'Champions' }],
          next_steps: ['Start trial'],
        },
      },
      [],
    )
    const view = await render(<DocumentCard document={doc} />)
    const text = view.container.textContent ?? ''
    expect(view.container.querySelector('[data-testid="implementation-brief-view"]')).not.toBeNull()
    expect(text).toContain('Implementation brief · Asana')
    expect(text).toContain('A 45-person field team needs offline scheduling.')
    expect(text).toContain('Setup')
    expect(text).toContain('Adoption')
    expect(text).toContain('Only option with offline mode')
    await view.unmount()
  })
})
