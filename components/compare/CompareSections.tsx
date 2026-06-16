'use client'

// components/compare/CompareSections.tsx — discussion, edge states, mobile action bar, toast
// Ported from the design prototype (sections.jsx), minus the design-tool "Preview states" switcher.

import React from 'react'
import { Icon, Btn } from './CompareUI'
import { DISCUSSIONS } from '@/lib/compare/data'

// ---- Discussion / questions ----------------------------------------------
export function Discussion() {
  return (
    <section style={{ maxWidth: 1440, margin: '56px auto 0', padding: '0 32px' }}>
      <div className="flex items-end justify-between gap-[16px] flex-wrap" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ marginBottom: 8 }}>
            <span className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ fontSize: 14, color: '#004eeb' }}>Buyer questions</span>
          </div>
          <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em', color: '#181d27' }}>What buyers ask before they commit</h2>
        </div>
        <Btn variant="primary" icon="msg">Ask Proploy a question</Btn>
      </div>
      <div className="disc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
        {DISCUSSIONS.map((d, i) => (
          <div
            key={i}
            className="flex flex-col gap-[10px]"
            style={{ border: '1px solid #e9eaeb', borderRadius: 14, background: '#fff', padding: 18, transition: 'box-shadow 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div className="flex items-center justify-between gap-[10px]">
              <span className="inline-flex items-center font-[family-name:var(--font-dm-sans)] font-medium whitespace-nowrap" style={{ padding: '2px 10px', borderRadius: 9999, background: '#fafafa', border: '1px solid #e9eaeb', color: '#414651', fontSize: 13, lineHeight: '20px' }}>{d.tag}</span>
              <span className="inline-flex items-center gap-[5px]" style={{ fontSize: 12.5, color: '#a4a7ae' }}><Icon name="msg" size={13} color="#a4a7ae" />{d.answers} answers</span>
            </div>
            <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 16.5, lineHeight: '24px', color: '#181d27' }}>{d.q}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: '#535862' }}>{d.top}</p>
            <a href="#" className="inline-flex items-center gap-[5px] font-semibold" style={{ fontSize: 13.5, color: '#004eeb', marginTop: 2 }}>See discussion <Icon name="arrowRight" size={13} color="#004eeb" /></a>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- Empty / one-item screens --------------------------------------------
export function EmptyState({ onAdd }: { onAdd: () => void }) {
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
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: '22px', color: '#535862' }}>Add a product, expert, or business to each slot above. We&apos;ll score every option against your filters and brief you on the practical differences.</p>
        </div>
        <div className="flex gap-[10px] flex-wrap justify-center">
          <Btn variant="primary" icon="plus" onClick={onAdd}>Add your first option</Btn>
          <Btn variant="secondary" icon="users">Get matched instead</Btn>
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

// ---- Saved confirmation toast --------------------------------------------
export function SavedToast({ show, onClose, kind = 'saved' }: { show: boolean; onClose: () => void; kind?: 'saved' | 'share' }) {
  React.useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3600)
      return () => clearTimeout(t)
    }
  }, [show, onClose])
  if (!show) return null
  const isShare = kind === 'share'
  return (
    <div className="compare-toast" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 80 }}>
      <div className="flex items-center gap-[12px]" style={{ background: '#fff', border: '1px solid #e9eaeb', borderRadius: 12, boxShadow: 'var(--shadow-xl)', padding: '12px 14px', minWidth: 320 }}>
        <div className="shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 9, background: isShare ? '#eff4ff' : '#ecfdf3', border: `1px solid ${isShare ? '#b2ccff' : '#abefc6'}` }}>
          <Icon name={isShare ? 'link' : 'check'} size={17} color={isShare ? '#155eef' : '#079455'} strokeWidth={isShare ? 2 : 3} />
        </div>
        <div className="flex-1">
          <div className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ fontSize: 14, color: '#181d27' }}>{isShare ? 'Share link copied' : 'Comparison saved'}</div>
          <div style={{ fontSize: 13, color: '#717680' }}>{isShare ? 'proploy.com/c/8fa2 — anyone with the link can view' : 'Find it under Saved comparisons in your account'}</div>
        </div>
        <button onClick={onClose} aria-label="Dismiss" className="flex cursor-pointer" style={{ border: 'none', background: 'transparent', color: '#a4a7ae', padding: 4 }}><Icon name="x" size={16} /></button>
      </div>
    </div>
  )
}

// ---- Mobile sticky bottom action bar -------------------------------------
export function MobileActionBar({ onAdd, onSave, onMatched, saved }: { onAdd: () => void; onSave: () => void; onMatched: () => void; saved: boolean }) {
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
