'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Check, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import {
  EXPERT_INTEREST_OPTIONS,
  PRODUCT_INTEREST_OPTIONS,
  type InterestPayload,
  type InterestRouteKind,
  type InterestStorageState,
  EMPTY_INTEREST_PAYLOAD,
} from './types'
import {
  clearInterestStorage,
  hasInterestData,
  mergeInterestPayloads,
  readInterestStorage,
  writeInterestStorage,
} from './interest-storage'

const client = new ServiceApisBrowserClient()
const INTERACTION_PROMPT_DELAY_MS = 9000
const DISMISSAL_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7
const EXCLUDED_PREFIXES = ['/experts/dashboard', '/experts/account', '/experts/chat', '/workspace']

type InterestCaptureContextValue = {
  activeKind: InterestRouteKind | null
  isOpen: boolean
  markInteraction: () => void
  openPrompt: () => void
  closePrompt: (keepDismissed?: boolean) => void
}

type InterestDraft = InterestPayload

const InterestCaptureContext = createContext<InterestCaptureContextValue | null>(null)

export function InterestCaptureProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [storage, setStorage] = useState<InterestStorageState>(DEFAULT_STATE)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeKind, setActiveKind] = useState<InterestRouteKind | null>(null)
  const [draft, setDraft] = useState<InterestDraft>(EMPTY_INTEREST_PAYLOAD)
  const [hasInteracted, setHasInteracted] = useState(false)
  const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const syncedUserRef = useRef<string | null>(null)

  const routeKind = useMemo<InterestRouteKind | null>(() => {
    if (!pathname) return null
    if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null
    if (pathname.startsWith('/products')) return 'products'
    if (pathname.startsWith('/experts')) return 'experts'
    return null
  }, [pathname])

  useEffect(() => {
    setStorage(readInterestStorage())
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    writeInterestStorage(storage)
  }, [isHydrated, storage])

  useEffect(() => {
    if (!isHydrated || isLoading) return
    if (user?.id && syncedUserRef.current !== user.id) {
      void syncGuestInterestDraft()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isLoading, isHydrated])

  useEffect(() => {
    setHasInteracted(false)
    setActiveKind(routeKind)
    setDraft(routeKind ? storage[routeKind] : EMPTY_INTEREST_PAYLOAD)

    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current)
      promptTimerRef.current = null
    }

    if (!routeKind || isOpen) return

    const onFirstInteraction = () => {
      setHasInteracted(true)
    }

    window.addEventListener('pointerdown', onFirstInteraction, { once: true, capture: true })
    window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true, capture: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true, capture: true })

    const schedulePrompt = () => {
      promptTimerRef.current = setTimeout(() => {
        setStorage((current) => {
          const dismissed = current.dismissed_until ?? 0
          const now = Date.now()
          if (!routeKind || isOpen || !hasInteracted || dismissed > now) return current
          setActiveKind(routeKind)
          setDraft(current[routeKind])
          setIsOpen(true)
          return current
        })
      }, INTERACTION_PROMPT_DELAY_MS)
    }

    schedulePrompt()

    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction, true)
      window.removeEventListener('scroll', onFirstInteraction, true)
      window.removeEventListener('keydown', onFirstInteraction, true)
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current)
        promptTimerRef.current = null
      }
    }
  }, [hasInteracted, isOpen, routeKind, storage])

  const updateDraft = useCallback((patch: Partial<InterestPayload>) => {
    if (!activeKind) return
    setDraft((current) => {
      const next = {
        industries: patch.industries ?? current.industries,
        platforms: patch.platforms ?? current.platforms,
        project_types: patch.project_types ?? current.project_types,
        company_sizes: patch.company_sizes ?? current.company_sizes,
      }
      setStorage((state) => ({
        ...state,
        [activeKind]: next,
      }))
      return next
    })
  }, [activeKind])

  const closePrompt = useCallback((keepDismissed = true) => {
    setIsOpen(false)
    if (keepDismissed) {
      setStorage((current) => ({
        ...current,
        dismissed_until: Date.now() + DISMISSAL_COOLDOWN_MS,
      }))
    }
  }, [])

  const syncGuestInterestDraft = useCallback(async () => {
    if (!user?.id) return
    const currentStorage = readInterestStorage()
    const merged = mergeInterestPayloads(currentStorage.products, currentStorage.experts)
    if (!hasInterestData(merged)) {
      syncedUserRef.current = user.id
      return
    }

    const currentResult = await client.get<{ user_id: string; industries: string[]; platforms: string[]; project_types: string[]; company_sizes: string[] }>(
      '/api/v1/users/me/interests',
      { requireAuth: true },
    )
    if (!currentResult.ok) return

    const remoteMerged = mergeInterestPayloads(currentResult.data, merged)
    const patchResult = await client.patch(
      '/api/v1/users/me/interests',
      remoteMerged,
      { requireAuth: true },
    )

    if (!patchResult.ok) return

    clearInterestStorage()
    setStorage(DEFAULT_STATE)
    syncedUserRef.current = user.id
  }, [user?.id])

  const openPrompt = useCallback(() => {
    if (!routeKind) return
    setActiveKind(routeKind)
    setDraft(storage[routeKind])
    setIsOpen(true)
  }, [routeKind, storage])

  const value = useMemo<InterestCaptureContextValue>(() => ({
    activeKind,
    isOpen,
    markInteraction: () => setHasInteracted(true),
    openPrompt,
    closePrompt,
  }), [activeKind, closePrompt, isOpen, openPrompt])

  return (
    <InterestCaptureContext.Provider value={value}>
      {children}
      {isOpen && activeKind ? (
        <InterestCaptureDialog
          kind={activeKind}
          draft={draft}
          onChange={updateDraft}
          onClose={() => closePrompt(true)}
          onSave={async () => {
            if (!activeKind) return
            if (user?.id) {
              const currentStorage = readInterestStorage()
              const merged = mergeInterestPayloads(currentStorage.products, currentStorage.experts)
              const currentResult = await client.get<{ user_id: string; industries: string[]; platforms: string[]; project_types: string[]; company_sizes: string[] }>(
                '/api/v1/users/me/interests',
                { requireAuth: true },
              )
              if (currentResult.ok) {
                const remoteMerged = mergeInterestPayloads(currentResult.data, merged)
                const patchResult = await client.patch(
                  '/api/v1/users/me/interests',
                  remoteMerged,
                  { requireAuth: true },
                )
                if (patchResult.ok) {
                  clearInterestStorage()
                  setStorage(DEFAULT_STATE)
                  syncedUserRef.current = user.id
                }
              }
            }
            closePrompt(true)
          }}
        />
      ) : null}
    </InterestCaptureContext.Provider>
  )
}

