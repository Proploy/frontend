import { act } from 'react'
import { render } from '@/test/render'
import { RequirementFitChart, type FitChartColumn, type FitChartRow } from './RequirementFitChart'

const rows: FitChartRow[] = [
  { key: 'compliance', label: 'Compliance' },
  { key: 'deployment', label: 'Deployment' },
  { key: 'team_size', label: 'Team size' },
]

const columns: FitChartColumn[] = [
  {
    id: 'asana',
    name: 'Asana',
    cells: {
      compliance: { status: 'yes', source: 'catalog', note: 'SOC 2 listed' },
      deployment: { status: 'partial', source: 'catalog' },
      team_size: { status: 'no', source: 'catalog' },
    },
  },
  {
    id: 'linear',
    name: 'Linear',
    cells: {
      compliance: { status: 'unknown', source: 'catalog' },
      deployment: { status: 'yes', source: 'catalog' },
      team_size: { status: 'yes', source: 'judgement', note: 'Reads as team-sized' },
    },
  },
]

function cells(container: HTMLElement) {
  return Array.from(container.querySelectorAll('button'))
}

describe('RequirementFitChart', () => {
  it('renders nothing when there is nothing to compare', async () => {
    const empty = await render(<RequirementFitChart rows={[]} columns={columns} />)
    expect(empty.container.textContent).toBe('')
    const noProducts = await render(<RequirementFitChart rows={rows} columns={[]} />)
    expect(noProducts.container.textContent).toBe('')
  })

  it('gives every cell a label that reads without colour', async () => {
    const view = await render(<RequirementFitChart rows={rows} columns={columns} />)
    const labels = cells(view.container).map((cell) => cell.getAttribute('aria-label'))
    expect(labels).toHaveLength(6)
    expect(labels[0]).toBe('Asana — Compliance: Meets. from the catalog. SOC 2 listed')
    expect(labels[5]).toBe("Linear — Team size: Meets. Sam's read. Reads as team-sized")
  })

  it('names all four states in the legend, so colour is never the only cue', async () => {
    const view = await render(<RequirementFitChart rows={rows} columns={columns} />)
    const text = view.container.textContent ?? ''
    for (const label of ['Meets', 'Partial', 'Missing', 'Not assessed']) {
      expect(text).toContain(label)
    }
  })

  it('scores each product against every row, not only the assessed ones', async () => {
    // Linear meets two of three; the unassessed compliance cell must not be
    // quietly dropped from the denominator.
    const view = await render(<RequirementFitChart rows={rows} columns={columns} />)
    const text = view.container.textContent ?? ''
    expect(text).toContain('1/3')
    expect(text).toContain('2/3')
  })

  it('reports the hovered cell in the detail line rather than a tooltip', async () => {
    const view = await render(<RequirementFitChart rows={rows} columns={columns} />)
    const status = view.container.querySelector('[role="status"]')
    expect(status?.textContent).toContain('Hover or tab a cell')

    await act(async () => {
      cells(view.container)[0].focus()
    })
    expect(status?.textContent).toContain('Asana · Compliance')
    expect(status?.textContent).toContain('SOC 2 listed')
  })

  it('says when a verdict is the agent opinion rather than a catalog record', async () => {
    const view = await render(<RequirementFitChart rows={rows} columns={columns} />)
    await act(async () => {
      cells(view.container)[5].focus()
    })
    const status = view.container.querySelector('[role="status"]')
    expect(status?.textContent).toContain('not a catalog record')
  })

  it('drops the numbered axis when compact, where no table follows it', async () => {
    const comfortable = await render(<RequirementFitChart rows={rows} columns={columns} />)
    expect(comfortable.container.textContent).toContain('read the full table below')

    const compact = await render(
      <RequirementFitChart rows={rows} columns={columns} density="compact" />,
    )
    expect(compact.container.textContent).not.toContain('read the full table below')
    // The axis is the only place the row ordinals are printed.
    expect(compact.container.querySelectorAll('.font-mono')).toHaveLength(columns.length)
  })

  it('dims a stale row and says so in the label, without hiding the verdict', async () => {
    const view = await render(
      <RequirementFitChart
        rows={[{ ...rows[0], stale: true }, rows[1]]}
        columns={columns}
      />,
    )
    const first = cells(view.container)[0]
    expect(first.getAttribute('aria-label')).toContain('based on earlier requirements')
    expect(first.className).toContain('opacity-45')
  })
})
