'use client'

import React, { useState } from 'react'
import { Link as LinkIcon, Loader2, Plus, Trash2, Upload } from 'lucide-react'
import Select from '@/components/ui/Select'
import type { ApplicationDocumentType } from '@/features/experts/types'
import type {
  UploadApplicationDocumentResult,
  UploadProjectFileResult,
} from '@/features/experts/use-expert-application'
import { isBlockedStorageUrl } from '@/features/experts/onboarding-mappers'
import type {
  AddedLink,
  FeaturedProject,
  UploadedApplicationFile,
  VendorOnboardingData,
} from '@/hooks/types/vendor-contracts'
import { INDUSTRY_OPTIONS, ProductLogoTile } from './ProductsSection'
import { FileUploadArea, UploadedFileRow } from './UploadControls'

interface EvidenceSectionProps {
  formData: VendorOnboardingData
  setFormData: (data: VendorOnboardingData) => void
  uploadProjectFile: (clientProjectId: string, file: File) => Promise<UploadProjectFileResult>
  uploadDocument: (
    documentType: Extract<ApplicationDocumentType, 'intro_video' | 'portfolio'>,
    file: File,
  ) => Promise<UploadApplicationDocumentResult>
  readOnly?: boolean
}

const MAX_FEATURED_PROJECTS = 3

const emptyProject: FeaturedProject = {
  clientProjectId: '',
  title: '',
  clientIndustry: '',
  platform: '',
  delivered: '',
  outcome: '',
  link: '',
  ndaSafe: false,
}

