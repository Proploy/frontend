'use client'

import { useState } from 'react'
import { Check, Loader2, User, Star, Link2, Briefcase, Shield } from 'lucide-react'
import OnboardingSidebar, { type OnboardingStep } from '@/components/onboarding/OnboardingSidebar'
import ExpertApplicationForm from '@/components/onboarding/ExpertApplicationForm'
import { onboardingSteps } from '@/config/onboarding-form'

const EXPERT_SIDEBAR_STEPS: OnboardingStep[] = [
  { icon: User,      title: 'Identity & Entity',    subtitle: 'Who you are' },
  { icon: Star,      title: 'Expertise & Focus',    subtitle: 'Your skills and wins' },
  { icon: Link2,     title: 'Proof & Portfolio',    subtitle: 'Links and evidence' },
  { icon: Briefcase, title: 'Availability & Fit',   subtitle: 'How you work' },
  { icon: Shield,    title: 'Compliance',            subtitle: 'Terms and consent' },
]

export default function BecomeExpertPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden flex">
      {/* Left sidebar */}
      <OnboardingSidebar currentStep={currentStep} steps={EXPERT_SIDEBAR_STEPS} />

      {/* Right content panel */}
      <div className="flex-1 flex flex-col items-center min-w-0 pt-[120px] md:pt-[160px] pb-[96px] relative overflow-auto">
        {/* Save status (top-right) */}
        <div className="absolute top-[24px] right-[32px] flex gap-[6px] items-center">
          {isSaving ? (
            <>
              <Loader2 className="size-[14px] text-[#717680] animate-spin" />
              <span className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#717680]">
                Saving…
              </span>
            </>
          ) : currentStep > 0 ? (
            <>
              <Check className="size-[14px] text-[#079455]" strokeWidth={2} />
              <span className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#079455]">
                All changes saved
              </span>
            </>
          ) : null}
        </div>

        {/* Subtle background pattern */}
        <div
          className="absolute top-[-196px] left-1/2 -translate-x-1/2 size-[768px] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'url(/hero-background-pattern.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content */}
        <div className="flex flex-col gap-[64px] items-center px-[32px] w-full relative z-10">
          {/* Form */}
          <div className="flex flex-col gap-[32px] items-center max-w-[480px] w-full">
            <ExpertApplicationForm
              onStepChange={setCurrentStep}
              onSavingChange={setIsSaving}
            />
          </div>

          {/* Step progress dots */}
          <div className="flex gap-[12px] items-center justify-center">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'bg-[#155eef] w-[24px] h-[8px]'
                    : i < currentStep
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
