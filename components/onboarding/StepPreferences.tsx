'use client'

import { Bell } from 'lucide-react'
import type { OnboardingFormData } from './types'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'

interface StepPreferencesProps {
  formData: OnboardingFormData
  updateFormData: (updates: Partial<OnboardingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepPreferences({ formData, updateFormData, onNext, onBack }: StepPreferencesProps) {
  const isValid = formData.agreeTerms

  return (
    <>
      {/* Featured icon */}
      <div className="bg-white border border-[#d5d7da] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-[56px] flex items-center justify-center relative shrink-0 overflow-hidden">
        <Bell className="size-[24px] text-[#414651]" strokeWidth={1.5} />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-[12px] items-center text-center w-full">
        <h1 className="display-sm-semibold text-[#181d27] w-full">
          Communication preferences
        </h1>
        <p className="text-md-regular text-[#535862] w-full">
          Choose how we can contact you.
        </p>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-[24px] w-full">
        <Checkbox
          checked={formData.productUpdates}
          onChange={(checked) => updateFormData({ productUpdates: checked })}
          size="md"
          label="Send me product updates and vendor opportunities"
          description="You can unsubscribe anytime."
        />

        <Checkbox
          checked={formData.onboardingSupport}
          onChange={(checked) => updateFormData({ onboardingSupport: checked })}
          size="md"
          label="Contact me about onboarding and account support"
          description="Includes verification requests and setup help."
        />

        {/* Divider */}
        <div className="w-full h-px bg-[#e9eaeb]" />

        <Checkbox
          checked={formData.agreeTerms}
          onChange={(checked) => updateFormData({ agreeTerms: checked })}
          size="md"
          label="I agree to the Terms and Privacy Policy *"
          description="You must accept to create a vendor account."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-[12px] items-center w-full">
        <Button variant="primary" size="lg" onClick={onNext} disabled={!isValid} className="w-full">
          Continue
        </Button>
        <Button variant="link-gray" size="sm" onClick={onBack}>
          Back
        </Button>
      </div>
    </>
  )
}
