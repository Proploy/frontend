'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import IdentitySection from '@/components/vendor-onboarding/IdentitySection';
import ProductsSection from '@/components/vendor-onboarding/ProductsSection';
import ExperienceSection from '@/components/vendor-onboarding/ExperienceSection';
import SocialsSection from '@/components/vendor-onboarding/SocialsSection';
import EvidenceSection from '@/components/vendor-onboarding/EvidenceSection';
import AvailabilitySection from '@/components/vendor-onboarding/AvailabilitySection';
import AgreementsSection from '@/components/vendor-onboarding/AgreementsSection';
import SectionSidebar, { SECTION_LABELS, type SidebarAction } from '@/components/vendor-onboarding/SectionSidebar';
import StatusBanner from '@/components/vendor-onboarding/StatusBanner';
import { Nav } from '@/components/site/Nav';
import {
  EMPTY_VENDOR_ONBOARDING_DATA,
  VENDOR_SECTION_KEYS,
  isVendorSectionKey,
  type VendorOnboardingData,
  type VendorSectionKey,
} from '@/hooks/types/vendor-contracts';
import { getSectionHints } from '@/lib/validations/vendor';
import { useAuth } from '@/components/providers/auth-provider';
import { useExpertApplication } from '@/features/experts/use-expert-application';
import { useExpertSelf } from '@/features/experts/use-expert-self';
import { notifyExpertApplicationChanged } from '@/features/experts/use-expert-application-stage';
import type { ExpertApplicationStatus, ExpertMe } from '@/features/experts/types';
import {
  hydrateVendorOnboardingFromExpert,
  mapVendorOnboardingToExpertDraft,
  reconcileVendorOnboardingIds,
} from '@/features/experts/onboarding-mappers';

const SECTION_SUBTITLES: Record<VendorSectionKey, string> = {
  identity: 'Your photo, name and headline are the first thing buyers see.',
  products: 'Pick the products you implement. Each one carries its own depth and certifications.',
  experience: 'A quick overview of your background and what sets you apart.',
  socials: 'Where clients can learn more about you.',
  evidence: 'Featured projects, an intro video and portfolio files. Choose what clients can see.',
  availability: 'Where you are, where you serve, and how much time you have.',
  agreements: 'Check what is left, then submit. You can submit as soon as the essentials are in.',
};

/** Debounce for autosave after the last edit. */
const AUTOSAVE_DELAY_MS = 1500;

const KNOWN_STATUSES: readonly ExpertApplicationStatus[] = [
  'draft',
  'submitted',
  'changes_requested',
  'approved',
  'rejected',
];

function asStatus(value: string | null | undefined): ExpertApplicationStatus | null {
  return (KNOWN_STATUSES as readonly string[]).includes(value ?? '')
    ? (value as ExpertApplicationStatus)
    : null;
}

function resumeSection(expert: ExpertMe | null): VendorSectionKey {
  const status = asStatus(expert?.status);
  if (status === 'submitted' || status === 'approved') return 'agreements';
  return isVendorSectionKey(expert?.lastStepKey) ? expert.lastStepKey : 'identity';
}

