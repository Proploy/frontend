import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

describe('expert frontend data boundaries', () => {
  it('does not seed public expert profiles from a hardcoded placeholder expert', () => {
    const source = readFileSync(join(root, 'app/experts/[id]/page.tsx'), 'utf8')

    expect(source).not.toContain('FALLBACK_PROFILE')
    expect(source).not.toContain('Amélie Laurent')
    expect(source).not.toContain('hello@amelie.com')
  })

  it('validates onboarding config fields through the same alias map used for rendering', () => {
    const source = readFileSync(
      join(root, 'components/onboarding/ExpertApplicationForm.tsx'),
      'utf8',
    )

    expect(source).toContain('const fieldKey = resolveFieldKey(field.name)')
    expect(source).toContain('const value = formData[fieldKey]')
  })
})
