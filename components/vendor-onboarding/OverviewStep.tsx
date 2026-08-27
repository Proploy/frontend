'use client'

import React from 'react';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface OverviewStepProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
}

const checklistItems = [
  { title: 'Expertise and platforms', detail: 'The products you implement and the industries you know.' },
  { title: 'Credentials and experience', detail: 'Partner badges, certifications and years in the work.' },
  { title: 'Featured projects', detail: 'Up to three engagements that show your range.' },
  { title: 'Portfolio and evidence', detail: 'Files and links — you choose what clients can see.' },
  { title: 'Availability and preferences', detail: 'Timezone, regions and the work you want.' },
  { title: 'Compliance and agreement', detail: 'Vendor terms, privacy and verification consent.' },
];

export default function OverviewStep({ formData, setFormData }: OverviewStepProps) {
  return (
    <div className="vo-step">
      <div className="vo-group" style={{ gap: 'var(--sp-2)' }}>
        <p className="pp-label">Before you start</p>
        <p className="pp-body">
          Six short sections, about ten minutes. Your answers save as a draft after every step, so
          you can leave and pick it up later.
        </p>
      </div>

      <ol className="vo-group" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {checklistItems.map((item, index) => (
          <li key={item.title} className="pp-flex pp-gap-4" style={{ alignItems: 'flex-start' }}>
            <span className="pp-tile pp-tile--sm pp-mono-num" aria-hidden>
              {index + 1}
            </span>
            <span className="pp-stack" style={{ gap: 2 }}>
              <span className="pp-h6">{item.title}</span>
              <span className="pp-small">{item.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
