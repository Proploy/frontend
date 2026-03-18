'use client'

import { useState } from 'react'
import { X, Plus, Link as LinkIcon } from 'lucide-react'

interface UrlListInputProps {
  links: any[]
  linkType: string
  onChange: (links: any[]) => void
  label: string
}

export default function UrlListInput({ links = [], linkType, onChange, label }: UrlListInputProps) {
  const [input, setInput] = useState('')

  const currentLinks = links.filter((l) => l.linkType === linkType)

  const addLink = () => {
    if (input.trim()) {
      try {
        new URL(input) // Basic validation
        const newLink = { linkType, url: input.trim() }
        onChange([...links, newLink])
        setInput('')
      } catch (err) {
        alert('Please enter a valid URL')
      }
    }
  }

  const removeLink = (url: string) => {
    onChange(links.filter((l) => !(l.linkType === linkType && l.url === url)))
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {currentLinks.map((link, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F4F8FD] rounded-xl border border-blue-50/50 group"
          >
            <div className="flex items-center gap-2 truncate">
              <LinkIcon size={14} className="text-[#0466E7] shrink-0" />
              <span className="text-sm text-gray-700 truncate">{link.url}</span>
            </div>
            <button 
              type="button" 
              onClick={() => removeLink(link.url)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
          placeholder={`Add ${label.toLowerCase()} URL...`}
          className="flex-1 h-[48px] px-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
        />
        <button
          type="button"
          onClick={addLink}
          className="p-3 bg-[#0466E7] text-white rounded-lg hover:bg-[#0355c0] transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
