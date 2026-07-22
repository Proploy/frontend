import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('compare tray navigation', () => {
  it('clears the current selection before opening the compare route', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/compare/CompareTray.tsx'),
      'utf8',
    )

    expect(source).toMatch(/const goCompare = \(\) => \{[\s\S]*clear\(\)[\s\S]*router\.push\(/)
  })
})
