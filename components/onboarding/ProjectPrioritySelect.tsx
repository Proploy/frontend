'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface ProjectPrioritySelectProps {
  value: string[]
  groups: Record<string, string[]>
  selectedGroup: string
  onSelectedGroupChange: (group: string) => void
  onChange: (values: string[]) => void
}

export default function ProjectPrioritySelect({
  value = [],
  groups,
  selectedGroup,
  onSelectedGroupChange,
  onChange,
}: ProjectPrioritySelectProps) {
  const [selectedProjectType, setSelectedProjectType] = useState('')

  const projectTypes = selectedGroup ? groups[selectedGroup] || [] : []

  const addProjectType = () => {
    if (!selectedProjectType || value.includes(selectedProjectType)) {
      return
    }

    onChange([...value, selectedProjectType])
    setSelectedProjectType('')
  }

  const removeProjectType = (projectType: string) => {
    onChange(value.filter((item) => item !== projectType))
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <select
          value={selectedGroup}
          onChange={(e) => {
            onSelectedGroupChange(e.target.value)
            setSelectedProjectType('')
          }}
          className="h-[56px] px-4 rounded-xl bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all appearance-none"
        >
          <option value="">Select priority area...</option>
          {Object.keys(groups).map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <select
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
          disabled={!selectedGroup}
          className="h-[56px] px-4 rounded-xl bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="">
            {selectedGroup ? 'Select project type...' : 'Choose a priority area first'}
          </option>
          {projectTypes.map((projectType) => (
            <option key={projectType} value={projectType}>
              {projectType}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addProjectType}
          disabled={!selectedProjectType}
          className="h-[56px] px-5 bg-[#0466E7] text-white rounded-xl hover:bg-[#0355c0] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {selectedGroup && (
        <p className="text-sm text-gray-500">
          Project types for <span className="font-semibold text-[#011127]">{selectedGroup}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {value.map((projectType) => (
          <span
            key={projectType}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0466E7]/10 text-[#0466E7] rounded-full text-sm font-medium border border-[#0466E7]/20"
          >
            {projectType}
            <button
              type="button"
              onClick={() => removeProjectType(projectType)}
              className="hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