export default function VendorOnboardingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    getApplication,
    saveApplicationDraft,
    submitApplication,
    uploadProjectFile,
    uploadApplicationDocument,
  } = useExpertApplication();
  const { restoreApplication } = useExpertSelf();

  const [section, setSection] = useState<VendorSectionKey>('identity');
  const [formData, setFormDataState] = useState<VendorOnboardingData>(EMPTY_VENDOR_ONBOARDING_DATA);
  const [expert, setExpert] = useState<ExpertMe | null>(null);
  const [touched, setTouched] = useState<ReadonlySet<VendorSectionKey>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const hydratedRef = useRef(false);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const queuedRef = useRef(false);
  const formRef = useRef(formData);
  const sectionRef = useRef(section);
  formRef.current = formData;
  sectionRef.current = section;

  const status = asStatus(expert?.status);
  const progress = expert?.progress ?? null;
  const readOnly = status === 'submitted' || status === 'approved';
  const loading = authLoading || Boolean(user && isHydrating);

  const applyExpert = useCallback((next: ExpertMe) => {
    setExpert(next);
    const reconciled = reconcileVendorOnboardingIds(formRef.current, next);
    if (reconciled.form !== formRef.current) {
      formRef.current = reconciled.form;
      setFormDataState(reconciled.form);
    }
    if (reconciled.certificationLinksChanged) dirtyRef.current = true;
  }, []);

  useEffect(() => {
    if (authLoading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (!user) {
      setIsHydrating(false);
      return;
    }

    void getApplication().then((result) => {
      if (result.ok && result.data) {
        const hydrated = hydrateVendorOnboardingFromExpert(EMPTY_VENDOR_ONBOARDING_DATA, result.data);
        formRef.current = hydrated;
        setFormDataState(hydrated);
        setExpert(result.data);
        setSection(resumeSection(result.data));
      } else if (!result.ok) {
        setError(result.error.message);
      }
      setIsHydrating(false);
    });
  }, [authLoading, getApplication, user]);

  const persistDraft = useCallback(async (): Promise<boolean> => {
    if (!user || readOnly) return false;
    if (savingRef.current) {
      queuedRef.current = true;
      return true;
    }
    savingRef.current = true;
    dirtyRef.current = false;
    setIsSaving(true);
    let succeeded = false;
    try {
      const payload = mapVendorOnboardingToExpertDraft(formRef.current, { lastStepKey: sectionRef.current });
      const result = await saveApplicationDraft(payload);
      if (!result.ok) {
        dirtyRef.current = true;
        setError(result.error.message);
        return false;
      }
      setError(null);
      setHasSaved(true);
      applyExpert(result.data);
      notifyExpertApplicationChanged();
      succeeded = true;
      return true;
    } finally {
      savingRef.current = false;
      setIsSaving(false);
      // Follow-up save only for edits made mid-flight or a reconcile that
      // assigned new link ids. A failed save waits for the next edit.
      const followUp = queuedRef.current || (succeeded && dirtyRef.current);
      queuedRef.current = false;
      if (followUp) void persistDraft();
    }
  }, [applyExpert, readOnly, saveApplicationDraft, user]);

  const setFormData = useCallback((next: VendorOnboardingData) => {
    formRef.current = next;
    dirtyRef.current = true;
    setFormDataState(next);
  }, []);

  // Autosave: every section persists shortly after the last edit, including
  // the first one, so reopening the page resumes with nothing lost.
  useEffect(() => {
    if (!user || readOnly || loading || !dirtyRef.current) return;
    const timer = setTimeout(() => {
      if (dirtyRef.current) void persistDraft();
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [formData, loading, persistDraft, readOnly, user]);

  const markTouched = useCallback((key: VendorSectionKey) => {
    setTouched((current) => (current.has(key) ? current : new Set(current).add(key)));
  }, []);

  const goTo = useCallback(
    (next: VendorSectionKey) => {
      markTouched(sectionRef.current);
      setSection(next);
      setError(null);
      if (dirtyRef.current) void persistDraft();
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [markTouched, persistDraft],
  );

  const sectionIndex = VENDOR_SECTION_KEYS.indexOf(section);
  const previousSection = sectionIndex > 0 ? VENDOR_SECTION_KEYS[sectionIndex - 1] : null;
  const nextSection =
    sectionIndex < VENDOR_SECTION_KEYS.length - 1 ? VENDOR_SECTION_KEYS[sectionIndex + 1] : null;

  const hints = useMemo(
    () => (touched.has(section) ? getSectionHints(section, formData) : []),
    [formData, section, touched],
  );

  const termsAccepted = Boolean(formData.agreements[0] && formData.agreements[1]);
  // The terms are the one client-side blocker; the server lists the rest.
  const blockers = (progress?.submitBlockers ?? []).filter((blocker) => !/terms/i.test(blocker));
  const canSubmit = Boolean(user) && !readOnly && termsAccepted && Boolean(expert) && blockers.length === 0;

  // Submission is never offered ahead of time: the sidebar sends the
  // applicant to the review section, and only accepted terms unlock Submit.
  const sidebarAction: SidebarAction = readOnly || !user
    ? { kind: 'none' }
    : section !== 'agreements'
    ? { kind: 'review' }
    : termsAccepted
    ? { kind: 'submit', blockers }
    : { kind: 'accept-terms' };
  const submitLabel = status === 'changes_requested' ? 'Resubmit application' : 'Submit application';

  const handleSubmit = async () => {
    if (!user) {
      setError('Sign in before submitting your expert application.');
      return;
    }
    if (!termsAccepted) {
      setError('Accept the vendor terms and privacy policy before submitting.');
      markTouched('agreements');
      setSection('agreements');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitApplication(
        mapVendorOnboardingToExpertDraft(formRef.current, { lastStepKey: 'agreements' }),
      );
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      dirtyRef.current = false;
      applyExpert(result.data);
      setSection('agreements');
      notifyExpertApplicationChanged();
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setError(null);
    try {
      const result = await restoreApplication();
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      const refreshed = await getApplication();
      if (refreshed.ok && refreshed.data) {
        applyExpert(refreshed.data);
        setSection(resumeSection(refreshed.data));
      }
      notifyExpertApplicationChanged();
    } finally {
      setIsRestoring(false);
    }
  };

  const renderSection = () => {
    switch (section) {
      case 'identity':
        return <IdentitySection formData={formData} setFormData={setFormData} readOnly={readOnly} />;
      case 'products':
        return (
          <ProductsSection
            formData={formData}
            setFormData={setFormData}
            uploadDocument={(documentType, file) => uploadApplicationDocument(documentType, file)}
            readOnly={readOnly}
          />
        );
      case 'experience':
        return <ExperienceSection formData={formData} setFormData={setFormData} readOnly={readOnly} />;
      case 'socials':
        return <SocialsSection formData={formData} setFormData={setFormData} readOnly={readOnly} />;
      case 'evidence':
        return (
          <EvidenceSection
            formData={formData}
            setFormData={setFormData}
            uploadProjectFile={uploadProjectFile}
            uploadDocument={(documentType, file) => uploadApplicationDocument(documentType, file)}
            readOnly={readOnly}
          />
        );
      case 'availability':
        return <AvailabilitySection formData={formData} setFormData={setFormData} readOnly={readOnly} />;
      case 'agreements':
        return (
          <AgreementsSection
            formData={formData}
            setFormData={setFormData}
            progress={progress}
            onEditSection={goTo}
            onSubmit={canSubmit ? handleSubmit : undefined}
            submitting={isSubmitting}
            submitLabel={submitLabel}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  const saveStatus = isSaving
    ? 'Saving…'
    : hasSaved
    ? 'Draft saved'
    : user
    ? 'Your draft saves as you go.'
    : 'Sign in to save your draft.';

  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />

      <main className="pp-page">
        <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-16) var(--sp-24)' }}>
          <div className="pp-glow" style={{ top: -180, left: '50%', marginLeft: -210 }} />

          <div className="pp-container-app">
            {/* ── Header + status: full width, above the two columns ── */}
            <div className="pp-stack pp-gap-5" style={{ marginBottom: 'var(--sp-6)' }}>
              <div className="pp-stack pp-gap-2 pp-soften">
                <p className="pp-label">Expert application</p>
                <h1 className="pp-display pp-d3">
                  {section === 'agreements' && readOnly ? 'Your application' : SECTION_LABELS[section]}
                </h1>
                <p className="pp-lede" style={{ maxWidth: '54ch' }}>{SECTION_SUBTITLES[section]}</p>
              </div>

              {!loading && (
                <StatusBanner
                  status={status}
                  progress={progress}
                  submittedAt={expert?.submittedAt}
                  onRestore={status === 'rejected' ? handleRestore : undefined}
                  restoring={isRestoring}
                />
              )}
            </div>

            {/* ── Sidebar and card share the same top edge ─────────── */}
            <div className="vo-layout">
              <SectionSidebar
                currentSection={section}
                sections={progress?.sections}
                percentComplete={progress?.percentComplete ?? 0}
                touched={touched}
                onSelect={goTo}
                action={sidebarAction}
                onReview={() => goTo('agreements')}
                onSubmit={handleSubmit}
                saveStatus={saveStatus}
                saving={isSaving}
                submitting={isSubmitting}
                disabled={loading}
              />

              <div className="pp-stack pp-gap-5" style={{ minWidth: 0 }}>
                <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                  {loading ? (
                    <p className="pp-body pp-center" style={{ paddingBlock: 'var(--sp-24)' }}>
                      Loading your application…
                    </p>
                  ) : (
                    renderSection()
                  )}

                  {hints.length > 0 && !readOnly && (
                    <ul className="vo-hints" style={{ marginTop: 'var(--sp-5)' }} aria-live="polite">
                      {hints.map((hint) => (
                        <li key={hint} className="pp-row pp-gap-2">
                          <AlertCircle size={14} aria-hidden />
                          {hint}
                        </li>
                      ))}
                    </ul>
                  )}

                  {error && (
                    <p role="alert" className="vo-error" style={{ marginTop: 'var(--sp-4)' }}>
                      {error}
                    </p>
                  )}

                  <div
                    className="pp-row pp-gap-3"
                    style={{ marginTop: 'var(--sp-8)', justifyContent: 'space-between', flexWrap: 'wrap' }}
                  >
                    {previousSection ? (
                      <button type="button" className="pp-btn pp-btn--ghost" onClick={() => goTo(previousSection)} disabled={loading}>
                        <ArrowLeft size={16} aria-hidden />
                        {SECTION_LABELS[previousSection]}
                      </button>
                    ) : (
                      <span />
                    )}
                    {nextSection ? (
                      <button type="button" className="pp-btn pp-btn--cobalt" onClick={() => goTo(nextSection)} disabled={loading}>
                        Continue to {SECTION_LABELS[nextSection]}
                        <ArrowRight size={16} aria-hidden />
                      </button>
                    ) : readOnly ? (
                      <Link href={status === 'approved' ? '/workspace' : '/dashboard'} className="pp-btn pp-btn--cobalt">
                        {status === 'approved' ? 'Go to workspace' : 'Go to dashboard'}
                      </Link>
                    ) : null}
                  </div>
                </div>

                <p className="pp-small">
                  Questions? <Link href="/contact">Talk to the team</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
