'use client'

// components/compare/CompareUI.tsx — shared primitives for the Compare page
// Ported from the design prototype (ui.jsx), minus Navbar/Footer (reused from the app).
// Icons come from lucide-react instead of hand-rolled SVG.

import React from 'react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import {
  Search, Plus, X, Check, ChevronDown, ArrowRight, SlidersHorizontal, Star,
  AlertTriangle, Minus, Bookmark, Share2, Sparkles, Clock, Users, Shield,
  Wrench, ArrowRightLeft, Link2, MessageSquare, Loader2, Info, type LucideIcon,
} from 'lucide-react'

// The skeuomorphic button overlay — Proploy's signature CTA shadow.
export const SKEUO =
  '0px 1px 2px 0px rgba(10,13,18,0.05), inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)'

// ---- Icon wrapper (maps prototype names → lucide components) --------------
const ICONS = {
  search: Search, plus: Plus, x: X, check: Check, chevronDown: ChevronDown,
  arrowRight: ArrowRight, sliders: SlidersHorizontal, star: Star, alert: AlertTriangle,
  minus: Minus, bookmark: Bookmark, share: Share2, sparkle: Sparkles, clock: Clock,
  users: Users, shield: Shield, wrench: Wrench, swap: ArrowRightLeft, link: Link2,
  msg: MessageSquare, loader: Loader2, info: Info,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export function Icon({
  name, size = 16, color = 'currentColor', strokeWidth = 2, style, className,
}: {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
  className?: string
}) {
  const Cmp = ICONS[name]
  return (
    <Cmp
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={{ flexShrink: 0, ...style }}
    />
  )
}

// ---- Logo tile (initials) -------------------------------------------------
export type LogoToneKey = 'brand' | 'pink' | 'success' | 'blue' | 'indigo'

const LOGO_TONES: Record<LogoToneKey, { bg: string; fg: string; border: string }> = {
  brand: { bg: '#eff4ff', fg: '#155eef', border: '#b2ccff' },
  pink: { bg: '#fdf2fa', fg: '#c11574', border: '#fcceee' },
  success: { bg: '#ecfdf3', fg: '#067647', border: '#abefc6' },
  blue: { bg: '#eff8ff', fg: '#175cd3', border: '#b2ddff' },
  indigo: { bg: '#eef4ff', fg: '#3538cd', border: '#c7d7fe' },
}

export function LogoTile({
  initial, tone = 'brand', size = 44, round = false, type, logoUrl,
}: {
  initial: string
  tone?: LogoToneKey
  size?: number
  round?: boolean
  type?: string
  logoUrl?: string | null
}) {
  const t = LOGO_TONES[tone] || LOGO_TONES.brand
  const isPerson = type === 'expert'
  return (
    <div
      className="flex items-center justify-center shrink-0 font-[family-name:var(--font-dm-sans)] font-bold"
      style={{
        width: size, height: size, borderRadius: round || isPerson ? 9999 : 10,
        background: t.bg, color: t.fg, border: `1px solid ${t.border}`,
        fontSize: size * 0.36, boxShadow: isPerson ? 'none' : SKEUO, letterSpacing: '-0.02em',
      }}
    >
      {logoUrl ? (
        <CatalogImage
          src={logoUrl}
          alt=""
          className="size-full object-contain p-[5px]"
          fallback={<span aria-hidden="true">{initial}</span>}
        />
      ) : initial}
    </div>
  )
}

// ---- Score ring -----------------------------------------------------------
export function ScoreRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 7) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value)) / 100
  const color = value >= 80 ? '#079455' : value >= 65 ? '#155eef' : value >= 50 ? '#dc6803' : '#d92d20'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eceef1" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-[family-name:var(--font-dm-sans)] font-bold"
          style={{ fontSize: size * 0.3, color: '#181d27', lineHeight: 1 }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

// ---- Pills & chips --------------------------------------------------------
export type PillTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'indigo'

const PILL_TONES: Record<PillTone, { bg: string; fg: string; border: string; dot: string }> = {
  neutral: { bg: '#fafafa', fg: '#414651', border: '#e9eaeb', dot: '#717680' },
  brand: { bg: '#eff4ff', fg: '#004eeb', border: '#b2ccff', dot: '#155eef' },
  success: { bg: '#ecfdf3', fg: '#067647', border: '#abefc6', dot: '#079455' },
  warning: { bg: '#fffaeb', fg: '#b54708', border: '#fec84b', dot: '#dc6803' },
  error: { bg: '#fef3f2', fg: '#b42318', border: '#fecdca', dot: '#d92d20' },
  indigo: { bg: '#eef4ff', fg: '#3538cd', border: '#c7d7fe', dot: '#444ce7' },
}

export function Pill({
  children, tone = 'neutral', dot = false, icon,
}: {
  children: React.ReactNode
  tone?: PillTone
  dot?: boolean
  icon?: IconName
}) {
  const t = PILL_TONES[tone] || PILL_TONES.neutral
  return (
    <span
      className="inline-flex items-center gap-[6px] font-[family-name:var(--font-dm-sans)] font-medium whitespace-nowrap"
      style={{
        padding: '2px 10px', borderRadius: 9999, background: t.bg, border: `1px solid ${t.border}`,
        color: t.fg, fontSize: 13, lineHeight: '20px',
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.dot }} />}
      {icon && <Icon name={icon} size={13} color={t.fg} />}
      {children}
    </span>
  )
}

