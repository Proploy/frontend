'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import InputField from '@/components/ui/InputField';
import Select from '@/components/ui/Select';
import Tag from '@/components/ui/Tag';
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

function MultiSelectDropdown({
  label,
  required,
  helperText,
  options,
  selectedValues,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }
    onChange([...selectedValues, value]);
  };

  return (
    <div className="flex flex-col gap-[6px]" ref={containerRef}>
      <label className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
        {label} {required && <span className="text-[#dc2626]">*</span>}
      </label>
      {helperText && (
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
          {helperText}
        </p>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen((current) => !current)
          }
        }}
        className="flex min-h-[48px] w-full items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[8px] text-left shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors focus-within:border-[#155eef]"
      >
        <div className="flex flex-1 flex-wrap gap-[6px]">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <Tag
                key={value}
                size="md"
                action="x-close"
                onClose={(event) => {
                  event.stopPropagation()
                  toggleValue(value)
                }}
                className="bg-[#eff4ff] border-[#b2ccff] text-[#004eeb]"
              >
                {value}
              </Tag>
            ))
          ) : (
            <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#717680]">
              {placeholder}
            </span>
          )}
        </div>

        <span className="shrink-0 text-[#717680]">
          ▾
        </span>
      </div>

      {isOpen && (
        <div className="relative">
          <div className="absolute left-0 right-0 top-[4px] z-20 max-h-[280px] overflow-auto rounded-[8px] border border-[#d5d7da] bg-white p-[4px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]">
            {options.map((option) => {
              const selected = selectedValues.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleValue(option)}
                  className={`flex w-full items-center justify-between rounded-[6px] px-[10px] py-[10px] text-left transition-colors ${
                    selected ? 'bg-[#f0f7ff] text-[#155eef]' : 'text-[#414651] hover:bg-[#fafafa]'
                  }`}
                >
                  <span className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px]">
                    {option}
                  </span>
                  {selected && <span className="text-[12px] font-semibold">Selected</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExpertiseStep({ formData, setFormData }: ExpertiseStepProps) {
  const selectedType = formData?.accountType ?? '';
  const { products, loading } = useProductList({ limit: 100, sort: 'name' });
  const platformOptions = useMemo(
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
      <MultiSelectDropdown
        label="Which platforms do you work with?"
        required
        helperText="Select products from the live Proploy catalog."
        options={platformOptions}
        selectedValues={formData.categories}
        onChange={(categories) => setFormData({
          ...formData,
          categories,
          platform: categories[0] ?? '',
        })}
        placeholder={loading ? 'Loading products...' : 'Select platforms...'}
      />

      <MultiSelectDropdown
        label="Secondary platforms"
        options={platformOptions.filter((platform) => !formData.categories.includes(platform))}
        selectedValues={formData.specializations}
        onChange={(specializations) => setFormData({ ...formData, specializations })}
        placeholder={loading ? 'Loading products...' : 'Select secondary platforms...'}
      />

      <Select
        label="Which industries have you worked in?"
        required
        options={industryOptions.map((industry) => ({ value: industry, label: industry }))}
        value={formData.industry}
        onChange={(industry) => setFormData({
          ...formData,
          industry,
          industries: industry ? [industry] : [],
        })}
        placeholder="Select an industry..."
        hintText="Choose a canonical industry value. The selected label is stored as-is."
      />
    </div>
  );
}
