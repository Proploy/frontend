'use client'

import React from 'react';
import {
  Flag,
  Tag,
  Award,
  Briefcase,
  Paperclip,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import ProgressSteps from '@/components/ui/ProgressSteps';
import type { ProgressStep } from '@/components/ui/ProgressSteps';

const steps: ProgressStep[] = [
  { icon: Flag, title: 'Overview', description: 'What you will complete' },
  { icon: Tag, title: 'Expertise', description: 'Platforms and industries' },
  { icon: Award, title: 'Credentials', description: 'Certs and experience' },
  { icon: Briefcase, title: 'Projects', description: 'Featured work' },
  { icon: Paperclip, title: 'Portfolio', description: 'Uploads and links' },
  { icon: Calendar, title: 'Preferences', description: 'Availability and fit' },
  { icon: CheckCircle, title: 'Submit', description: 'Review and agree' },
];

interface ProgressStepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return <ProgressSteps steps={steps} currentStep={currentStep} />;
}
