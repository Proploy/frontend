'use client'

import { Handshake, User, Briefcase, FileText, Award } from 'lucide-react'
import Button from '@/components/ui/Button'

interface StepGetStartedProps {
  onNext: () => void
}

export default function StepGetStarted({ onNext }: StepGetStartedProps) {
  return (
    <>
      {/* Featured icon */}
      <div className="bg-white border border-[#d5d7da] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-[56px] flex items-center justify-center relative shrink-0 overflow-hidden">
        <Handshake className="size-[24px] text-[#414651]" strokeWidth={1.5} />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-[12px] items-center text-center w-full">
        <h1 className="display-sm-semibold text-[#181d27] w-full">
          Join as a vendor
        </h1>
        <p className="text-md-regular text-[#535862] w-full">
          Create your vendor profile to get matched with projects and clients.
        </p>
      </div>

      {/* What you'll need card */}
      <div className="bg-[#fafafa] border border-[#e9eaeb] rounded-[12px] pt-[21px] px-[21px] pb-[1px] w-full">
        <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#181d27] mb-[12px]">
          {`What you'll need`}
        </p>
        <div className="flex flex-col gap-[10px] pb-[21px]">
          <div className="flex gap-[10px] items-center">
            <User className="size-[16px] text-[#535862] shrink-0" strokeWidth={1.5} />
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
              Contact details
            </p>
          </div>
          <div className="flex gap-[10px] items-center">
            <Briefcase className="size-[16px] text-[#535862] shrink-0" strokeWidth={1.5} />
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
              Your service platforms and skills
            </p>
          </div>
          <div className="flex gap-[10px] items-center">
            <FileText className="size-[16px] text-[#535862] shrink-0" strokeWidth={1.5} />
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
              Portfolio or proof of work
            </p>
          </div>
          <div className="flex gap-[10px] items-start">
            <Award className="size-[16px] text-[#535862] shrink-0 mt-[2px]" strokeWidth={1.5} />
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
              Optional: certifications and partner badges
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-[16px] items-center w-full">
        <Button variant="primary" size="lg" onClick={onNext} className="w-full">
          Get Started
        </Button>
        <Button variant="link-color" size="sm">
          Already started? Resume
        </Button>
        <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[18px] text-[#a4a7ae] text-center">
          Auto-save is on. You can finish later anytime.
        </p>
      </div>
    </>
  )
}
