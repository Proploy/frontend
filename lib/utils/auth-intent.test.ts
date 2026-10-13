import { getAuthIntentFromCookie } from './auth-intent'

describe('getAuthIntentFromCookie', () => {
  it('decodes the URL-encoded value Next.js writes', () => {
    expect(getAuthIntentFromCookie('sb-x=1; auth_intent=%2Fbecome-expert; other=2')).toBe('/become-expert')
  })

  it('keeps a value containing "=" intact', () => {
    expect(getAuthIntentFromCookie('auth_intent=%2Fworkspace%3Ftab%3Dbriefs')).toBe('/workspace?tab=briefs')
  })

  it('returns null when the cookie is absent, empty or malformed', () => {
    expect(getAuthIntentFromCookie(null)).toBeNull()
    expect(getAuthIntentFromCookie('other=1')).toBeNull()
    expect(getAuthIntentFromCookie('auth_intent=')).toBeNull()
    expect(getAuthIntentFromCookie('auth_intent=%E0%A4%A')).toBeNull()
  })
})
