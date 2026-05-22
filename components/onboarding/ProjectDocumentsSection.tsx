'use client'

import { useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { useExpertDashboard } from '@/hooks/use-expert-dashboard'
import type { ExpertProjectResponse } from '@/hooks/types/expert-contracts'

interface ProjectDocumentsSectionProps {
  /** Projects to display — must include fileStorageKey to show upload status */
  projects: ExpertProjectResponse[]
  /** Show upload UI (for approved experts editing their profile) */
  editable?: boolean
  /** Called when user finishes editing projects in the dashboard */
  onProjectsChange?: (projects: ExpertProjectResponse[]) => void
}

export type ProjectDocumentEntry = {
  title: string
  summary: string
  link?: string | null
  outcomes: string
  fileStorageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
  fileUrl?: string | null
}

export default function ProjectDocumentsSection({
  projects,
}: ProjectDocumentsSectionProps) {
  const { getProjectFileDownloadUrl } = useExpertDashboard()
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDownload = async (projectId: string) => {
    setDownloadingId(projectId)
    try {
      const result = await getProjectFileDownloadUrl(projectId)
      if (result.ok) {
        window.open(result.data.downloadUrl, '_blank')
      }
    } finally {
      setDownloadingId(null)
    }
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-400 italic">
        No projects added yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const hasFile = !!project.fileStorageKey
        const isDownloading = downloadingId === project.id

        return (
          <div
            key={project.id}
            className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
          >
            {/* File icon */}
            <div className="w-8 h-8 rounded-lg bg-[#0466E7]/10 flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={16} className="text-[#0466E7]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#011127]">{project.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{project.summary}</p>

              {/* Document row */}
              <div className="mt-2 flex items-center gap-2">
                {project.fileName ? (
                  <>
                    <span className="text-xs text-gray-500 truncate max-w-[160px]">
                      {project.fileName}
                    </span>
                    {hasFile && (
                      <button
                        onClick={() => handleDownload(project.id)}
                        disabled={isDownloading}
                        className="flex items-center gap-1 text-xs text-[#0466E7] hover:underline disabled:opacity-50 shrink-0"
                      >
                        {isDownloading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Download size={12} />
                        )}
                        Download
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">No document attached</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