export function useInterestCapture() {
  const ctx = useContext(InterestCaptureContext)
  if (!ctx) {
    throw new Error('useInterestCapture must be used within an InterestCaptureProvider')
  }
  return ctx
}

const DEFAULT_STATE = {
  products: { ...EMPTY_INTEREST_PAYLOAD },
  experts: { ...EMPTY_INTEREST_PAYLOAD },
  dismissed_until: null,
}

function InterestCaptureDialog({
  kind,
  draft,
  onChange,
  onClose,
  onSave,
}: {
  kind: InterestRouteKind
  draft: InterestPayload
  onChange: (patch: Partial<InterestPayload>) => void
  onClose: () => void
  onSave: () => Promise<void>
}) {
  const isProducts = kind === 'products'
  const title = isProducts ? 'Help us tailor product recommendations' : 'Help us tailor expert recommendations'
  const description = isProducts
    ? 'Tell us a little about the tools and team shape you are evaluating. We will use this to adapt results and compare flows later.'
    : 'Tell us what kind of expert support you are looking for. We will use this to adapt expert discovery and comparisons later.'
  const productOptions = PRODUCT_INTEREST_OPTIONS
  const expertOptions = EXPERT_INTEREST_OPTIONS

  const toggleValue = (field: keyof InterestPayload, value: string) => {
    const current = draft[field]
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    onChange({ [field]: next } as Partial<InterestPayload>)
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#0a0d12]/45 px-[16px] backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="interest-capture-title">
      <div className="w-full max-w-[760px] rounded-[18px] border border-[#e9eaeb] bg-white shadow-[0_24px_70px_rgba(10,13,18,0.22)]">
        <div className="flex items-start justify-between gap-[16px] border-b border-[#eef0f2] px-[24px] py-[22px]">
          <div>
            <h2 id="interest-capture-title" className="text-[22px] font-semibold leading-[30px] text-[#181d27]">
              {title}
            </h2>
            <p className="mt-[6px] max-w-[620px] text-[15px] leading-[22px] text-[#535862]">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[#717680] hover:bg-[#f5f5f5] hover:text-[#181d27]"
            aria-label="Close interest prompt"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-[18px] px-[24px] py-[22px] md:grid-cols-2">
          <Field title={isProducts ? 'Industries' : 'Industries'} hint="Pick up to 3" >
            <OptionGrid
              value={draft.industries}
              options={isProducts ? productOptions.industries : expertOptions.industries}
              onToggle={(value) => toggleValue('industries', value)}
            />
          </Field>
          <Field title={isProducts ? 'Platforms' : 'Platforms'} hint="Pick up to 3">
            <OptionGrid
              value={draft.platforms}
              options={isProducts ? productOptions.platforms : expertOptions.platforms}
              onToggle={(value) => toggleValue('platforms', value)}
            />
          </Field>
          {isProducts ? (
            <Field title="Company size" hint="Pick one or more" className="md:col-span-2">
              <OptionGrid
                value={draft.company_sizes}
                options={productOptions.company_sizes}
                onToggle={(value) => toggleValue('company_sizes', value)}
              />
            </Field>
          ) : (
            <Field title="Project types" hint="Pick one or more" className="md:col-span-2">
              <OptionGrid
                value={draft.project_types}
                options={expertOptions.project_types}
                onToggle={(value) => toggleValue('project_types', value)}
              />
            </Field>
          )}
        </div>

        <div className="flex flex-col-reverse gap-[10px] border-t border-[#eef0f2] px-[24px] py-[18px] sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[42px] items-center justify-center rounded-[10px] border border-[#d5d7da] bg-white px-[16px] text-[14px] font-semibold text-[#414651] hover:bg-[#fafafa]"
          >
            Continue without saving
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-[42px] items-center justify-center gap-[8px] rounded-[10px] bg-[#155eef] px-[16px] text-[14px] font-semibold text-white hover:bg-[#004eeb]"
          >
            <Check size={16} />
            Save preferences
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  title,
  hint,
  className = '',
  children,
}: {
  title: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="mb-[10px]">
        <p className="text-[14px] font-semibold text-[#181d27]">{title}</p>
        {hint ? <p className="mt-[2px] text-[12px] text-[#717680]">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

function OptionGrid({
  value,
  options,
  onToggle,
}: {
  value: string[]
  options: readonly string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-[8px]">
      {options.map((option) => {
        const selected = value.includes(option)
        return (
          <button
            type="button"
            key={option}
            onClick={() => onToggle(option)}
            className={`inline-flex h-[36px] items-center rounded-full border px-[12px] text-[13px] font-medium transition-colors ${
              selected
                ? 'border-[#b2ccff] bg-[#eff4ff] text-[#004eeb]'
                : 'border-[#d5d7da] bg-white text-[#414651] hover:border-[#b2ccff] hover:bg-[#f9fbff]'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
