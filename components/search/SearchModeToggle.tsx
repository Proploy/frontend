'use client'

import type { SearchMode } from '@/features/catalog'

const MODES: { value: SearchMode; label: string; cardLabel: string; hint: string }[] = [
  { value: 'keyword', label: 'Search by name', cardLabel: 'Search Software', hint: 'Exact product, vendor or category names' },
  { value: 'natural', label: 'Describe what you need', cardLabel: 'Get Recommendations', hint: 'Ask in plain language' },
]

/**
 * Keyword vs natural-language search mode. Two variants:
 * - `default` — the inline pill used on the products page.
 * - `card` — compact segmented control with mode icons for the match engine.
 */
export function SearchModeToggle({
  value,
  onChange,
  variant = 'default',
}: {
  value: SearchMode
  onChange: (mode: SearchMode) => void
  variant?: 'default' | 'card'
}) {
  if (variant === 'card') {
    return (
      <div
        role="group"
        aria-label="Search mode"
        className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white/90 p-0.5 shadow-sm"
      >
        {MODES.map((mode) => {
          const active = value === mode.value
          return (
            <button
              key={mode.value}
              type="button"
              aria-pressed={active}
              title={mode.hint}
              onClick={() => onChange(mode.value)}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-medium transition-colors',
                active
                  ? 'bg-[var(--cobalt)] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')}
            >
              {mode.value === 'keyword' ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="m12 3 1.9 5.7L19.6 10l-5.7 1.3L12 17l-1.9-5.7L4.4 10l5.7-1.3L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M18.5 16.5v3M17 18h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
              {mode.cardLabel}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label="Search mode"
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur"
    >
      {MODES.map((mode) => {
        const active = value === mode.value
        return (
          <button
            key={mode.value}
            type="button"
            aria-pressed={active}
            title={mode.hint}
            onClick={() => onChange(mode.value)}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-[var(--cobalt)] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}