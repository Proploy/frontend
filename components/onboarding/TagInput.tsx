'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, ChevronDown } from 'lucide-react'

interface TagInputProps {
  values: string[]
  onChange: (values: string[]) => void
  label: string
  suggestions?: string[]
}

export default function TagInput({ values = [], onChange, label, suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) => !values.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
      setInput('')
      setShowSuggestions(false)
      setShowDropdown(false)
    }
  }

  const addFromSuggestion = (value: string) => {
    addTag(value)
  }

  const removeTag = (value: string) => {
    onChange(values.filter((item) => item !== value))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    }
  }

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
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
      <div className="relative flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(e.target.value.length > 0 || suggestions.length > 0)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={`Add ${label.toLowerCase()}...`}
            className="w-full h-[48px] px-4 rounded-lg bg-[#F4F8FD] border border-transparent focus:border-[#0466E7] focus:outline-none transition-all text-sm"
          />
          {showSuggestions && filteredSuggestions.length > 0 && input && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addFromSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F4F8FD] text-sm text-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        {suggestions.length > 0 && (
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-3 bg-[#F4F8FD] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            <ChevronDown size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={() => addTag(input)}
          className="p-3 bg-[#0466E7] text-white rounded-lg hover:bg-[#0355c0] transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>
      {showDropdown && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 px-1">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.filter((s) => !values.includes(s)).slice(0, 10).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addFromSuggestion(s)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-[#0466E7]/10 hover:text-[#0466E7] rounded-full text-sm text-gray-600 transition-colors border border-gray-100"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
