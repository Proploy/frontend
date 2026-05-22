'use client'

import React, { useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { VendorOnboardingData, FeaturedProject } from '@/hooks/types/vendor-contracts';

interface ProjectsFormData {
  totalProjects: string;
  featuredProjects: FeaturedProject[];
}

interface ProjectsStepProps {
  formData: VendorOnboardingData;
  updateFormData: (data: Partial<VendorOnboardingData>) => void;
}

const emptyProject: FeaturedProject = {
  title: '',
  clientIndustry: '',
  platform: '',
  delivered: '',
  outcome: '',
  link: '',
  ndaSafe: false,
};

const inputClasses =
  'w-full h-[44px] px-[14px] bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#155eef] transition-colors';

const labelClasses =
  'font-[family-name:var(--font-inter)] font-medium text-[14px] leading-[20px] text-[#414651]';

const textareaBase =
  'w-full px-[14px] py-[10px] bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#155eef] transition-colors resize-none';

export default function ProjectsStep({ formData, updateFormData }: ProjectsStepProps) {
  const projects: ProjectsFormData = {
    totalProjects: formData.totalProjects ?? '',
    featuredProjects: formData.featuredProjects ?? [],
  };

  const update = useCallback(
    (patch: Partial<ProjectsFormData>) => {
      updateFormData(patch);
    },
    [updateFormData],
  );

  const updateProject = useCallback(
    (index: number, patch: Partial<FeaturedProject>) => {
      const next = [...projects.featuredProjects];
      next[index] = { ...next[index], ...patch };
      update({ featuredProjects: next });
    },
    [projects.featuredProjects, update],
  );

  const addProject = useCallback(() => {
    if (projects.featuredProjects.length >= 3) return;
    update({ featuredProjects: [...projects.featuredProjects, { ...emptyProject }] });
  }, [projects.featuredProjects, update]);

  const removeProject = useCallback(
    (index: number) => {
      const next = [...projects.featuredProjects];
      next.splice(index, 1);
      update({ featuredProjects: next });
    },
    [projects.featuredProjects, update],
  );

  return (
    <div className="flex flex-col gap-[24px]">
      {/* ─── Total client projects ─── */}
      <div className="flex flex-col gap-[6px]">
        <label className={labelClasses}>
          Total client projects completed <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={projects.totalProjects}
          onChange={(e) => update({ totalProjects: e.target.value })}
          placeholder="e.g. 12"
          className={inputClasses}
        />
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
          Count paid client work, not personal practice projects.
        </p>
      </div>

      {/* ─── Featured projects heading ─── */}
      <div className="flex flex-col gap-[4px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[28px] text-[#181d27]">
          Featured projects (optional, up to 3)
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
          Add your strongest freelance projects.
        </p>
      </div>

      {/* ─── Project cards ─── */}
      {projects.featuredProjects.map((project, idx) => (
        <div
          key={idx}
          className="bg-[#f5f5f6] rounded-[12px] p-[20px] flex flex-col gap-[16px]"
        >
          {/* Card header */}
          <div className="flex items-center justify-between">
            <h4 className="font-[family-name:var(--font-dm-sans)] font-medium text-[18px] leading-[26px] text-[#181d27]">
              Project {idx + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeProject(idx)}
              className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#717680] hover:text-[#414651] transition-colors"
            >
              Remove
            </button>
          </div>

          {/* Project title */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>
              Project title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProject(idx, { title: e.target.value })}
              placeholder="e.g., CRM Migration for SaaS Company"
              className={inputClasses}
            />
          </div>

          {/* Client industry */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>Client industry</label>
            <input
              type="text"
              value={project.clientIndustry}
              onChange={(e) => updateProject(idx, { clientIndustry: e.target.value })}
              placeholder="e.g., SaaS"
              className={inputClasses}
            />
          </div>

          {/* Platform used */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>
              Platform used <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={project.platform}
              onChange={(e) => updateProject(idx, { platform: e.target.value })}
              placeholder="e.g., HubSpot"
              className={inputClasses}
            />
          </div>

          {/* What you delivered */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>
              What you delivered <span className="text-red-500">*</span>
            </label>
            <textarea
              value={project.delivered}
              onChange={(e) => updateProject(idx, { delivered: e.target.value })}
              placeholder="Describe what you built or delivered"
              className={textareaBase}
              style={{ height: 98 }}
            />
          </div>

          {/* Outcome or impact */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>Outcome or impact (optional)</label>
            <textarea
              value={project.outcome}
              onChange={(e) => updateProject(idx, { outcome: e.target.value })}
              placeholder="Share the results or impact"
              className={textareaBase}
              style={{ height: 74 }}
            />
          </div>

          {/* Link */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>Link (optional)</label>
            <input
              type="url"
              value={project.link}
              onChange={(e) => updateProject(idx, { link: e.target.value })}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>

          {/* NDA-safe toggle */}
          <label className="flex items-center gap-[10px] cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={project.ndaSafe}
              onClick={() => updateProject(idx, { ndaSafe: !project.ndaSafe })}
              className={`relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full transition-colors ${
                project.ndaSafe ? 'bg-[#155eef]' : 'bg-[#d5d7da]'
              }`}
            >
              <span
                className={`inline-block h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-transform ${
                  project.ndaSafe ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
            <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#414651]">
              This description is NDA safe
            </span>
          </label>
        </div>
      ))}

      {/* Add featured project link */}
      {projects.featuredProjects.length < 3 && (
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-[6px] self-start font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#155eef] hover:text-[#1249c4] transition-colors"
        >
          <Plus size={18} />
          Add featured project
        </button>
      )}
    </div>
  );
}