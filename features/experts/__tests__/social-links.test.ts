import { SOCIAL_PLATFORM_RULES, isValidSocialUrl, socialUrlError } from '../social-links'

describe('socialUrlError', () => {
  it('accepts the platform host, with or without www and on subdomains', () => {
    expect(socialUrlError('linkedin', 'https://www.linkedin.com/in/alex')).toBeNull()
    expect(socialUrlError('linkedin', 'https://uk.linkedin.com/company/acme')).toBeNull()
    expect(socialUrlError('twitter', 'https://x.com/alex')).toBeNull()
    expect(socialUrlError('twitter', 'https://twitter.com/alex')).toBeNull()
    expect(socialUrlError('youtube', 'https://youtu.be/abc')).toBeNull()
  })

  it('rejects a link from another platform in a platform-specific box', () => {
    expect(socialUrlError('linkedin', 'https://github.com/alex')).toMatch(/This box is for LinkedIn/)
    expect(socialUrlError('github', 'https://www.linkedin.com/in/alex')).toMatch(/github\.com/)
  })

  it('does not fall for look-alike hosts', () => {
    expect(socialUrlError('linkedin', 'https://linkedin.com.evil.io/in/alex')).not.toBeNull()
    expect(socialUrlError('linkedin', 'https://notlinkedin.com/in/alex')).not.toBeNull()
  })

  it('requires https and a full URL', () => {
    expect(socialUrlError('website', 'http://mysite.com')).toMatch(/https/)
    expect(socialUrlError('website', 'mysite.com')).toMatch(/full link/)
  })

  it('lets website and other links point anywhere over https', () => {
    expect(socialUrlError('website', 'https://mysite.com')).toBeNull()
    expect(socialUrlError('other', 'https://calendly.com/alex')).toBeNull()
  })

  it('treats a blank row as not-an-error and not-valid', () => {
    expect(socialUrlError('linkedin', '   ')).toBeNull()
    expect(isValidSocialUrl('linkedin', '   ')).toBe(false)
  })

  it('lists every platform once, with a personal website row', () => {
    const platforms = SOCIAL_PLATFORM_RULES.map((rule) => rule.platform)
    expect(new Set(platforms).size).toBe(platforms.length)
    expect(platforms).toContain('website')
  })
})
