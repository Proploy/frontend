'use client'

import React from 'react';
import { Check } from 'lucide-react';

export interface ProgressStep {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export default function ProgressSteps({
  steps,
  currentStep,
  className = '',
}: ProgressStepsProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-start max-w-[1008px] mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;
          const isLast = index === steps.length - 1;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.title}>
              {/* Step */}
              <div
                className={`flex-1 flex flex-col gap-[12px] items-center relative ${
                  isFuture ? 'opacity-60' : ''
                }`}
              >
                {/* Icon box */}
                {isCompleted ? (
                  <div className="bg-[#155eef] rounded-full size-[40px] flex items-center justify-center shrink-0">
                    <Check size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                ) : isCurrent ? (
                  <div className="bg-white border border-[#155eef] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),0px_0px_0px_2px_white,0px_0px_0px_4px_#2970ff] size-[40px] flex items-center justify-center relative shrink-0 overflow-hidden">
                    <Icon size={20} strokeWidth={1.5} className="text-[#414651]" />
                    <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
                  </div>
                ) : (
                  <div className="bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-[40px] flex items-center justify-center relative shrink-0 overflow-hidden">
                    <Icon size={20} strokeWidth={1.5} className="text-[#414651]" />
                    <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
                  </div>
                )}

                {/* Labels */}
                <div className="flex flex-col items-center text-center w-full">
                  <p
                    className={`font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] ${
                      isCurrent ? 'text-[#004eeb]' : 'text-[#414651]'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] ${
                      isCurrent ? 'text-[#155eef]' : 'text-[#535862]'
                    }`}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting line between steps */}
              {!isLast && (
                <div className="flex items-center shrink-0 mt-[19px]" style={{ width: 16 }}>
                  <div
                    className={`h-[2px] w-full ${
                      index < currentStep ? 'bg-[#155eef]' : 'bg-[#e9eaeb]'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
