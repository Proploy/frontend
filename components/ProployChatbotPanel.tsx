'use client'

import { useState } from 'react'
import { X, ImageIcon, BarChart3, Zap, FileText, Edit3, Sparkles, Paperclip, Smile } from 'lucide-react'

const PROMPTS = [
  { label: 'Create image', icon: <ImageIcon size={12} className="text-emerald-600" /> },
  { label: 'Analyze data', icon: <BarChart3 size={12} className="text-blue-500" /> },
  { label: 'Make a plan', icon: <Zap size={12} className="text-violet-500" /> },
  { label: 'Summarize text', icon: <FileText size={12} className="text-fuchsia-500" /> },
  { label: 'Help me write', icon: <Edit3 size={12} className="text-orange-500" /> },
  { label: 'More', icon: <Sparkles size={12} className="text-[#414651]" /> },
]

interface ProployChatbotPanelProps {
  userName?: string
  onClose?: () => void
  onSend?: (message: string) => void
  className?: string
}

export default function ProployChatbotPanel({
  userName = 'Olivia',
  onClose,
  onSend,
  className = '',
}: ProployChatbotPanelProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim()) return
    onSend?.(message)
    setMessage('')
  }

  return (
    <div
      className={`flex flex-col w-full h-full bg-white font-[family-name:var(--font-dm-sans)] ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-[20px] w-full">
        <div className="flex items-center gap-[16px] pt-[20px] px-[24px]">
          <p className="flex-1 font-semibold text-[18px] leading-[28px] text-[#181d27]">
            Proploy Chatbot
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chatbot"
            className="flex items-center justify-center p-[10px] rounded-[8px] hover:bg-gray-50"
          >
            <X size={20} className="text-[#414651]" />
          </button>
        </div>
        <div className="h-px w-full bg-[#e9eaeb]" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-[32px] overflow-y-auto px-[24px] pb-[24px]">
        <div className="flex flex-col items-center gap-[20px] w-full px-[16px] py-[24px]">
          {/* Logo */}
          <div className="grid grid-cols-2 gap-[4.44px]">
            <div className="size-[17.78px] rounded-[2.37px] bg-[#0d1f36]" />
            <div className="size-[17.78px] rounded-[2.37px] bg-[#0d1f36]" />
            <div className="size-[17.78px] rounded-[2.37px] bg-[#0466e7]" />
            <div className="size-[17.78px] rounded-[2.37px] bg-[#0d1f36]" />
          </div>

          <div className="flex flex-col items-center gap-[8px] text-center w-full">
            <div className="flex flex-col w-full">
              <p className="font-semibold text-[16px] leading-[24px] text-[#717680]">
                Hi {userName},
              </p>
              <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                Welcome back! How can I help?
              </p>
            </div>
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              I&apos;m here to help tackle your tasks. Choose from the prompts below or tell me what you need!
            </p>
          </div>
        </div>

        {/* Prompt badges */}
        <div className="flex flex-wrap items-start justify-center gap-[8px] w-full px-[16px] pb-[32px]">
          {PROMPTS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="flex items-center gap-[4px] bg-white border border-[#d5d7da] rounded-[8px] pl-[8px] pr-[10px] py-[4px] shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] hover:bg-gray-50 transition-colors"
            >
              {p.icon}
              <span className="font-medium text-[14px] leading-[20px] text-[#414651]">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#e9eaeb] bg-white pt-[20px] pb-[24px] px-[24px]">
        <div className="relative flex flex-col h-[128px] w-full">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="flex-1 w-full px-[14px] pt-[12px] pb-[44px] bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] resize-none font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#0466e7]/30 focus:border-[#0466e7]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <div className="absolute bottom-[8px] right-[14px] flex items-center gap-[8px]">
            <button
              type="button"
              aria-label="Attach file"
              className="flex items-center justify-center p-[6px] rounded-[6px] hover:bg-gray-50"
            >
              <Paperclip size={16} className="text-[#414651]" />
            </button>
            <button
              type="button"
              aria-label="Insert emoji"
              className="flex items-center justify-center p-[6px] rounded-[6px] hover:bg-gray-50"
            >
              <Smile size={16} className="text-[#414651]" />
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:text-[#0466e7]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
