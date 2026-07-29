'use client'

// components/compare/CompareSections.tsx — discussion, edge states, mobile action bar, toast
// Ported from the design prototype (sections.jsx), minus the design-tool "Preview states" switcher.

import React from 'react'
import { Icon, Btn } from './CompareUI'
import type { CompareMatchedExpert } from '@/features/compare/client-api'
export { ActionToast, SavedToast } from '@/components/ui/action-toast'
export type { ActionToastState } from '@/components/ui/action-toast'

// ---- Empty / one-item screens --------------------------------------------
export function EmptyState({ onAdd, onMatched }: { onAdd: () => void; onMatched?: () => void | Promise<void> }) {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
      <div
        className="flex flex-col items-center gap-[16px] text-center"
        style={{ border: '1.5px dashed #d5d7da', borderRadius: 16, background: '#fff', padding: '64px 32px' }}
      >
        <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 14, background: '#eff4ff', border: '1px solid #d1e0ff' }}>
          <Icon name="sliders" size={26} color="#155eef" />
        </div>
        <div style={{ maxWidth: 420 }}>
          <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 20, color: '#181d27' }}>Nothing to compare yet</h3>
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: '22px', color: '#535862' }}>Add a product to each slot above. We&apos;ll brief you on the practical differences between the options.</p>
        </div>
        <div className="flex gap-[10px] flex-wrap justify-center">
          <Btn variant="primary" icon="plus" onClick={onAdd}>Add your first option</Btn>
          <Btn variant="secondary" icon="users" onClick={onMatched}>Get matched instead</Btn>
        </div>
      </div>
    </div>
  )
}

export function OneItemNudge({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto 18px', padding: '0 32px' }}>
      <div className="flex items-center gap-[12px]" style={{ padding: '14px 18px', borderRadius: 12, background: '#f5f8ff', border: '1px solid #b2ccff' }}>
        <div className="shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 9, background: '#fff', border: '1px solid #d1e0ff' }}>
          <Icon name="info" size={17} color="#155eef" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ fontSize: 14.5, color: '#181d27' }}>Add one more to compare</span>
          <p style={{ margin: '2px 0 0', fontSize: 13.5, color: '#535862' }}>A comparison needs at least two options. The brief and highlights unlock once you add a second.</p>
        </div>
        <Btn variant="primary" size="sm" icon="plus" onClick={onAdd}>Add option</Btn>
      </div>
    </div>
  )
}

// ---- Loading skeleton table ----------------------------------------------
function Sk({ w = '70%' }: { w?: string }) {
  return <div className="compare-shimmer" style={{ height: 14, width: w, borderRadius: 6 }} />
}

