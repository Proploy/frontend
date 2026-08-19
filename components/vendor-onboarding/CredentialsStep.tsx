'use client'

import React, { useCallback, useRef, useState } from 'react';
import { Upload, Trash2, Plus } from 'lucide-react';
import Select from '@/components/ui/Select';
import type { UploadApplicationDocumentResult } from '@/features/experts/use-expert-application';
import type { UploadedApplicationFile, VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface CredentialsFormData {
  certificationFiles: UploadedApplicationFile[];
  manualCertifications: string[];
  yearsExperience: string;
  openToAssessment: boolean;
}

interface CredentialsStepProps {
  formData: VendorOnboardingData;
  updateFormData: (data: Partial<VendorOnboardingData>) => void;
  uploadDocument: (documentType: 'certification', file: File) => Promise<UploadApplicationDocumentResult>;
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

export default function CredentialsStep({ formData, updateFormData, uploadDocument }: CredentialsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const credentials: CredentialsFormData = {
    certificationFiles: formData.certificationFiles ?? [],
    manualCertifications: formData.manualCertifications ?? [],
    yearsExperience: formData.yearsExperience ?? '',
    openToAssessment: formData.openToAssessment ?? false,
  };

  const [localCerts, setLocalCerts] = useState(() =>
    credentials.manualCertifications.map((value) => ({ id: crypto.randomUUID(), value }))
  );

  const update = useCallback(
    (patch: Partial<CredentialsFormData>) => {
      updateFormData(patch);
    },
    [updateFormData],
  );

  const updateLocalCerts = useCallback((next: { id: string; value: string }[]) => {
    setLocalCerts(next);
    update({ manualCertifications: next.map((c) => c.value) });
  }, [update]);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || isUploading) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const uploaded: UploadedApplicationFile[] = [];

      for (const file of Array.from(files)) {
        const result = await uploadDocument('certification', file);
        if (!result.ok) {
          setUploadError(result.error.message);
          continue;
        }
        uploaded.push({
          name: result.data.fileName,
          size: result.data.fileSizeBytes,
          fileContentType: result.data.fileContentType,
          storageKey: result.data.storageKey,
          visible: true,
        });
      }

      if (uploaded.length > 0) {
        update({ certificationFiles: [...credentials.certificationFiles, ...uploaded] });
      }
    } finally {
      setIsUploading(false);
    }
  }, [credentials.certificationFiles, isUploading, update, uploadDocument]);

  const removeFile = useCallback(
    (index: number) => {
      const next = [...credentials.certificationFiles];
      next.splice(index, 1);
      update({ certificationFiles: next });
    },
    [credentials.certificationFiles, update],
  );

  const addManualCertification = useCallback(() => {
    updateLocalCerts([...localCerts, { id: crypto.randomUUID(), value: '' }]);
  }, [localCerts, updateLocalCerts]);

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
          onDrop={(event) => {
            event.preventDefault();
            void handleFiles(event.dataTransfer.files);
          }}
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
            {isUploading ? 'Uploading…' : <>Drag and drop files here, or <span className="text-[#155eef] font-medium">browse</span></>}
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
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </div>

        {uploadError ? (
          <p className="rounded-[8px] border border-[#fda29b] bg-[#fef3f2] px-[12px] py-[10px] text-[14px] text-[#b42318]">
            {uploadError}
          </p>
        ) : null}

        {/* Uploaded file rows */}
        {credentials.certificationFiles.map((file, idx) => (
          <div
            key={file.name}
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
            <label className="flex items-center gap-[6px] text-[12px] text-[#535862]">
              <input
                type="checkbox"
                checked={file.visible}
                onChange={() => {
                  const next = [...credentials.certificationFiles];
                  next[idx] = { ...next[idx], visible: !next[idx].visible };
                  update({ certificationFiles: next });
                }}
                className="size-[16px] accent-[#155eef]"
              />
              Visible
            </label>
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
        {localCerts.map((cert, idx) => (
          <div key={cert.id} className="flex items-center gap-[8px]">
            <input
              type="text"
              value={cert.value}
              placeholder="e.g., HubSpot Solutions Partner"
              onChange={(e) => {
                const next = [...localCerts];
                next[idx] = { ...next[idx], value: e.target.value };
                updateLocalCerts(next);
              }}
              className="flex-1 h-[44px] px-[14px] bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#155eef] transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                const next = [...localCerts];
                next.splice(idx, 1);
                updateLocalCerts(next);
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
