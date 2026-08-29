'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import Select from '@/components/ui/Select';
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

export function MultiSelectDropdown({
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
    <div className="pp-field" ref={containerRef}>
      <label>
        {label} {required && <span className="vo-req">*</span>}
      </label>
      {helperText && <p className="pp-small">{helperText}</p>}

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
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
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleValue(value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleValue(value);
                    }
                  }}
                >
                  <X size={12} />
                </span>
              </span>
            ))
          ) : (
            <span className="vo-multi-ph">{placeholder}</span>
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
            {options.length === 0 && <p className="pp-small" style={{ padding: 10 }}>No options yet.</p>}
            {options.map((option) => {
              const selected = selectedValues.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleValue(option)}
                  className="vo-opt"
                >
                  <span>{option}</span>
                  {selected && <span className="pp-label">Selected</span>}
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
    <div className="vo-step">
      {/* Account type selector */}
      <div className="pp-field">
        <label>
          Account type <span className="vo-req">*</span>
        </label>

        <div className="pp-flex pp-gap-3 vo-choice-row">
          {accountTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              aria-pressed={selectedType === type.value}
              onClick={() => handleAccountTypeSelect(type.value)}
              className="vo-choice"
            >
              <span className="vo-choice-title">{type.title}</span>
              <span className="vo-choice-sub">{type.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pp-field">
        <label htmlFor="vo-display-name">
          Public display name <span className="vo-req">*</span>
        </label>
        <input
          id="vo-display-name"
          className="pp-input"
          type="text"
          value={formData.displayName}
          onChange={(event) => setFormData({ ...formData, displayName: event.target.value })}
          placeholder="e.g., Alex Tan or Acme Consulting"
        />
      </div>

      <div className="pp-field">
        <label htmlFor="vo-headline">
          Professional headline <span className="vo-req">*</span>
        </label>
        <input
          id="vo-headline"
          className="pp-input"
          type="text"
          value={formData.headline}
          onChange={(event) => setFormData({ ...formData, headline: event.target.value })}
          placeholder="e.g., HubSpot and Salesforce implementation specialist"
        />
      </div>

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
