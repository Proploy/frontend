'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import ProjectList from '@/components/onboarding/ProjectList'
import ProjectPrioritySelect from '@/components/onboarding/ProjectPrioritySelect'
import TagInput from '@/components/onboarding/TagInput'
import UrlListInput from '@/components/onboarding/UrlListInput'
import {
  INDUSTRY_SUGGESTIONS,
  onboardingSteps,
  PLATFORM_SUGGESTIONS,
  PROJECT_PRIORITY_GROUPS,
  TOOLS_SUGGESTIONS,
  type OnboardingField,
} from '@/config/onboarding-form'

type ExpertProject = {
  title: string
  summary: string
  link: string
  outcomes: string
}

type ExpertDraftData = Partial<Omit<ExpertFormData, 'featuredProjects'>> & {
  yearsExperience?: number
  projectsCompletedTotal?: number
  availabilityHoursPerWeek?: number
  featuredProjects?: ExpertProject[]
  links?: { linkType: string; url: string }[]
  projects?: ExpertProject[]
}

type ExpertFormData = {
  entityType: string
  displayName: string
  headline: string
  regionCountry: string
  regionCity: string
  timezone: string
  yearsExperience: number | ''
  projectsCompletedTotal: number | ''
  introVideoLink: string
  availabilityHoursPerWeek: number | ''
  availabilityNotes: string
  whyPlatform: string
  uniqueStrength: string
  idealClients: string
  biggestWin: string
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  preferredProjectTypes: string[]
  toolsStack: string[]
  portfolioLinks: string[]
  caseStudyLinks: string[]
  certificationLinks: string[]
  testimonialsLinks: string[]
  featuredProjects: ExpertProject[]
  agreeTerms: boolean
  consentContact: boolean
}

const FIELD_SUGGESTIONS: Record<string, string[]> = {
  primaryPlatforms: PLATFORM_SUGGESTIONS,
  secondaryPlatforms: PLATFORM_SUGGESTIONS,
  industryExpertise: INDUSTRY_SUGGESTIONS,
  toolsStack: TOOLS_SUGGESTIONS,
}

const DEFAULT_FORM_DATA: ExpertFormData = {
  entityType: '',
  displayName: '',
  headline: '',
  regionCountry: '',
  regionCity: '',
  timezone: '',
  yearsExperience: '',
  projectsCompletedTotal: '',
  introVideoLink: '',
  availabilityHoursPerWeek: '',
  availabilityNotes: '',
  whyPlatform: '',
  uniqueStrength: '',
  idealClients: '',
  biggestWin: '',
  primaryPlatforms: [],
  secondaryPlatforms: [],
  industryExpertise: [],
  preferredProjectTypes: [],
  toolsStack: [],
  portfolioLinks: [],
  caseStudyLinks: [],
  certificationLinks: [],
  testimonialsLinks: [],
  featuredProjects: [],
  agreeTerms: false,
  consentContact: false,
}

type LinkFieldName = 'portfolioLinks' | 'caseStudyLinks' | 'certificationLinks' | 'testimonialsLinks'

const LINK_TYPE_TO_FIELD: Record<string, LinkFieldName> = {
  portfolio: 'portfolioLinks',
  case_study: 'caseStudyLinks',
  certification: 'certificationLinks',
  testimonial: 'testimonialsLinks',
}

function isValidUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function normalizeNumber(value: number | '') {
  return typeof value === 'number' ? value : undefined
}

function buildPayload(formData: ExpertFormData) {
  return {
    ...formData,
    yearsExperience: normalizeNumber(formData.yearsExperience),
    projectsCompletedTotal: normalizeNumber(formData.projectsCompletedTotal),
    availabilityHoursPerWeek: normalizeNumber(formData.availabilityHoursPerWeek),
    featuredProjects: formData.featuredProjects,
    projects: formData.featuredProjects,
    tags: [
      ...formData.primaryPlatforms.map((tagValue) => ({ tagType: 'platform', tagValue })),
      ...formData.secondaryPlatforms.map((tagValue) => ({ tagType: 'platform', tagValue })),
      ...formData.industryExpertise.map((tagValue) => ({ tagType: 'industry', tagValue })),
      ...formData.preferredProjectTypes.map((tagValue) => ({ tagType: 'project_type', tagValue })),
      ...formData.toolsStack.map((tagValue) => ({ tagType: 'tool', tagValue })),
    ],
    links: [
      ...formData.portfolioLinks.map((url) => ({ linkType: 'portfolio', url })),
      ...formData.caseStudyLinks.map((url) => ({ linkType: 'case_study', url })),
      ...formData.certificationLinks.map((url) => ({ linkType: 'certification', url })),
      ...formData.testimonialsLinks.map((url) => ({ linkType: 'testimonial', url })),
    ],
  }
}

