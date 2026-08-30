import fs from 'node:fs'
import path from 'node:path'

import { useEffect } from 'react'

import { render } from '@/test/render'
import { useNaturalSearch } from '../hooks'

const hoisted = vi.hoisted(() => ({
  mocks: {
    natural: vi.fn(),
  },
}))

vi.mock('@/features/catalog/shared/client-api', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('../shared/client-api')>()
  return {
    ...original,
    clientCatalogApi: {
      ...original.clientCatalogApi,
      search: {
        ...original.clientCatalogApi.search,
        natural: hoisted.mocks.natural,
      },
    },
  }
})

const emptyResponse = {
  ok: true as const,
  data: { results: [], count: 0, facets: null, note: null },
}

function Probe({ freeTrial }: { freeTrial: boolean }) {
  const { search } = useNaturalSearch({ freeTrial })
  useEffect(() => {
    void search('invoicing')
  }, [search])
  return null
}

async function flush() {
  await Promise.resolve()
}

describe('useNaturalSearch filters on the wire', () => {
  beforeEach(() => {
    hoisted.mocks.natural.mockResolvedValue(emptyResponse)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends trial_available when free-trial filter is on', async () => {
    vi.useFakeTimers()
    try {
      const { unmount } = await render(<Probe freeTrial />)
      await vi.advanceTimersByTimeAsync(250)
      await flush()

      expect(hoisted.mocks.natural).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'invoicing', trial_available: true }),
      )
      await unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  it('omits trial_available when the free-trial filter is off', async () => {
    vi.useFakeTimers()
    try {
      const { unmount } = await render(<Probe freeTrial={false} />)
      await vi.advanceTimersByTimeAsync(250)
      await flush()

      expect(hoisted.mocks.natural).toHaveBeenCalledWith({
        query: 'invoicing',
        limit: 20,
      })
      await unmount()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('freeTrial wiring contract', () => {
  const pageSource = fs.readFileSync(
    path.join(
      process.cwd(),
      'app/(site)/products/page.tsx',
    ),
    'utf8',
  )

  it('passes the drawer free-trial filter into natural search', () => {
    const panelDelcaration = pageSource.indexOf('function ProductSearchPanel(')
    const panelBody = pageSource.slice(panelDelcaration)
    expect(panelBody).toMatch(/useNaturalSearch\(\{ freeTrial \}\)/)
    expect(pageSource).toContain('freeTrial={filters.freeTrial}')
  })
})