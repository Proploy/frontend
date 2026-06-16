'use client'

import { useState } from 'react'
import { Download, ExternalLink, Eye, FileImage, FileText, Loader2, X } from 'lucide-react'
import type { ExpertProjectDownloadUrlResponse, ExpertProjectResponse } from '@/features/experts/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

type ProjectFileResult = { ok: true; data: ExpertProjectDownloadUrlResponse } | NormalizedError

type ProjectDocumentViewerProps = {
  project: ExpertProjectResponse
  getDownloadUrl: (projectId: string) => Promise<ProjectFileResult>
  compact?: boolean
}

type PreviewKind = 'pdf' | 'image' | 'unsupported'

const SAFE_IMAGE_TYPES = new Set([
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
])

function getPreviewKind(contentType?: string | null): PreviewKind {
  const normalized = contentType?.split(';')[0]?.trim().toLowerCase()
  if (!normalized) return 'unsupported'
  if (normalized === 'application/pdf') return 'pdf'
  if (SAFE_IMAGE_TYPES.has(normalized)) return 'image'
  return 'unsupported'
}

function formatFileSize(sizeBytes?: number | null) {
  if (!sizeBytes || sizeBytes <= 0) return null
  if (sizeBytes < 1024) return `${sizeBytes} B`
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ProjectDocumentViewer({
  project,
  getDownloadUrl,
  compact = false,
}: ProjectDocumentViewerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isOpeningFile, setIsOpeningFile] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  if (!project.fileStorageKey) return null

  const previewKind = getPreviewKind(project.fileContentType)
  const canPreview = previewKind !== 'unsupported'
  const fileSize = formatFileSize(project.fileSizeBytes)
  const fileMeta = [project.fileContentType, fileSize].filter(Boolean).join(' · ') || 'Project document'
  const Icon = previewKind === 'image' ? FileImage : FileText

  const resolveSignedUrl = async () => {
    const result = await getDownloadUrl(project.id)
    if (!result.ok) {
      setFileError(result.error.message)
      return null
    }
    return result.data.downloadUrl
  }

  const openPreview = async () => {
    if (!canPreview || isLoadingPreview) return
    setIsLoadingPreview(true)
    setFileError(null)
    const signedUrl = await resolveSignedUrl()
    setIsLoadingPreview(false)
    if (!signedUrl) return
    setPreviewUrl(signedUrl)
    setIsPreviewOpen(true)
  }

  const openInNewTab = async () => {
    if (isOpeningFile) return
    setIsOpeningFile(true)
    setFileError(null)
    const signedUrl = previewUrl ?? await resolveSignedUrl()
    setIsOpeningFile(false)
    if (!signedUrl) return
    window.open(signedUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className={`mt-[14px] rounded-[10px] border border-[#d5d7da] bg-white p-[12px] ${compact ? '' : 'w-full'}`}>
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          <div className="flex min-w-0 items-center gap-[10px]">
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                {project.fileName || 'Project document'}
              </p>
              <p className="truncate text-[12px] leading-[18px] text-[#717680]">{fileMeta}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-[8px]">
            {canPreview ? (
              <button
                type="button"
                onClick={openPreview}
                disabled={isLoadingPreview}
                className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold leading-[18px] text-[#414651] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingPreview ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                Preview
              </button>
            ) : null}
            <button
              type="button"
              onClick={openInNewTab}
              disabled={isOpeningFile}
              className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[7px] text-[13px] font-semibold leading-[18px] text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isOpeningFile ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
              Open
            </button>
          </div>
        </div>

        {fileError ? (
          <p className="mt-[8px] text-[13px] leading-[18px] text-[#d92d20]">{fileError}</p>
        ) : null}
      </div>

      {isPreviewOpen && previewUrl ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0d12]/70 p-[16px]"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.fileName || project.title} preview`}
        >
          <div className="flex h-[min(88vh,920px)] w-full max-w-[1040px] flex-col overflow-hidden rounded-[12px] bg-white shadow-xl">
            <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[16px] py-[12px]">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-[22px] text-[#181d27]">
                  {project.fileName || project.title}
                </p>
                <p className="truncate text-[12px] leading-[18px] text-[#717680]">{fileMeta}</p>
              </div>
              <div className="flex shrink-0 items-center gap-[8px]">
                <button
                  type="button"
                  onClick={openInNewTab}
                  className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold leading-[18px] text-[#414651] hover:bg-[#fafafa]"
                >
                  <Download size={14} />
                  Open file
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex size-[36px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#f5f5f5] hover:text-[#181d27]"
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 bg-[#f5f5f5]">
              {previewKind === 'image' ? (
                <div className="flex size-full items-center justify-center overflow-auto p-[16px]">
                  {/* Signed storage URLs are short-lived and may not be configured for next/image remote optimization. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={project.fileName || `${project.title} document preview`}
                    className="max-h-full max-w-full rounded-[8px] object-contain"
                  />
                </div>
              ) : (
                <iframe
                  src={previewUrl}
                  title={project.fileName || `${project.title} document preview`}
                  className="size-full border-0 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
