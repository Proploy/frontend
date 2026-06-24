'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X } from 'lucide-react'

/**
 * Design-token dropzone used across the dashboard (contract upload, account
 * photo/portfolio, chat attachments). Headless react-dropzone + Proploy styling.
 * Reports the picked file(s); the caller decides what to do (read as data URL, etc).
 */
export function FileDropzone({
  accept,
  multiple = false,
  hint,
  fileName,
  onFiles,
  onClear,
}: {
  accept?: Record<string, string[]>
  multiple?: boolean
  hint?: string
  // when set, renders a "selected file" chip instead of the drop target
  fileName?: string | null
  onFiles: (files: File[]) => void
  onClear?: () => void
}) {
  const onDrop = useCallback((accepted: File[]) => onFiles(accepted), [onFiles])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple })

  if (fileName) {
    return (
      <div className="flex items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white px-[16px] py-[12px]">
        <div className="flex items-center gap-[10px] min-w-0">
          <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff8ff] text-[#155eef]">
            <UploadCloud size={16} />
          </span>
          <span className="truncate text-[14px] font-medium leading-[20px] text-[#181d27]">{fileName}</span>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex size-[28px] shrink-0 items-center justify-center rounded-[6px] text-[#717680] hover:bg-[#fafafa] hover:text-[#181d27] transition-colors"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center gap-[8px] rounded-[12px] border border-dashed px-[24px] py-[24px] text-center transition-colors ${
        isDragActive ? 'border-[#155eef] bg-[#eff8ff]' : 'border-[#d5d7da] bg-[#fafafa] hover:border-[#155eef]'
      }`}
    >
      <input {...getInputProps()} />
      <span className="flex size-[40px] items-center justify-center rounded-full bg-white text-[#155eef] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <UploadCloud size={20} />
      </span>
      <p className="text-[14px] leading-[20px] text-[#414651]">
        <span className="font-semibold text-[#155eef]">Click to upload</span> or drag and drop
      </p>
      {hint && <p className="text-[12px] leading-[18px] text-[#717680]">{hint}</p>}
    </div>
  )
}
