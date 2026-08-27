'use client'

import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface SubmittedStepProps {
  formData: VendorOnboardingData;
}

export default function SubmittedStep({ formData }: SubmittedStepProps) {
  return (
    <div
      className="pp-stack pp-gap-4 pp-center"
      style={{ alignItems: 'center', paddingBlock: 'var(--sp-8)' }}
    >
      <span className="pp-tile pp-tile--soft" aria-hidden>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 13 4 4 10-10" />
        </svg>
      </span>

      <p className="pp-label">In review</p>
      <h2 className="pp-display pp-d4">Application submitted</h2>
      <p className="pp-body" style={{ maxWidth: '46ch' }}>
        Thanks — {formData.displayName || 'your application'} is now with our review team. We
        typically respond within two business days, and you can keep editing from your expert
        dashboard in the meantime.
      </p>
    </div>
  );
}
