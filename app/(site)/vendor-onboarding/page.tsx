'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import OverviewStep from '@/components/vendor-onboarding/OverviewStep';
import ExpertiseStep from '@/components/vendor-onboarding/ExpertiseStep';
import CredentialsStep from '@/components/vendor-onboarding/CredentialsStep';
import ProjectsStep from '@/components/vendor-onboarding/ProjectsStep';
import PortfolioStep from '@/components/vendor-onboarding/PortfolioStep';
import PreferencesStep from '@/components/vendor-onboarding/PreferencesStep';
import ReviewStep from '@/components/vendor-onboarding/ReviewStep';
import SubmittedStep from '@/components/vendor-onboarding/SubmittedStep';
import ProgressStepper from '@/components/vendor-onboarding/ProgressStepper';
import { Nav } from '@/components/site/Nav';
import { VendorOnboardingData } from '@/hooks/types/vendor-contracts';
import { vendorStepSchemas } from '@/lib/validations/vendor';
import { useAuth } from '@/components/providers/auth-provider';
import { useExpertApplication } from '@/features/experts/use-expert-application';
import {
  hydrateVendorOnboardingFromExpert,
  mapVendorOnboardingToExpertDraft,
} from '@/features/experts/onboarding-mappers';

const STEP_CONFIG = [
  {
    eyebrow: "Expert application",
    title: "Complete your expert profile",
    subtitle:
      "This helps us verify expertise and match you with the right projects.",
  },
  {
    eyebrow: "Expertise",
    title: "What you work on",
    subtitle: "Tell us what you work on so we can match you accurately.",
  },
  {
    eyebrow: "Credentials",
    title: "Credentials and experience",
    subtitle:
      "Add certifications and a quick overview of your background.",
  },
  {
    eyebrow: "Projects",
    title: "Project experience",
    subtitle: "Share the scope of your client work.",
  },
  {
    eyebrow: "Portfolio",
    title: "Portfolio and evidence",
    subtitle:
      "Upload materials that show your expertise. Choose what clients can see.",
  },
  {
    eyebrow: "Preferences",
    title: "Availability and preferences",
    subtitle: "Tell us how you want to work so we can match you well.",
  },
  {
    eyebrow: "Review",
    title: "Review and submit",
    subtitle:
      "Confirm everything is accurate before submitting for review.",
  },
  {
    eyebrow: "Submitted",
    title: "You're in review",
    subtitle:
      "Your profile is in review. You can still update details while we review it.",
  },
];

const INITIAL_FORM_DATA: VendorOnboardingData = {
  accountType: '',
  displayName: '',
  headline: '',
  categories: [],
  specializations: [],
  skills: [],
  platform: '',
  industry: '',
  industries: [],
  certificationFiles: [],
  manualCertifications: [],
  yearsExperience: '',
  openToAssessment: false,
  totalProjects: '',
  featuredProjects: [],
  portfolioFiles: [],
  portfolioLinks: [],
  introVideoLink: '',
  introVideoFile: null,
  visibilitySettings: {},
  timezone: '',
  regions: [],
  weeklyAvailability: '',
  earliestStartDate: '',
  preferredProjectTypes: [],
  whyPlatforms: '',
  agreements: [],
};

