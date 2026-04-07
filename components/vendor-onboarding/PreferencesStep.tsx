'use client'

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Select from '@/components/ui/Select';

interface PreferencesStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const timezoneOptions = [
  'UTC-12:00 (Baker Island)',
  'UTC-11:00 (Samoa)',
  'UTC-10:00 (Hawaii)',
  'UTC-09:00 (Alaska)',
  'UTC-08:00 (Pacific Time)',
  'UTC-07:00 (Mountain Time)',
  'UTC-06:00 (Central Time)',
  'UTC-05:00 (Eastern Time)',
  'UTC-04:00 (Atlantic Time)',
  'UTC-03:00 (Buenos Aires)',
  'UTC-02:00 (Mid-Atlantic)',
  'UTC-01:00 (Azores)',
  'UTC+00:00 (London, Lisbon)',
  'UTC+01:00 (Berlin, Paris)',
  'UTC+02:00 (Cairo, Helsinki)',
  'UTC+03:00 (Moscow, Nairobi)',
  'UTC+04:00 (Dubai)',
  'UTC+05:00 (Karachi)',
  'UTC+05:30 (Mumbai)',
  'UTC+06:00 (Dhaka)',
  'UTC+07:00 (Bangkok)',
  'UTC+08:00 (Singapore)',
  'UTC+09:00 (Tokyo)',
  'UTC+10:00 (Sydney)',
  'UTC+11:00 (Solomon Islands)',
  'UTC+12:00 (Auckland)',
];

const regionOptions = [
  'North America',
  'South America',
  'Europe',
  'Middle East',
  'Africa',
  'Central Asia',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Oceania',
];

const projectTypeOptions = [
  'Implementation',
  'Migration',
  'Integration',
  'Customization',
  'Consulting',
  'Training',
  'Support & maintenance',
  'Audit & optimization',
];

const availabilityOptions = [
  'Less than 5 hours',
  '5 to 10 hours',
  '10 to 20 hours',
  '20+ hours',
];

function MultiSelectTagInput({
  label,
  required,
  helperText,
  options,
  selectedValues,
  onChange,
}: {
  label: string;
  required?: boolean;
  helperText?: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(selectedValues.filter((v) => v !== option));
  };

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="font-[family-name:var(--font-inter)] font-medium text-[14px] leading-[20px] text-[#414651]">
        {label}
        {required && <span className="text-[#dc2626]"> *</span>}
      </label>
      {helperText && (
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
          {helperText}
        </p>
      )}

      <div className="relative">
        {/* Input area with tags */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-wrap items-center gap-[6px] min-h-[48px] w-full bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[8px] shadow-xs cursor-pointer focus-within:border-[#155eef] transition-colors"
        >
          {selectedValues.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-[4px] bg-[#f5f5f6] rounded-[6px] px-[8px] py-[4px] font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#414651]"
            >
              {value}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(value);
                }}
                className="flex items-center justify-center w-[16px] h-[16px] rounded-full hover:bg-[#e9eaeb] transition-colors cursor-pointer"
              >
                <X className="w-[12px] h-[12px] text-[#535862]" />
              </button>
            </span>
          ))}

          {selectedValues.length === 0 && (
            <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#717680]">
              Select...
            </span>
          )}

          <ChevronDown className="w-[16px] h-[16px] text-[#717680] ml-auto flex-shrink-0" />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 top-full left-0 right-0 mt-[4px] bg-white border border-[#d5d7da] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-[14px] py-[10px] font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] hover:bg-[#f5f5f6] transition-colors cursor-pointer ${
                    isSelected ? 'text-[#155eef] bg-[#f0f7ff]' : 'text-[#414651]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PreferencesStep({ formData, setFormData }: PreferencesStepProps) {
  const selectedTimezone = formData?.timezone ?? '';
  const selectedRegions: string[] = formData?.regions ?? [];
  const weeklyAvailability = formData?.weeklyAvailability ?? '';
  const earliestStartDate = formData?.earliestStartDate ?? '';
  const preferredProjectTypes: string[] = formData?.preferredProjectTypes ?? [];
  const whyPlatforms = formData?.whyPlatforms ?? '';

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Field 1: Timezone */}
      <Select
        label="Timezone"
        required
        options={timezoneOptions.map((tz) => ({ value: tz, label: tz }))}
        value={selectedTimezone}
        onChange={(val) => updateField('timezone', val)}
        placeholder="Select timezone..."
      />

      {/* Field 2: Regions you can serve */}
      <MultiSelectTagInput
        label="Regions you can serve"
        required
        options={regionOptions}
        selectedValues={selectedRegions}
        onChange={(values) => updateField('regions', values)}
      />

      {/* Field 3: Weekly availability */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-inter)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Weekly availability
        </label>

        <div className="flex flex-col gap-[12px] mt-[4px]">
          {availabilityOptions.map((option) => {
            const isSelected = weeklyAvailability === option;
            return (
              <label key={option} className="flex items-center gap-[10px] cursor-pointer">
                <div
                  className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'border-[#155eef]' : 'border-[#d5d7da]'
                  }`}
                  onClick={() => updateField('weeklyAvailability', option)}
                >
                  {isSelected && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#155eef]" />
                  )}
                </div>
                <input
                  type="radio"
                  name="weeklyAvailability"
                  value={option}
                  checked={isSelected}
                  onChange={() => updateField('weeklyAvailability', option)}
                  className="sr-only"
                />
                <span className="font-[family-name:var(--font-inter)] font-medium text-[16px] leading-[24px] text-[#414651]">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Field 4: Earliest start date */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-inter)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Earliest start date
        </label>
        <input
          type="date"
          value={earliestStartDate}
          onChange={(e) => updateField('earliestStartDate', e.target.value)}
          className="h-[44px] w-full bg-white border border-[#d5d7da] rounded-[8px] px-[14px] shadow-xs font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] text-[#181d27] outline-none focus:border-[#155eef] transition-colors cursor-pointer"
        />
      </div>

      {/* Field 5: Preferred project types */}
      <MultiSelectTagInput
        label="Preferred project types"
        required
        helperText="Select at least 1."
        options={projectTypeOptions}
        selectedValues={preferredProjectTypes}
        onChange={(values) => updateField('preferredProjectTypes', values)}
      />

      {/* Field 6: Why did you choose these platforms or services? */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-[family-name:var(--font-inter)] font-medium text-[14px] leading-[20px] text-[#414651]">
          Why did you choose these platforms or services?
        </label>
        <textarea
          value={whyPlatforms}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              updateField('whyPlatforms', e.target.value);
            }
          }}
          placeholder="Share what you enjoy and what you are best at."
          className="h-[122px] w-full bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] shadow-xs font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#155eef] transition-colors resize-none"
        />
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#717680] text-right">
          {whyPlatforms.length}/500
        </p>
      </div>
    </div>
  );
}
