'use client'

// Integrations connection store.
//
// Same lightweight cross-tab pattern as lib/demo/demo-store.ts: a module-level
// cache persisted to localStorage and synced across tabs via the native
// `storage` event, read through useSyncExternalStore. This avoids a Context
// provider, so the *same* connection state is shared by surfaces on different
// route subtrees — Settings (/experts/account) and the Calendar
// (/experts/dashboard/calendar) — without threading a provider through both.
//
// UI-first: "connecting" just flips a flag and records an account label. No
// network. Wire the real OAuth here when a backend exists.

import { useSyncExternalStore } from 'react'
import {
  INTEGRATION_CATALOG,
  SCHEDULING_INTEGRATIONS,
  getIntegration,
  type IntegrationDef,
} from './integrations-catalog'

const KEY = 'proploy.integrations.v1'

export interface Connection {
  connected: boolean
  account?: string
  connectedAt?: number
}

export interface IntegrationsState {
  connections: Record<string, Connection>
  /** Catalog key of the scheduler used when booking a call. */
  activeScheduler: string
}

function defaultState(): IntegrationsState {
  const connections: Record<string, Connection> = {}
  for (const def of INTEGRATION_CATALOG) {
    connections[def.key] = def.defaultConnected
      ? { connected: true, account: def.defaultAccount, connectedAt: 0 }
      : { connected: false }
  }
  return { connections, activeScheduler: 'cal_com' }
}

let cache: IntegrationsState = defaultState()
const listeners = new Set<() => void>()
let initialized = false

function readFromStorage(): IntegrationsState {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<IntegrationsState>
    // Merge saved connections over defaults so newly-added catalog keys keep
    // their seed state while user changes are preserved.
    const connections = { ...base.connections }
    if (saved.connections) {
      for (const [k, v] of Object.entries(saved.connections)) {
        if (getIntegration(k)) connections[k] = { ...connections[k], ...v }
      }
    }
    const activeScheduler =
      saved.activeScheduler && getIntegration(saved.activeScheduler)?.scheduling
        ? saved.activeScheduler
        : base.activeScheduler
    return { connections, activeScheduler }
  } catch {
    return base
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

function update(fn: (s: IntegrationsState) => IntegrationsState) {
  ensureInit()
  cache = fn(cache)
  persist()
}

function now(): number {
  try {
    return Date.now()
  } catch {
    return 0
  }
}

/* --------------------------------------------------------------- actions */

export function connectIntegration(key: string, account?: string) {
  if (!getIntegration(key)) return
  update((s) => ({
    ...s,
    connections: {
      ...s.connections,
      [key]: { connected: true, account: account?.trim() || undefined, connectedAt: now() },
    },
  }))
}

export function disconnectIntegration(key: string) {
  update((s) => {
    const connections = { ...s.connections, [key]: { connected: false } }
    // If we just disconnected the active scheduler, fall back to another
    // connected scheduler, else Proploy's native one.
    let activeScheduler = s.activeScheduler
    if (key === activeScheduler) {
      const fallback = SCHEDULING_INTEGRATIONS.find(
        (d) => d.key !== key && connections[d.key]?.connected,
      )
      activeScheduler = fallback?.key ?? 'cal_diy'
    }
    return { ...s, connections, activeScheduler }
  })
}

export function setActiveScheduler(key: string) {
  update((s) => ({ ...s, activeScheduler: key }))
}

/* ------------------------------------------------------------------ hook */

function subscribe(cb: () => void) {
  ensureInit()
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot(): IntegrationsState {
  ensureInit()
  return cache
}
function getServerSnapshot(): IntegrationsState {
  // Deterministic seed on the server so SSR and the first client render match.
  return SERVER_SNAPSHOT
}
const SERVER_SNAPSHOT = defaultState()

export interface UseIntegrations extends IntegrationsState {
  isConnected: (key: string) => boolean
  accountFor: (key: string) => string | undefined
  /** Connected scheduling integrations, in catalog order. */
  connectedSchedulers: IntegrationDef[]
  /** The active scheduler's catalog def (undefined for Proploy-native cal_diy). */
  activeSchedulerDef: IntegrationDef | undefined
  connect: typeof connectIntegration
  disconnect: typeof disconnectIntegration
  setActiveScheduler: typeof setActiveScheduler
}

export function useIntegrations(): UseIntegrations {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isConnected = (key: string) => Boolean(state.connections[key]?.connected)
  return {
    ...state,
    isConnected,
    accountFor: (key) => state.connections[key]?.account,
    connectedSchedulers: SCHEDULING_INTEGRATIONS.filter((d) => isConnected(d.key)),
    activeSchedulerDef: getIntegration(state.activeScheduler),
    connect: connectIntegration,
    disconnect: disconnectIntegration,
    setActiveScheduler,
  }
}
