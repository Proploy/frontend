'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import ProjectList from '@/components/onboarding/ProjectList'
import ProjectPrioritySelect from '@/components/onboarding/ProjectPrioritySelect'
import TagInput from '@/components/onboarding/TagInput'
import UrlListInput from '@/components/onboarding/UrlListInput'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import TextAreaField from '@/components/ui/TextAreaField'
import {
  INDUSTRY_SUGGESTIONS,
  onboardingSteps,
  PLATFORM_SUGGESTIONS,
  PROJECT_PRIORITY_GROUPS,
  TOOLS_SUGGESTIONS,
  type OnboardingField,
} from '@/config/onboarding-form'
import { useExpertApplication } from '@/hooks/use-expert-application'
import type { ExpertDraftRequest } from '@/hooks/types/expert-contracts'

type ExpertProject = {
  title: string
  summary: string
  link?: string | null
  outcomes: string
}

type ExpertDraftData = {
  entityType?: string | null
  displayName?: string | null
  headline?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  timezone?: string | null
  yearsExperience?: number | null
  projectsCompletedTotal?: number | null
  introVideoLink?: string | null
  availabilityHoursPerWeek?: number | null
  availabilityNotes?: string | null
  whyPlatform?: string | null
  uniqueStrength?: string | null
  idealClients?: string | null
  biggestWin?: string | null
  primaryPlatforms?: string[] | null
  secondaryPlatforms?: string[] | null
  industryExpertise?: string[] | null
  preferredProjectTypes?: string[] | null
  toolsStack?: string[] | null
  agreeTerms?: boolean | null
  consentContact?: boolean | null
  featuredProjects?: ExpertProject[]
  links?: { linkType: string; url: string }[]
  projects?: ExpertProject[]
  tags?: { tagType: string; tagValue: string }[]
  schedulingProvider?: string | null
  schedulingLink?: string | null
  schedulingLinkEnabled?: boolean | null
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
  schedulingProvider: string
  schedulingLink: string
  schedulingLinkEnabled: boolean
}

type RenderField = {
  name: string
  type: string
  label: string
  required?: boolean
  placeholder?: string
  options?: string[]
  groupedOptions?: Record<string, string[]>
}

type RenderField = {
  name: string
  type: string
  label: string
  required?: boolean
  placeholder?: string
  options?: string[]
  groupedOptions?: Record<string, string[]>
}

// Config uses snake_case names; form state uses camelCase. This map bridges them.
const FIELD_NAME_ALIAS: Record<string, keyof ExpertFormData> = {
  primary_platforms:      'primaryPlatforms',
  secondary_platforms:    'secondaryPlatforms',
  industry_expertise:     'industryExpertise',
  preferred_project_types:'preferredProjectTypes',
  tools_stack:            'toolsStack',
  portfolio_links:        'portfolioLinks',
  case_study_links:       'caseStudyLinks',
  certification_links:    'certificationLinks',
  testimonials_links:     'testimonialsLinks',
  featured_projects:      'featuredProjects',
}

function resolveFieldKey(name: string): keyof ExpertFormData {
  return FIELD_NAME_ALIAS[name] ?? (name as keyof ExpertFormData)
}

const FIELD_SUGGESTIONS: Record<string, string[]> = {
  primaryPlatforms: PLATFORM_SUGGESTIONS,
  secondaryPlatforms: PLATFORM_SUGGESTIONS,
  industryExpertise: INDUSTRY_SUGGESTIONS,
  toolsStack: TOOLS_SUGGESTIONS,
  // snake_case aliases for config compatibility
  primary_platforms:   PLATFORM_SUGGESTIONS,
  secondary_platforms: PLATFORM_SUGGESTIONS,
  industry_expertise:  INDUSTRY_SUGGESTIONS,
  tools_stack:         TOOLS_SUGGESTIONS,
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
  schedulingProvider: '',
  schedulingLink: '',
  schedulingLinkEnabled: false,
}

type LinkFieldName = 'portfolioLinks' | 'caseStudyLinks' | 'certificationLinks' | 'testimonialsLinks'

