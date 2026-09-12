'use client'

import Link from 'next/link';
import { Check } from 'lucide-react';
import type { ExpertProgressSection } from '@/features/experts/types';
import { VENDOR_SECTION_KEYS, type VendorSectionKey } from '@/hooks/types/vendor-contracts';

export const SECTION_LABELS: Record<VendorSectionKey, string> = {
  identity: 'You',
  products: 'Products',
  experience: 'Experience',
  socials: 'Social & links',
  evidence: 'Projects & proof',
  availability: 'Availability',
  agreements: 'Review & submit',
};

type SectionState = 'complete' | 'attention' | 'todo';

export type SidebarAction =
  | { kind: 'review' }
  | { kind: 'accept-terms' }
  | { kind: 'submit'; blockers: string[] }
  | { kind: 'none' };

interface SectionSidebarProps {
  currentSection: VendorSectionKey;
  sections: ExpertProgressSection[] | null | undefined;
  percentComplete: number;
  /** Section keys the applicant has opened this session. */
  touched: ReadonlySet<VendorSectionKey>;
  onSelect: (section: VendorSectionKey) => void;
  action: SidebarAction;
  onReview: () => void;
  onSubmit: () => void;
  saveStatus: string;
  saving: boolean;
  submitting: boolean;
  disabled?: boolean;
}

function stateFor(
  key: VendorSectionKey,
  section: ExpertProgressSection | undefined,
  touched: ReadonlySet<VendorSectionKey>,
): SectionState {
  if (section?.complete) return 'complete';
  if (section && section.missing.length > 0 && touched.has(key)) return 'attention';
  return 'todo';
}

/**
 * Left rail of the wizard: percent bar, one clickable row per section with
 * its state, save status, and the single call to action. The CTA leads to
 * the review section until the terms are accepted; only then does it
 * become "Submit application".
 */
export default function SectionSidebar({
  currentSection,
  sections,
  percentComplete,
  touched,
  onSelect,
  action,
  onReview,
  onSubmit,
  saveStatus,
  saving,
  submitting,
  disabled = false,
}: SectionSidebarProps) {
  const byKey = new Map((sections ?? []).map((section) => [section.key, section]));
  const percent = Math.max(0, Math.min(100, Math.round(percentComplete)));

  return (
    <aside className="vo-side" aria-label="Application progress">
      <div className="pp-stack" style={{ gap: 6 }}>
        <div className="pp-row" style={{ justifyContent: 'space-between' }}>
          <span className="pp-label">Your application</span>
          <span className="pp-small" style={{ fontVariantNumeric: 'tabular-nums' }}>{percent}% complete</span>
        </div>
        <div className="vo-progress" style={{ height: 8 }} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="vo-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ol className="vo-side-nav">
        {VENDOR_SECTION_KEYS.map((key, index) => {
          const section = byKey.get(key);
          const state = stateFor(key, section, touched);
          const current = key === currentSection;
          return (
            <li key={key}>
              <button
                type="button"
                className="vo-side-item"
                data-state={state}
                aria-current={current ? 'step' : undefined}
                onClick={() => onSelect(key)}
                disabled={disabled}
              >
                <span className="vo-side-node" aria-hidden>
                  {state === 'complete' ? <Check size={13} strokeWidth={2.5} /> : index + 1}
                </span>
                <span className="vo-side-label">{SECTION_LABELS[key]}</span>
                {state === 'attention' && <span className="vo-side-meta">{section?.missing.length}</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="vo-side-foot">
        {action.kind === 'review' && (
          <button type="button" className="pp-btn pp-btn--cobalt pp-btn--block" onClick={onReview} disabled={disabled}>
            Review & submit
          </button>
        )}
        {action.kind === 'accept-terms' && (
          <p className="pp-small">Accept the terms at the bottom of this page to unlock submission.</p>
        )}
        {action.kind === 'submit' && (
          <>
            {action.blockers.length > 0 && (
              <ul className="vo-side-blockers">
                {action.blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="pp-btn pp-btn--cobalt pp-btn--block"
              onClick={onSubmit}
              disabled={disabled || submitting || saving || action.blockers.length > 0}
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </>
        )}

        <Link href="/dashboard" className="pp-small" style={{ textAlign: 'center' }}>
          Save and finish later
        </Link>
      </div>
    </aside>
  );
}
