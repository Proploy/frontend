'use client'

import React from 'react';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface OverviewStepProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
}

const checklistItems = [
  'Expertise and platforms',
  'Credentials and experience',
  'Featured projects',
  'Portfolio and evidence',
  'Availability and preferences',
  'Compliance and agreement',
];

export default function OverviewStep({ formData, setFormData }: OverviewStepProps) {
  return (
    <div className="bg-[#fafafa] border border-[#e9eaeb] rounded-[12px] p-[25px]">
      {/* Title */}
      <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#181d27]">
        What we&apos;ll need
      </h3>

      {/* Checklist */}
      <div className="flex flex-col gap-[16px] mt-[12px]">
        {checklistItems.map((item) => (
          <div key={item} className="flex items-center gap-[12px]">
            {/* Circle outline */}
            <div className="w-[20px] h-[20px] min-w-[20px] rounded-full border-2 border-[#d5d7da]" />

            {/* Label */}
            <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#414651]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
