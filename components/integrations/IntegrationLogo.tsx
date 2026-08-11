import type { ReactNode } from 'react'

// Brand marks for every catalog integration. Kept as a single shared component
// so Settings and the Calendar page render identical logos. Simple, recognizable
// marks — brand colours with a monogram fallback — not pixel-perfect logos.

export function IntegrationLogo({
  name,
  size = 40,
  borderless = false,
}: {
  name: string
  size?: number
  borderless?: boolean
}) {
  const inner = Math.round(size * (borderless ? 0.85 : 0.55))
  const wrap = (children: ReactNode, bg = 'bg-white') =>
    borderless ? (
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {children}
      </div>
    ) : (
      <div
        className={`rounded-[10px] border border-[#e9eaeb] flex items-center justify-center shrink-0 ${bg}`}
        style={{ width: size, height: size }}
      >
        {children}
      </div>
    )
  const monogram = (letter: string, color: string) =>
    wrap(
      <div
        className="flex items-center justify-center rounded-[7px] font-bold text-white"
        style={{ width: inner, height: inner, background: color, fontSize: Math.round(size * 0.4) }}
      >
        {letter}
      </div>,
    )

  const key = name.toLowerCase().trim()

  if (key === 'cal_com' || key.includes('cal.com')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#111827" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="sans-serif">
          Cal
        </text>
      </svg>,
    )
  }
  if (key.includes('calendly')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#006bff" />
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff" strokeWidth="2.2" />
      </svg>,
    )
  }
  if (key.includes('google_cal') || key.includes('google calendar')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" stroke="#e0e0e0" />
        <rect x="3" y="3" width="18" height="5" rx="3" fill="#4285f4" />
        <text x="12" y="18" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4285f4" fontFamily="sans-serif">
          31
        </text>
      </svg>,
    )
  }
  if (key.includes('fireflies')) {
    return monogram('🔥', 'transparent')
  }
  if (key.includes('zoom')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#2d8cff" />
        <path d="M6 9.5a1 1 0 0 1 1-1h6a1.5 1.5 0 0 1 1.5 1.5v4.5a1 1 0 0 1-1 1H7.5A1.5 1.5 0 0 1 6 14V9.5Zm9.5 1.2 2.5-1.6v5.8l-2.5-1.6Z" fill="#fff" />
      </svg>,
    )
  }
  if (key.includes('docusign')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#ffcc00" />
        <path d="M6 12.5 10 16.5 18 7.5" stroke="#1a1a1a" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,
    )
  }
  if (key.includes('gdrive') || key.includes('google drive')) {
    return wrap(
      <svg width={inner} height={Math.round(inner * 0.9)} viewBox="0 0 87 78" aria-hidden="true">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
      </svg>,
    )
  }
  if (key.includes('stripe')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#635bff" />
        <text x="12" y="16" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="sans-serif">
          S
        </text>
      </svg>,
    )
  }
  if (key.includes('quickbooks')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#2ca01c" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="sans-serif">
          qb
        </text>
      </svg>,
    )
  }
  if (key.includes('hubspot')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" fill="#ff7a59" aria-hidden="true">
        <path d="M17 8.2V5.6a2 2 0 1 0-2 0v2.6a6 6 0 0 0-2.4 1l-6-4.7a2.3 2.3 0 1 0-1.2 1.6l5.9 4.6a6 6 0 1 0 8.9-.9 6 6 0 0 0-1.2-.6Zm-2.5 9.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
      </svg>,
    )
  }
  if (key.includes('clearbit')) {
    return monogram('C', '#3b82f6')
  }
  if (key.includes('slack')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.04 15.1a2.1 2.1 0 1 1-2.1-2.1h2.1v2.1Zm1.06 0a2.1 2.1 0 0 1 4.2 0v5.26a2.1 2.1 0 1 1-4.2 0V15.1Z" fill="#e01e5a" />
        <path d="M8.2 5.04a2.1 2.1 0 1 1 2.1-2.1v2.1H8.2Zm0 1.06a2.1 2.1 0 0 1 0 4.2H2.94a2.1 2.1 0 1 1 0-4.2H8.2Z" fill="#36c5f0" />
        <path d="M18.96 8.2a2.1 2.1 0 1 1 2.1 2.1h-2.1V8.2Zm-1.06 0a2.1 2.1 0 0 1-4.2 0V2.94a2.1 2.1 0 1 1 4.2 0V8.2Z" fill="#2eb67d" />
        <path d="M15.8 18.96a2.1 2.1 0 1 1-2.1 2.1v-2.1h2.1Zm0-1.06a2.1 2.1 0 0 1 0-4.2h5.26a2.1 2.1 0 1 1 0 4.2H15.8Z" fill="#ecb22e" />
      </svg>,
    )
  }
  if (key.includes('gmail') || key.includes('google mail')) {
    return wrap(
      <svg width={inner} height={Math.round(inner * 0.78)} viewBox="0 0 24 18" aria-hidden="true">
        <path d="M2 4v11a1 1 0 0 0 1 1h3V8.5l6 4.5 6-4.5V16h3a1 1 0 0 0 1-1V4l-10 7.5L2 4Z" fill="#ea4335" />
        <path d="M2 4 12 11.5 22 4v-.5A1.5 1.5 0 0 0 20.5 2h-17A1.5 1.5 0 0 0 2 3.5V4Z" fill="#ea4335" opacity="0.85" />
      </svg>,
    )
  }
  if (key.includes('linear')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#5e6ad2" />
        <path d="M5 14.5 9.5 19M5 11 13 19M5 7.5 16.5 19" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>,
    )
  }
  if (key.includes('monday')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="5.5" cy="12" r="2.4" fill="#ff3d57" />
        <circle cx="12" cy="12" r="2.4" fill="#ffcb00" />
        <circle cx="18.5" cy="12" r="2.4" fill="#00d647" />
      </svg>,
    )
  }
  if (key.includes('figma')) {
    return wrap(
      <svg width={Math.round(inner * 0.68)} height={inner} viewBox="0 0 16 24" aria-hidden="true">
        <path d="M8 0H4a4 4 0 0 0 0 8h4V0Z" fill="#f24e1e" />
        <path d="M8 8H4a4 4 0 0 0 0 8h4V8Z" fill="#a259ff" />
        <path d="M8 16H4a4 4 0 1 0 4 4v-4Z" fill="#0acf83" />
        <path d="M8 0h4a4 4 0 0 1 0 8H8V0Z" fill="#ff7262" />
        <circle cx="12" cy="12" r="4" fill="#1abcfe" />
      </svg>,
    )
  }
  if (key.includes('canva')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#00c4cc" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="serif">
          C
        </text>
      </svg>,
    )
  }
  if (key.includes('zapier')) {
    return wrap(
      <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 12a8.6 8.6 0 0 1-.3 2.2 8.6 8.6 0 0 1-2.2.3 8.6 8.6 0 0 1-2.2-.3A8.6 8.6 0 0 1 9.5 12a8.6 8.6 0 0 1 .3-2.2A8.6 8.6 0 0 1 12 9.5a8.6 8.6 0 0 1 2.2.3 8.6 8.6 0 0 1 .3 2.2ZM24 10.6h-6.8l4.8-4.8-1.7-1.7-4.8 4.8V2.1h-2.4v6.8L8.3 4.1 6.6 5.8l4.8 4.8H4.6v2.4h6.8l-4.8 4.8 1.7 1.7 4.8-4.8v6.8h2.4v-6.8l4.8 4.8 1.7-1.7-4.8-4.8H24Z" fill="#ff4f00" />
      </svg>,
    )
  }
  if (key.includes('jira')) {
    return wrap(<img src="/figma-assets/3cfffe4377ece59c767cedf8f8508772137336a0.svg" alt="Jira" style={{ width: inner, height: inner }} />)
  }
  if (key.includes('notion')) {
    return wrap(<img src="/figma-assets/080d123fdd49f2bef0a3ff77860937bc5900aedf.svg" alt="Notion" style={{ width: inner, height: inner }} />)
  }
  if (key.includes('zendesk')) {
    return wrap(<img src="/figma-assets/db1d93e4c70dee1f2295fa860e2783918ef1e51f.svg" alt="Zendesk" style={{ width: inner, height: inner }} />)
  }

  return monogram(name.charAt(0).toUpperCase(), '#717680')
}

