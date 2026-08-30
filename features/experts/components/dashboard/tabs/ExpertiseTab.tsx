'use client'

import { useState } from 'react'
import type { ExpertMe } from '@/features/experts/types'
import { useExpertDashboard } from '@/features/experts/use-expert-dashboard'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { Loader2 } from 'lucide-react'

// Simple helper component to render a comma-separated list into an array editor,
// or we can just use text areas and split by comma for simplicity in this iteration.
export function ExpertiseTab({ expert }: { expert: ExpertMe }) {
  const { updateProfile } = useExpertDashboard()
  
  const [primaryPlatforms, setPrimaryPlatforms] = useState(expert.primaryPlatforms?.join(', ') || '')
  const [secondaryPlatforms, setSecondaryPlatforms] = useState(expert.secondaryPlatforms?.join(', ') || '')
  const [industryExpertise, setIndustryExpertise] = useState(expert.industryExpertise?.join(', ') || '')
  const [preferredProjectTypes, setPreferredProjectTypes] = useState(expert.preferredProjectTypes?.join(', ') || '')
  const [toolsStack, setToolsStack] = useState(expert.toolsStack?.join(', ') || '')
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isDirty = 
    primaryPlatforms !== (expert.primaryPlatforms?.join(', ') || '') ||
    secondaryPlatforms !== (expert.secondaryPlatforms?.join(', ') || '') ||
    industryExpertise !== (expert.industryExpertise?.join(', ') || '') ||
    preferredProjectTypes !== (expert.preferredProjectTypes?.join(', ') || '') ||
    toolsStack !== (expert.toolsStack?.join(', ') || '')

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    
    const splitMap = (val: string) => val.split(',').map(s => s.trim()).filter(Boolean)

    const res = await updateProfile({
      primaryPlatforms: splitMap(primaryPlatforms),
      secondaryPlatforms: splitMap(secondaryPlatforms),
      industryExpertise: splitMap(industryExpertise),
      preferredProjectTypes: splitMap(preferredProjectTypes),
      toolsStack: splitMap(toolsStack)
    } as any)
    
    setSaving(false)
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(res.error?.message || 'Failed to update expertise')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#181d27]">Expertise & Skills</h2>
        <p className="mt-1 text-[14px] text-[#535862]">Enter your skills separated by commas.</p>
        
        {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Expertise details saved successfully.</div>}

        <div className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Primary Platforms</span>
            <input 
              value={primaryPlatforms}
              onChange={(e) => setPrimaryPlatforms(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              placeholder="e.g. Shopify, Magento"
            />
          </label>
          
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Secondary Platforms</span>
            <input 
              value={secondaryPlatforms}
              onChange={(e) => setSecondaryPlatforms(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              placeholder="e.g. BigCommerce, WooCommerce"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Industry Expertise</span>
            <input 
              value={industryExpertise}
              onChange={(e) => setIndustryExpertise(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              placeholder="e.g. Fashion, Electronics"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Preferred Project Types</span>
            <input 
              value={preferredProjectTypes}
              onChange={(e) => setPreferredProjectTypes(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              placeholder="e.g. Migration, Custom Theme"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Tools Stack</span>
            <input 
              value={toolsStack}
              onChange={(e) => setToolsStack(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              placeholder="e.g. React, Next.js, Tailwind"
            />
          </label>
          
          <div className="mt-4 flex justify-end border-t border-[#e9eaeb] pt-5">
            <button 
              type="button" 
              disabled={!isDirty || saving}
              onClick={handleSave}
              className={`inline-flex h-10 items-center justify-center rounded-[8px] bg-[#155eef] px-4 text-[14px] font-semibold text-white transition-colors disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
