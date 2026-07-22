import {
  isUnpublishedValue,
  normalizePublishedList,
  normalizePublishedValue,
} from '../published-values'

describe('published value helpers', () => {
  it('treats unpublished status text as missing', () => {
    expect(isUnpublishedValue('Not published')).toBe(true)
    expect(isUnpublishedValue(' unpublished ')).toBe(true)
    expect(normalizePublishedValue('Not published')).toBeNull()
  })

  it('preserves real values', () => {
    expect(normalizePublishedValue('Project Management')).toBe('Project Management')
    expect(normalizePublishedValue(null)).toBeNull()
  })

  it('removes unpublished entries from lists', () => {
    expect(normalizePublishedList(['Slack', 'Not published', 'Gmail'])).toEqual(['Slack', 'Gmail'])
  })
})
