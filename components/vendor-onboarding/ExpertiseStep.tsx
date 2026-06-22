'use client'

import React from 'react';
import InputField from '@/components/ui/InputField';
import TagInput from '@/components/onboarding/TagInput';
import { useProductList } from '@/features/catalog';
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

const industryOptions = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & E-commerce',
  'Manufacturing',
  'Consulting',
];

export default function ExpertiseStep({ formData, setFormData }: ExpertiseStepProps) {
  const selectedType = formData?.accountType ?? '';
  const { products, loading } = useProductList({ limit: 100, sort: 'name' });
  const platformOptions = React.useMemo(
    () => products.map((product) => product.product_name),
    [products],
  );

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

      <InputField
        label="Public display name"
        required
        value={formData.displayName}
        onChange={(event) => setFormData({ ...formData, displayName: event.target.value })}
        placeholder="e.g., Alex Tan or Acme Consulting"
      />

      <InputField
        label="Professional headline"
        required
        value={formData.headline}
        onChange={(event) => setFormData({ ...formData, headline: event.target.value })}
        placeholder="e.g., HubSpot and Salesforce implementation specialist"
      />

      {/* Platforms field */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Which platforms do you work with? <span className="text-[#dc2626]">*</span>
        </label>
        <TagInput
          values={formData.categories}
          label="platforms"
          suggestions={platformOptions}
          loading={loading}
          allowCustom={false}
          onChange={(categories) => setFormData({
            ...formData,
            categories,
            platform: categories[0] ?? '',
          })}
        />
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
          Select products from the live Proploy catalog.
        </p>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Secondary platforms
        </label>
        <TagInput
          values={formData.specializations}
          label="secondary platforms"
          suggestions={platformOptions.filter((platform) => !formData.categories.includes(platform))}
          loading={loading}
          allowCustom={false}
          onChange={(specializations) => setFormData({ ...formData, specializations })}
        />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Which industries have you worked in?
        </label>
        <TagInput
          values={formData.industries}
          label="industries"
          suggestions={industryOptions}
          allowCustom={false}
          onChange={(industries) => setFormData({
            ...formData,
            industries,
            industry: industries[0] ?? '',
          })}
        />
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
          Pick up to 5 to improve matching.
        </p>
      </div>
    </div>
  );
}
