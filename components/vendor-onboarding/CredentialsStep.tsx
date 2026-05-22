'use client'

import React, { useCallback, useRef } from 'react';
import { Upload, Trash2, Plus } from 'lucide-react';
import Select from '@/components/ui/Select';

interface UploadedFile {
  name: string;
  size: number;
}

interface CredentialsFormData {
  certificationFiles: UploadedFile[];
  manualCertifications: string[];
  yearsExperience: string;
  openToAssessment: boolean;
}

interface CredentialsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const experienceOptions = [
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '6–10 years',
  '10+ years',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CredentialsStep({ formData, updateFormData }: CredentialsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const credentials: CredentialsFormData = {
    certificationFiles: formData.certificationFiles ?? [],
    manualCertifications: formData.manualCertifications ?? [],
    yearsExperience: formData.yearsExperience ?? '',
    openToAssessment: formData.openToAssessment ?? false,
  };

  const update = useCallback(
    (patch: Partial<CredentialsFormData>) => {
      updateFormData(patch);
    },
    [updateFormData],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      update({
        certificationFiles: [...credentials.certificationFiles, ...newFiles],
      });
    },
    [credentials.certificationFiles, update],
  );

  const removeFile = useCallback(
    (index: number) => {
      const next = [...credentials.certificationFiles];
      next.splice(index, 1);
      update({ certificationFiles: next });
    },
    [credentials.certificationFiles, update],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const addManualCertification = useCallback(() => {
    update({
      manualCertifications: [...credentials.manualCertifications, ''],
    });
  }, [credentials.manualCertifications, update]);

  return (
    <div className="flex flex-col gap-[24px]">
      {/* ─── Section 1: Badges / Certifications ─── */}
      <div className="flex flex-col gap-[16px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[28px] text-[#181d27]">
          Partner badges or certifications
        </h3>

        {/* File upload drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          className="flex flex-col items-center justify-center gap-[8px] h-[176px] bg-white border-2 border-dashed border-[#d5d7da] rounded-[8px] cursor-pointer hover:border-[#155eef] transition-colors"
        >
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[#f5f5f6]">
            <Upload size={20} className="text-[#535862]" />
          </div>
          <p className="font-[family-name:var(--font-inter)] font-normal text-[16px] leading-[24px] text-[#414651]">
            Drag and drop files here, or <span className="text-[#155eef] font-medium">browse</span>
          </p>
          <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
            PDF, PNG, or JPG. Max 25 MB each.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Uploaded file rows */}
        {credentials.certificationFiles.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center justify-between bg-[#f5f5f6] rounded-[8px] h-[64px] px-[12px]"
          >
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#181d27]">
                {file.name}
              </span>
              <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[12px] leading-[18px] text-[#535862]">
                {formatFileSize(file.size)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeFile(idx)}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-[8px] hover:bg-[#e9eaeb] transition-colors"
              aria-label={`Remove ${file.name}`}
            >
              <Trash2 size={18} className="text-[#717680]" />
            </button>
          </div>
        ))}

        {/* Divider with "or" */}
        <div className="flex items-center gap-[12px]">
          <div className="flex-1 h-px bg-[#e9eaeb]" />
          <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#717680]">
            or
          </span>
          <div className="flex-1 h-px bg-[#e9eaeb]" />
        </div>

        {/* Manual certification inputs */}
        {credentials.manualCertifications.map((cert, idx) => (
          <div key={idx} className="flex items-center gap-[8px]">
            <input
              type="text"
              value={cert}
              placeholder="e.g., HubSpot Solutions Partner"
              onChange={(e) => {
                const next = [...credentials.manualCertifications];
                next[idx] = e.target.value;
                update({ manualCertifications: next });
              }}
              className="flex-1 h-[44px] px-[14px] bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#155eef] transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                const next = [...credentials.manualCertifications];
                next.splice(idx, 1);
                update({ manualCertifications: next });
              }}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-[8px] hover:bg-[#f5f5f6] transition-colors"
              aria-label="Remove certification"
            >
              <Trash2 size={18} className="text-[#717680]" />
            </button>
          </div>
        ))}

        {/* Add certification manually link */}
        <button
          type="button"
          onClick={addManualCertification}
          className="flex items-center gap-[6px] self-start font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#155eef] hover:text-[#1249c4] transition-colors"
        >
          <Plus size={18} />
          Add certification manually
        </button>
      </div>

      {/* ─── Section 2: Years of experience ─── */}
      <Select
        label="Years of hands-on experience"
        required
        options={experienceOptions.map((opt) => ({ value: opt, label: opt }))}
        value={credentials.yearsExperience}
        onChange={(val) => update({ yearsExperience: val })}
        placeholder="Select range"
      />

      {/* ─── Section 3: Skills assessment ─── */}
      <div className="flex flex-col gap-[8px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[28px] text-[#181d27]">
          Optional skills assessment
        </h3>

        <label className="flex items-start gap-[10px] cursor-pointer">
          <input
            type="checkbox"
            checked={credentials.openToAssessment}
            onChange={(e) => update({ openToAssessment: e.target.checked })}
            className="mt-[3px] w-[18px] h-[18px] rounded-[4px] border border-[#d5d7da] accent-[#155eef] cursor-pointer"
          />
          <div className="flex flex-col gap-[2px]">
            <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#414651]">
              I am open to a quick skills assessment
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
              This may speed up approval.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
