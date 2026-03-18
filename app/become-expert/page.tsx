'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { onboardingSteps } from '@/config/onboarding-form'
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, Save } from 'lucide-react'
import TagInput from '@/components/onboarding/TagInput'
import UrlListInput from '@/components/onboarding/UrlListInput'
import ProjectList from '@/components/onboarding/ProjectList'

export default function BecomeExpertPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<any>({
    tags: [],
    links: [],
    projects: []
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch existing draft
  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await fetch('/api/experts/me')
        const data = await res.json()
        if (data) {
          // Flatten data from DB structure back to form structure if needed
          setFormData({
            ...data,
            tags: data.tags || [],
            links: data.links || [],
            projects: data.projects || []
          })
        }
      } catch (err) {
        console.error('Failed to fetch draft', err)
      } finally {
        setIsLoading(false)
      }
    }
    if (isLoaded && user) {
      fetchDraft()
    }
  }, [isLoaded, user])

  const saveDraft = useCallback(async (data: any) => {
    setIsSaving(true)
    try {
      await fetch('/api/experts/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (err) {
      console.error('Failed to save draft', err)
    } finally {
      setIsSaving(false)
    }
  }, [])

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      await saveDraft(formData)
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/experts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Validation failed. Please check all required fields.')
      }
      router.push('/become-expert/success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  if (!isLoaded || isLoading) {
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
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[#0466E7] font-semibold text-sm uppercase tracking-wider mb-2">Step {currentStep + 1} of {onboardingSteps.length}</p>
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

        {/* Form Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-blue-50">
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">{step.description}</p>
          
          <div className="space-y-8">
            {step.fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-[#011127] font-semibold text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'text' || field.type === 'url' ? (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full h-[56px] px-6 rounded-xl bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all placeholder:text-gray-400"
                  />
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    value={formData[field.name] || ''}
                    onChange={(e) => updateField(field.name, parseInt(e.target.value) || 0)}
                    className="w-full h-[56px] px-6 rounded-xl bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="w-full h-[56px] px-6 rounded-xl bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all appearance-none"
                  >
                    <option value="">Select option...</option>
                    {(field as any).options?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    rows={4}
                    className="w-full p-6 rounded-xl bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all"
                  />
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => updateField(field.name, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0466E7] focus:ring-[#0466E7]"
                    />
                    <span className="text-gray-700 group-hover:text-black transition-colors">{field.label}</span>
                  </label>
                ) : field.type === 'tags' ? (
                  <TagInput 
                    tags={formData.tags}
                    tagType={field.name}
                    label={field.label}
                    onChange={(tags) => updateField('tags', tags)}
                  />
                ) : field.type === 'url_list' ? (
                  <UrlListInput 
                    links={formData.links}
                    linkType={field.name}
                    label={field.label}
                    onChange={(links) => updateField('links', links)}
                  />
                ) : field.type === 'project_list' ? (
                  <ProjectList 
                    projects={formData.projects}
                    onChange={(projects) => updateField('projects', projects)}
                  />
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm italic">
                    Unknown field type "{field.type}"
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center gap-4">
            <button
              onClick={handleBack}
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
              onClick={handleNext}
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
