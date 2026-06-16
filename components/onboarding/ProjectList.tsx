'use client'

import { useState, useRef, useCallback } from 'react'
import { Plus, Trash2, Upload, FileText, Loader2 } from 'lucide-react'
import type { GetUploadUrlResult } from '@/features/experts/use-expert-application'

interface ProjectFileState {
  file: File | null
  uploadProgress: number | null
  error: string | null
  storageKey: string | null
  fileName: string | null
  fileContentType: string | null
  fileSizeBytes: number | null
}

export interface ProjectListProject {
  id?: string
  clientId?: string
  title: string
  summary: string
  link?: string | null
  outcomes: string
  fileStorageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
  fileUrl?: string | null
  _fileState?: ProjectFileState
}

interface ProjectListProps {
  projects: ProjectListProject[]
  onChange: (projects: ProjectListProject[]) => void
  uploadFile?: (
    clientProjectId: string,
    filename: string,
    contentType: string,
    fileSizeBytes: number,
  ) => Promise<GetUploadUrlResult>
  uploadToSignedUrl?: (uploadUrl: string, file: File) => Promise<void>
}

const EMPTY_PROJECT: ProjectListProject = {
  id: '',
  clientId: '',
  title: '',
  summary: '',
  link: '',
  outcomes: '',
}