const LINK_TYPE_TO_FIELD: Record<string, LinkFieldName> = {
  portfolio: 'portfolioLinks',
  case_study: 'caseStudyLinks',
  certification: 'certificationLinks',
  testimonial: 'testimonialsLinks',
}

function isValidUrl(value: string) {
  try { new URL(value); return true } catch { return false }
}

function normalizeNumber(value: number | '') {
  return typeof value === 'number' ? value : undefined
}

function buildPayload(formData: ExpertFormData): ExpertDraftRequest {
  return {
    entityType: formData.entityType,
    displayName: formData.displayName,
    headline: formData.headline,
    regionCountry: formData.regionCountry,
    regionCity: formData.regionCity,
    timezone: formData.timezone,
    yearsExperience: normalizeNumber(formData.yearsExperience),
    projectsCompletedTotal: normalizeNumber(formData.projectsCompletedTotal),
    introVideoLink: formData.introVideoLink,
    availabilityHoursPerWeek: normalizeNumber(formData.availabilityHoursPerWeek),
    availabilityNotes: formData.availabilityNotes,
    whyPlatform: formData.whyPlatform,
    uniqueStrength: formData.uniqueStrength,
    idealClients: formData.idealClients,
    biggestWin: formData.biggestWin,
    primaryPlatforms: formData.primaryPlatforms,
    secondaryPlatforms: formData.secondaryPlatforms,
    industryExpertise: formData.industryExpertise,
    preferredProjectTypes: formData.preferredProjectTypes,
    toolsStack: formData.toolsStack,
    projects: formData.featuredProjects,
    agreeTerms: formData.agreeTerms,
    consentContact: formData.consentContact,
    schedulingProvider: formData.schedulingProvider || null,
    schedulingLink: formData.schedulingLink || null,
    schedulingLinkEnabled: formData.schedulingLinkEnabled,
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
    rawTags.filter((tag) => tag.tagType === tagType).map((tag) => tag.tagValue)
  const directOrTagged = (
    directValues: string[] | null | undefined,
    tagType: string,
  ): string[] => {
    if (Array.isArray(directValues) && directValues.length > 0) return directValues
    return getTagValues(tagType)
  }

  const normalizedLinks: Record<LinkFieldName, string[]> = {
    portfolioLinks: [],
    caseStudyLinks: [],
    certificationLinks: [],
    testimonialsLinks: [],
  }

  for (const link of Array.isArray(data?.links) ? data.links : []) {
    const fieldName = LINK_TYPE_TO_FIELD[link.linkType]
    if (fieldName) normalizedLinks[fieldName].push(link.url)
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
    primaryPlatforms: directOrTagged(data?.primaryPlatforms, 'platform'),
    secondaryPlatforms: Array.isArray(data?.secondaryPlatforms) ? data.secondaryPlatforms : [],
    industryExpertise: directOrTagged(data?.industryExpertise, 'industry'),
    preferredProjectTypes: directOrTagged(data?.preferredProjectTypes, 'project_type'),
    toolsStack: directOrTagged(data?.toolsStack, 'tool'),
    portfolioLinks: normalizedLinks.portfolioLinks,
    caseStudyLinks: normalizedLinks.caseStudyLinks,
    certificationLinks: normalizedLinks.certificationLinks,
    testimonialsLinks: normalizedLinks.testimonialsLinks,
    featuredProjects: Array.isArray(data?.featuredProjects) ? data.featuredProjects :
                      Array.isArray(data?.projects) ? data.projects : [],
    agreeTerms: Boolean(data?.agreeTerms),
    consentContact: Boolean(data?.consentContact),
    schedulingProvider: data?.schedulingProvider ?? '',
    schedulingLink: data?.schedulingLink ?? '',
    schedulingLinkEnabled: Boolean(data?.schedulingLinkEnabled),
  }
}

function getPriorityAreaForProjectTypes(projectTypes: string[]) {
  const match = Object.entries(PROJECT_PRIORITY_GROUPS).find(([, values]) =>
    projectTypes.some((pt) => values.includes(pt))
  )
  return match?.[0] ?? ''
}

function getStepIndexForField(fieldName: string) {
  const requestedKey = resolveFieldKey(fieldName)
  return onboardingSteps.findIndex((step) =>
    step.fields.some((field: OnboardingField) =>
      field.name === fieldName || resolveFieldKey(field.name) === requestedKey,
    ),
  )
}

function validateField(field: OnboardingField, formData: ExpertFormData) {
  const fieldKey = resolveFieldKey(field.name)
  const value = formData[fieldKey]
  if (field.required) {
    if (field.type === 'checkbox' && value !== true)
      return `Please complete ${field.label.toLowerCase()}`
    if (['tags', 'url_list', 'project_list', 'project_priority'].includes(field.type) &&
      (!Array.isArray(value) || value.length === 0))
      return `${field.label} is required`
    if (field.type === 'number' && (value === '' || value === undefined || value === null))
      return `${field.label} is required`
    if (['text', 'textarea', 'select', 'url'].includes(field.type) &&
      typeof value === 'string' && value.trim().length === 0)
      return `${field.label} is required`
  }
  if (field.type === 'url' && typeof value === 'string' && value.trim() && !isValidUrl(value.trim()))
    return `Please enter a valid ${field.label.toLowerCase()}`
  if (field.name === 'featuredProjects') {
    if (formData.featuredProjects.some((p) => p.link && !isValidUrl(p.link)))
      return 'Please enter valid project links'
  }
  return null
}

function validateStep(stepIndex: number, formData: ExpertFormData) {
  const errors: Record<string, string> = {}
  for (const field of onboardingSteps[stepIndex].fields) {
    const msg = validateField(field, formData)
    if (msg) errors[field.name] = msg
  }
  return errors
}

function validateAllSteps(formData: ExpertFormData) {
  return onboardingSteps.reduce<Record<string, string>>((acc, _step, index) => ({
    ...acc,
    ...validateStep(index, formData),
  }), {})
}

function clearStepErrors(fieldErrors: Record<string, string>, stepIndex: number) {
  const next = { ...fieldErrors }
  for (const field of onboardingSteps[stepIndex].fields) {
    delete next[field.name]
    delete next[resolveFieldKey(field.name)]
  }
  return next
}

function getFieldError(fieldErrors: Record<string, string>, fieldName: string) {
  return fieldErrors[fieldName] ?? fieldErrors[resolveFieldKey(fieldName)]
}

function removeFieldError(fieldErrors: Record<string, string>, fieldName: string) {
  const next = { ...fieldErrors }
  delete next[fieldName]
  for (const [configName, stateName] of Object.entries(FIELD_NAME_ALIAS)) {
    if (stateName === fieldName) delete next[configName]
  }
  return next
}

interface ExpertApplicationFormProps {
  onStepChange?: (step: number) => void
  onSavingChange?: (saving: boolean) => void
}

export default function ExpertApplicationForm({ onStepChange, onSavingChange }: ExpertApplicationFormProps = {}) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const {
    getApplication,
    saveApplicationDraft,
    submitApplication,
    getProjectFileUploadUrl,
    uploadProjectFileToSignedUrl,
  } = useExpertApplication()
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

  // Notify parent of step changes
  useEffect(() => { onStepChange?.(currentStep) }, [currentStep, onStepChange])

  // Notify parent of save state
  useEffect(() => { onSavingChange?.(isSaving) }, [isSaving, onSavingChange])

  const persistDraft = useCallback(async (data: ExpertFormData) => {
    setIsSaving(true)
    try {
      const result = await saveApplicationDraft(buildPayload(data))
      if (!result.ok) throw new Error(result.error.message)
    } catch (err) {
      console.error('Failed to save draft', err)
    } finally {
      setIsSaving(false)
    }
  }, [saveApplicationDraft])

  const flushDraftSave = useCallback(async (data: ExpertFormData) => {
    if (!user) return
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
      autosaveTimeoutRef.current = null
    }
    await persistDraft(data)
  }, [persistDraft, user])

  useEffect(() => {
    async function fetchDraft() {
      try {
        const result = await getApplication()
        if (result.ok && result.data) {
          const normalized = normalizeDraftData(result.data)
          setFormData(normalized)
          setSelectedPriorityArea(getPriorityAreaForProjectTypes(normalized.preferredProjectTypes))
        } else if (!result.ok) {
          setError(result.error.message)
        }
      } catch (err) {
        console.error('Failed to fetch draft', err)
      } finally {
        hasHydratedDraftRef.current = true
        setIsLoading(false)
      }
    }
    if (!isAuthLoading && user) { fetchDraft(); return }
    if (!isAuthLoading) { hasHydratedDraftRef.current = true; setIsLoading(false) }
  }, [getApplication, isAuthLoading, user])

  useEffect(() => {
    if (!user || !hasHydratedDraftRef.current) return
    if (skipNextAutosaveRef.current) { skipNextAutosaveRef.current = false; return }
    autosaveTimeoutRef.current = setTimeout(() => { void persistDraft(formData) }, 800)
    return () => { if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current) }
  }, [formData, persistDraft, user])

  useEffect(() => {
    if (!selectedPriorityArea && formData.preferredProjectTypes.length > 0) {
      setSelectedPriorityArea(getPriorityAreaForProjectTypes(formData.preferredProjectTypes))
    }
  }, [formData.preferredProjectTypes, selectedPriorityArea])

  const currentStepErrors = useMemo(() => {
    const errors: Record<string, string> = {}
    for (const field of onboardingSteps[currentStep].fields) {
      const fieldError = getFieldError(fieldErrors, field.name)
      if (fieldError) errors[field.name] = fieldError
    }
    return errors
  }, [currentStep, fieldErrors])

  const updateField = <K extends keyof ExpertFormData>(name: K, value: ExpertFormData[K]) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => {
      if (!getFieldError(prev, name)) return prev
      return removeFieldError(prev, name)
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
    if (currentStep === 0) return
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
      if (nextStep >= 0) setCurrentStep(nextStep)
      setError('Please fix the highlighted fields before submitting.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitApplication(buildPayload(formData))
      if (!result.ok) {
        const serverFieldErrors = result.error.fields
        if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors)
          const firstInvalidField = Object.keys(serverFieldErrors)[0]
          const nextStep = getStepIndexForField(firstInvalidField)
          if (nextStep >= 0) setCurrentStep(nextStep)
        }
        setError(result.error.message || 'Validation failed. Please check all required fields.')
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#155eef]" />
      </div>
    )
  }

  const step = onboardingSteps[currentStep]
  return (
    <div className="flex flex-col gap-[32px] w-full">
      {/* Step header */}
      <div className="flex flex-col gap-[12px] items-center text-center w-full">
        <h1 className="display-sm-semibold text-[#181d27] w-full">{step.title}</h1>
        <p className="text-md-regular text-[#535862] w-full">{step.description}</p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-[20px] w-full">
        {step.fields.map((field: RenderField) => {
          const fieldKey = resolveFieldKey(field.name)
          const fieldError = currentStepErrors[field.name]
          const hasError = Boolean(fieldError)

          return (
            <div key={field.name} className="flex flex-col gap-[6px]">
              {/* Label (skip for checkbox — it renders its own label) */}
              {field.type !== 'checkbox' && (
                <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
                  {field.label}
                  {field.required && <span className="text-[#155eef] ml-[2px]">*</span>}
                </label>
              )}

              {/* text / url */}
              {(field.type === 'text' || field.type === 'url') && (
                <InputField
                  inputType={field.type}
                  placeholder={field.placeholder}
                  value={(formData[fieldKey] as string) || ''}
                  onChange={(e) => updateField(fieldKey, e.target.value as never)}
                  error={hasError}
                  errorMessage={fieldError}
                />
              )}

              {/* number */}
              {field.type === 'number' && (
                <InputField
                  inputType="number"
                  value={(formData[fieldKey] as string | number)?.toString() || ''}
                  onChange={(e) => {
                    const v = e.target.value
                    updateField(fieldKey, (v === '' ? '' : Number(v)) as never)
                  }}
                  error={hasError}
                  errorMessage={fieldError}
                />
              )}

              {/* select */}
              {field.type === 'select' && (
                <Select
                  options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
                  value={(formData[fieldKey] as string) || ''}
                  onChange={(val) => updateField(fieldKey, val as never)}
                  placeholder="Select option..."
                  error={hasError}
                  errorMessage={fieldError}
                />
              )}

              {/* textarea */}
              {field.type === 'textarea' && (
                <TextAreaField
                  value={(formData[fieldKey] as string) || ''}
                  onChange={(e) => updateField(fieldKey, e.target.value as never)}
                  rows={4}
                  error={hasError}
                  errorMessage={fieldError}
                />
              )}

              {/* checkbox */}
              {field.type === 'checkbox' && (
                <Checkbox
                  checked={Boolean(formData[fieldKey])}
                  onChange={(checked) => updateField(fieldKey, checked as never)}
                  label={field.label}
                  className={hasError ? 'p-[12px] border border-[#fda29b] bg-[#fef3f2] rounded-[8px]' : 'p-[12px] border border-[#d5d7da] hover:bg-[#fafafa] rounded-[8px]'}
                />
              )}

              {/* tags */}
              {field.type === 'tags' && (
                <TagInput
                  values={(formData[fieldKey] as string[]) || []}
                  label={field.label}
                  suggestions={FIELD_SUGGESTIONS[field.name] || []}
                  onChange={(values) => updateField(fieldKey, values as never)}
                  error={hasError}
                />
              )}

              {/* url_list */}
              {field.type === 'url_list' && (
                <UrlListInput
                  links={(formData[fieldKey] as string[]) || []}
                  label={field.label}
                  onChange={(links) => updateField(fieldKey, links as never)}
                  error={hasError}
                />
              )}

              {/* project_list */}
              {field.type === 'project_list' && (
                <ProjectList
                  projects={formData.featuredProjects}
                  onChange={(projects) => updateField('featuredProjects', projects)}
                  uploadFile={getProjectFileUploadUrl}
                  uploadToSignedUrl={uploadProjectFileToSignedUrl}
                />
              )}

              {/* project_priority */}
              {field.type === 'project_priority' && (
                <ProjectPrioritySelect
                  value={formData.preferredProjectTypes}
                  groups={field.groupedOptions || {}}
                  selectedGroup={selectedPriorityArea}
                  onSelectedGroupChange={setSelectedPriorityArea}
                  onChange={(values) => updateField('preferredProjectTypes', values)}
                />
              )}

              {/* Unknown field type */}
              {!['text', 'url', 'number', 'select', 'textarea', 'checkbox', 'tags', 'url_list', 'project_list', 'project_priority'].includes(field.type) && (
                <div className="px-[14px] py-[10px] bg-[#fffaeb] border border-[#fec84b] rounded-[8px] text-[#b54708] text-[14px]">
                  Unknown field type `{field.type}`
                </div>
              )}

              {/* Field error */}
              {fieldError && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#d92d20]">
                  {fieldError}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Global error */}
      {error && (
        <div className="px-[14px] py-[12px] bg-[#fef3f2] border border-[#fecdca] rounded-[8px] text-[14px] leading-[20px] text-[#d92d20] font-[family-name:var(--font-dm-sans)]">
          {error}
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex flex-col gap-[12px] items-center w-full">
        <Button
          variant="primary"
          size="lg"
          onClick={() => void handleNext()}
          loading={isSubmitting}
          loadingText="Submitting..."
          className="w-full"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Submit Application' : 'Continue'}
        </Button>
        {currentStep > 0 && (
          <Button
            variant="link-gray"
            size="sm"
            onClick={() => void handleBack()}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  )
}
