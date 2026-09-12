'use client'

import React from 'react';
import Select from '@/components/ui/Select';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface ExperienceSectionProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  readOnly?: boolean;
}

export const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '6–10 years',
  '10+ years',
];

const TEXT_LIMIT = 600;

function LimitedTextarea({
  id,
  label,
  value,
  placeholder,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="pp-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => {
          if (event.target.value.length <= TEXT_LIMIT) onChange(event.target.value);
        }}
        placeholder={placeholder}
        className="pp-textarea"
        style={{ minHeight: 98 }}
        disabled={disabled}
      />
      <p className="pp-small pp-mono-num" style={{ textAlign: 'right' }}>
        {value.length}/{TEXT_LIMIT}
      </p>
    </div>
  );
}

export default function ExperienceSection({ formData, setFormData, readOnly = false }: ExperienceSectionProps) {
  const update = (patch: Partial<VendorOnboardingData>) => setFormData({ ...formData, ...patch });

  return (
    <div className="vo-step">
      <div className="vo-grid-2">
        <Select
          label="Years in this line of work"
          required
          options={EXPERIENCE_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
          value={formData.yearsExperience}
          onChange={(value) => update({ yearsExperience: value })}
          placeholder="Choose a range"
          disabled={readOnly}
        />

        <div className="pp-field">
          <label htmlFor="vo-total-projects">
            <span
              className="vo-label-tip"
              data-tip="All products together. Shown as a number on your profile."
            >Client projects delivered</span> <span className="vo-req">*</span>
          </label>
          <input
            id="vo-total-projects"
            type="number"
            inputMode="numeric"
            min={0}
            value={formData.totalProjects}
            onChange={(event) => update({ totalProjects: event.target.value })}
            placeholder="40"
            className="pp-input"
            disabled={readOnly}
          />
        </div>
      </div>

      <LimitedTextarea
        id="vo-unique-strength"
        label="What clients keep hiring you for"
        value={formData.uniqueStrength}
        placeholder="Untangling half-finished CRM migrations without losing pipeline data"
        onChange={(value) => update({ uniqueStrength: value })}
        disabled={readOnly}
      />

      <LimitedTextarea
        id="vo-biggest-win"
        label="Your proudest engagement"
        value={formData.biggestWin}
        placeholder="Moved a 60-seat sales team from Salesforce to HubSpot in six weeks with zero lost deals"
        onChange={(value) => update({ biggestWin: value })}
        disabled={readOnly}
      />

      <LimitedTextarea
        id="vo-ideal-clients"
        label="Who you do your best work with"
        value={formData.idealClients}
        placeholder="Series A–C SaaS companies with a RevOps lead and 10–50 sales seats"
        onChange={(value) => update({ idealClients: value })}
        disabled={readOnly}
      />

    </div>
  );
}
