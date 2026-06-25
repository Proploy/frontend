'use client';

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
import Button from '@/components/ui/Button';
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
    title: "Complete your vendor profile",
    subtitle:
      "This helps us verify expertise and match you with the right projects.",
  },
  {
    title: "Your expertise",
    subtitle: "Tell us what you work on so we can match you accurately.",
  },
  {
    title: "Credentials and experience",
    subtitle:
      "Add certifications and a quick overview of your background.",
  },
  {
    title: "Project experience",
    subtitle: "Share the scope of your client work.",
  },
  {
    title: "Portfolio and evidence",
    subtitle:
      "Upload materials that show your expertise. Choose what clients can see.",
  },
  {
    title: "Availability and preferences",
    subtitle: "Tell us how you want to work so we can match you well.",
  },
  {
    title: "Review and submit",
    subtitle:
      "Confirm everything is accurate before submitting for review.",
  },
  {
    title: "Submitted \u{1F389}",
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
    getProjectFileUploadUrl,
    uploadProjectFileToSignedUrl,
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
      window.location.href = "/experts/dashboard";
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
        return <CredentialsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return (
          <ProjectsStep
            formData={formData}
            updateFormData={updateFormData}
            getUploadUrl={getProjectFileUploadUrl}
            uploadToSignedUrl={uploadProjectFileToSignedUrl}
          />
        );
      case 4:
        return <PortfolioStep formData={formData} setFormData={replaceFormData} />;
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

  return (
    <div className="min-h-screen bg-white pt-[120px]">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="flex flex-col items-center">
          {/* Proploy Logomark */}
          <img src="/proploy-logomark.png" alt="Proploy" className="mb-6 h-12 w-12" />

          {/* Title */}
          <h1 className="mb-2 text-center font-[family-name:var(--font-dm-sans)] text-[30px] font-semibold leading-tight text-[#181d27]">
            {STEP_CONFIG[currentStep].title}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-center font-[family-name:var(--font-dm-sans)] text-[16px] font-normal leading-relaxed text-[#535862]">
            {STEP_CONFIG[currentStep].subtitle}
          </p>

          {/* Form Content Area */}
          <div className="w-full max-w-[840px]">
            {onboardingLoading ? (
              <div className="py-[96px] text-center text-[16px] text-[#717680]">
                Loading your application…
              </div>
            ) : renderStepContent()}

            {/* Step error message */}
            {stepError && (
              <p className="mt-4 text-center font-[family-name:var(--font-dm-sans)] text-[14px] font-normal text-[#dc2626]">
                {stepError}
              </p>
            )}

            {/* Continue Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={onboardingLoading || isSaving}
              className="w-full mt-8"
            >
              {isSaving ? 'Saving…' : getContinueLabel()}
            </Button>

            {/* Review step note */}
            {currentStep === 6 && (
              <p className="mt-3 text-center font-[family-name:var(--font-dm-sans)] text-[14px] font-normal text-[#535862]">
                We will email you if we need more information.
              </p>
            )}

            {/* Back Link */}
            {(currentStep > 0 || currentStep === 7) && (
              <Button
                variant="link-color"
                size="lg"
                onClick={handleBackAction}
                className="w-full mt-3"
              >
                {getBackLabel()}
              </Button>
            )}

            {/* Progress Stepper */}
            <div className="mt-10 mb-10">
              <ProgressStepper currentStep={currentStep} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
