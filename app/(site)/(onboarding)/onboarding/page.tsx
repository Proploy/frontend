'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import {
  getInterests,
  saveInterests,
  useOnboardingStatus,
  type InterestsPayload,
} from '@/features/onboarding'
import { mergeInterestPayloads } from '@/features/interests/interest-storage'
import { EXPERT_INTEREST_OPTIONS, PRODUCT_INTEREST_OPTIONS } from '@/features/interests/types'

const DEFAULT_NEXT = '/workspace'

// Buyer step options. Industries/platforms/project types mirror the expert
// taxonomy so a buyer's answers are matchable against expert profiles.
const INDUSTRIES = EXPERT_INTEREST_OPTIONS.industries
const PLATFORMS = EXPERT_INTEREST_OPTIONS.platforms
const PROJECT_TYPES = EXPERT_INTEREST_OPTIONS.project_types
const COMPANY_SIZES = PRODUCT_INTEREST_OPTIONS.company_sizes

/** Only same-origin paths — never bounce to an attacker-supplied absolute URL. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return DEFAULT_NEXT
  return value
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingSplash />}>
      <OnboardingFlow />
    </Suspense>
  )
}

function OnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: isAuthLoading } = useAuth()
  const status = useOnboardingStatus()
  const next = useMemo(() => safeNext(searchParams.get('next')), [searchParams])

  const [step, setStep] = useState<'role' | 'details'>('role')
  const [industries, setIndustries] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [companySize, setCompanySize] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // Signed out → sign in first, then come back here.
  useEffect(() => {
    if (isAuthLoading || user) return
    router.replace(`/sign-in?redirectTo=${encodeURIComponent(`/onboarding?next=${next}`)}`)
  }, [isAuthLoading, next, router, user])

  // Already onboarded (or landed here by hand) → straight through.
  useEffect(() => {
    if (status.isPending || !status.isSignedIn || !status.isOnboarded) return
    router.replace(next)
  }, [next, router, status.isOnboarded, status.isPending, status.isSignedIn])

  const selectionCount = industries.length + platforms.length + projectTypes.length + (companySize ? 1 : 0)

  const handleExpert = () => {
    // The expert track *is* the vendor application; it owns its own steps.
    router.replace('/become-expert')
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError('')

    const answers: InterestsPayload = {
      industries,
      platforms,
      project_types: projectTypes,
      company_sizes: companySize ? [companySize] : [],
    }

    // Merge onto whatever is already stored so a re-run never drops answers
    // captured by the browse-time interest prompt.
    const current = await getInterests()
    const merged = mergeInterestPayloads(current.ok ? current.data : null, answers)

    const result = await saveInterests(merged)
    if (!result.ok) {
      setError(result.error.message || 'Could not save your answers. Please try again.')
      setIsSaving(false)
      return
    }

    router.replace(next)
  }

  if (isAuthLoading || !user || status.isPending || status.isOnboarded) {
    return <OnboardingSplash />
  }

  return (
    <div className="pp-scope" style={{ minHeight: '100%', background: 'var(--paper)' }}>
      <div
        className="pp-stack pp-gap-12"
        style={{ maxWidth: 720, width: '100%', margin: '0 auto', padding: 'var(--sp-12) var(--sp-6)' }}
      >
        <header className="pp-flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" aria-label="Proploy home" className="inline-flex">
            <Image alt="Proploy" src="/proploy-logomark.png" width={38} height={38} />
          </Link>
          <p className="pp-label">Step {step === 'role' ? 1 : 2} of 2</p>
        </header>

        {step === 'role' ? (
          <RoleStep
            name={user.name ?? user.email ?? ''}
            onBuyer={() => setStep('details')}
            onExpert={handleExpert}
          />
        ) : (
          <DetailsStep
            industries={industries}
            platforms={platforms}
            projectTypes={projectTypes}
            companySize={companySize}
            onToggleIndustry={(value) => setIndustries(toggle(industries, value))}
            onTogglePlatform={(value) => setPlatforms(toggle(platforms, value))}
            onToggleProjectType={(value) => setProjectTypes(toggle(projectTypes, value))}
            onSelectCompanySize={(value) => setCompanySize(value === companySize ? null : value)}
            onBack={() => setStep('role')}
            onSubmit={handleSubmit}
            canSubmit={selectionCount > 0 && !isSaving}
            isSaving={isSaving}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

function RoleStep({
  name,
  onBuyer,
  onExpert,
}: {
  name: string
  onBuyer: () => void
  onExpert: () => void
}) {
  const firstName = name.split(/[ @]/)[0]

  return (
    <div className="pp-stack pp-gap-8">
      <div className="pp-stack pp-gap-3">
        <p className="pp-label">Welcome{firstName ? `, ${firstName}` : ''}</p>
        <h1 className="pp-display pp-d3">How will you use Proploy?</h1>
        <p className="pp-body">
          This sets up your workspace. You can change tracks later from your profile.
        </p>
      </div>

      <div className="pp-grid pp-grid-2">
        <RoleCard
          title="I'm hiring experts"
          body="Find vetted specialists for the software you run, and manage briefs, contracts and invoices in one workspace."
          action="Set up my workspace"
          onClick={onBuyer}
        />
        <RoleCard
          title="I'm an expert"
          body="Build a vetted profile, get matched to implementation work, and run engagements end to end."
          action="Start my application"
          onClick={onExpert}
        />
      </div>
    </div>
  )
}

function RoleCard({
  title,
  body,
  action,
  onClick,
}: {
  title: string
  body: string
  action: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pp-card pp-stack pp-gap-4"
      style={{ textAlign: 'left', cursor: 'pointer' }}
    >
      <h2 className="pp-h5">{title}</h2>
      <p className="pp-small" style={{ flex: 1 }}>{body}</p>
      <span className="pp-btn pp-btn--secondary pp-btn--sm" aria-hidden="true">{action}</span>
    </button>
  )
}

function DetailsStep({
  industries,
  platforms,
  projectTypes,
  companySize,
  onToggleIndustry,
  onTogglePlatform,
  onToggleProjectType,
  onSelectCompanySize,
  onBack,
  onSubmit,
  canSubmit,
  isSaving,
  error,
}: {
  industries: string[]
  platforms: string[]
  projectTypes: string[]
  companySize: string | null
  onToggleIndustry: (value: string) => void
  onTogglePlatform: (value: string) => void
  onToggleProjectType: (value: string) => void
  onSelectCompanySize: (value: string) => void
  onBack: () => void
  onSubmit: () => void
  canSubmit: boolean
  isSaving: boolean
  error: string
}) {
  return (
    <div className="pp-stack pp-gap-8">
      <div className="pp-stack pp-gap-3">
        <p className="pp-label">Tell us what you work with</p>
        <h1 className="pp-display pp-d3">A few quick answers</h1>
        <p className="pp-body">
          We use these to match products and experts to your stack. Pick anything that fits — at
          least one.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="pp-body"
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--r-control)',
            border: 'var(--bw) solid var(--color-error-200)',
            background: 'var(--color-error-50)',
            color: 'var(--color-error-700)',
          }}
        >
          {error}
        </div>
      )}

      <ChipGroup label="Your industry" options={INDUSTRIES} selected={industries} onToggle={onToggleIndustry} />
      <ChipGroup label="Platforms you run" options={PLATFORMS} selected={platforms} onToggle={onTogglePlatform} />
      <ChipGroup label="What you need help with" options={PROJECT_TYPES} selected={projectTypes} onToggle={onToggleProjectType} />
      <ChipGroup
        label="Company size"
        options={COMPANY_SIZES}
        selected={companySize ? [companySize] : []}
        onToggle={onSelectCompanySize}
      />

      <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
        <button type="button" className="pp-btn pp-btn--ghost" onClick={onBack} disabled={isSaving}>
          Back
        </button>
        <button
          type="button"
          className="pp-btn pp-btn--cobalt"
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{ marginLeft: 'auto' }}
        >
          {isSaving ? 'Saving…' : 'Open my workspace'}
        </button>
      </div>
    </div>
  )
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <fieldset className="pp-stack pp-gap-3" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="pp-label" style={{ padding: 0 }}>{label}</legend>
      <div className="pp-flex pp-wrap pp-gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="pp-chip"
            aria-pressed={selected.includes(option)}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function OnboardingSplash() {
  return (
    <div
      className="pp-scope pp-flex"
      style={{ minHeight: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}
    >
      <p className="pp-body">Loading…</p>
    </div>
  )
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}
