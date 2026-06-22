'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Tag from '@/components/ui/Tag'

interface TagInputProps {
  values: string[]
  label: string
  suggestions?: string[]
  onChange: (values: string[]) => void
  error?: boolean
  allowCustom?: boolean
  loading?: boolean
}

export default function TagInput({
  values = [],
  label,
  suggestions = [],
  onChange,
  error,
  allowCustom = true,
  loading = false,
}: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = (value: string = input) => {
    const trimmed = value.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    if (value === input) setInput('')
  }

  const removeTag = (value: string) => {
    onChange(values.filter((v) => v !== value))
  }

  const normalizedInput = input.trim().toLowerCase()
  const unusedSuggestions = suggestions.filter(
    (suggestion) =>
      !values.includes(suggestion)
      && (!normalizedInput || suggestion.toLowerCase().includes(normalizedInput)),
  )

  return (
    <div className="flex flex-col gap-[12px]">
      {/* Selected tags */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-[8px]">
          {values.map((value) => (
            <Tag
              key={value}
              size="md"
              action="x-close"
              onClose={() => removeTag(value)}
              className="bg-[#eff4ff] border-[#b2ccff] text-[#004eeb]"
            >
              {value}
            </Tag>
          ))}
        </div>
      )}

      {/* Input row */}
      {(allowCustom || suggestions.length > 0) && (
        <div
          className={`flex gap-[8px] items-center bg-white border rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] transition-colors ${
            error
              ? 'border-[#fda29b] focus-within:ring-1 focus-within:ring-[#fda29b]'
              : 'border-[#d5d7da] focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff]'
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              e.preventDefault()
              if (allowCustom) addTag()
              else if (unusedSuggestions.length === 1) addTag(unusedSuggestions[0])
            }}
            placeholder={allowCustom ? `Add ${label.toLowerCase()}...` : `Search ${label.toLowerCase()}...`}
            className="flex-1 font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] bg-transparent outline-none"
            style={{ fontVariationSettings: "'opsz' 14" }}
          />
          {allowCustom && (
            <button
              type="button"
              onClick={() => addTag()}
              disabled={!input.trim()}
              className="shrink-0 size-[28px] rounded-[6px] bg-[#155eef] text-white flex items-center justify-center hover:bg-[#004eeb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}

      {/* Suggestions */}
      {loading ? (
        <p className="text-[14px] leading-[20px] text-[#717680]">Loading catalog products…</p>
      ) : unusedSuggestions.length > 0 ? (
        <div className="flex flex-wrap gap-[6px]">
          {unusedSuggestions.slice(0, 12).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="inline-flex items-center h-[24px] px-[9px] rounded-[6px] bg-white border border-[#d0d5dd] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#344054] hover:border-[#2970ff] hover:text-[#004eeb] hover:bg-[#f5f8ff] transition-colors whitespace-nowrap"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      ) : !allowCustom && normalizedInput ? (
        <p className="text-[14px] leading-[20px] text-[#717680]">
          No catalog products match “{input.trim()}”.
        </p>
      ) : !allowCustom ? (
        <p className="text-[14px] leading-[20px] text-[#717680]">
          All available products have been selected.
        </p>
      ) : null}
    </div>
  )
}
