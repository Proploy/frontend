'use client'

import { useRef, useState } from 'react'
import { Link as LinkIcon, Trash2, Upload } from 'lucide-react'
import type { UploadApplicationDocumentResult } from '@/features/experts/use-expert-application'
import type { ApplicationDocumentType } from '@/features/experts/types'
import { isBlockedStorageUrl } from '@/features/experts/onboarding-mappers'
import type {
  AddedLink,
  UploadedApplicationFile,
  VendorOnboardingData,
} from '@/hooks/types/vendor-contracts'

interface PortfolioStepProps {
  formData: VendorOnboardingData
  setFormData: (data: VendorOnboardingData) => void
  uploadDocument: (
    documentType: Extract<ApplicationDocumentType, 'intro_video' | 'portfolio'>,
    file: File,
  ) => Promise<UploadApplicationDocumentResult>
}

function formatFileSize(bytes: number): string {
  if (!bytes) return 'Uploaded file'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileUploadArea({
  helperText,
  accept,
  disabled,
  onFiles,
}: {
  helperText: string
  accept: string
  disabled?: boolean
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
    >
      <span className="pp-tile pp-tile--soft" aria-hidden>
        <Upload size={18} />
      </span>
      <p className="pp-body" style={{ color: 'var(--ink)' }}>
        {disabled ? 'Uploading…' : <>Drag and drop files here, or <span className="pp-accent">browse</span></>}
      </p>
      <p className="pp-small">{helperText}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={accept.includes('pdf')}
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

function UploadedFileRow({
  file,
  onRemove,
  onToggleVisibility,
}: {
  file: UploadedApplicationFile
  onRemove: () => void
  onToggleVisibility: () => void
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
        <label className="pp-check" style={{ alignItems: 'center', fontSize: 13 }}>
          <input type="checkbox" style={{ marginTop: 0 }} checked={file.visible} onChange={onToggleVisibility} />
          Visible
        </label>
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

export default function PortfolioStep({ formData, setFormData, uploadDocument }: PortfolioStepProps) {
  const [linkInput, setLinkInput] = useState('')
  const [uploadingType, setUploadingType] = useState<ApplicationDocumentType | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const links: AddedLink[] = formData?.portfolioLinks ?? []
  const portfolioFiles: UploadedApplicationFile[] = formData?.portfolioFiles ?? []
  const introVideoLink = formData?.introVideoLink ?? ''
  const introVideoFile: UploadedApplicationFile | null = formData?.introVideoFile ?? null

  const uploadFile = async (
    documentType: Extract<ApplicationDocumentType, 'intro_video' | 'portfolio'>,
    file: File,
  ) => {
    setUploadingType(documentType)
    setUploadError(null)
    const result = await uploadDocument(documentType, file)
    setUploadingType(null)
    if (!result.ok) {
      setUploadError(result.error.message)
      return
    }

    const uploaded: UploadedApplicationFile = {
      name: result.data.fileName,
      size: result.data.fileSizeBytes,
      fileContentType: result.data.fileContentType,
      storageKey: result.data.storageKey,
      visible: true,
    }
    if (documentType === 'intro_video') {
      setFormData({ ...formData, introVideoLink: '', introVideoFile: uploaded })
    } else {
      setFormData({ ...formData, portfolioFiles: [...portfolioFiles, uploaded] })
    }
  }

  const handleAddLink = () => {
    const trimmed = linkInput.trim()
    if (!trimmed) return
    setFormData({ ...formData, portfolioLinks: [...links, { url: trimmed, visible: true, linkType: 'portfolio' }] })
    setLinkInput('')
  }

  const removeLink = (index: number) => {
    setFormData({ ...formData, portfolioLinks: links.filter((_, i) => i !== index) })
  }

  const updateLinkVisibility = (index: number) => {
    setFormData({
      ...formData,
      portfolioLinks: links.map((link, i) => i === index ? { ...link, visible: !link.visible } : link),
    })
  }

  const removePortfolioFile = (index: number) => {
    setFormData({ ...formData, portfolioFiles: portfolioFiles.filter((_, i) => i !== index) })
  }

  const updatePortfolioFileVisibility = (index: number) => {
    setFormData({
      ...formData,
      portfolioFiles: portfolioFiles.map((file, i) => i === index ? { ...file, visible: !file.visible } : file),
    })
  }

  return (
    <div className="vo-step" style={{ gap: 'var(--sp-8)' }}>
      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Introduction</p>
          <p className="pp-h6">Video introduction</p>
          <p className="pp-small">Suggested length: 30 to 90 seconds.</p>
        </div>

        <FileUploadArea
          accept="video/mp4,video/quicktime,video/webm"
          helperText="MP4, MOV, or WebM. Max 200 MB."
          disabled={uploadingType === 'intro_video'}
          onFiles={(files) => {
            const file = files?.[0]
            if (file) void uploadFile('intro_video', file)
          }}
        />
        {introVideoFile ? (
          <UploadedFileRow
            file={introVideoFile}
            onRemove={() => setFormData({ ...formData, introVideoLink: '', introVideoFile: null })}
            onToggleVisibility={() => setFormData({ ...formData, introVideoFile: { ...introVideoFile, visible: !introVideoFile.visible } })}
          />
        ) : null}

        <div className="vo-divider">or paste a link</div>

        <input
          type="url"
          value={isBlockedStorageUrl(introVideoLink) ? '' : introVideoLink}
          onChange={(event) => {
            const value = event.target.value
            if (!isBlockedStorageUrl(value)) setFormData({ ...formData, introVideoLink: value })
          }}
          placeholder="Paste a public video link"
          className="pp-input"
        />
        {introVideoLink && !introVideoFile && !isBlockedStorageUrl(introVideoLink) ? (
          <div className="vo-row">
            <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
              <p className="vo-row-name">Video link saved</p>
              <a href={introVideoLink} target="_blank" rel="noreferrer" className="vo-row-meta" style={{ wordBreak: 'break-all' }}>
                {introVideoLink}
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Evidence</p>
          <p className="pp-h6">Portfolio and certificates</p>
          <p className="pp-small">PDF, PNG, JPG. Max 25 MB each.</p>
        </div>

        <FileUploadArea
          accept=".pdf,.png,.jpg,.jpeg"
          helperText="PDF, PNG, or JPG. Max 25 MB each."
          disabled={uploadingType === 'portfolio'}
          onFiles={(files) => {
            const file = files?.[0]
            if (file) void uploadFile('portfolio', file)
          }}
        />
        {portfolioFiles.map((file, index) => (
          <UploadedFileRow
            key={`${file.storageKey ?? file.name}-${index}`}
            file={file}
            onRemove={() => removePortfolioFile(index)}
            onToggleVisibility={() => updatePortfolioFileVisibility(index)}
          />
        ))}

        <div className="pp-field">
          <label htmlFor="vo-portfolio-link">Add a link</label>
          <div className="pp-row pp-gap-2">
            <input
              id="vo-portfolio-link"
              type="url"
              value={linkInput}
              onChange={(event) => setLinkInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleAddLink()
                }
              }}
              placeholder="Website, Notion, Drive folder, public case study"
              className="pp-input"
            />
            <button type="button" onClick={handleAddLink} className="pp-btn pp-btn--secondary">
              Add
            </button>
          </div>
        </div>

        {links.length > 0 ? (
          <div className="pp-stack pp-gap-2">
            {links.map((link, index) => (
              <div key={`${link.url}-${index}`} className="vo-row">
                <div className="pp-row pp-gap-2" style={{ minWidth: 0, flex: 1 }}>
                  <LinkIcon size={15} style={{ flexShrink: 0, color: 'var(--cobalt)' }} />
                  <span className="vo-row-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.url}
                  </span>
                </div>
                <div className="pp-row pp-gap-3" style={{ flexShrink: 0 }}>
                  <label className="pp-check" style={{ alignItems: 'center', fontSize: 13 }}>
                    <input type="checkbox" style={{ marginTop: 0 }} checked={link.visible} onChange={() => updateLinkVisibility(index)} />
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="vo-icon-btn vo-icon-btn--danger"
                    aria-label={`Remove ${link.url}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {uploadError ? <p className="vo-error">{uploadError}</p> : null}

      <div className="pp-stack" style={{ gap: 4 }}>
        <p className="pp-label">Visibility</p>
        <p className="pp-small">
          Visible items appear on your public profile. Private items are used for verification only.
        </p>
      </div>
    </div>
  )
}
