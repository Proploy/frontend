'use client'

import React, { useCallback, useState } from 'react';
import { Loader2, Plus, Upload } from 'lucide-react';
import Select from '@/components/ui/Select';
import { useProductList } from '@/features/catalog';
import type { UploadProjectFileResult } from '@/features/experts/use-expert-application';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface FeaturedProject {
  clientProjectId: string;
  title: string;
  clientIndustry: string;
  platform: string;
  delivered: string;
  outcome: string;
  link: string;
  ndaSafe: boolean;
  fileStorageKey?: string | null;
  fileName?: string | null;
  fileContentType?: string | null;
  fileSizeBytes?: number | null;
}

interface ProjectsFormData {
  totalProjects: string;
  featuredProjects: FeaturedProject[];
}

interface ProjectsStepProps {
  formData: VendorOnboardingData;
  updateFormData: (data: Partial<VendorOnboardingData>) => void;
  uploadProjectFile?: (
    clientProjectId: string,
    file: File,
  ) => Promise<UploadProjectFileResult>;
}

const emptyProject: FeaturedProject = {
  clientProjectId: '',
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

function createClientProjectId() {
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const industryOptions = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & E-commerce',
  'Manufacturing',
  'Consulting',
];

export default function ProjectsStep({
  formData,
  updateFormData,
  uploadProjectFile: uploadFile,
}: ProjectsStepProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { products, loading } = useProductList({ limit: 100, sort: 'name' });
  const platformOptions = products.map((product) => product.product_name);
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
    update({
      featuredProjects: [
        ...projects.featuredProjects,
        { ...emptyProject, clientProjectId: createClientProjectId() },
      ],
    });
  }, [projects.featuredProjects, update]);

  const removeProject = useCallback(
    (index: number) => {
      const next = [...projects.featuredProjects];
      next.splice(index, 1);
      update({ featuredProjects: next });
    },
    [projects.featuredProjects, update],
  );

  const uploadProjectFile = async (index: number, file: File | null) => {
    if (!file || !uploadFile) return;
    const project = projects.featuredProjects[index];
    const clientProjectId = project.clientProjectId || createClientProjectId();

    setUploadingIndex(index);
    setUploadError(null);
    const result = await uploadFile(clientProjectId, file);
    if (!result.ok) {
      setUploadError(result.error.message);
      setUploadingIndex(null);
      return;
    }

    try {
      updateProject(index, {
        clientProjectId,
        fileStorageKey: result.data.storageKey,
        fileName: result.data.fileName,
        fileContentType: result.data.fileContentType,
        fileSizeBytes: result.data.fileSizeBytes,
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Project file upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

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
          key={project.clientProjectId}
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
            <Select
              options={industryOptions.map((industry) => ({ value: industry, label: industry }))}
              value={project.clientIndustry}
              onChange={(value) => updateProject(idx, { clientIndustry: value })}
              placeholder="Select industry..."
              disabled={loading}
            />
          </div>

          {/* Platform used */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClasses}>
              Platform used <span className="text-red-500">*</span>
            </label>
            <Select
              options={platformOptions.map((platform) => ({ value: platform, label: platform }))}
              value={project.platform}
              onChange={(value) => updateProject(idx, { platform: value })}
              placeholder={loading ? 'Loading catalog...' : 'Select platform...'}
              disabled={loading}
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

          {uploadFile && (
            <div className="flex flex-col gap-[8px]">
              <label className={labelClasses}>Project evidence (optional)</label>
              <p className="text-[12px] leading-[18px] text-[#535862]">
                PDF, DOC, DOCX, TXT, PNG, or JPG. Max 5 MB per file.
              </p>
              <label className="flex cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-dashed border-[#b2ccff] bg-white px-[14px] py-[12px] text-[14px] font-semibold text-[#004eeb]">
                {uploadingIndex === idx ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploadingIndex === idx
                  ? 'Uploading…'
                  : project.fileName
                    ? `Replace ${project.fileName}`
                    : 'Upload project file'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  disabled={uploadingIndex === idx}
                  onChange={(event) => void uploadProjectFile(idx, event.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
              {project.fileName && (
                <div className="mt-[4px] rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[10px]">
                  <p className="text-[12px] font-medium leading-[18px] text-[#181d27]">
                    Uploaded document
                  </p>
                  <p className="text-[12px] leading-[18px] text-[#535862]">
                    {project.fileName}
                    {project.fileSizeBytes ? ` · ${Math.round(project.fileSizeBytes / 1024)} KB` : ''}
                  </p>
                </div>
              )}
            </div>
          )}

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

      {uploadError && (
        <p className="rounded-[8px] border border-[#fda29b] bg-[#fef3f2] px-[12px] py-[10px] text-[14px] text-[#b42318]">
          {uploadError}
        </p>
      )}

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
