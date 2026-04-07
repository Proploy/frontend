"use client";

import { useState } from "react";
import OverviewStep from "@/components/vendor-onboarding/OverviewStep";
import ExpertiseStep from "@/components/vendor-onboarding/ExpertiseStep";
import CredentialsStep from "@/components/vendor-onboarding/CredentialsStep";
import ProjectsStep from "@/components/vendor-onboarding/ProjectsStep";
import PortfolioStep from "@/components/vendor-onboarding/PortfolioStep";
import PreferencesStep from "@/components/vendor-onboarding/PreferencesStep";
import ReviewStep from "@/components/vendor-onboarding/ReviewStep";
import SubmittedStep from "@/components/vendor-onboarding/SubmittedStep";
import ProgressStepper from "@/components/vendor-onboarding/ProgressStepper";
import Button from "@/components/ui/Button";

interface FormData {
  // Step 0 - Overview (no fields, just informational)

  // Step 1 - Expertise
  categories: string[];
  specializations: string[];
  skills: string[];

  // Step 2 - Credentials
  certifications: string[];
  yearsOfExperience: string;
  bio: string;

  // Step 3 - Projects
  projectTypes: string[];
  averageProjectSize: string;
  clientTypes: string[];
  completedProjectsCount: string;

  // Step 4 - Portfolio
  portfolioFiles: File[];
  portfolioLinks: string[];
  visibilitySettings: Record<string, boolean>;

  // Step 5 - Preferences
  availability: string;
  preferredWorkType: string;
  locationPreference: string;
  rateRange: string;
  startDate: string;

  // Step 6 - Review (no additional fields)
  // Step 7 - Submitted (no additional fields)
}

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

const INITIAL_FORM_DATA: FormData = {
  categories: [],
  specializations: [],
  skills: [],
  certifications: [],
  yearsOfExperience: "",
  bio: "",
  projectTypes: [],
  averageProjectSize: "",
  clientTypes: [],
  completedProjectsCount: "",
  portfolioFiles: [],
  portfolioLinks: [],
  visibilitySettings: {},
  availability: "",
  preferredWorkType: "",
  locationPreference: "",
  rateRange: "",
  startDate: "",
};

export default function VendorOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleContinue = () => {
    if (currentStep === 7) {
      // "Go to dashboard" action
      window.location.href = "/";
      return;
    }
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

  const replaceFormData = (newData: any) => {
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
        return <ProjectsStep formData={formData} updateFormData={updateFormData} />;
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
            {renderStepContent()}

            {/* Continue Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              className="w-full mt-8"
            >
              {getContinueLabel()}
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
