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

  const update = useCallback(
    (patch: Partial<CredentialsFormData>) => {
      updateFormData(patch);
    },
    [updateFormData],
  );

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || isUploading) return;
    setIsUploading(true);
    setUploadError(null);
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
    setIsUploading(false);
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
    update({
      manualCertifications: [...credentials.manualCertifications, ''],
    });
  }, [credentials.manualCertifications, update]);

  return (
    <div className="vo-step">
      {/* ─── Section 1: Badges / Certifications ─── */}
      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Credentials</p>
          <p className="pp-h6">Partner badges or certifications</p>
        </div>

        {/* File upload drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          onDrop={(event) => {
            event.preventDefault();
            void handleFiles(event.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          className="vo-drop"
        >
          <span className="pp-tile pp-tile--soft" aria-hidden>
            <Upload size={18} />
          </span>
          <p className="pp-body" style={{ color: 'var(--ink)' }}>
            {isUploading ? 'Uploading…' : <>Drag and drop files here, or <span className="pp-accent">browse</span></>}
          </p>
          <p className="pp-small">PDF, PNG, or JPG. Max 25 MB each.</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </div>

        {uploadError ? <p className="vo-error">{uploadError}</p> : null}

        {/* Uploaded file rows */}
        {credentials.certificationFiles.map((file, idx) => (
          <div key={`${file.name}-${idx}`} className="vo-row">
            <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
              <span className="vo-row-name">{file.name}</span>
              <span className="vo-row-meta">{formatFileSize(file.size)}</span>
            </div>
            <div className="pp-row pp-gap-3" style={{ flexShrink: 0 }}>
              <label className="pp-check" style={{ alignItems: 'center', fontSize: 13 }}>
                <input
                  type="checkbox"
                  style={{ marginTop: 0 }}
                  checked={file.visible}
                  onChange={() => {
                    const next = [...credentials.certificationFiles];
                    next[idx] = { ...next[idx], visible: !next[idx].visible };
                    update({ certificationFiles: next });
                  }}
                />
                Visible
              </label>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="vo-icon-btn vo-icon-btn--danger"
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <div className="vo-divider">or</div>

        {/* Manual certification inputs */}
        {credentials.manualCertifications.map((cert, idx) => (
          <div key={idx} className="pp-row pp-gap-2">
            <input
              type="text"
              value={cert}
              placeholder="e.g., HubSpot Solutions Partner"
              onChange={(e) => {
                const next = [...credentials.manualCertifications];
                next[idx] = e.target.value;
                update({ manualCertifications: next });
              }}
              className="pp-input"
            />
            <button
              type="button"
              onClick={() => {
                const next = [...credentials.manualCertifications];
                next.splice(idx, 1);
                update({ manualCertifications: next });
              }}
              className="vo-icon-btn vo-icon-btn--danger"
              aria-label="Remove certification"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* Add certification manually link */}
        <button type="button" onClick={addManualCertification} className="pp-link-arrow" style={{ alignSelf: 'flex-start' }}>
          <Plus size={16} />
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
      <div className="vo-group" style={{ gap: 'var(--sp-3)' }}>
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Optional</p>
          <p className="pp-h6">Skills assessment</p>
        </div>

        <label className="pp-check" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={credentials.openToAssessment}
            onChange={(e) => update({ openToAssessment: e.target.checked })}
          />
          <span className="pp-stack" style={{ gap: 2 }}>
            <span style={{ color: 'var(--ink)' }}>I am open to a quick skills assessment</span>
            <span className="pp-small">This may speed up approval.</span>
          </span>
        </label>
      </div>
    </div>
  );
}
