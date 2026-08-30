'use client'

import { useState } from 'react'
import type { ExpertMe, ExpertLinkResponse, ExpertProjectResponse } from '@/features/experts/types'
import { useExpertDashboard } from '@/features/experts/use-expert-dashboard'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { Loader2, Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react'

export function PortfolioTab({ expert }: { expert: ExpertMe }) {
  const { addLink, deleteLink, addProject, deleteProject, uploadProjectFile } = useExpertDashboard()
  const [links, setLinks] = useState<ExpertLinkResponse[]>(expert.links || [])
  const [projects, setProjects] = useState<ExpertProjectResponse[]>(expert.projects || [])

  const [linkUrl, setLinkUrl] = useState('')
  const [linkType, setLinkType] = useState('portfolio')
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)

  const [projectTitle, setProjectTitle] = useState('')
  const [projectSummary, setProjectSummary] = useState('')
  const [projectOutcomes, setProjectOutcomes] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [projectError, setProjectError] = useState<string | null>(null)

  const handleAddLink = async () => {
    if (!linkUrl) return
    setIsAddingLink(true)
    setLinkError(null)
    const res = await addLink({ linkType, url: linkUrl })
    setIsAddingLink(false)
    if (res.ok) {
      setLinks([...links, res.data as unknown as ExpertLinkResponse])
      setLinkUrl('')
    } else {
      setLinkError(res.error?.message || 'Failed to add link')
    }
  }

  const handleDeleteLink = async (id: string) => {
    const res = await deleteLink(id)
    if (res.ok) {
      setLinks(links.filter(l => l.id !== id))
    }
  }

  const handleAddProject = async () => {
    if (!projectTitle || !projectSummary || !projectOutcomes) {
      setProjectError('Please fill in all required project fields.')
      return
    }
    setIsAddingProject(true)
    setProjectError(null)
    
    let fileMeta = null
    if (projectFile) {
      // For immediate upload we'd ideally have an endpoint that doesn't need projectId first,
      // but our API currently requires projectId. So we create the project first, then upload the file.
    }

    const res = await addProject({
      title: projectTitle,
      summary: projectSummary,
      outcomes: projectOutcomes,
      link: projectUrl || undefined,
    })
    
    if (res.ok) {
      const newProject = res.data as unknown as ExpertProjectResponse
      
      if (projectFile) {
        const fileRes = await uploadProjectFile(newProject.id, projectFile)
        if (fileRes.ok) {
          // Ideally refresh the project to get the updated file data, 
          // for now we'll just optimistically update the list
        }
      }
      
      // Need a full refresh realistically to get the exact final object, but optimistic for now
      setProjects([...projects, newProject])
      setProjectTitle('')
      setProjectSummary('')
      setProjectOutcomes('')
      setProjectUrl('')
      setProjectFile(null)
    } else {
      setProjectError(res.error?.message || 'Failed to add project')
    }
    setIsAddingProject(false)
  }

  const handleDeleteProject = async (id: string) => {
    const res = await deleteProject(id)
    if (res.ok) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#181d27]">Links</h2>
        <p className="mt-1 text-[14px] text-[#535862]">Add links to your external portfolios, GitHub, or LinkedIn.</p>
        
        {linkError && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{linkError}</div>}

        <div className="mt-6 flex flex-col gap-4">
          {links.map(link => (
            <div key={link.id} className="flex items-center justify-between rounded-lg border border-[#e9eaeb] p-4">
              <div className="flex items-center gap-3">
                <LinkIcon size={18} className="text-[#535862]" />
                <div>
                  <div className="text-[14px] font-medium text-[#181d27] capitalize">{link.linkType.replace('_', ' ')}</div>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-[14px] text-[#155eef] hover:underline flex items-center gap-1">
                    {link.url} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <button onClick={() => handleDeleteLink(link.id)} className="text-[#d92d20] hover:text-[#b42318]">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          <div className="flex gap-3 items-end border-t border-[#e9eaeb] pt-4 mt-2">
            <label className="flex flex-col gap-1.5 w-1/4">
              <span className="text-[13px] font-medium text-[#414651]">Type</span>
              <select 
                value={linkType}
                onChange={(e) => setLinkType(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[14px] outline-none"
              >
                <option value="portfolio">Portfolio</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="website">Website</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 flex-1">
              <span className="text-[13px] font-medium text-[#414651]">URL</span>
              <input 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[14px] outline-none" 
                placeholder="https://"
              />
            </label>
            <button 
              onClick={handleAddLink}
              disabled={isAddingLink || !linkUrl}
              className={`inline-flex h-10 items-center justify-center rounded-[8px] bg-[#181d27] px-4 text-[14px] font-semibold text-white transition-colors disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              {isAddingLink ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span className="ml-2">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#181d27]">Projects</h2>
        <p className="mt-1 text-[14px] text-[#535862]">Add your past projects and case studies.</p>
        
        {projectError && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{projectError}</div>}

        <div className="mt-6 flex flex-col gap-4">
          {projects.map(project => (
            <div key={project.id} className="flex items-start justify-between rounded-lg border border-[#e9eaeb] p-4">
              <div className="flex flex-col gap-2">
                <div className="text-[16px] font-medium text-[#181d27]">{project.title}</div>
                <div className="text-[14px] text-[#535862]">{project.summary}</div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-[13px] text-[#155eef] hover:underline flex items-center gap-1">
                    Project Link <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <button onClick={() => handleDeleteProject(project.id)} className="text-[#d92d20] hover:text-[#b42318] p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          <div className="flex flex-col gap-4 border-t border-[#e9eaeb] pt-4 mt-2">
            <h3 className="text-[15px] font-medium text-[#181d27]">Add New Project</h3>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[#414651]">Title *</span>
              <input 
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[14px] outline-none" 
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[#414651]">Summary *</span>
              <textarea 
                value={projectSummary}
                onChange={(e) => setProjectSummary(e.target.value)}
                rows={2}
                className="w-full rounded-[8px] border border-[#d5d7da] bg-white p-3 text-[14px] outline-none" 
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[#414651]">Outcomes *</span>
              <textarea 
                value={projectOutcomes}
                onChange={(e) => setProjectOutcomes(e.target.value)}
                rows={2}
                className="w-full rounded-[8px] border border-[#d5d7da] bg-white p-3 text-[14px] outline-none" 
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[#414651]">URL (optional)</span>
              <input 
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[14px] outline-none" 
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[#414651]">Attachment (optional)</span>
              <input 
                type="file"
                onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
                className="text-[14px] text-[#535862]" 
              />
            </label>
            
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleAddProject}
                disabled={isAddingProject || !projectTitle || !projectSummary || !projectOutcomes}
                className={`inline-flex h-10 items-center justify-center rounded-[8px] bg-[#181d27] px-4 text-[14px] font-semibold text-white transition-colors disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                {isAddingProject ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                Add Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