function createClientProjectId(): string {
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getFileContentType(file: File): string {
  return file.type || 'application/octet-stream'
}

export default function ProjectList({
  projects = [],
  onChange,
  uploadFile,
  uploadToSignedUrl,
}: ProjectListProps) {
  const [newProject, setNewProject] = useState<ProjectListProject>(EMPTY_PROJECT)
  const [fileStates, setFileStates] = useState<Record<number, ProjectFileState>>({})
  const [newProjectFileState, setNewProjectFileState] = useState<ProjectFileState | null>(null)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const newProjectFileInputRef = useRef<HTMLInputElement | null>(null)

  const addProject = useCallback(() => {
    if (newProject.title && newProject.summary && newProject.outcomes) {
      const clientId = newProject.clientId || createClientProjectId()
      const withClientId = { ...newProject, clientId }
      onChange([...projects, withClientId])
      setNewProject(EMPTY_PROJECT)
      setNewProjectFileState(null)
      if (newProjectFileInputRef.current) newProjectFileInputRef.current.value = ''
    }
  }, [newProject, projects, onChange])

  const removeProject = useCallback(
    (index: number) => {
      onChange(projects.filter((_, i) => i !== index))
    },
    [projects, onChange],
  )

  const handleFileChange = useCallback(
    async (projectIndex: number, file: File | null) => {
      if (!file || !uploadFile || !uploadToSignedUrl) return

      const clientId = projects[projectIndex]?.clientId || projects[projectIndex]?.id
      if (!clientId) return

      const contentType = getFileContentType(file)
      const fileSizeBytes = file.size

      setFileStates((prev) => ({
        ...prev,
        [projectIndex]: {
          file,
          uploadProgress: 0,
          error: null,
          storageKey: null,
          fileName: file.name,
          fileContentType: contentType,
          fileSizeBytes: fileSizeBytes,
        },
      }))

      try {
        const uploadResult = await uploadFile(
          clientId,
          file.name,
          contentType,
          fileSizeBytes,
        )

        if (!uploadResult.ok) throw new Error(uploadResult.error.message)

        const { uploadUrl, storageKey } = uploadResult.data

        setFileStates((prev) => ({
          ...prev,
          [projectIndex]: {
            ...prev[projectIndex],
            uploadProgress: 50,
          },
        }))

        await uploadToSignedUrl(uploadUrl, file)

        setFileStates((prev) => ({
          ...prev,
          [projectIndex]: {
            ...prev[projectIndex],
            uploadProgress: null,
            storageKey,
          },
        }))

        const updated = [...projects]
        updated[projectIndex] = {
          ...updated[projectIndex],
          fileName: file.name,
          fileContentType: contentType,
          fileSizeBytes: fileSizeBytes,
          fileStorageKey: storageKey,
        }
        onChange(updated)
      } catch (err) {
        setFileStates((prev) => ({
          ...prev,
          [projectIndex]: {
            ...prev[projectIndex],
            uploadProgress: null,
            error: err instanceof Error ? err.message : 'Upload failed',
          },
        }))
      }
    },
    [projects, uploadFile, uploadToSignedUrl, onChange],
  )

  const handleNewProjectFileChange = useCallback(
    async (file: File | null) => {
      if (!file || !uploadFile || !uploadToSignedUrl) return

      const clientId = newProject.clientId || createClientProjectId()
      const contentType = getFileContentType(file)
      const fileSizeBytes = file.size

      setNewProject((prev) => ({ ...prev, clientId }))
      setNewProjectFileState({
        file,
        uploadProgress: 0,
        error: null,
        storageKey: null,
        fileName: file.name,
        fileContentType: contentType,
        fileSizeBytes,
      })

      try {
        const uploadResult = await uploadFile(
          clientId,
          file.name,
          contentType,
          fileSizeBytes,
        )

        if (!uploadResult.ok) throw new Error(uploadResult.error.message)

        const { uploadUrl, storageKey } = uploadResult.data

        setNewProjectFileState((prev) => prev ? {
          ...prev,
          uploadProgress: 50,
        } : prev)

        await uploadToSignedUrl(uploadUrl, file)

        setNewProjectFileState((prev) => prev ? {
          ...prev,
          uploadProgress: null,
          storageKey,
        } : prev)

        setNewProject((prev) => ({
          ...prev,
          clientId,
          fileName: file.name,
          fileContentType: contentType,
          fileSizeBytes,
          fileStorageKey: storageKey,
        }))
      } catch (err) {
        setNewProjectFileState((prev) => prev ? {
          ...prev,
          uploadProgress: null,
          error: err instanceof Error ? err.message : 'Upload failed',
        } : {
          file,
          uploadProgress: null,
          error: err instanceof Error ? err.message : 'Upload failed',
          storageKey: null,
          fileName: file.name,
          fileContentType: contentType,
          fileSizeBytes,
        })
      }
    },
    [newProject.clientId, uploadFile, uploadToSignedUrl],
  )

  const isNewProjectUploading = typeof newProjectFileState?.uploadProgress === 'number'
  const newProjectHasFile = !!newProject.fileStorageKey || !!newProjectFileState?.storageKey

  return (
    <div className="space-y-6">
      {/* Expert project list */}
      <div className="grid gap-4">
        {projects.map((project, idx) => {
          const fileState = fileStates[idx]
          const isUploading = typeof fileState?.uploadProgress === 'number'
          const hasError = !!fileState?.error
          const hasFile = !!project.fileStorageKey || !!fileState?.storageKey

          return (
            <div key={project.clientId || idx} className="p-4 bg-gray-50 rounded-xl relative border border-gray-100 group">
              <button
                onClick={() => removeProject(idx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>

              <h4 className="font-bold text-[#011127] pr-8">{project.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{project.summary}</p>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0466E7] hover:underline mt-2 inline-block">
                  View Project
                </a>
              )}

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Outcomes</p>
                <p className="text-sm text-gray-700 mt-1">{project.outcomes}</p>
              </div>

              {/* File upload section */}
              {uploadFile && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Document</p>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[idx]?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#b2ccff] bg-[#eff4ff] px-2.5 py-1.5 text-xs font-semibold text-[#004eeb] transition-colors hover:bg-[#d1e0ff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      {hasFile ? 'Replace file' : 'Upload file'}
                    </button>
                  </div>

                  <input
                    ref={(el) => { fileInputRefs.current[idx] = el }}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(idx, e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  {isUploading && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                      <Loader2 size={12} className="animate-spin" />
                      <span>Uploading... {Math.round(fileState.uploadProgress ?? 0)}%</span>
                    </div>
                  )}

                  {hasError && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
                      <span>{fileState.error}</span>
                    </div>
                  )}

                  {project.fileName && !isUploading && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <FileText size={12} />
                      <span className="truncate max-w-[160px]">{project.fileName}</span>
                      <button
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="text-[#0466E7] hover:underline ml-1"
                      >
                        Replace
                      </button>
                    </div>
                  )}

                  {!hasFile && !isUploading && (
                    <p className="mt-2 text-xs text-gray-500">
                      Attach a project file as PDF, document, text file, or image.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add new project form */}
      <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white space-y-4">
        <h4 className="font-semibold text-sm text-gray-500">Add New Project</h4>
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="w-full h-[48px] px-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
          />
          <textarea
            placeholder="Summary of what you did"
            value={newProject.summary}
            onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
            rows={2}
          />
          <input
            type="url"
            placeholder="Project Link (optional)"
            value={newProject.link || ''}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value || null })}
            className="w-full h-[48px] px-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
          />
          <textarea
            placeholder="Key outcomes / results"
            value={newProject.outcomes}
            onChange={(e) => setNewProject({ ...newProject, outcomes: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
            rows={2}
          />

          {uploadFile && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Document</p>
                <button
                  type="button"
                  onClick={() => newProjectFileInputRef.current?.click()}
                  disabled={isNewProjectUploading}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#b2ccff] bg-[#eff4ff] px-2.5 py-1.5 text-xs font-semibold text-[#004eeb] transition-colors hover:bg-[#d1e0ff] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isNewProjectUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {newProjectHasFile ? 'Replace file' : 'Upload file'}
                </button>
              </div>

              <input
                ref={newProjectFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={(e) => handleNewProjectFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />

              {isNewProjectUploading && (
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Uploading... {Math.round(newProjectFileState?.uploadProgress ?? 0)}%</span>
                </div>
              )}

              {newProjectFileState?.error && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
                  <span>{newProjectFileState.error}</span>
                </div>
              )}

              {newProject.fileName && !isNewProjectUploading && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <FileText size={12} />
                  <span className="truncate max-w-[220px]">{newProject.fileName}</span>
                  <button
                    type="button"
                    onClick={() => newProjectFileInputRef.current?.click()}
                    className="text-[#0466E7] hover:underline ml-1"
                  >
                    Replace
                  </button>
                </div>
              )}

              {!newProjectHasFile && !isNewProjectUploading && (
                <p className="mt-2 text-xs text-gray-500">
                  Attach a project file as PDF, document, text file, or image.
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={addProject}
            className="w-full h-[48px] bg-gray-100 text-[#011127] font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Project to List
          </button>
        </div>
      </div>
    </div>
  )
}