export function Chip({
  children,
  tone = 'neutral',
  wrap = false,
}: {
  children: React.ReactNode
  tone?: PillTone
  wrap?: boolean
}) {
  const t = PILL_TONES[tone] || PILL_TONES.neutral
  return (
    <span
      className={`inline-flex items-center gap-[5px] font-[family-name:var(--font-dm-sans)] font-medium ${
        wrap
          ? 'min-w-0 max-w-full whitespace-normal break-words'
          : 'whitespace-nowrap'
      }`}
      style={{
        padding: '3px 8px', borderRadius: 6, background: t.bg, border: `1px solid ${t.border}`,
        color: t.fg, fontSize: 12.5, lineHeight: '18px',
      }}
    >
      {children}
    </span>
  )
}

// Boolean check / cross
export function YesNo({ value, yes = 'Yes', no = 'No' }: { value: boolean; yes?: string; no?: string }) {
  return value ? (
    <span
      className="inline-flex items-center gap-[6px] font-[family-name:var(--font-dm-sans)] font-semibold"
      style={{ color: '#067647', fontSize: 14 }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{ width: 18, height: 18, borderRadius: 9999, background: '#ecfdf3', border: '1px solid #abefc6' }}
      >
        <Icon name="check" size={11} color="#079455" strokeWidth={3} />
      </span>
      {yes}
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-[6px] font-[family-name:var(--font-dm-sans)] font-medium"
      style={{ color: '#717680', fontSize: 14 }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{ width: 18, height: 18, borderRadius: 9999, background: '#fafafa', border: '1px solid #e9eaeb' }}
      >
        <Icon name="minus" size={11} color="#a4a7ae" strokeWidth={3} />
      </span>
      {no}
    </span>
  )
}

// "Not enough data" neutral state for a cell
export function NoData() {
  return (
    <span
      className="inline-flex items-center gap-[6px] italic"
      style={{ color: '#a4a7ae', fontSize: 13 }}
    >
      <Icon name="info" size={13} color="#a4a7ae" /> Not enough data
    </span>
  )
}

// ---- Buttons --------------------------------------------------------------
export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type BtnSize = 'sm' | 'md' | 'lg'

export function Btn({
  children, variant = 'secondary', size = 'md', icon, iconRight, onClick, style, full, type = 'button', disabled,
}: {
  children?: React.ReactNode
  variant?: BtnVariant
  size?: BtnSize
  icon?: IconName
  iconRight?: IconName
  onClick?: () => void
  style?: React.CSSProperties
  full?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const sz =
    size === 'sm' ? { pad: '7px 12px', fs: 14, h: 36 }
      : size === 'lg' ? { pad: '12px 20px', fs: 16, h: 48 }
        : { pad: '9px 16px', fs: 14, h: 40 }
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: disabled ? '#a4c4ff' : '#155eef', color: '#fff', border: '2px solid rgba(255,255,255,0.12)', boxShadow: SKEUO },
    secondary: { background: '#fff', color: '#414651', border: '1px solid #d5d7da', boxShadow: SKEUO },
    ghost: { background: 'transparent', color: '#414651', border: '1px solid transparent', boxShadow: 'none' },
    danger: { background: '#fff', color: '#b42318', border: '1px solid #fecdca', boxShadow: SKEUO },
  }
  const v = variants[variant] || variants.secondary
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-[7px] font-[family-name:var(--font-dm-sans)] font-semibold"
      style={{
        padding: sz.pad, minHeight: sz.h, borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: sz.fs, lineHeight: '20px', width: full ? '100%' : undefined,
        transition: 'filter 150ms ease, background 150ms ease', ...v, ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.97)' }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
    >
      {icon && <Icon name={icon} size={sz.fs + 2} color={v.color as string} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.fs + 2} color={v.color as string} />}
    </button>
  )
}
