'use client'

import { useState } from 'react'
import { Link as LinkIcon, X, Plus } from 'lucide-react'

interface UrlListInputProps {
  links: string[]
  label: string
  onChange: (links: string[]) => void
  error?: boolean
}

function isValidUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default function UrlListInput({ links = [], label, onChange, error }: UrlListInputProps) {
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')

  const addLink = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    if (!isValidUrl(trimmed)) {
      setInputError('Please enter a valid URL (e.g. https://example.com)')
      return
    }

    if (!links.includes(trimmed)) {
      onChange([...links, trimmed])
    }
    setInput('')
    setInputError('')
  }

  const removeLink = (url: string) => {
    onChange(links.filter((l) => l !== url))
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {/* Listed links */}
      {links.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          {links.map((url, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-[12px] px-[14px] py-[10px] bg-[#f5f8ff] border border-[#d1e0ff] rounded-[8px] group"
            >
              <div className="flex items-center gap-[8px] min-w-0">
                <LinkIcon size={14} className="text-[#155eef] shrink-0" strokeWidth={2} />
                <span className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#004eeb] truncate">
                  {url}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeLink(url)}
                className="shrink-0 size-[20px] flex items-center justify-center text-[#98a2b3] hover:text-[#d92d20] transition-colors"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex flex-col gap-[6px]">
        <div
          className={`flex gap-[8px] items-center bg-white border rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] transition-colors ${
            inputError || error
              ? 'border-[#fda29b] focus-within:ring-1 focus-within:ring-[#fda29b]'
              : 'border-[#d5d7da] focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff]'
          }`}
        >
          <input
            type="url"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (inputError) setInputError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
            placeholder={`https://...`}
            className="flex-1 font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] bg-transparent outline-none"
            style={{ fontVariationSettings: "'opsz' 14" }}
          />
          <button
            type="button"
            onClick={addLink}
            disabled={!input.trim()}
            className="shrink-0 size-[28px] rounded-[6px] bg-[#155eef] text-white flex items-center justify-center hover:bg-[#004eeb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
        {inputError && (
          <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#d92d20]">
            {inputError}
          </p>
        )}
      </div>
    </div>
  )
}
