'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { seedProposalsState } from './proposals-mock'

const STORAGE_KEY = 'proploy.proposals.v1'

const uid = (p = 'id') =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${p}-${crypto.randomUUID().slice(0, 8)}`
    : `${p}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`

export type RequestStatus = 'new' | 'reviewing' | 'proposed' | 'won' | 'declined'

export const REQUEST_STATUS_META: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#175cd3', bg: '#eff8ff' },
  reviewing: { label: 'Reviewing', color: '#b54708', bg: '#fffaeb' },
  proposed: { label: 'Proposal sent', color: '#5925dc', bg: '#f4f3ff' },
  won: { label: 'Won', color: '#067647', bg: '#ecfdf3' },
  declined: { label: 'Declined', color: '#717680', bg: '#fafafa' },
}

export type RateModel = 'fixed' | 'hourly' | 'retainer'

export type Proposal = {
  summary: string
  rateModel: RateModel
  amountCents: number // total fixed, hourly rate, or monthly retainer depending on model
  timelineWeeks: number
  sentAt: string // ISO
}

export type InboundRequest = {
  id: string
  company: string
  contact: string
  role: string
  software: string[]
  scope: string
  budgetLowCents: number
  budgetHighCents: number
  startDate: string // ISO YYYY-MM-DD
  receivedAt: string // ISO
  verified: boolean
  matchScore: number // 0-100
  status: RequestStatus
  proposal?: Proposal | null
}

export type ProposalsState = { requests: InboundRequest[] }

type ProposalsContextValue = {
  requests: InboundRequest[]
  getRequest: (id: string) => InboundRequest | undefined
  setStatus: (id: string, status: RequestStatus) => void
  sendProposal: (id: string, proposal: Omit<Proposal, 'sentAt'>) => void
  declineRequest: (id: string) => void
}

const ProposalsContext = createContext<ProposalsContextValue | null>(null)

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProposalsState>(seedProposalsState)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw) as ProposalsState)
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const value = useMemo<ProposalsContextValue>(() => {
    const patch = (id: string, fn: (r: InboundRequest) => InboundRequest) =>
      setState((s) => ({ requests: s.requests.map((r) => (r.id === id ? fn(r) : r)) }))
    return {
      requests: state.requests,
      getRequest: (id) => state.requests.find((r) => r.id === id),
      setStatus: (id, status) => patch(id, (r) => ({ ...r, status })),
      sendProposal: (id, proposal) =>
        patch(id, (r) => ({ ...r, status: 'proposed', proposal: { ...proposal, sentAt: new Date().toISOString() } })),
      declineRequest: (id) => patch(id, (r) => ({ ...r, status: 'declined' })),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // uid is exposed for parity with other stores even though requests are seed-only.
  void uid

  return <ProposalsContext.Provider value={value}>{children}</ProposalsContext.Provider>
}

export function useProposals(): ProposalsContextValue {
  const ctx = useContext(ProposalsContext)
  if (!ctx) throw new Error('useProposals must be used within ProposalsProvider')
  return ctx
}
