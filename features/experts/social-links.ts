import type { SocialPlatform } from './types'

/**
 * One row per platform in the socials section. The host allowlist is what
 * makes "the LinkedIn box only takes LinkedIn links" true; `website` and
 * `other` accept any https URL.
 */
export interface SocialPlatformRule {
  platform: SocialPlatform
  label: string
  /** Shown inside the empty input. A real-looking URL, not "https://". */
  placeholder: string
  /** Accepted hostnames (any subdomain of these). Empty = any https host. */
  hosts: readonly string[]
  /** Copy for the mismatch error, e.g. "a linkedin.com link". */
  expects: string
}

export const SOCIAL_PLATFORM_RULES: readonly SocialPlatformRule[] = [
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://www.linkedin.com/in/your-name',
    hosts: ['linkedin.com'],
    expects: 'a linkedin.com profile or company page',
  },
  {
    platform: 'website',
    label: 'Personal website',
    placeholder: 'https://yourstudio.com',
    hosts: [],
    expects: 'an https link to your own site',
  },
  {
    platform: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/your-handle',
    hosts: ['github.com'],
    expects: 'a github.com profile or organisation',
  },
  {
    platform: 'twitter',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/your-handle',
    hosts: ['x.com', 'twitter.com'],
    expects: 'an x.com or twitter.com profile',
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    placeholder: 'https://www.youtube.com/@your-channel',
    hosts: ['youtube.com', 'youtu.be'],
    expects: 'a youtube.com channel',
  },
  {
    platform: 'dribbble',
    label: 'Dribbble',
    placeholder: 'https://dribbble.com/your-handle',
    hosts: ['dribbble.com'],
    expects: 'a dribbble.com profile',
  },
  {
    platform: 'behance',
    label: 'Behance',
    placeholder: 'https://www.behance.net/your-handle',
    hosts: ['behance.net'],
    expects: 'a behance.net profile',
  },
  {
    platform: 'other',
    label: 'Other link',
    placeholder: 'https://calendly.com/your-name or a public case study',
    hosts: [],
    expects: 'an https link',
  },
]

export function socialRuleFor(platform: SocialPlatform): SocialPlatformRule {
  return SOCIAL_PLATFORM_RULES.find((rule) => rule.platform === platform) ?? SOCIAL_PLATFORM_RULES[SOCIAL_PLATFORM_RULES.length - 1]
}

function hostMatches(hostname: string, allowed: string): boolean {
  return hostname === allowed || hostname.endsWith(`.${allowed}`)
}

/**
 * Returns an error message, or null when the URL is an https link on one of
 * the platform's hosts. Blank input is not an error (the row is optional).
 */
export function socialUrlError(platform: SocialPlatform, value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return 'Paste the full link, starting with https://'
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname) {
    return 'Links must start with https://'
  }
  const rule = socialRuleFor(platform)
  if (rule.hosts.length === 0) return null
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '')
  return rule.hosts.some((allowed) => hostMatches(host, allowed))
    ? null
    : `This box is for ${rule.label}. Paste ${rule.expects}.`
}

export function isValidSocialUrl(platform: SocialPlatform, value: string): boolean {
  return value.trim() !== '' && socialUrlError(platform, value) === null
}
