'use client'

import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Select from '@/components/ui/Select';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface PreferencesStepProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
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
    <div className="pp-field" ref={containerRef}>
      <label>
        {label}
        {required && <span className="vo-req"> *</span>}
      </label>
      {helperText && <p className="pp-small">{helperText}</p>}

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="vo-multi"
      >
        <span className="vo-multi-values">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <span key={value} className="pp-tag pp-tag--cobalt">
                {value}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${value}`}
                  className="pp-tag-x"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(value);
                    }
                  }}
                >
                  <X size={12} />
                </span>
              </span>
            ))
          ) : (
            <span className="vo-multi-ph">Select…</span>
          )}
        </span>

        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            color: 'var(--ink-soft)',
            transition: 'transform var(--d-base) var(--ease)',
            transform: isOpen ? 'rotate(180deg)' : undefined,
          }}
        />
      </button>

      {isOpen && (
        <div className="vo-menu-wrap">
          <div className="vo-menu">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(option)}
                  className="vo-opt"
                >
                  <span>{option}</span>
                  {isSelected && <span className="pp-label">Selected</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
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

  const updateField = (field: string, value: string | string[] | boolean | Date | null) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="vo-step">
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
      <fieldset className="pp-field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ padding: 0, fontSize: 13, fontWeight: 'var(--weight-medium)', color: 'var(--ink)' }}>
          Weekly availability
        </legend>

        <div className="pp-stack pp-gap-3" style={{ marginTop: 6 }}>
          {availabilityOptions.map((option) => {
            const isSelected = weeklyAvailability === option;
            return (
              <label key={option} className="vo-radio" data-on={isSelected}>
                <input
                  type="radio"
                  name="weeklyAvailability"
                  value={option}
                  checked={isSelected}
                  onChange={() => updateField('weeklyAvailability', option)}
                  className="sr-only"
                />
                <span className="vo-radio-dot" aria-hidden />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Field 4: Earliest start date */}
      <div className="pp-field">
        <label htmlFor="earliest-start-date">Earliest start date</label>
        <input
          id="earliest-start-date"
          type="date"
          value={earliestStartDate}
          onChange={(e) => updateField('earliestStartDate', e.target.value)}
          className="pp-input"
          style={{ cursor: 'pointer' }}
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

      {/* Field 6: Why these platforms */}
      <div className="pp-field">
        <label htmlFor="vo-why-platforms">Why did you choose these platforms or services?</label>
        <textarea
          id="vo-why-platforms"
          value={whyPlatforms}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              updateField('whyPlatforms', e.target.value);
            }
          }}
          placeholder="Share what you enjoy and what you are best at."
          className="pp-textarea"
          style={{ minHeight: 122 }}
        />
        <p className="pp-small pp-mono-num" style={{ textAlign: 'right' }}>
          {whyPlatforms.length}/500
        </p>
      </div>
    </div>
  );
}