export default function VendorOnboardingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    getApplication,
    saveApplicationDraft,
    submitApplication,
    uploadProjectFile,
    uploadApplicationDocument,
  } = useExpertApplication();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<VendorOnboardingData>(INITIAL_FORM_DATA);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (authLoading || hydratedRef.current) return;
    hydratedRef.current = true;

    if (!user) return;

    void getApplication().then((result) => {
      if (result.ok && result.data) {
        const application = result.data;
        setFormData((current) => hydrateVendorOnboardingFromExpert(current, application));
      } else if (!result.ok) {
        setStepError(result.error.message);
      }
      setIsHydrating(false);
    });
  }, [authLoading, getApplication, user]);

  const onboardingLoading = authLoading || Boolean(user && isHydrating);

  const updateFormData = (updates: Partial<VendorOnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const persistDraft = async () => {
    if (!user) {
      setStepError('Sign in before saving your expert application.');
      return false;
    }

    setIsSaving(true);
    const result = await saveApplicationDraft(mapVendorOnboardingToExpertDraft(formData));
    setIsSaving(false);

    if (!result.ok) {
      setStepError(result.error.message);
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (currentStep === 7) {
      window.location.href = "/workspace";
      return;
    }

    // Validate current step before advancing
    const schema = vendorStepSchemas[currentStep];
    const result = schema.safeParse(formData);
    if (!result.success) {
      setStepError(result.error.errors[0]?.message || 'Please fill in all required fields');
      return;
    }
    setStepError(null);

    if (currentStep === 6) {
      if (!user) {
        setStepError('Sign in before submitting your expert application.');
        return;
      }
      if (!formData.agreements.every(Boolean)) {
        setStepError('Accept all agreements before submitting.');
        return;
      }

      setIsSaving(true);
      const result = await submitApplication(mapVendorOnboardingToExpertDraft(formData));
      setIsSaving(false);
      if (!result.ok) {
        setStepError(result.error.message);
        return;
      }
      setCurrentStep(7);
      return;
    }

    if (currentStep > 0 && !(await persistDraft())) return;
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getContinueLabel = () => {
    if (currentStep === 6) return "Submit for review";
    if (currentStep === 7) return "Go to dashboard";
    return "Continue";
  };

  const getBackLabel = () => {
    if (currentStep === 7) return "Edit profile";
    return "Back";
  };

  const handleBackAction = () => {
    if (currentStep === 7) {
      setCurrentStep(6);
      return;
    }
    handleBack();
  };

  const replaceFormData = (newData: VendorOnboardingData) => {
    setFormData(newData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep formData={formData} setFormData={replaceFormData} />;
      case 1:
        return <ExpertiseStep formData={formData} setFormData={replaceFormData} />;
      case 2:
        return (
          <CredentialsStep
            formData={formData}
            updateFormData={updateFormData}
            uploadDocument={(documentType, file) => uploadApplicationDocument(documentType, file)}
          />
        );
      case 3:
        return (
          <ProjectsStep
            formData={formData}
            updateFormData={updateFormData}
            uploadProjectFile={uploadProjectFile}
          />
        );
      case 4:
        return (
          <PortfolioStep
            formData={formData}
            setFormData={replaceFormData}
            uploadDocument={(documentType, file) => uploadApplicationDocument(documentType, file)}
          />
        );
      case 5:
        return <PreferencesStep formData={formData} setFormData={replaceFormData} />;
      case 6:
        return <ReviewStep formData={formData} setFormData={replaceFormData} onEditStep={(step: number) => setCurrentStep(step)} />;
      case 7:
        return <SubmittedStep formData={formData} />;
      default:
        return null;
    }
  };

  const step = STEP_CONFIG[currentStep];

  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />

      <main className="pp-page">
        <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-16) var(--sp-24)' }}>
          <div className="pp-glow" style={{ top: -180, left: '50%', marginLeft: -210 }} />

          <div className="pp-container-app">
            {/* ── Header ─────────────────────────────────────────── */}
            <div
              className="pp-stack pp-gap-4 pp-center pp-soften"
              style={{ alignItems: 'center', marginBottom: 'var(--sp-12)' }}
            >
              <p className="pp-label">
                {step.eyebrow}
                {currentStep < 7 ? ` — Step ${currentStep + 1} of 7` : ''}
              </p>
              <h1 className="pp-display pp-d2" style={{ maxWidth: '18ch' }}>
                {step.title}
              </h1>
              <p className="pp-lede" style={{ maxWidth: '54ch' }}>
                {step.subtitle}
              </p>
            </div>

            {/* ── Progress rail ──────────────────────────────────── */}
            <div style={{ maxWidth: 960, margin: '0 auto var(--sp-10)' }}>
              <ProgressStepper currentStep={currentStep} />
            </div>

            {/* ── Form panel ─────────────────────────────────────── */}
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
              <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                {onboardingLoading ? (
                  <p className="pp-body pp-center" style={{ paddingBlock: 'var(--sp-24)' }}>
                    Loading your application…
                  </p>
                ) : (
                  renderStepContent()
                )}

                {stepError && (
                  <p
                    role="alert"
                    className="pp-body"
                    style={{
                      marginTop: 'var(--sp-4)',
                      padding: '10px 14px',
                      borderRadius: 'var(--r-control)',
                      border: 'var(--bw) solid var(--color-error-200)',
                      background: 'var(--color-error-50)',
                      color: 'var(--color-error-700)',
                    }}
                  >
                    {stepError}
                  </p>
                )}

                <div
                  className="pp-stack pp-gap-3"
                  style={{ marginTop: 'var(--sp-8)' }}
                >
                  <button
                    type="button"
                    className="pp-btn pp-btn--cobalt pp-btn--block"
                    onClick={handleContinue}
                    disabled={onboardingLoading || isSaving}
                  >
                    {isSaving ? 'Saving…' : getContinueLabel()}
                  </button>

                  {(currentStep > 0 || currentStep === 7) && (
                    <button
                      type="button"
                      className="pp-btn pp-btn--ghost pp-btn--block"
                      onClick={handleBackAction}
                      disabled={isSaving}
                    >
                      {getBackLabel()}
                    </button>
                  )}
                </div>

                {currentStep === 6 && (
                  <p className="pp-small pp-center" style={{ marginTop: 'var(--sp-3)' }}>
                    We will email you if we need more information.
                  </p>
                )}
              </div>

              <p className="pp-small pp-center" style={{ marginTop: 'var(--sp-6)' }}>
                Your draft saves as you go. Questions? <Link href="/contact">Talk to the team</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