function normalizeDraftData(data: ExpertDraftData): ExpertFormData {
  const rawTags = Array.isArray(data?.tags) ? data.tags : []
  const getTagValues = (tagType: string): string[] =>
    rawTags.filter((t: any) => t.tagType === tagType).map((t: any) => t.tagValue)

  const normalizedLinks: Record<LinkFieldName, string[]> = {
    portfolioLinks: [],
    caseStudyLinks: [],
    certificationLinks: [],
    testimonialsLinks: [],
  }

  for (const link of Array.isArray(data?.links) ? data.links : []) {
    const fieldName = LINK_TYPE_TO_FIELD[link.linkType]
    if (fieldName) {
      normalizedLinks[fieldName].push(link.url)
    }
  }

  return {
    ...DEFAULT_FORM_DATA,
    entityType: data?.entityType ?? '',
    displayName: data?.displayName ?? '',
    headline: data?.headline ?? '',
    regionCountry: data?.regionCountry ?? '',
    regionCity: data?.regionCity ?? '',
    timezone: data?.timezone ?? '',
    yearsExperience: typeof data?.yearsExperience === 'number' ? data.yearsExperience : '',
    projectsCompletedTotal: typeof data?.projectsCompletedTotal === 'number' ? data.projectsCompletedTotal : '',
    introVideoLink: data?.introVideoLink ?? '',
    availabilityHoursPerWeek: typeof data?.availabilityHoursPerWeek === 'number' ? data.availabilityHoursPerWeek : '',
    availabilityNotes: data?.availabilityNotes ?? '',
    whyPlatform: data?.whyPlatform ?? '',
    uniqueStrength: data?.uniqueStrength ?? '',
    idealClients: data?.idealClients ?? '',
    biggestWin: data?.biggestWin ?? '',
    // Tags → flat arrays (primary and secondary both stored as tagType='platform')
    primaryPlatforms: getTagValues('platform'),
    secondaryPlatforms: [],
    industryExpertise: getTagValues('industry'),
    preferredProjectTypes: getTagValues('project_type'),
    toolsStack: getTagValues('tool'),
    portfolioLinks: normalizedLinks.portfolioLinks,
    caseStudyLinks: normalizedLinks.caseStudyLinks,
    certificationLinks: normalizedLinks.certificationLinks,
    testimonialsLinks: normalizedLinks.testimonialsLinks,
    featuredProjects: Array.isArray(data?.featuredProjects) ? data.featuredProjects :
                      Array.isArray(data?.projects) ? data.projects : [],
    agreeTerms: Boolean(data?.agreeTerms),
    consentContact: Boolean(data?.consentContact),
  }
}

function getPriorityAreaForProjectTypes(projectTypes: string[]) {
  const match = Object.entries(PROJECT_PRIORITY_GROUPS).find(([, values]) =>
    projectTypes.some((projectType) => values.includes(projectType))
  )

  return match?.[0] ?? ''
}

function getStepIndexForField(fieldName: string) {
  return onboardingSteps.findIndex((step) =>
    step.fields.some((field) => field.name === fieldName)
  )
}

function validateField(field: OnboardingField, formData: ExpertFormData) {
  const value = formData[field.name as keyof ExpertFormData]

  if (field.required) {
    if (field.type === 'checkbox' && value !== true) {
      return `Please complete ${field.label.toLowerCase()}`
    }

    if ((field.type === 'tags' || field.type === 'url_list' || field.type === 'project_list' || field.type === 'project_priority') &&
      (!Array.isArray(value) || value.length === 0)
    ) {
      return `${field.label} is required`
    }

    if (field.type === 'number' && (value === '' || value === undefined || value === null)) {
      return `${field.label} is required`
    }

    if ((field.type === 'text' || field.type === 'textarea' || field.type === 'select' || field.type === 'url') &&
      typeof value === 'string' &&
      value.trim().length === 0
    ) {
      return `${field.label} is required`
    }
  }

  if (field.type === 'url' && typeof value === 'string' && value.trim() && !isValidUrl(value.trim())) {
    return `Please enter a valid ${field.label.toLowerCase()}`
  }

  if (field.name === 'featuredProjects') {
    const projects = formData.featuredProjects
    const hasInvalidProjectLink = projects.some((project) => project.link && !isValidUrl(project.link))
    if (hasInvalidProjectLink) {
      return 'Please enter valid project links'
    }
  }

  return null
}

