'use client'

import { useState, useRef } from 'react'
import type { ExpertMe } from '@/features/experts/types'
import { useExpertDashboard } from '@/features/experts/use-expert-dashboard'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { Loader2, Camera, X } from 'lucide-react'

export function ProfileTab({ expert }: { expert: ExpertMe }) {
  const { updateProfile } = useExpertDashboard()
  const [displayName, setDisplayName] = useState(expert.displayName || '')
  const [headline, setHeadline] = useState(expert.headline || '')
  const [regionCountry, setRegionCountry] = useState(expert.regionCountry || '')
  const [timezone, setTimezone] = useState(expert.timezone || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isDirty = 
    displayName !== (expert.displayName || '') ||
    headline !== (expert.headline || '') ||
    regionCountry !== (expert.regionCountry || '') ||
    timezone !== (expert.timezone || '')

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    const res = await updateProfile({
      displayName,
      headline,
      regionCountry,
      timezone
    })
    setSaving(false)
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(res.error?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#181d27]">Basic Profile</h2>
        <p className="mt-1 text-[14px] text-[#535862]">Manage your personal information and headline.</p>
        
        {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Profile saved successfully.</div>}

        <div className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Display Name</span>
            <input 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
            />
          </label>
          
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Headline</span>
            <input 
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
            />
          </label>

          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[14px] font-medium text-[#414651]">Country</span>
              <input 
                value={regionCountry}
                onChange={(e) => setRegionCountry(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[14px] font-medium text-[#414651]">Timezone</span>
              <input 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              />
            </label>
          </div>
          
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
