'use client'

import { FileSearch } from 'lucide-react'
import type { OnboardingFormData } from './types'
import Button from '@/components/ui/Button'

interface StepReviewProps {
  formData: OnboardingFormData
  onBack: () => void
  onEdit: (step: number) => void
}

function ReviewRow({
  label,
  value,
  onEdit,
  showBorder = true,
}: {
  label: string
  value: string
  onEdit: () => void
  showBorder?: boolean
}) {
  return (
    <div className={`flex items-center justify-between py-[12px] ${showBorder ? 'border-b border-[#f0f0f0]' : ''}`}>
      <div className="flex flex-col gap-[2px]">
        <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#717680]">
          {label}
        </p>
        <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#181d27]">
          {value}
        </p>
      </div>
      <Button variant="link-color" size="sm" onClick={onEdit}>
        Edit
      </Button>
    </div>
  )
}

export default function StepReview({ formData, onBack, onEdit }: StepReviewProps) {
  const handleCreateAccount = () => {
    // TODO: Submit form data to API
    console.log('Creating account with:', formData)
  }

  return (
    <>
      {/* Featured icon */}
      <div className="bg-white border border-[#d5d7da] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-[56px] flex items-center justify-center relative shrink-0 overflow-hidden">
        <FileSearch className="size-[24px] text-[#414651]" strokeWidth={1.5} />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-[12px] items-center text-center w-full">
        <h1 className="display-sm-semibold text-[#181d27] w-full">
          Review your details
        </h1>
        <p className="text-md-regular text-[#535862] w-full">
          Confirm your information before creating your account.
        </p>
      </div>

      {/* Review card */}
      <div className="bg-[#fafafa] border border-[#e9eaeb] rounded-[12px] pt-[21px] px-[21px] w-full">
        <ReviewRow
          label="Account type"
          value={formData.accountType === 'individual' ? 'Individual' : 'Business or team'}
          onEdit={() => onEdit(1)}
        />
        <ReviewRow
          label="Display name"
          value={formData.fullName || '—'}
          onEdit={() => onEdit(1)}
        />
        <ReviewRow
          label="Work email"
          value={formData.workEmail || '—'}
          onEdit={() => onEdit(1)}
        />
        <ReviewRow
          label="Phone number"
          value={formData.phoneNumber || '—'}
          onEdit={() => onEdit(1)}
        />
        <ReviewRow
          label="Location"
          value={formData.primaryLocation || '—'}
          onEdit={() => onEdit(1)}
          showBorder={false}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-[14px] items-center w-full">
        <Button variant="primary" size="lg" onClick={handleCreateAccount} className="w-full">
          Create account
        </Button>
        <Button variant="link-gray" size="sm" onClick={onBack}>
          Back
        </Button>
        <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#a4a7ae] text-center">
          By continuing, you agree to our Terms and acknowledge our Privacy Policy.
        </p>
      </div>
    </>
  )
}
