// @vitest-environment jsdom

import React from 'react'
import { describe, expect, it } from 'vitest'

import { render } from '@/test/render'
import { ExpertFilterSections } from './ExpertFilterSections'
import { DEFAULT_EXPERT_FILTERS, type ExpertFilterValues } from '@/features/experts/filter-values'
import type { ExpertFacets } from '@/features/experts/types'

const NOTION = 'f86d96ad76fa'

function facets(productIndustries: string[]): ExpertFacets {
  return {
    scope: { search: null, universe: 9, matched: 9 },
    groups: {
      products: {
        selection: 'disjunctive',
        options: [{ value: NOTION, label: 'Notion', count: 3, selected: true }],
      },
      product_industries: {
        selection: 'disjunctive',
        options: productIndustries.map((value) => ({ value, label: value, count: 1, selected: false })),
      },
    },
  } as ExpertFacets
}

const withNotion: ExpertFilterValues = { ...DEFAULT_EXPERT_FILTERS, products: [NOTION] }

function pills(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('button')).map((b) => b.textContent ?? '')
}

describe('expertise-on-product block', () => {
  it('renders the product industries served by the API', async () => {
    const { container } = await render(
      <ExpertFilterSections
        values={withNotion}
        onChange={() => {}}
        facets={facets(['Technology', 'Professional Services', 'Education'])}
      />,
    )

    expect(container.textContent).toContain('Expertise on Notion')
    expect(container.textContent).toContain('Industries served on it')
    expect(pills(container)).toEqual(expect.arrayContaining(['Technology', 'Professional Services', 'Education']))
  })

  it('says "Expertise", not "Depth"', async () => {
    const { container } = await render(
      <ExpertFilterSections values={withNotion} onChange={() => {}} facets={facets(['Technology'])} />,
    )

    expect(container.textContent).toContain('Expertise on Notion')
    expect(container.textContent).not.toContain('Depth on')
  })

  it('hides the industries when the product has none in the catalog', async () => {
    // 7 published products still have no `industry_fit`. Offering an empty
    // control there would read as broken rather than as "not filled in yet".
    const { container } = await render(
      <ExpertFilterSections values={withNotion} onChange={() => {}} facets={facets([])} />,
    )

    expect(container.textContent).toContain('Expertise on Notion')
    expect(container.textContent).not.toContain('Industries served on it')
  })

  it('toggles productIndustries, leaving the expert-wide industries alone', async () => {
    let next: ExpertFilterValues | null = null
    const { container } = await render(
      <ExpertFilterSections
        values={withNotion}
        onChange={(v) => { next = v }}
        facets={facets(['Technology', 'Education'])}
      />,
    )

    const pill = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Education')
    expect(pill).toBeTruthy()
    pill!.click()

    expect(next!.productIndustries).toEqual(['Education'])
    // The two are different questions: one is the expert's own industries,
    // the other is what they do on this product.
    expect(next!.industries).toEqual([])
  })

  it('shows nothing at all until a product is picked', async () => {
    const { container } = await render(
      <ExpertFilterSections
        values={DEFAULT_EXPERT_FILTERS}
        onChange={() => {}}
        facets={facets(['Technology'])}
      />,
    )

    expect(container.textContent).not.toContain('Industries served on it')
  })
})
