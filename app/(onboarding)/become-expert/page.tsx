'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar'
import StepGetStarted from '@/components/onboarding/StepGetStarted'
import StepDetails from '@/components/onboarding/StepDetails'
import StepPreferences from '@/components/onboarding/StepPreferences'
import StepReview from '@/components/onboarding/StepReview'
import type { OnboardingFormData } from '@/components/onboarding/types'

export default function BecomeExpertPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<OnboardingFormData>({
    accountType: 'individual',
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    primaryLocation: '',
    productUpdates: false,
    onboardingSupport: false,
    agreeTerms: false,
  })

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))
  const goToStep = (step: number) => setCurrentStep(step)

  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar */}
      <OnboardingSidebar currentStep={currentStep} />

      {/* Right Content */}
      <div className="flex-1 flex flex-col items-center min-w-[480px] pt-[160px] pb-[96px] relative overflow-auto">
        {/* Save status indicator (steps 1+) */}
        {currentStep > 0 && (
          <div className="absolute top-[24px] right-[32px] flex gap-[6px] items-center">
            {currentStep === 2 ? (
              <>
                <Loader2 className="size-[14px] text-[#717182] animate-spin" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#717182]">
                  Saving
                </span>
              </>
            ) : (
              <>
                <Check className="size-[14px] text-[#079455]" strokeWidth={2} />
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#079455]">
                  All changes saved
                </span>
              </>
            )}
          </div>
        )}

        {/* Background pattern (subtle) */}
        <div
          className="absolute top-[-196px] left-1/2 -translate-x-1/2 size-[768px] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'url(/hero-background-pattern.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content */}
        <div className="flex flex-col gap-[80px] items-center px-[32px] w-full relative z-10">
          <div className="flex flex-col gap-[32px] items-center max-w-[360px] w-full">
            {currentStep === 0 && <StepGetStarted onNext={nextStep} />}
            {currentStep === 1 && (
              <StepDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 2 && (
              <StepPreferences
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 3 && (
              <StepReview
                formData={formData}
                onBack={prevStep}
                onEdit={goToStep}
              />
            )}
          </div>

          {/* Step indicator dots */}
          <div className="flex gap-[12px] items-center justify-center">
            {[0, 1, 2, 3].map(step => (
              <div
                key={step}
                className={`rounded-full transition-all ${
                  step === currentStep
                    ? 'bg-[#155eef] w-[24px] h-[8px]'
                    : step < currentStep
                    ? 'bg-[#155eef] opacity-40 size-[8px]'
                    : 'bg-[#e9eaeb] size-[8px]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
