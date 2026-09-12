'use client'

import { useRef } from 'react'
import { Trash2, Upload } from 'lucide-react'
import type { UploadedApplicationFile } from '@/hooks/types/vendor-contracts'

export function formatFileSize(bytes: number): string {
  if (!bytes) return 'Uploaded file'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadArea({
  helperText,
  accept,
  multiple = false,
  disabled,
  compact = false,
  onFiles,
}: {
  helperText: string
  accept: string
  multiple?: boolean
  disabled?: boolean
  compact?: boolean
  onFiles: (files: FileList | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) inputRef.current?.click()
      }}
      onDrop={(event) => {
        event.preventDefault()
        if (!disabled) onFiles(event.dataTransfer.files)
      }}
      onDragOver={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) inputRef.current?.click()
      }}
      className="vo-drop"
      style={compact ? { paddingBlock: 'var(--sp-5)' } : undefined}
    >
      {!compact && (
        <span className="pp-tile pp-tile--soft" aria-hidden>
          <Upload size={18} />
        </span>
      )}
      <p className="pp-body" style={{ color: 'var(--ink)' }}>
        {disabled ? 'Uploading…' : <>Drag and drop here, or <span className="pp-accent">browse</span></>}
      </p>
      <p className="pp-small">{helperText}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          onFiles(event.target.files)
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}

export function UploadedFileRow({
  file,
  onRemove,
  onToggleVisibility,
}: {
  file: UploadedApplicationFile
  onRemove: () => void
  onToggleVisibility?: () => void
}) {
  return (
    <div className="vo-row">
      <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
        <p className="vo-row-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file.name}
        </p>
        <p className="vo-row-meta">{formatFileSize(file.size)}</p>
      </div>
      <div className="pp-row pp-gap-3" style={{ flexShrink: 0 }}>
        {onToggleVisibility && (
          <label className="pp-check" style={{ alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" style={{ marginTop: 0 }} checked={file.visible} onChange={onToggleVisibility} />
            Visible
          </label>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="vo-icon-btn vo-icon-btn--danger"
          aria-label={`Remove ${file.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