export function LoadingTable({ count }: { count: number }) {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
      <div className="overflow-hidden" style={{ border: '1px solid #e9eaeb', borderRadius: 16, background: '#fff' }}>
        <div className="flex items-center gap-[8px] font-[family-name:var(--font-dm-sans)] font-semibold" style={{ padding: '13px 16px', borderBottom: '1px solid #f0f0f0', color: '#717680', fontSize: 13.5 }}>
          <Icon name="loader" size={16} color="#155eef" className="animate-spin" /> Building your comparison…
        </div>
        {Array.from({ length: 6 }).map((_, r) => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: `220px repeat(${count}, 1fr)`, borderTop: r ? '1px solid #f5f5f5' : 'none' }}>
            <div style={{ padding: '16px 18px' }}><Sk w="60%" /></div>
            {Array.from({ length: count }).map((_, c) => (
              <div key={c} style={{ padding: '16px 16px', borderLeft: '1px solid #f5f5f5' }}><Sk w={['80%', '55%', '70%'][(r + c) % 3]} /></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ShareComparisonModal({
  open,
  url,
  onClose,
  onCopied,
}: {
  open: boolean
  url: string
  onClose: () => void
  onCopied: () => void
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const absoluteUrl = typeof window === 'undefined' || url.startsWith('http')
    ? url
    : `${window.location.origin}${url}`
  const encodedUrl = encodeURIComponent(absoluteUrl)
  const shareTitle = 'Proploy software comparison'
  const shareBody = 'Review this Proploy software comparison.'
  const encodedTitle = encodeURIComponent(shareTitle)
  const encodedBody = encodeURIComponent(`${shareBody} ${absoluteUrl}`)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl)
      onCopied()
      onClose()
    } catch {
      onCopied()
    }
  }
  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: shareTitle, text: shareBody, url: absoluteUrl })
        onClose()
        return
      } catch {
        return
      }
    }
    await copyLink()
  }
  const shareOptions = [
    { label: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedBody}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedBody}` },
  ]

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#181d27]/45 px-4" onMouseDown={onClose}>
      <div className="w-full max-w-[520px] rounded-[16px] border border-[#e9eaeb] bg-white p-5 shadow-[0_24px_48px_-12px_rgba(10,13,18,0.28)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 20, color: '#181d27' }}>Share comparison</h3>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#717680' }}>Choose where to share this comparison, or copy a private link.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close share modal" className="flex cursor-pointer" style={{ border: 'none', background: 'transparent', color: '#717680', padding: 4 }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {shareOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target={option.label === 'Email' ? undefined : '_blank'}
              rel={option.label === 'Email' ? undefined : 'noreferrer'}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-[#d5d7da] bg-white px-4 text-[14px] font-semibold text-[#414651] shadow-[var(--shadow-xs)]"
              onClick={onClose}
            >
              {option.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-[#d5d7da] bg-white px-4 text-[14px] font-semibold text-[#414651] shadow-[var(--shadow-xs)]"
          >
            Slack
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-[#b2ccff] bg-[#eff4ff] px-4 text-[14px] font-semibold text-[#004eeb] shadow-[var(--shadow-xs)]"
          >
            <Icon name="link" size={16} color="#155eef" /> Copy Link
          </button>
          <button
            type="button"
            onClick={shareNative}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-[#d5d7da] bg-[#fafafa] px-4 text-[14px] font-semibold text-[#414651] shadow-[var(--shadow-xs)]"
          >
            <Icon name="share" size={16} color="#414651" /> Other platforms
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  )
}

export function MatchedExpertsModal({
  open,
  loading,
  error,
  experts,
  onClose,
}: {
  open: boolean
  loading: boolean
  error: string | null
  experts: CompareMatchedExpert[]
  onClose: () => void
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#181d27]/45 px-4" onMouseDown={onClose}>
      <div className="max-h-[82vh] w-full max-w-[780px] overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.28)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-[#e9eaeb] p-5">
          <div>
            <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 20, color: '#181d27' }}>Matched experts</h3>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#717680' }}>Experts associated with the products in this comparison.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close matched experts modal" className="flex cursor-pointer" style={{ border: 'none', background: 'transparent', color: '#717680', padding: 4 }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="max-h-[calc(82vh-92px)] overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center gap-2 text-[14px] text-[#535862]"><Icon name="loader" className="animate-spin" color="#155eef" /> Finding associated experts…</div>
          ) : error ? (
            <div className="rounded-[10px] border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-[14px] text-[#b42318]">{error}</div>
          ) : experts.length === 0 ? (
            <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-4 py-8 text-center text-[14px] text-[#717680]">No approved experts are associated with these products yet.</div>
          ) : (
            <div className="grid gap-3">
              {experts.map((expert) => (
                <article key={expert.id} className="rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eff4ff] text-[17px] font-semibold text-[#155eef]">
                        {expert.profilePictureUrl ? <img src={expert.profilePictureUrl} alt={expert.displayName} className="size-full object-cover" /> : expert.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 16, color: '#181d27' }}>{expert.displayName}</h4>
                        {expert.headline ? <p style={{ margin: '3px 0 0', fontSize: 13.5, color: '#535862' }}>{expert.headline}</p> : null}
                        <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#717680' }}>
                          {[expert.regionCity, expert.regionCountry].filter(Boolean).join(', ') || 'Location not listed'}
                          {expert.yearsExperience ? ` · ${expert.yearsExperience}+ years` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full border border-[#b2ccff] bg-[#eff4ff] px-3 py-1 text-[13px] font-semibold text-[#004eeb]">{expert.matchScore}% match</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...expert.matchedProducts, ...expert.primaryPlatforms.slice(0, 3), ...expert.industryExpertise.slice(0, 2)].filter(Boolean).slice(0, 8).map((value) => (
                      <span key={value} className="rounded-full border border-[#d1e0ff] bg-white px-2.5 py-1 text-[12px] font-medium text-[#155eef]">{value}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    {expert.schedulingLink ? (
                      <a href={expert.schedulingLink} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[13px] font-semibold text-[#414651]">Schedule</a>
                    ) : null}
                    <a href={`/experts/${encodeURIComponent(expert.id)}`} className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#155eef] px-3 text-[13px] font-semibold text-white" style={{ boxShadow: 'var(--shadow-xs)' }}>View profile</a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Mobile sticky bottom action bar -------------------------------------
export function MobileActionBar({ onAdd, onSave, onMatched, saved }: { onAdd: () => void; onSave: () => void | Promise<void>; onMatched: () => void | Promise<void>; saved: boolean }) {
  return (
    <div
      className="mobile-actionbar gap-[8px]"
      style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 65, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderTop: '1px solid #e9eaeb', padding: '10px 14px calc(10px + env(safe-area-inset-bottom))' }}
    >
      <Btn variant="secondary" size="md" icon="plus" onClick={onAdd} style={{ flex: 1 }}>Add</Btn>
      <Btn variant="secondary" size="md" icon={saved ? 'check' : 'bookmark'} onClick={onSave} style={{ flex: 1 }}>{saved ? 'Saved' : 'Save'}</Btn>
      <Btn variant="primary" size="md" icon="users" onClick={onMatched} style={{ flex: 1.4 }}>Get matched</Btn>
    </div>
  )
}
