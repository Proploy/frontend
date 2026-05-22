'use client'

import React from 'react';
import Select from '@/components/ui/Select';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface ExpertiseStepProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
}

const accountTypes = [
  {
    value: 'individual',
    title: 'Individual',
    subtitle: 'Freelancer or solo consultant',
  },
  {
    value: 'business',
    title: 'Business or team',
    subtitle: 'Agency, studio, or multi-person team',
  },
];

const platformOptions = [
  { value: 'monday', label: 'monday.com' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'zendesk', label: 'Zendesk' },
  { value: 'jira', label: 'Jira / Atlassian' },
  { value: 'asana', label: 'Asana' },
  { value: 'servicenow', label: 'ServiceNow' },
];

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
];

export default function ExpertiseStep({ formData, setFormData }: ExpertiseStepProps) {
  const selectedType = formData?.accountType ?? '';

  const handleAccountTypeSelect = (value: string) => {
    setFormData({ ...formData, accountType: value });
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Account type selector */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Account type <span className="text-[#dc2626]">*</span>
        </label>

        <div className="flex gap-[12px]">
          {accountTypes.map((type) => {
            const isSelected = selectedType === type.value;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleAccountTypeSelect(type.value)}
                className={`flex-1 flex flex-col justify-center h-[84px] p-[18px] rounded-[8px] border-2 text-left transition-colors ${
                  isSelected
                    ? 'bg-[#f0f7ff] border-[#155eef]'
                    : 'bg-white border-[#e9eaeb]'
                }`}
              >
                <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#414651]">
                  {type.title}
                </span>
                <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
                  {type.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Platforms field */}
      <Select
        label="Which platforms do you work with?"
        required
        options={platformOptions}
        value={formData?.platform ?? ''}
        onChange={(val) => setFormData({ ...formData, platform: val })}
        placeholder="Select platforms..."
        hintText="Select at least 1. Add more later."
      />

      {/* Industries field */}
      <Select
        label="Which industries have you worked in?"
        options={industryOptions}
        value={formData?.industry ?? ''}
        onChange={(val) => setFormData({ ...formData, industry: val })}
        placeholder="Select industries..."
        hintText="Pick up to 5 to improve matching."
      />
    </div>
  );
}