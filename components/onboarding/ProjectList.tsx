'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface ProjectFileState {
  file: File | null
  uploadProgress: number | null  // 0-100 when in progress, null when idle
  error: string | null
  storageKey: string | null
  fileName: string | null
  fileContentType: string | null
  fileSizeBytes: number | null
}

interface ProjectListProject {
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

interface ProjectListProps {
  projects: ProjectListProject[]
  onChange: (projects: ProjectListProject[]) => void
  uploadFile: (projectId: string, filename: string, contentType: string, fileSizeBytes: number) => Promise<{ uploadUrl: string; storageKey: string }>
  uploadToSignedUrl: (uploadUrl: string, file: File) => Promise<void>
  onUploadError?: (index: number, error: string) => void
}

const EMPTY_PROJECT: ProjectListProject = { title: '', summary: '', link: '', outcomes: '' }

export default function ProjectList({ projects = [], onChange, uploadFile, uploadToSignedUrl, onUploadError }: ProjectListProps) {
  const [newProject, setNewProject] = useState<ProjectListProject>(EMPTY_PROJECT)
  const [fileStates, setFileStates] = useState<Record<number, ProjectFileState>>({})
  const [newProjectFileState, setNewProjectFileState] = useState<ProjectFileState | null>(null)
  const [uploadingProjectIndex, setUploadingProjectIndex] = useState<number | null>(null)
  const [isUploadingNewProject, setIsUploadingNewProject] = useState(false)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const newProjectFileInputRef = useRef<HTMLInputElement | null>(null)

  const addProject = () => {
    if (newProject.title && newProject.summary && newProject.outcomes) {
      onChange([...projects, { ...newProject }])
      setNewProject(EMPTY_PROJECT)
      setNewProjectFileState(null)
      if (newProjectFileInputRef.current) newProjectFileInputRef.current.value = ''
    }
  }

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index))
  }

  const getFileContentType = (file: File) => file.type || 'application/octet-stream'

  const uploadSelectedFile = async (clientProjectId: string, file: File) => {
    const contentType = getFileContentType(file)
    const { uploadUrl, storageKey } = await uploadFile(
      clientProjectId,
      file.name,
      contentType,
      file.size,
    )
    await uploadToSignedUrl(uploadUrl, file)
    return { storageKey, contentType }
  }

  const handleFileSelect = async (index: number, file: File | null) => {
    if (!file) return

    const state: ProjectFileState = {
      file,
      uploadProgress: 0,
      error: null,
      storageKey: null,
      fileName: file.name,
      fileContentType: getFileContentType(file),
      fileSizeBytes: file.size,
    }

    setFileStates((prev) => ({ ...prev, [index]: state }))
    setUploadingProjectIndex(index)

    try {
      const clientProjectId = `project-${index}`
      const uploadPromise = uploadSelectedFile(clientProjectId, file)

      setFileStates((prev) => ({
        ...prev,
        [index]: { ...prev[index]!, uploadProgress: 50 },
      }))

      const { storageKey, contentType } = await uploadPromise

      setFileStates((prev) => ({
        ...prev,
        [index]: {
          ...prev[index]!,
          uploadProgress: null,
          error: null,
          storageKey,
        },
      }))

      // Update project with file metadata
      const updatedProjects = [...projects]
      updatedProjects[index] = {
        ...updatedProjects[index],
        fileStorageKey: storageKey,
        fileName: file.name,
        fileContentType: contentType,
        fileSizeBytes: file.size,
      }
      onChange(updatedProjects)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setFileStates((prev) => ({
        ...prev,
        [index]: { ...prev[index]!, uploadProgress: null, error: errorMessage },
      }))
      onUploadError?.(index, errorMessage)
    } finally {
      setUploadingProjectIndex(null)
    }
  }

  const handleNewProjectFileSelect = async (file: File | null) => {
    if (!file) return

    const state: ProjectFileState = {
      file,
      uploadProgress: 0,
      error: null,
      storageKey: null,
      fileName: file.name,
      fileContentType: getFileContentType(file),
      fileSizeBytes: file.size,
    }

    setNewProjectFileState(state)
    setIsUploadingNewProject(true)

    try {
      const clientProjectId = 'draft'
      const uploadPromise = uploadSelectedFile(clientProjectId, file)
      setNewProjectFileState((prev) => prev ? { ...prev, uploadProgress: 50 } : prev)
      const { storageKey, contentType } = await uploadPromise

      setNewProjectFileState((prev) => prev ? {
        ...prev,
        uploadProgress: null,
        error: null,
        storageKey,
        fileContentType: contentType,
      } : prev)

      setNewProject((prev) => ({
        ...prev,
        fileStorageKey: storageKey,
        fileName: file.name,
        fileContentType: contentType,
        fileSizeBytes: file.size,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setNewProjectFileState((prev) => prev ? { ...prev, uploadProgress: null, error: errorMessage } : prev)
    } finally {
      setIsUploadingNewProject(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {projects.map((project, idx) => {
          const fileState = fileStates[idx]
          const isUploading = uploadingProjectIndex === idx
          const hasUploadedFile = Boolean(project.fileStorageKey || fileState?.storageKey)

          return (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl relative border border-gray-100 group">
              <button
                onClick={() => removeProject(idx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
              <h4 className="font-bold text-[#011127] pr-8">{project.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{project.summary}</p>

              {/* Link */}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0466E7] hover:underline mt-2 inline-block">
                  View Project
                </a>
              )}

              {/* Uploaded file */}
              {project.fileName && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <FileText size={14} />
                  <span>{project.fileName}</span>
                  {hasUploadedFile && (
                    <CheckCircle size={14} className="text-green-500" />
                  )}
                </div>
              )}

              {/* Upload progress / error */}
              {isUploading && fileState?.uploadProgress !== null && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-xs text-[#0466E7]">
                    <Upload size={14} className="animate-pulse" />
                    <span>Uploading... {fileState.uploadProgress}%</span>
                  </div>
                  <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0466E7] transition-all"
                      style={{ width: `${fileState.uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload error */}
              {fileState?.error && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
                  <AlertCircle size={14} />
                  <span>{fileState.error}</span>
                </div>
              )}

              {/* File input */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Document Upload</p>
                <input
                  ref={(el) => { fileInputRefs.current[idx] = el }}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={(e) => handleFileSelect(idx, e.target.files?.[0] ?? null)}
                  disabled={isUploading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[idx]?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
                >
                  <Upload size={14} />
                  {project.fileName ? 'Replace file' : 'Upload document'}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Outcomes</p>
                <p className="text-sm text-gray-700 mt-1">{project.outcomes}</p>
              </div>
            </div>
          )
        })}
      </div>

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
            value={newProject.link ?? ''}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="w-full h-[48px] px-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
          />
          <textarea
            placeholder="Key outcomes / results"
            value={newProject.outcomes}
            onChange={(e) => setNewProject({ ...newProject, outcomes: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
            rows={2}
          />
          <div className="rounded-lg border border-gray-200 bg-[#F4F8FD] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#414651]">Supporting document</p>
                <p className="mt-1 text-xs text-gray-500">
                  Upload a case study, proof document, certification, or project evidence.
                </p>
                {newProjectFileState?.fileName && (
                  <>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                      <FileText size={14} className="shrink-0" />
                      <span className="truncate">{newProjectFileState.fileName}</span>
                      {newProjectFileState.storageKey && (
                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                      )}
                    </div>
                    {newProjectFileState.storageKey && (
                      <p className="mt-2 text-xs font-medium text-[#067647]">
                        Add this project to the list to save the uploaded document with your application.
                      </p>
                    )}
                  </>
                )}
              </div>
              <input
                ref={newProjectFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={(e) => handleNewProjectFileSelect(e.target.files?.[0] ?? null)}
                disabled={isUploadingNewProject}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => newProjectFileInputRef.current?.click()}
                disabled={isUploadingNewProject}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 transition-all hover:bg-gray-100 disabled:opacity-50"
              >
                <Upload size={14} />
                {newProjectFileState?.fileName ? 'Replace' : 'Upload'}
              </button>
            </div>

            {isUploadingNewProject && newProjectFileState && newProjectFileState.uploadProgress !== null && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-xs text-[#0466E7]">
                  <Upload size={14} className="animate-pulse" />
                  <span>Uploading... {newProjectFileState.uploadProgress}%</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-[#0466E7] transition-all"
                    style={{ width: `${newProjectFileState.uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {newProjectFileState?.error && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-500">
                <AlertCircle size={14} />
                <span>{newProjectFileState.error}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={addProject}
            disabled={isUploadingNewProject}
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
