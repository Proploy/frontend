'use client'

// Lightweight cross-tab demo store. Persists to localStorage and syncs across
// browser tabs via the native `storage` event, so an action taken in the
// business dashboard (one tab) shows up in the expert dashboard (another tab).
// Demo-only: overlays the static *-mock fixtures; clear with resetDemo().

import { useSyncExternalStore } from 'react'

const KEY = 'proploy-demo-v1'

// The single demo expert <-> demo business that the synced flows are about.
export const DEMO_EXPERT = 'Avery Mock'
export const DEMO_BUSINESS = 'Northwind Capital'

export interface DemoMessage {
  id: string
  from: 'business' | 'expert'
  text: string
  ts: number
}

export interface DemoLead {
  id: string
  title: string
  category: string
  scope: string
  timeline: string
  budget: string
  ts: number
}

export interface DemoReview {
  id: string
  author: string
  company: string
  project: string
  rating: number
  title: string
  body: string
  ts: number
}

export interface DemoPayout {
  id: string
  milestone: string
  project: string
  amountCents: number
  ts: number
}

export interface DemoNotif {
  id: string
  role: 'expert' | 'business'
  kind: 'payment' | 'project' | 'message' | 'review' | 'approval' | 'dispute' | 'system'
  title: string
  body: string
  href?: string
  ts: number
}

export interface DemoState {
  messages: DemoMessage[]
  leads: DemoLead[]
  reviews: DemoReview[]
  payouts: DemoPayout[]
  notifications: DemoNotif[]
}

const EMPTY: DemoState = { messages: [], leads: [], reviews: [], payouts: [], notifications: [] }

let cache: DemoState = EMPTY
const listeners = new Set<() => void>()
let initialized = false

function readFromStorage(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<DemoState>) }
  } catch {
    return EMPTY
  }
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  cache = readFromStorage()
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = readFromStorage()
      listeners.forEach((l) => l())
    }
  })
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* ignore quota */
  }
  listeners.forEach((l) => l())
}

function update(fn: (s: DemoState) => DemoState) {
  ensureInit()
  cache = fn(cache)
  persist()
}

let seq = 0
function id(prefix: string) {
  seq += 1
  return `${prefix}-${cache.messages.length + cache.leads.length + cache.reviews.length + seq}`
}
// Monotonic-ish timestamp without Date.now() (unavailable in some sandboxes is
// fine here — this is browser-only). Falls back to a counter for ordering.
function now(): number {
  try {
    return Date.now()
  } catch {
    seq += 1
    return seq
  }
}

/* --------------------------------------------------------------- actions */

export function addMessage(from: 'business' | 'expert', text: string) {
  update((s) => ({ ...s, messages: [...s.messages, { id: id('m'), from, text, ts: now() }] }))
}

export function addLead(lead: Omit<DemoLead, 'id' | 'ts'>) {
  update((s) => ({ ...s, leads: [{ ...lead, id: id('lead'), ts: now() }, ...s.leads] }))
}

export function addReview(review: Omit<DemoReview, 'id' | 'ts'>) {
  update((s) => ({ ...s, reviews: [{ ...review, id: id('rev'), ts: now() }, ...s.reviews] }))
}

export function addPayout(payout: Omit<DemoPayout, 'id' | 'ts'>) {
  update((s) => ({ ...s, payouts: [{ ...payout, id: id('pay'), ts: now() }, ...s.payouts] }))
}

export function notify(n: Omit<DemoNotif, 'id' | 'ts'>) {
  update((s) => ({ ...s, notifications: [{ ...n, id: id('n'), ts: now() }, ...s.notifications] }))
}

export function resetDemo() {
  update(() => ({ messages: [], leads: [], reviews: [], payouts: [], notifications: [] }))
}

/* ------------------------------------------------------------------ hook */

function subscribe(cb: () => void) {
  ensureInit()
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot(): DemoState {
  ensureInit()
  return cache
}
function getServerSnapshot(): DemoState {
  return EMPTY
}

export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
