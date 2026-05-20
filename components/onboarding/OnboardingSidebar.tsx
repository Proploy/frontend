'use client'

import Link from 'next/link'
import { Check, User, Bell, FileSearch, Handshake, Mail, LucideIcon } from 'lucide-react'

const DEFAULT_STEPS = [
  { icon: Handshake, title: 'Get started', subtitle: 'Create your vendor account' },
  { icon: User, title: 'Your details', subtitle: 'Name and contact info' },
  { icon: Bell, title: 'Preferences', subtitle: 'Updates and consent' },
  { icon: FileSearch, title: 'Review', subtitle: 'Confirm details' },
]

export interface OnboardingStep {
  icon: LucideIcon
  title: string
  subtitle: string
}

interface OnboardingSidebarProps {
  currentStep: number
  steps?: OnboardingStep[]
}

export default function OnboardingSidebar({ currentStep, steps }: OnboardingSidebarProps) {
  const resolvedSteps = steps ?? DEFAULT_STEPS

  return (
    <div className="bg-[#fafafa] flex flex-col justify-between h-full w-full max-w-[440px] shrink-0">
      <div className="flex flex-col gap-[80px] pt-[32px] px-[32px]">
        {/* Logo */}
        <Link href="/">
          <img src="/proploy-logo.png" alt="Proploy" className="w-[139px] h-auto" />
        </Link>

        {/* Progress Steps */}
        <div className="flex flex-col pr-[32px]">
          {resolvedSteps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isFuture = index > currentStep
            const isLast = index === resolvedSteps.length - 1
            const Icon = step.icon

            return (
              <div
                key={index}
                className={`flex gap-[16px] items-start ${isFuture ? 'opacity-60' : ''}`}
              >
                {/* Icon + Connector */}
                <div className="flex flex-col gap-[4px] items-center self-stretch shrink-0">
                  {isCompleted ? (
                    <div className="bg-[#155eef] rounded-full size-[48px] flex items-center justify-center relative z-[2] shrink-0">
                      <Check className="size-[24px] text-white" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className={`bg-white border rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-[48px] flex items-center justify-center relative z-[2] shrink-0 overflow-hidden ${
                      isCurrent ? 'border-[#155eef]' : 'border-[#d5d7da]'
                    }`}>
                      <Icon className="size-[24px] text-[#414651]" strokeWidth={1.5} />
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
                    </div>
                  )}
                  {!isLast && (
                    <div className={`flex-1 w-0 min-h-[20px] border-l-2 z-[1] ${
                      isCompleted ? 'border-solid border-[#155eef]' : 'border-dashed border-[#e9eaeb]'
                    }`} />
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col pb-[32px]">
                  <p className={`font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] ${
                    isCurrent ? 'text-[#004eeb]' : 'text-[#414651]'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] ${
                    isCurrent ? 'text-[#155eef]' : 'text-[#535862]'
                  }`}>
                    {step.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between p-[32px]">
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
          &copy; Proploy 2026
        </p>
        <div className="flex gap-[8px] items-center">
          <Mail className="size-[16px] text-[#535862]" strokeWidth={1.5} />
          <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
            help@proploy.com
          </p>
        </div>
      </div>
    </div>
  )
}
