'use client'

import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface SubmittedStepProps {
  formData: VendorOnboardingData;
}

export default function SubmittedStep({ formData }: SubmittedStepProps) {
  return (
    <div className="rounded-[12px] border border-[#abefc6] bg-[#ecfdf3] px-[24px] py-[32px] text-center">
      <h2 className="text-[24px] font-semibold text-[#067647]">Application submitted</h2>
      <p className="mt-[8px] text-[16px] leading-[24px] text-[#535862]">
        Thanks, {formData.displayName || 'your application'} is now in review. You can still update it from your expert dashboard.
      </p>
    </div>
  );
}
