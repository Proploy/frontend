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
      className={`flex h-[176px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#d5d7da] bg-white transition-colors ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-[#155eef]'}`}
    >
      <div className="mb-[12px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#f5f5f6]">
        <Upload className="h-[20px] w-[20px] text-[#535862]" />
      </div>
      <p className="font-[family-name:var(--font-inter)] text-[16px] font-normal leading-[24px] text-[#414651]">
        {disabled ? 'Uploading…' : <>Drag and drop files here, or <span className="font-medium text-[#155eef]">browse</span></>}
      </p>
      <p className="mt-[4px] font-[family-name:var(--font-dm-sans)] text-[14px] font-normal leading-[20px] text-[#535862]">
        {helperText}
      </p>
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
    <div className="flex items-center justify-between gap-[12px] rounded-[8px] bg-[#f5f5f6] px-[12px] py-[10px]">
      <div className="min-w-0">
        <p className="truncate font-[family-name:var(--font-dm-sans)] text-[14px] font-medium leading-[20px] text-[#181d27]">
          {file.name}
        </p>
        <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-normal leading-[18px] text-[#535862]">
          {formatFileSize(file.size)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-[10px]">
        <label className="flex items-center gap-[6px] text-[12px] text-[#535862]">
          <input
            type="checkbox"
            checked={file.visible}
            onChange={onToggleVisibility}
            className="size-[16px] accent-[#155eef]"
          />
          Visible
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] hover:bg-[#e9eaeb]"
          aria-label={`Remove ${file.name}`}
        >
          <Trash2 size={18} className="text-[#717680]" />
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
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-[20px] font-medium leading-[30px] text-[#181d27]">
          Video introduction
        </h3>
        <p className="mb-[10px] font-[family-name:var(--font-dm-sans)] text-[14px] font-normal leading-[20px] text-[#535862]">
          Suggested length: 30 to 90 seconds.
        </p>
        <div className="flex flex-col gap-[12px]">
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
          <input
            type="url"
            value={isBlockedStorageUrl(introVideoLink) ? '' : introVideoLink}
            onChange={(event) => {
              const value = event.target.value
              if (!isBlockedStorageUrl(value)) setFormData({ ...formData, introVideoLink: value })
            }}
            placeholder="Paste a public video link"
            className="h-[44px] flex-1 rounded-[8px] border border-[#d5d7da] bg-white px-[14px] font-[family-name:var(--font-dm-sans)] text-[16px] font-normal leading-[24px] text-[#181d27] shadow-xs outline-none transition-colors placeholder:text-[#717680] focus:border-[#155eef]"
          />
          {introVideoLink && !introVideoFile && !isBlockedStorageUrl(introVideoLink) ? (
            <div className="rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[10px]">
              <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-medium leading-[18px] text-[#181d27]">Video link saved</p>
              <a href={introVideoLink} target="_blank" rel="noreferrer" className="break-all font-[family-name:var(--font-dm-sans)] text-[12px] leading-[18px] text-[#155eef]">
                {introVideoLink}
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-[20px] font-medium leading-[30px] text-[#181d27]">
          Portfolio and certificates
        </h3>
        <p className="mb-[10px] font-[family-name:var(--font-dm-sans)] text-[14px] font-normal leading-[20px] text-[#535862]">
          PDF, PNG, JPG. Max 25 MB each.
        </p>
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
            key={file.storageKey ?? file.name}
            file={file}
            onRemove={() => removePortfolioFile(index)}
            onToggleVisibility={() => updatePortfolioFileVisibility(index)}
          />
        ))}

        <div className="mt-[16px] flex flex-col gap-[6px]">
          <label className="font-[family-name:var(--font-inter)] text-[14px] font-medium leading-[20px] text-[#414651]">Add a link</label>
          <div className="flex gap-[8px]">
            <input
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
              className="h-[44px] flex-1 rounded-[8px] border border-[#d5d7da] bg-white px-[14px] font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] text-[#181d27] shadow-xs outline-none transition-colors placeholder:text-[#717680] focus:border-[#155eef]"
            />
            <button type="button" onClick={handleAddLink} className="h-[44px] w-[63px] rounded-[8px] bg-[#155eef] font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#1249c4]">Add</button>
          </div>
          {links.length > 0 ? (
            <div className="mt-[8px] flex flex-col gap-[8px]">
              {links.map((link, index) => (
                <div key={link.id ?? link.url} className="flex items-center justify-between rounded-[8px] bg-[#f5f5f6] px-[12px] py-[8px]">
                  <div className="flex min-w-0 flex-1 items-center gap-[8px]">
                    <LinkIcon className="h-[16px] w-[16px] shrink-0 text-[#155eef]" />
                    <span className="truncate font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#155eef]">{link.url}</span>
                  </div>
                  <div className="ml-[12px] flex shrink-0 items-center gap-[12px]">
                    <label className="flex items-center gap-[6px] text-[12px] text-[#535862]">
                      <input type="checkbox" checked={link.visible} onChange={() => updateLinkVisibility(index)} className="size-[16px] accent-[#155eef]" />
                      Visible
                    </label>
                    <button type="button" onClick={() => removeLink(index)} className="font-[family-name:var(--font-dm-sans)] text-[14px] font-medium leading-[20px] text-[#dc2626]">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {uploadError ? <p className="rounded-[8px] border border-[#fda29b] bg-[#fef3f2] px-[12px] py-[10px] text-[14px] text-[#b42318]">{uploadError}</p> : null}

      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-[20px] font-medium leading-[30px] text-[#181d27]">Visibility settings</h3>
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-normal leading-[20px] text-[#535862]">
          Visible items appear on your public profile. Private items are used for verification only.
        </p>
      </div>
    </div>
  )
}
