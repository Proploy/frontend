'use client'

import React from 'react';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface ReviewStepProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  onEditStep: (step: number) => void;
}

const summaryRows = [
  {
    step: 1,
    title: 'Account type',
    getValue: (formData: VendorOnboardingData) => {
      const type = formData?.accountType;
      if (type === 'business') return 'Business or team';
      if (type === 'individual') return 'Individual';
      return 'Individual';
    },
  },
  {
    step: 1,
    title: 'Platforms and industries',
    getValue: (formData: VendorOnboardingData) => {
      const platforms = formData?.categories?.length ?? 0;
      const industries = formData?.industries?.length ?? 0;
      return `${platforms || 1} platforms, ${industries || 1} industries`;
    },
  },
  {
    step: 2,
    title: 'Experience and certifications',
    getValue: (formData: VendorOnboardingData) => {
      const experience = formData?.yearsExperience || 'Not specified';
      const certs = (formData?.certificationFiles?.length ?? 0) + (formData?.manualCertifications?.length ?? 0);
      return `${experience} experience, ${certs || 1} certifications`;
    },
  },
  {
    step: 3,
    title: 'Projects and featured work',
    getValue: (formData: VendorOnboardingData) => {
      const total = formData?.totalProjects || '0';
      const featured = formData?.featuredProjects?.length ?? 0;
      return `${total} total projects, ${featured || 1} featured`;
    },
  },
  {
    step: 4,
    title: 'Portfolio items and visibility',
    getValue: (formData: VendorOnboardingData) => {
      const files = formData?.portfolioFiles?.length ?? 0;
      const links = formData?.portfolioLinks?.length ?? 0;
      return `${files} files, ${links || 1} links`;
    },
  },
  {
    step: 5,
    title: 'Preferences and availability',
    getValue: (formData: VendorOnboardingData) => {
      const projectTypes = formData?.preferredProjectTypes?.length ?? 0;
      const regions = formData?.regions?.length ?? 0;
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
    <div className="vo-step" style={{ gap: 'var(--sp-8)' }}>
      {/* Summary Section */}
      <div className="vo-group">
        <p className="pp-label">Summary</p>

        <div className="vo-summary">
          {summaryRows.map((row) => (
            <div key={row.title} className="vo-summary-row">
              <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
                <span className="pp-h6">{row.title}</span>
                <span className="pp-small">{row.getValue(formData)}</span>
              </div>

              <button
                type="button"
                onClick={() => onEditStep(row.step)}
                className="pp-link-arrow"
              >
                Edit
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agreements Section */}
      <div className="vo-group">
        <p className="pp-label">Agreements</p>

        <div className="pp-stack pp-gap-3">
          {agreementItems.map((item, index) => (
            <label key={item} className="pp-check" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreements[index] ?? false}
                onChange={() => handleAgreementToggle(index)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