function validateStep(stepIndex: number, formData: ExpertFormData) {
  const errors: Record<string, string> = {}

  for (const field of onboardingSteps[stepIndex].fields) {
    const message = validateField(field, formData)
    if (message) {
      errors[field.name] = message
    }
  }

  return errors
}

function validateAllSteps(formData: ExpertFormData) {
  return onboardingSteps.reduce<Record<string, string>>((acc, _step, index) => {
    return { ...acc, ...validateStep(index, formData) }
  }, {})
}

function clearStepErrors(fieldErrors: Record<string, string>, stepIndex: number) {
  const nextErrors = { ...fieldErrors }

  for (const field of onboardingSteps[stepIndex].fields) {
    delete nextErrors[field.name]
  }

  return nextErrors
}

export default function ExpertApplicationForm() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ExpertFormData>(DEFAULT_FORM_DATA)
  const [selectedPriorityArea, setSelectedPriorityArea] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasHydratedDraftRef = useRef(false)
  const skipNextAutosaveRef = useRef(true)

  const persistDraft = useCallback(async (data: ExpertFormData) => {
    setIsSaving(true)
    try {
      await fetch('/api/experts/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(data)),
      })
    } catch (err) {
      console.error('Failed to save draft', err)
    } finally {
      setIsSaving(false)
    }
  }, [])

  const flushDraftSave = useCallback(async (data: ExpertFormData) => {
    if (!user) {
      return
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
      autosaveTimeoutRef.current = null
    }

    await persistDraft(data)
  }, [persistDraft, user])

  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await fetch('/api/experts/me')
        const json = await res.json()

        if (json.data) {
          const normalizedData = normalizeDraftData(json.data)
          setFormData(normalizedData)
          setSelectedPriorityArea(
            getPriorityAreaForProjectTypes(normalizedData.preferredProjectTypes)
          )
        }
      } catch (err) {
        console.error('Failed to fetch draft', err)
      } finally {
        hasHydratedDraftRef.current = true
        setIsLoading(false)
      }
    }

    if (!isAuthLoading && user) {
      fetchDraft()
      return
    }

    if (!isAuthLoading) {
      hasHydratedDraftRef.current = true
      setIsLoading(false)
    }
  }, [isAuthLoading, user])

  useEffect(() => {
    if (!user || !hasHydratedDraftRef.current) {
      return
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false
      return
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      void persistDraft(formData)
    }, 800)

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [formData, persistDraft, user])

  useEffect(() => {
    if (!selectedPriorityArea && formData.preferredProjectTypes.length > 0) {
      setSelectedPriorityArea(
        getPriorityAreaForProjectTypes(formData.preferredProjectTypes)
      )
    }
  }, [formData.preferredProjectTypes, selectedPriorityArea])

  const currentStepErrors = useMemo(() => {
    const errors: Record<string, string> = {}

    for (const field of onboardingSteps[currentStep].fields) {
      if (fieldErrors[field.name]) {
        errors[field.name] = fieldErrors[field.name]
      }
    }

    return errors
  }, [currentStep, fieldErrors])

  const updateField = <K extends keyof ExpertFormData>(name: K, value: ExpertFormData[K]) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev
      }

      const next = { ...prev }
      delete next[name]
      return next
    })

    setError(null)
  }

  const handleNext = async () => {
    const stepErrors = validateStep(currentStep, formData)
    const nextErrors = { ...clearStepErrors(fieldErrors, currentStep), ...stepErrors }
    setFieldErrors(nextErrors)

    if (Object.keys(stepErrors).length > 0) {
      setError('Please fix the highlighted fields before continuing.')
      return
    }

    setError(null)

    if (currentStep < onboardingSteps.length - 1) {
      await flushDraftSave(formData)
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
      return
    }

    await handleSubmit()
  }

  const handleBack = async () => {
    if (currentStep === 0) {
      return
    }

    await flushDraftSave(formData)
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    const clientErrors = validateAllSteps(formData)
    setFieldErrors(clientErrors)

    if (Object.keys(clientErrors).length > 0) {
      const firstInvalidField = Object.keys(clientErrors)[0]
      const nextStep = getStepIndexForField(firstInvalidField)
      if (nextStep >= 0) {
        setCurrentStep(nextStep)
      }
      setError('Please fix the highlighted fields before submitting.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/experts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(formData)),
      })
      const json = await res.json()

      if (!res.ok) {
        const serverFieldErrors = json.details?.fields as Record<string, string> | undefined

        if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors)
          const firstInvalidField = Object.keys(serverFieldErrors)[0]
          const nextStep = getStepIndexForField(firstInvalidField)
          if (nextStep >= 0) {
            setCurrentStep(nextStep)
          }
        }

        setError(json.message || 'Validation failed. Please check all required fields.')
        return
      }

      router.push('/become-expert/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0466E7]" />
      </div>
    )
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen bg-[#F4F8FD] pt-[120px] pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[#0466E7] font-semibold text-sm uppercase tracking-wider mb-2">
                Step {currentStep + 1} of {onboardingSteps.length}
              </p>
              <h1 className="text-3xl font-bold text-[#011127] font-dm-sans">{step.title}</h1>
            </div>
            {isSaving && (
              <div className="flex items-center text-gray-400 text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving draft...
              </div>
            )}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0466E7] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-blue-50">
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">{step.description}</p>

          <div className="space-y-8">
            {step.fields.map((field) => {
              const fieldError = currentStepErrors[field.name]
              const hasError = Boolean(fieldError)
              const inputClassName = `w-full rounded-xl bg-[#F4F8FD] border ${
                hasError ? 'border-red-300' : 'border-transparent'
              } focus:border-[#0466E7] focus:outline-none transition-all`

              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="text-[#011127] font-semibold text-sm">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' || field.type === 'url' ? (
                    <input
                      type={field.type}
                      value={formData[field.name as keyof ExpertFormData] as string}
                      onChange={(e) => updateField(field.name as keyof ExpertFormData, e.target.value as never)}
                      placeholder={field.placeholder}
                      className={`${inputClassName} h-[56px] px-6 placeholder:text-gray-400`}
                    />
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={formData[field.name as keyof ExpertFormData] as number | ''}
                      onChange={(e) => {
                        const value = e.target.value
                        updateField(
                          field.name as keyof ExpertFormData,
                          (value === '' ? '' : Number(value)) as never
                        )
                      }}
                      className={`${inputClassName} h-[56px] px-6`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name as keyof ExpertFormData] as string}
                      onChange={(e) => updateField(field.name as keyof ExpertFormData, e.target.value as never)}
                      className={`${inputClassName} h-[56px] px-6 appearance-none`}
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name as keyof ExpertFormData] as string}
                      onChange={(e) => updateField(field.name as keyof ExpertFormData, e.target.value as never)}
                      rows={4}
                      className={`${inputClassName} p-6`}
                    />
                  ) : field.type === 'checkbox' ? (
                    <label className={`flex items-center gap-3 cursor-pointer group rounded-xl border px-4 py-4 ${hasError ? 'border-red-300 bg-red-50/50' : 'border-transparent bg-[#F4F8FD]'}`}>
                      <input
                        type="checkbox"
                        checked={Boolean(formData[field.name as keyof ExpertFormData])}
                        onChange={(e) => updateField(field.name as keyof ExpertFormData, e.target.checked as never)}
                        className="w-5 h-5 rounded border-gray-300 text-[#0466E7] focus:ring-[#0466E7]"
                      />
                      <span className="text-gray-700 group-hover:text-black transition-colors">{field.label}</span>
                    </label>
                  ) : field.type === 'tags' ? (
                    <TagInput
                      values={(formData[field.name as keyof ExpertFormData] as string[]) || []}
                      label={field.label}
                      suggestions={FIELD_SUGGESTIONS[field.name] || []}
                      onChange={(values) => updateField(field.name as keyof ExpertFormData, values as never)}
                    />
                  ) : field.type === 'url_list' ? (
                    <UrlListInput
                      links={(formData[field.name as keyof ExpertFormData] as string[]) || []}
                      label={field.label}
                      onChange={(links) => updateField(field.name as keyof ExpertFormData, links as never)}
                    />
                  ) : field.type === 'project_list' ? (
                    <ProjectList
                      projects={formData.featuredProjects}
                      onChange={(projects) => updateField('featuredProjects', projects)}
                    />
                  ) : field.type === 'project_priority' ? (
                    <ProjectPrioritySelect
                      value={formData.preferredProjectTypes}
                      groups={field.groupedOptions || {}}
                      selectedGroup={selectedPriorityArea}
                      onSelectedGroupChange={setSelectedPriorityArea}
                      onChange={(values) => updateField('preferredProjectTypes', values)}
                    />
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm italic">
                      Unknown field type &quot;{field.type}&quot;
                    </div>
                  )}

                  {fieldError && (
                    <p className="text-sm text-red-600">{fieldError}</p>
                  )}
                </div>
              )
            })}
          </div>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center gap-4">
            <button
              onClick={() => void handleBack()}
              disabled={currentStep === 0 || isSubmitting}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              onClick={() => void handleNext()}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-10 py-4 bg-[#0466E7] text-white rounded-full font-bold hover:bg-[#0355c0] transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentStep === onboardingSteps.length - 1 ? (
                'Submit Application'
              ) : (
                <>
                  Next Step
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
