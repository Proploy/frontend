'use client'

import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import type { ExpertProgress } from '@/features/experts/types';
import { VENDOR_SECTION_KEYS, type VendorOnboardingData, type VendorSectionKey } from '@/hooks/types/vendor-contracts';
import { SECTION_LABELS } from './SectionSidebar';

interface AgreementsSectionProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  progress: ExpertProgress | null;
  onEditSection: (section: VendorSectionKey) => void;
  /** Present when the applicant may submit from here. */
  onSubmit?: () => void;
  submitting?: boolean;
  submitLabel?: string;
  readOnly?: boolean;
}

function joinNames(values: string[], max = 3): string {
  if (values.length === 0) return '';
  if (values.length <= max) return values.join(', ');
  return `${values.slice(0, max).join(', ')} +${values.length - max} more`;
}

const summaryRows: { section: VendorSectionKey; getValue: (form: VendorOnboardingData) => string }[] = [
  {
    section: 'identity',
    getValue: (form) => {
      const type = form.accountType === 'business' ? 'Business or team' : 'Individual';
      return [form.displayName || 'No display name yet', form.headline, type].filter(Boolean).join(' · ');
    },
  },
  {
    section: 'products',
    getValue: (form) => {
      const products = form.productExpertise.map((p) => p.productName);
      // Manual certifications are `{ name, file }` entries, not strings, so the
      // name is what gets trimmed — same as the per-product ones above. Calling
      // `.trim()` on the entry itself throws for any expert who has one, and
      // `ignoreBuildErrors` lets that type error through to production.
      const certs = form.productExpertise.reduce((n, p) => n + p.certifications.filter((c) => c.name.trim()).length, 0)
        + form.manualCertifications.filter((c) => c.name.trim()).length;
      return products.length
        ? `${joinNames(products)} · ${certs} certification${certs === 1 ? '' : 's'} · ${form.industries.length} industr${form.industries.length === 1 ? 'y' : 'ies'}`
        : 'No products added yet';
    },
  },
  {
    section: 'experience',
    getValue: (form) =>
      [form.yearsExperience || 'Years not set', form.totalProjects ? `${form.totalProjects} projects` : 'Projects not set']
        .join(' · '),
  },
  {
    section: 'socials',
    getValue: (form) => {
      const count = form.socialLinks.filter((l) => l.url.trim()).length;
      return count ? `${count} link${count === 1 ? '' : 's'}` : 'No links yet';
    },
  },
  {
    section: 'evidence',
    getValue: (form) => {
      const parts = [
        `${form.featuredProjects.length} featured project${form.featuredProjects.length === 1 ? '' : 's'}`,
        `${form.portfolioFiles.length + form.portfolioLinks.length} portfolio item${form.portfolioFiles.length + form.portfolioLinks.length === 1 ? '' : 's'}`,
        form.introVideoFile || form.introVideoLink ? 'intro video' : '',
      ];
      return parts.filter(Boolean).join(' · ');
    },
  },
  {
    section: 'availability',
    getValue: (form) =>
      [
        [form.regionCity, form.regionCountry].filter(Boolean).join(', ') || 'Location not set',
        form.weeklyAvailability || 'Availability not set',
        form.regions.length ? joinNames(form.regions, 2) : 'No regions',
        form.remoteOnly ? 'remote only' : '',
      ].filter(Boolean).join(' · '),
  },
];

const agreementItems = [
  'I agree to the Vendor Terms and Platform Rules',
  'I acknowledge the Privacy Policy and data handling practices',
  'I consent to verification checks for submitted credentials',
];

export default function AgreementsSection({
  formData,
  setFormData,
  progress,
  onEditSection,
  onSubmit,
  submitting = false,
  submitLabel = 'Submit application',
  readOnly = false,
}: AgreementsSectionProps) {
  const agreements: boolean[] = formData.agreements ?? [false, false, false];
  const sections = progress?.sections ?? [];
  const byKey = new Map(sections.map((section) => [section.key, section]));
  const termsAccepted = Boolean(agreements[0] && agreements[1]);
  // The terms are the one client-side blocker; everything else comes from the server.
  const blockers = (progress?.submitBlockers ?? []).filter((blocker) => !/terms/i.test(blocker));

  const handleAgreementToggle = (index: number) => {
    const updated = [...agreements];
    updated[index] = !updated[index];
    setFormData({ ...formData, agreements: updated });
  };

  return (
    <div className="vo-step" style={{ gap: 'var(--sp-8)' }}>
      <div className="vo-group">
        <p className="pp-label">Summary</p>

        <div className="vo-summary">
          {summaryRows.map((row) => (
            <div key={row.section} className="vo-summary-row">
              <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
                <span className="pp-h6">{byKey.get(row.section)?.label ?? SECTION_LABELS[row.section]}</span>
                <span className="pp-small">{row.getValue(formData)}</span>
              </div>

              <button type="button" onClick={() => onEditSection(row.section)} className="pp-link-arrow">
                Edit
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {sections.length > 0 && (
        <div className="vo-group">
          <p className="pp-label">Checklist</p>
          <ul className="vo-summary" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {VENDOR_SECTION_KEYS.map((key) => {
              const section = byKey.get(key);
              if (!section) return null;
              return (
                <li key={key} className="vo-summary-row">
                  <div className="pp-row pp-gap-3" style={{ minWidth: 0, alignItems: 'flex-start' }}>
                    <span
                      className={`pp-tag ${section.complete ? 'pp-tag--success' : 'pp-tag--warning'}`}
                      style={{ padding: 4 }}
                      aria-hidden
                    >
                      {section.complete ? <Check size={12} strokeWidth={3} /> : <AlertCircle size={12} />}
                    </span>
                    <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
                      <span className="pp-h6">{section.label}</span>
                      <span className="pp-small">
                        {section.complete ? 'Complete' : `Missing ${section.missing.join(', ')}`}
                      </span>
                    </div>
                  </div>
                  {!section.complete && key !== 'agreements' && (
                    <button type="button" onClick={() => onEditSection(key)} className="pp-link-arrow">
                      Fix
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="vo-group">
        <p className="pp-label">Agreements</p>

        <div className="pp-stack pp-gap-3">
          {agreementItems.map((item, index) => (
            <label key={item} className="pp-check" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreements[index] ?? false}
                onChange={() => handleAgreementToggle(index)}
                disabled={readOnly}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {!readOnly && (
        termsAccepted ? (
          <div className="vo-group">
            {blockers.length > 0 ? (
              <div className="vo-banner vo-banner--info">
                <AlertCircle size={18} />
                <div className="vo-banner-body">
                  <p style={{ fontWeight: 'var(--weight-medium)' }}>Almost there. Before you can submit, add:</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {blockers.map((blocker) => (
                      <li key={blocker}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="pp-small">
                Everything essential is in. You can keep improving your profile after you submit.
              </p>
            )}
            {onSubmit && (
              <button
                type="button"
                className="pp-btn pp-btn--cobalt pp-btn--block"
                onClick={onSubmit}
                disabled={submitting || blockers.length > 0}
              >
                {submitting ? 'Submitting…' : submitLabel}
              </button>
            )}
          </div>
        ) : (
          <p className="pp-small">Accept the vendor terms and privacy policy above to unlock submission.</p>
        )
      )}
    </div>
  );
}
