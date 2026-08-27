'use client'

import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  'Overview',
  'Expertise',
  'Credentials',
  'Projects',
  'Portfolio',
  'Preferences',
  'Submit',
];

interface ProgressStepperProps {
  currentStep: number;
}

/**
 * v2 progress rail: a mono-numbered node per step joined by a hairline that
 * fills in cobalt as the applicant advances. Deliberately lighter than the
 * legacy icon-and-description stepper so it reads as chrome, not content.
 */
export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <ol className="vo-rail" aria-label="Application progress">
      {STEPS.map((title, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <li
            key={title}
            className="vo-rail-step"
            data-state={isDone ? 'done' : isCurrent ? 'current' : 'todo'}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {index > 0 && <span className="vo-rail-line" aria-hidden />}
            <span className="vo-rail-node">
              {isDone ? <Check size={14} strokeWidth={3} /> : index + 1}
            </span>
            <span className="vo-rail-label">{title}</span>
          </li>
        );
      })}
    </ol>
  );
}
