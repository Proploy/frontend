'use client'

import { useEffect, useId, useRef, useState } from 'react'

export interface SortOption<T extends string> {
  value: T
  label: string
}

/**
 * Compact sort control: an icon button that opens a small menu of options.
 * The active option is shown as the button's tooltip and with a check mark.
 */
export function SortMenu<T extends string>({
  value,
  options,
  onChange,
  label = 'Sort',
}: {
  value: T
  options: SortOption<T>[]
  onChange: (value: T) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const active = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="pp-sort">
      <button
        type="button"
        className="pp-sort-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label}: ${active?.label ?? ''}`}
        title={`${label}: ${active?.label ?? ''}`}
        data-active={value !== options[0]?.value}
        onClick={() => setOpen((current) => !current)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h12M4 12h8M4 17h4" />
          <path d="m17 11 3 3 3-3M20 14V4" />
        </svg>
      </button>
      {open && (
        <div id={menuId} role="menu" aria-label={label} className="pp-sort-menu">
          <p className="pp-sort-menu-title">{label} by</p>
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className="pp-sort-item"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                <span>{option.label}</span>
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
