'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CONTRACT_TEMPLATES,
  deriveStatus,
  type Contract,
  type ContractMilestone,
  type ContractParty,
  type ContractsState,
  type ContractSignature,
  type ContractTemplateKey,
  type PartyRole,
} from '@/hooks/types/contracts-doc'
import { seedContractsState } from './contracts-mock'
import { renderTypedSignature, TYPED_PREFIX } from './typed-signature'

const STORAGE_KEY = 'proploy.contracts.v1'

const uid = (p = 'id') =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${p}-${crypto.randomUUID().slice(0, 8)}`
    : `${p}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`

const isoDate = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

// The provider identity used when drafting new contracts (the signed-in expert).
export const ME: ContractParty = {
  role: 'provider',
  name: 'Jordan Avery',
  org: 'Avery Implementation Co.',
  email: 'jordan@averyimpl.co',
}

type NewContractInput = {
  templateKey: ContractTemplateKey
  title: string
  project: string
  client: { name: string; org: string; email: string }
  currency?: string
}

type ContractsContextValue = {
  contracts: Contract[]
  getContract: (id: string) => Contract | undefined
  addContract: (input: NewContractInput) => Contract
  addUploadedContract: (input: NewContractInput & { fileName: string }) => Contract
  updateContract: (id: string, patch: Partial<Contract>) => void
  signContract: (id: string, role: PartyRole, sig: Omit<ContractSignature, 'role'>) => void
  deleteContract: (id: string) => void
}

const ContractsContext = createContext<ContractsContextValue | null>(null)

function buildMilestones(templateKey: ContractTemplateKey): ContractMilestone[] {
  const tpl = CONTRACT_TEMPLATES.find((t) => t.key === templateKey)
  if (!tpl) return []
  return tpl.milestones.map((m) => ({
    id: uid('m'),
    label: m.label,
    due: isoDate(m.offsetDays),
    amountCents: m.amountCents,
  }))
}

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContractsState>(seedContractsState)
  const hydrated = useRef(false)

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw) as ContractsState)
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true
  }, [])

  // Materialize seeded `typed:Name` signatures into real PNG data URLs (canvas
  // is browser-only). Runs once after hydrate; persisted state already holds
  // real PNGs so this is a no-op on return visits.
  useEffect(() => {
    setState((s) => {
      let changed = false
      const contracts = s.contracts.map((c) => {
        const signatures = { ...c.signatures }
        ;(['provider', 'client'] as PartyRole[]).forEach((role) => {
          const sig = signatures[role]
          if (sig && sig.dataUrl.startsWith(TYPED_PREFIX)) {
            signatures[role] = { ...sig, dataUrl: renderTypedSignature(sig.dataUrl.slice(TYPED_PREFIX.length)) }
            changed = true
          }
        })
        return changed ? { ...c, signatures } : c
      })
      return changed ? { contracts } : s
    })
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const value = useMemo<ContractsContextValue>(() => {
    const patch = (id: string, fn: (c: Contract) => Contract) =>
      setState((s) => ({ contracts: s.contracts.map((c) => (c.id === id ? fn(c) : c)) }))

    return {
      contracts: state.contracts,
      getContract: (id) => state.contracts.find((c) => c.id === id),

      addContract: (input) => {
        const tpl = CONTRACT_TEMPLATES.find((t) => t.key === input.templateKey)
        const c: Contract = {
          id: uid('ctr'),
          title: input.title,
          project: input.project,
          templateKey: input.templateKey,
          currency: input.currency ?? 'USD',
          createdAt: isoDate(),
          provider: { ...ME },
          client: { role: 'client', ...input.client },
          scope: tpl?.scope ?? '',
          milestones: buildMilestones(input.templateKey),
          signatures: {},
          uploadedDocName: null,
          status: 'draft',
        }
        setState((s) => ({ contracts: [c, ...s.contracts] }))
        return c
      },

      addUploadedContract: (input) => {
        const c: Contract = {
          id: uid('ctr'),
          title: input.title,
          project: input.project,
          templateKey: input.templateKey,
          currency: input.currency ?? 'USD',
          createdAt: isoDate(),
          provider: { ...ME },
          client: { role: 'client', ...input.client },
          scope:
            'Uploaded document. Review the attached file for the full statement of work, then sign below to execute.',
          milestones: buildMilestones(input.templateKey),
          signatures: {},
          uploadedDocName: input.fileName,
          status: 'draft',
        }
        setState((s) => ({ contracts: [c, ...s.contracts] }))
        return c
      },

      updateContract: (id, p) =>
        patch(id, (c) => {
          const next = { ...c, ...p }
          return { ...next, status: deriveStatus(next) }
        }),

      signContract: (id, role, sig) =>
        patch(id, (c) => {
          const signatures = { ...c.signatures, [role]: { role, ...sig } }
          return { ...c, signatures, status: deriveStatus({ signatures }) }
        }),

      deleteContract: (id) =>
        setState((s) => ({ contracts: s.contracts.filter((c) => c.id !== id) })),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>
}

export function useContracts(): ContractsContextValue {
  const ctx = useContext(ContractsContext)
  if (!ctx) throw new Error('useContracts must be used within ContractsProvider')
  return ctx
}
