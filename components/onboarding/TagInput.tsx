'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
  tags: any[]
  tagType: string
  onChange: (tags: any[]) => void
  label: string
}

export default function TagInput({ tags = [], tagType, onChange, label }: TagInputProps) {
  const [input, setInput] = useState('')

  const tagValues = tags
    .filter((t) => t.tagType === tagType)
    .map((t) => t.tagValue)

  const addTag = () => {
    if (input.trim() && !tagValues.includes(input.trim())) {
      const newTag = { tagType, tagValue: input.trim() }
      onChange([...tags, newTag])
      setInput('')
    }
  }

  const removeTag = (value: string) => {
    onChange(tags.filter((t) => !(t.tagType === tagType && t.tagValue === value)))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tagValues.map((value) => (
          <span 
            key={value} 
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0466E7]/10 text-[#0466E7] rounded-full text-sm font-medium border border-[#0466E7]/20"
          >
            {value}
            <button 
              type="button" 
              onClick={() => removeTag(value)}
              className="hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 h-[48px] px-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
        />
        <button
          type="button"
          onClick={addTag}
          className="p-3 bg-[#0466E7] text-white rounded-lg hover:bg-[#0355c0] transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
