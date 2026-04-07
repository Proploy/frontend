'use client'

import { useState } from 'react'
import { User, Users } from 'lucide-react'
import type { OnboardingFormData } from './types'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'

interface StepDetailsProps {
  formData: OnboardingFormData
  updateFormData: (updates: Partial<OnboardingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepDetails({ formData, updateFormData, onNext, onBack }: StepDetailsProps) {
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError = emailTouched && formData.workEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)
    ? 'Enter a valid email address'
    : ''

  const isValid =
    formData.fullName.trim() &&
    formData.workEmail.trim() &&
    !emailError &&
    formData.phoneNumber.trim() &&
    formData.primaryLocation.trim()

  return (
    <>
      {/* Featured icon */}
      <div className="bg-white border border-[#d5d7da] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-[56px] flex items-center justify-center relative shrink-0 overflow-hidden">
        <User className="size-[24px] text-[#414651]" strokeWidth={1.5} />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-[12px] items-center text-center w-full">
        <h1 className="display-sm-semibold text-[#181d27] w-full">Your details</h1>
        <p className="text-md-regular text-[#535862] w-full">
          Please provide your name and contact information.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-[20px] w-full">
        {/* Account type */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
            Account type <span className="text-[#d4183d]">*</span>
          </label>
          <div className="flex gap-[12px]">
            {/* Individual */}
            <button
              type="button"
              onClick={() => updateFormData({ accountType: 'individual' })}
              className={`flex-1 rounded-[10px] p-[18px] flex flex-col gap-[12px] items-start text-left cursor-pointer transition-colors ${
                formData.accountType === 'individual'
                  ? 'bg-[#f5faff] border-2 border-[#0466e7]'
                  : 'bg-white border border-[#d5d7da] hover:border-[#a4a7ae]'
              }`}
            >
              <div className={`rounded-[8px] size-[36px] flex items-center justify-center ${
                formData.accountType === 'individual' ? 'bg-white' : 'bg-[#f5f5f5]'
              }`}>
                <User className="size-[20px] text-[#414651]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Individual
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#535862]">
                  Freelancer or solo consultant
                </p>
              </div>
            </button>

            {/* Business or team */}
            <button
              type="button"
              onClick={() => updateFormData({ accountType: 'business' })}
              className={`flex-1 rounded-[10px] p-[18px] flex flex-col gap-[12px] items-start text-left cursor-pointer transition-colors ${
                formData.accountType === 'business'
                  ? 'bg-[#f5faff] border-2 border-[#0466e7]'
                  : 'bg-white border border-[#d5d7da] hover:border-[#a4a7ae]'
              }`}
            >
              <div className={`rounded-[8px] size-[36px] flex items-center justify-center ${
                formData.accountType === 'business' ? 'bg-white' : 'bg-[#f5f5f5]'
              }`}>
                <Users className="size-[20px] text-[#414651]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Business or team
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#535862]">
                  Agency, studio, or multi-person team
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Full name */}
        <InputField
          label="Full name"
          required
          value={formData.fullName}
          onChange={e => updateFormData({ fullName: e.target.value })}
          placeholder="Alex Tan"
          hintText="This will appear on your profile."
        />

        {/* Work email */}
        <InputField
          label="Work email"
          required
          inputType="email"
          value={formData.workEmail}
          onChange={e => updateFormData({ workEmail: e.target.value })}
          onBlur={() => setEmailTouched(true)}
          placeholder="name@company.com"
          error={!!emailError}
          errorMessage={emailError}
        />

        {/* Phone number */}
        <InputField
          label="Phone number"
          required
          inputType="tel"
          value={formData.phoneNumber}
          onChange={e => updateFormData({ phoneNumber: e.target.value })}
          placeholder="+65 8123 4567"
        />

        {/* Primary location */}
        <InputField
          label="Primary location"
          required
          value={formData.primaryLocation}
          onChange={e => updateFormData({ primaryLocation: e.target.value })}
          placeholder="Singapore"
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
