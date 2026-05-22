'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface ProjectListProps {
  projects: any[]
  onChange: (projects: any[]) => void
}

export default function ProjectList({ projects = [], onChange }: ProjectListProps) {
  const [newProject, setNewProject] = useState({ title: '', summary: '', link: '', outcomes: '' })

  const addProject = () => {
    if (newProject.title && newProject.summary && newProject.outcomes) {
      onChange([...projects, newProject])
      setNewProject({ title: '', summary: '', link: '', outcomes: '' })
    }
  }

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {projects.map((project, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-xl relative border border-gray-100 group">
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
          </div>
        ))}
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
            value={newProject.link}
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
