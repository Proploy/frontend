import { useEffect } from 'react'

import { render } from '@/test/render'
import { useCategoryTree } from '../hooks'
import type { CategoryNode } from '../types'

const hoisted = vi.hoisted(() => ({ getTree: vi.fn() }))

vi.mock('@/features/catalog/shared/client-api', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../shared/client-api')>()
  return {
    ...original,
    clientCatalogApi: {
      ...original.clientCatalogApi,
      categories: { ...original.clientCatalogApi.categories, getTree: hoisted.getTree },
    },
  }
})

function node(label: string): CategoryNode {
  return {
    term_id: label.toLowerCase(),
    taxonomy_type: 'ui_category',
    slug: label.toLowerCase(),
    label,
    description: null,
    parent_term_id: null,
    product_count: 3,
    children: [],
  }
}

let seen: CategoryNode[] = []

function Probe({ initialData }: { initialData?: CategoryNode[] }) {
  const { tree } = useCategoryTree({ initialData })
  useEffect(() => {
    seen = tree
  }, [tree])
  return null
}

async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useCategoryTree initial data', () => {
  beforeEach(() => {
    seen = []
    hoisted.getTree.mockReset()
    hoisted.getTree.mockResolvedValue({ ok: true as const, data: { tree: [node('CRM'), node('Sales')] } })
  })

  it('fetches when the server render produced no categories', async () => {
    // An empty array used to be treated as valid data, which left the filter
    // list permanently empty with no request in flight.
    const { unmount } = await render(<Probe initialData={[]} />)
    await flush()

    expect(hoisted.getTree).toHaveBeenCalledTimes(1)
    expect(seen.map((n) => n.label)).toEqual(['CRM', 'Sales'])
    await unmount()
  })

  it('fetches when no initial data is supplied at all', async () => {
    const { unmount } = await render(<Probe />)
    await flush()

    expect(hoisted.getTree).toHaveBeenCalledTimes(1)
    await unmount()
  })

  it('trusts a non-empty server-rendered tree and skips the request', async () => {
    const { unmount } = await render(<Probe initialData={[node('Marketing')]} />)
    await flush()

    expect(hoisted.getTree).not.toHaveBeenCalled()
    expect(seen.map((n) => n.label)).toEqual(['Marketing'])
    await unmount()
  })
})
