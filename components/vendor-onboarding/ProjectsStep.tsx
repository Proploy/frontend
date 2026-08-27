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
    <div className="vo-step">
      {/* ─── Total client projects ─── */}
      <div className="pp-field">
        <label htmlFor="vo-total-projects">
          Total client projects completed <span className="vo-req">*</span>
        </label>
        <input
          id="vo-total-projects"
          type="text"
          inputMode="numeric"
          value={projects.totalProjects}
          onChange={(e) => update({ totalProjects: e.target.value })}
          placeholder="e.g. 12"
          className="pp-input"
        />
        <p className="pp-small">Count paid client work, not personal practice projects.</p>
      </div>

      {/* ─── Featured projects heading ─── */}
      <div className="pp-stack" style={{ gap: 4 }}>
        <p className="pp-label">Optional — up to 3</p>
        <p className="pp-h6">Featured projects</p>
        <p className="pp-small">Add your strongest client projects.</p>
      </div>

      {/* ─── Project cards ─── */}
      {projects.featuredProjects.map((project, idx) => (
        <div key={idx} className="vo-subcard">
          {/* Card header */}
          <div className="vo-subcard-head">
            <p className="pp-h6">
              <span className="pp-mono-num pp-accent">{String(idx + 1).padStart(2, '0')}</span>
              {'  '}Project
            </p>
            <button type="button" onClick={() => removeProject(idx)} className="pp-btn pp-btn--ghost pp-btn--sm">
              Remove
            </button>
          </div>

          {/* Project title */}
          <div className="pp-field">
            <label>
              Project title <span className="vo-req">*</span>
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProject(idx, { title: e.target.value })}
              placeholder="e.g., CRM Migration for SaaS Company"
              className="pp-input"
            />
          </div>

          {/* Client industry */}
          <Select
            label="Client industry"
            options={industryOptions.map((industry) => ({ value: industry, label: industry }))}
            value={project.clientIndustry}
            onChange={(value) => updateProject(idx, { clientIndustry: value })}
            placeholder="Select industry..."
            disabled={loading}
          />

          {/* Platform used */}
          <Select
            label="Platform used"
            required
            options={platformOptions.map((platform) => ({ value: platform, label: platform }))}
            value={project.platform}
            onChange={(value) => updateProject(idx, { platform: value })}
            placeholder={loading ? 'Loading catalog...' : 'Select platform...'}
            disabled={loading}
          />

          {/* What you delivered */}
          <div className="pp-field">
            <label>
              What you delivered <span className="vo-req">*</span>
            </label>
            <textarea
              value={project.delivered}
              onChange={(e) => updateProject(idx, { delivered: e.target.value })}
              placeholder="Describe what you built or delivered"
              className="pp-textarea"
              style={{ minHeight: 98 }}
            />
          </div>

          {/* Outcome or impact */}
          <div className="pp-field">
            <label>Outcome or impact (optional)</label>
            <textarea
              value={project.outcome}
              onChange={(e) => updateProject(idx, { outcome: e.target.value })}
              placeholder="Share the results or impact"
              className="pp-textarea"
              style={{ minHeight: 78 }}
            />
          </div>

          {/* Link */}
          <div className="pp-field">
            <label>Link (optional)</label>
            <input
              type="url"
              value={project.link}
              onChange={(e) => updateProject(idx, { link: e.target.value })}
              placeholder="https://..."
              className="pp-input"
            />
          </div>

          {uploadFile && (
            <div className="pp-field">
              <label>Project evidence (optional)</label>
              <p className="pp-small">PDF, DOC, DOCX, TXT, PNG, or JPG. Max 5 MB per file.</p>
              <label className="vo-drop" style={{ paddingBlock: 'var(--sp-5)' }}>
                <span className="pp-link-arrow" style={{ pointerEvents: 'none' }}>
                  {uploadingIndex === idx ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploadingIndex === idx
                    ? 'Uploading…'
                    : project.fileName
                      ? `Replace ${project.fileName}`
                      : 'Upload project file'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  disabled={uploadingIndex === idx}
                  onChange={(event) => void uploadProjectFile(idx, event.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
              {project.fileName && (
                <div className="vo-row">
                  <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
                    <span className="vo-row-name">{project.fileName}</span>
                    <span className="vo-row-meta">
                      Uploaded
                      {project.fileSizeBytes ? ` · ${Math.round(project.fileSizeBytes / 1024)} KB` : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NDA-safe toggle */}
          <div className="pp-row pp-gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={project.ndaSafe}
              onClick={() => updateProject(idx, { ndaSafe: !project.ndaSafe })}
              className="vo-switch"
              aria-label="This description is NDA safe"
            >
              <span />
            </button>
            <span className="pp-body" style={{ color: 'var(--ink)' }}>This description is NDA safe</span>
          </div>
        </div>
      ))}

      {uploadError && <p className="vo-error">{uploadError}</p>}

      {/* Add featured project link */}
      {projects.featuredProjects.length < 3 && (
        <button type="button" onClick={addProject} className="pp-link-arrow" style={{ alignSelf: 'flex-start' }}>
          <Plus size={16} />
          Add featured project
        </button>
      )}
    </div>
  );
}