function createClientProjectId() {
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function EvidenceSection({
  formData,
  setFormData,
  uploadProjectFile,
  uploadDocument,
  readOnly = false,
}: EvidenceSectionProps) {
  const [linkInput, setLinkInput] = useState('')
  const [uploadingType, setUploadingType] = useState<ApplicationDocumentType | null>(null)
  const [uploadingProject, setUploadingProject] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const projects = formData.featuredProjects
  const links: AddedLink[] = formData.portfolioLinks
  const portfolioFiles: UploadedApplicationFile[] = formData.portfolioFiles
  const introVideoLink = formData.introVideoLink ?? ''
  const introVideoFile = formData.introVideoFile ?? null

  // Projects are tagged with one of the products chosen in the products
  // section so the card can show its logo. Legacy drafts may carry a
  // platform that is no longer selected; keep it selectable so nothing is lost.
  const productOptions = formData.productExpertise.map((product) => product.productName)
  const productIdByName = new Map(
    formData.productExpertise.map((product) => [product.productName, product.productId]),
  )

  const update = (patch: Partial<VendorOnboardingData>) => setFormData({ ...formData, ...patch })

  const updateProject = (clientProjectId: string, patch: Partial<FeaturedProject>) => {
    update({
      featuredProjects: projects.map((project) =>
        project.clientProjectId === clientProjectId ? { ...project, ...patch } : project),
    })
  }

  const addProject = () => {
    if (projects.length >= MAX_FEATURED_PROJECTS) return
    update({ featuredProjects: [...projects, { ...emptyProject, clientProjectId: createClientProjectId() }] })
  }

  const handleProjectFile = async (project: FeaturedProject, file: File | null) => {
    if (!file) return
    setUploadingProject(project.clientProjectId)
    setUploadError(null)
    try {
      const result = await uploadProjectFile(project.clientProjectId, file)
      if (!result.ok) {
        setUploadError(result.error.message)
        return
      }
      updateProject(project.clientProjectId, {
        fileStorageKey: result.data.storageKey,
        fileName: result.data.fileName,
        fileContentType: result.data.fileContentType,
        fileSizeBytes: result.data.fileSizeBytes,
      })
    } finally {
      setUploadingProject(null)
    }
  }

  const handleDocument = async (
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
      update({ introVideoLink: '', introVideoFile: uploaded })
    } else {
      update({ portfolioFiles: [...portfolioFiles, uploaded] })
    }
  }

  const handleAddLink = () => {
    const trimmed = linkInput.trim()
    if (!trimmed) return
    update({ portfolioLinks: [...links, { url: trimmed, visible: true, linkType: 'portfolio' }] })
    setLinkInput('')
  }

  return (
    <div className="vo-step" style={{ gap: 'var(--sp-8)' }}>
      {/* ─── Featured projects ─── */}
      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Up to {MAX_FEATURED_PROJECTS}</p>
          <p className="pp-h6">
            <span
              className="vo-label-tip"
              data-tip="Your strongest client work. Tag each with the product it was delivered on."
            >Featured projects</span>
          </p>
        </div>

        {projects.map((project, idx) => {
          const platformId = productIdByName.get(project.platform) ?? null
          const platformOptions = project.platform && !productOptions.includes(project.platform)
            ? [project.platform, ...productOptions]
            : productOptions
          return (
            <div key={project.clientProjectId} className="vo-subcard">
              <div className="vo-subcard-head">
                <div className="pp-row pp-gap-3" style={{ minWidth: 0 }}>
                  {project.platform ? (
                    <ProductLogoTile productId={platformId} productName={project.platform} />
                  ) : (
                    <span className="pp-tile pp-tile--sm pp-mono-num" aria-hidden>{String(idx + 1).padStart(2, '0')}</span>
                  )}
                  <p className="pp-h6" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {project.title || `Project ${idx + 1}`}
                  </p>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => update({ featuredProjects: projects.filter((p) => p.clientProjectId !== project.clientProjectId) })}
                    className="pp-btn pp-btn--ghost pp-btn--sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="pp-field">
                <label>
                  Project title <span className="vo-req">*</span>
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject(project.clientProjectId, { title: e.target.value })}
                  placeholder="HubSpot migration for a 60-seat SaaS sales team"
                  className="pp-input"
                  disabled={readOnly}
                />
              </div>

              <div className="vo-grid-2">
                <Select
                  label="Product used"
                  options={platformOptions.map((name) => ({ value: name, label: name }))}
                  value={project.platform}
                  onChange={(value) => updateProject(project.clientProjectId, { platform: value })}
                  placeholder={productOptions.length ? 'Choose a product' : 'Add products first'}
                  hintText={productOptions.length ? undefined : 'Products you pick in the Products section appear here.'}
                  disabled={readOnly || (platformOptions.length === 0)}
                />

                <Select
                  label="Client industry"
                  options={INDUSTRY_OPTIONS.map((industry) => ({ value: industry, label: industry }))}
                  value={project.clientIndustry}
                  onChange={(value) => updateProject(project.clientProjectId, { clientIndustry: value })}
                  placeholder="Choose an industry"
                  disabled={readOnly}
                />
              </div>

              <div className="pp-field">
                <label>
                  What you delivered <span className="vo-req">*</span>
                </label>
                <textarea
                  value={project.delivered}
                  onChange={(e) => updateProject(project.clientProjectId, { delivered: e.target.value })}
                  placeholder="Migrated 40k contacts and 3 pipelines from Salesforce, rebuilt lead routing, trained 12 reps"
                  className="pp-textarea"
                  style={{ minHeight: 98 }}
                  disabled={readOnly}
                />
              </div>

              <div className="pp-field">
                <label>What changed for the client</label>
                <textarea
                  value={project.outcome}
                  onChange={(e) => updateProject(project.clientProjectId, { outcome: e.target.value })}
                  placeholder="Lead response time went from 2 days to 3 hours; no deals lost in cutover"
                  className="pp-textarea"
                  style={{ minHeight: 78 }}
                  disabled={readOnly}
                />
              </div>

              <div className="pp-field">
                <label>Case study or reference link</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => updateProject(project.clientProjectId, { link: e.target.value })}
                  placeholder="https://yourstudio.com/case-studies/acme"
                  className="pp-input"
                  disabled={readOnly}
                />
              </div>

              <div className="pp-field">
                <label>
                  <span
                    className="vo-label-tip"
                    data-tip="PDF, DOC, DOCX, TXT, PNG, or JPG. Max 5 MB per file."
                  >Project evidence</span>
                </label>
                {!readOnly && (
                  <label className="vo-drop" style={{ paddingBlock: 'var(--sp-5)' }}>
                    <span className="pp-link-arrow" style={{ pointerEvents: 'none' }}>
                      {uploadingProject === project.clientProjectId ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploadingProject === project.clientProjectId
                        ? 'Uploading…'
                        : project.fileName
                          ? `Replace ${project.fileName}`
                          : 'Upload project file'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      disabled={uploadingProject === project.clientProjectId}
                      onChange={(event) => {
                        void handleProjectFile(project, event.target.files?.[0] ?? null)
                        event.currentTarget.value = ''
                      }}
                      className="hidden"
                    />
                  </label>
                )}
                {project.fileName && (
                  <div className="vo-row">
                    <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
                      <span className="vo-row-name">{project.fileName}</span>
                      <span className="vo-row-meta">
                        Uploaded
                        {project.fileSizeBytes ? ` · ${Math.round(project.fileSizeBytes / 1024)} KB` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pp-row pp-gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={project.ndaSafe}
                  onClick={() => updateProject(project.clientProjectId, { ndaSafe: !project.ndaSafe })}
                  className="vo-switch"
                  aria-label="This description is NDA safe"
                  disabled={readOnly}
                >
                  <span />
                </button>
                <span className="pp-body" style={{ color: 'var(--ink)' }}>This description is NDA safe</span>
              </div>
            </div>
          )
        })}

        {projects.length < MAX_FEATURED_PROJECTS && !readOnly && (
          <button type="button" onClick={addProject} className="pp-link-arrow" style={{ alignSelf: 'flex-start' }}>
            <Plus size={16} />
            Add featured project
          </button>
        )}
      </div>

      {/* ─── Intro video ─── */}
      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Introduction</p>
          <p className="pp-h6">
            <span
              className="vo-label-tip"
              data-tip="60 to 90 seconds. Who you are, what you implement, who it is for."
            >Video introduction</span>
          </p>
        </div>

        {!readOnly && (
          <FileUploadArea
            accept="video/mp4,video/quicktime,video/webm"
            helperText="MP4, MOV, or WebM. Max 200 MB."
            disabled={uploadingType === 'intro_video'}
            onFiles={(files) => {
              const file = files?.[0]
              if (file) void handleDocument('intro_video', file)
            }}
          />
        )}
        {introVideoFile ? (
          <UploadedFileRow
            file={introVideoFile}
            onRemove={() => update({ introVideoLink: '', introVideoFile: null })}
            onToggleVisibility={() => update({ introVideoFile: { ...introVideoFile, visible: !introVideoFile.visible } })}
          />
        ) : null}

        <div className="vo-divider">or paste a link</div>

        <input
          type="url"
          value={isBlockedStorageUrl(introVideoLink) ? '' : introVideoLink}
          onChange={(event) => {
            const value = event.target.value
            if (!isBlockedStorageUrl(value)) update({ introVideoLink: value })
          }}
          placeholder="https://www.loom.com/share/… or a YouTube link"
          className="pp-input"
          disabled={readOnly}
        />
      </div>

      {/* ─── Portfolio ─── */}
      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Evidence</p>
          <p className="pp-h6">Portfolio files and links</p>
          <p className="pp-small">Case studies, decks, or public write-ups. Choose what clients can see.</p>
        </div>

        {!readOnly && (
          <FileUploadArea
            accept=".pdf,.png,.jpg,.jpeg"
            helperText="PDF, PNG, or JPG. Max 25 MB each."
            disabled={uploadingType === 'portfolio'}
            onFiles={(files) => {
              const file = files?.[0]
              if (file) void handleDocument('portfolio', file)
            }}
          />
        )}
        {portfolioFiles.map((file, index) => (
          <UploadedFileRow
            key={file.id ?? file.storageKey ?? `${file.name}-${index}`}
            file={file}
            onRemove={() => update({ portfolioFiles: portfolioFiles.filter((_, i) => i !== index) })}
            onToggleVisibility={() => update({
              portfolioFiles: portfolioFiles.map((entry, i) => (i === index ? { ...entry, visible: !entry.visible } : entry)),
            })}
          />
        ))}

        {!readOnly && (
          <div className="pp-field">
            <label htmlFor="vo-portfolio-link">Portfolio link</label>
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
                placeholder="https://yourstudio.com/work"
                className="pp-input"
              />
              <button type="button" onClick={handleAddLink} className="pp-btn pp-btn--secondary">
                Add
              </button>
            </div>
          </div>
        )}

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
                    <input
                      type="checkbox"
                      style={{ marginTop: 0 }}
                      checked={link.visible}
                      onChange={() => update({
                        portfolioLinks: links.map((entry, i) => (i === index ? { ...entry, visible: !entry.visible } : entry)),
                      })}
                      disabled={readOnly}
                    />
                    Visible
                  </label>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => update({ portfolioLinks: links.filter((_, i) => i !== index) })}
                      className="vo-icon-btn vo-icon-btn--danger"
                      aria-label={`Remove ${link.url}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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
