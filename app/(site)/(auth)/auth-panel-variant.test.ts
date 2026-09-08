import { resolveAuthPanelVariant } from './auth-panel-variant'
import { readRedirectParam, sanitizeRedirectPath, withRedirect } from './auth-redirect'

describe('resolveAuthPanelVariant', () => {
  it('maps each gated entry point to its panel', () => {
    expect(resolveAuthPanelVariant('/AI_workspace')).toBe('ask-sam')
    expect(resolveAuthPanelVariant('/workspace')).toBe('ask-sam')
    expect(resolveAuthPanelVariant('/become-expert')).toBe('become-expert')
    expect(resolveAuthPanelVariant('/experts')).toBe('browse-experts')
    expect(resolveAuthPanelVariant('/experts/42')).toBe('browse-experts')
    expect(resolveAuthPanelVariant('/explore-experts')).toBe('browse-experts')
  })

  it('matches nested paths, query strings and casing', () => {
    expect(resolveAuthPanelVariant('/ai_workspace')).toBe('ask-sam')
    expect(resolveAuthPanelVariant('/workspace/contracts')).toBe('ask-sam')
    expect(resolveAuthPanelVariant('/experts/42?tab=reviews')).toBe('browse-experts')
    expect(resolveAuthPanelVariant('/experts/')).toBe('browse-experts')
  })

  it('does not match a route that merely starts with the same characters', () => {
    // `/expertsomething` is not under `/experts`.
    expect(resolveAuthPanelVariant('/expertsomething')).toBe('default')
    expect(resolveAuthPanelVariant('/become-expert-faq')).toBe('default')
  })

  it('sends approved experts bounced off their own area to the default panel', () => {
    expect(resolveAuthPanelVariant('/experts/dashboard')).toBe('default')
    expect(resolveAuthPanelVariant('/experts/account')).toBe('default')
    expect(resolveAuthPanelVariant('/experts/chat/7')).toBe('default')
  })

  it('falls back to the default panel for anything else', () => {
    expect(resolveAuthPanelVariant(null)).toBe('default')
    expect(resolveAuthPanelVariant(undefined)).toBe('default')
    expect(resolveAuthPanelVariant('')).toBe('default')
    expect(resolveAuthPanelVariant('/products')).toBe('default')
    // An off-origin value is rejected before it can pick a panel.
    expect(resolveAuthPanelVariant('https://evil.example/experts')).toBe('default')
  })
})

describe('sanitizeRedirectPath', () => {
  it('accepts same-origin paths', () => {
    expect(sanitizeRedirectPath('/become-expert')).toBe('/become-expert')
    expect(sanitizeRedirectPath('/experts/42?tab=reviews')).toBe('/experts/42?tab=reviews')
  })

  it('rejects anything that could leave the origin', () => {
    expect(sanitizeRedirectPath('https://evil.example')).toBeNull()
    expect(sanitizeRedirectPath('//evil.example')).toBeNull()
    expect(sanitizeRedirectPath('/\\evil.example')).toBeNull()
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBeNull()
    expect(sanitizeRedirectPath('become-expert')).toBeNull()
  })

  it('rejects empty and oversized values', () => {
    expect(sanitizeRedirectPath('')).toBeNull()
    expect(sanitizeRedirectPath(null)).toBeNull()
    expect(sanitizeRedirectPath(`/${'a'.repeat(512)}`)).toBeNull()
  })
})

describe('readRedirectParam', () => {
  it('reads both spellings, preferring redirectTo', () => {
    expect(readRedirectParam({ redirectTo: '/workspace' })).toBe('/workspace')
    // The nav CTA, expert profile and workspace empty state all write `redirect`.
    expect(readRedirectParam({ redirect: '/become-expert' })).toBe('/become-expert')
    expect(readRedirectParam({ redirectTo: '/workspace', redirect: '/experts' })).toBe('/workspace')
  })

  it('takes the first value when a param is repeated', () => {
    expect(readRedirectParam({ redirectTo: ['/experts', '/products'] })).toBe('/experts')
  })

  it('drops unsafe and missing values', () => {
    expect(readRedirectParam({})).toBeNull()
    expect(readRedirectParam({ redirectTo: 'https://evil.example' })).toBeNull()
  })
})

describe('withRedirect', () => {
  it('carries the destination onto another auth route', () => {
    expect(withRedirect('/sign-up', '/become-expert')).toBe(
      '/sign-up?redirectTo=%2Fbecome-expert',
    )
  })

  it('merges extra params', () => {
    expect(withRedirect('/check-email', '/experts', { email: 'a@b.com' })).toBe(
      '/check-email?email=a%40b.com&redirectTo=%2Fexperts',
    )
  })

  it('leaves the href bare when there is nothing to carry', () => {
    expect(withRedirect('/sign-in', null)).toBe('/sign-in')
  })
})
