'use client'

import React from 'react';

interface ReviewStepProps {
  formData: any;
  setFormData: (data: any) => void;
  onEditStep: (step: number) => void;
}

const summaryRows = [
  {
    step: 1,
    title: 'Account type',
    getValue: (formData: any) => {
      const type = formData?.accountType;
      if (type === 'business') return 'Business or team';
      if (type === 'individual') return 'Individual';
      return 'Individual';
    },
  },
  {
    step: 1,
    title: 'Platforms and industries',
    getValue: (formData: any) => {
      const platforms = formData?.categories?.length ?? 0;
      const industries = formData?.specializations?.length ?? 0;
      return `${platforms || 1} platforms, ${industries || 1} industries`;
    },
  },
  {
    step: 2,
    title: 'Experience and certifications',
    getValue: (formData: any) => {
      const experience = formData?.yearsOfExperience || 'Not specified';
      const certs = formData?.certifications?.length ?? 0;
      return `${experience} experience, ${certs || 1} certifications`;
    },
  },
  {
    step: 3,
    title: 'Projects and featured work',
    getValue: (formData: any) => {
      const total = formData?.completedProjectsCount || '12';
      const featured = formData?.projectTypes?.length ?? 0;
      return `${total} total projects, ${featured || 1} featured`;
    },
  },
  {
    step: 4,
    title: 'Portfolio items and visibility',
    getValue: (formData: any) => {
      const files = formData?.portfolioFiles?.length ?? 0;
      const links = formData?.portfolioLinks?.length ?? 0;
      return `${files} files, ${links || 1} links`;
    },
  },
  {
    step: 5,
    title: 'Preferences and availability',
    getValue: (formData: any) => {
      const projectTypes = formData?.projectTypes?.length ?? 0;
      const regions = formData?.locationPreference ? 1 : 0;
      return `${projectTypes || 1} project types, ${regions || 1} regions`;
    },
  },
];

const agreementItems = [
  'I agree to the Vendor Terms and Platform Rules',
  'I acknowledge the Privacy Policy and data handling practices',
  'I consent to verification checks for submitted credentials',
];

export default function ReviewStep({ formData, setFormData, onEditStep }: ReviewStepProps) {
  const agreements: boolean[] = formData?.agreements ?? [false, false, false];

  const handleAgreementToggle = (index: number) => {
    const updated = [...agreements];
    updated[index] = !updated[index];
    setFormData({ ...formData, agreements: updated });
  };

  return (
    <div className="flex flex-col gap-[32px]">
      {/* Summary Section */}
      <div className="flex flex-col gap-[12px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[28px] text-[#181d27]">
          Summary
        </h3>

        <div className="rounded-[8px] border border-[#e9eaeb] overflow-hidden">
          {summaryRows.map((row, index) => (
            <div
              key={row.title}
              className={`flex items-center justify-between px-[16px] py-[16px] ${
                index < summaryRows.length - 1 ? 'border-b border-[#e9eaeb]' : ''
              }`}
            >
              {/* Left side */}
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27]">
                  {row.title}
                </span>
                <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
                  {row.getValue(formData)}
                </span>
              </div>

              {/* Edit link */}
              <button
                type="button"
                onClick={() => onEditStep(row.step)}
                className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#155eef] cursor-pointer bg-transparent border-none hover:underline"
              >
                Edit &gt;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agreements Section */}
      <div className="flex flex-col gap-[12px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[28px] text-[#181d27]">
          Agreements
        </h3>

        <div className="flex flex-col gap-[16px]">
          {agreementItems.map((item, index) => (
            <label
              key={item}
              className="flex items-start gap-[12px] cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreements[index] ?? false}
                  onChange={() => handleAgreementToggle(index)}
                  className="peer sr-only"
                />
                <div className="w-[20px] h-[20px] rounded-[4px] border border-[#d5d7da] bg-white peer-checked:bg-[#155eef] peer-checked:border-[#155eef] transition-colors flex items-center justify-center">
                  {agreements[index] && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#414651]">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
