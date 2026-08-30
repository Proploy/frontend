'use client'

import { useState } from 'react'
import type { ExpertMe } from '@/features/experts/types'
import { useExpertDashboard } from '@/features/experts/use-expert-dashboard'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { Loader2 } from 'lucide-react'

export function ExperienceTab({ expert }: { expert: ExpertMe }) {
  const { updateProfile } = useExpertDashboard()
  const [yearsExperience, setYearsExperience] = useState(expert.yearsExperience?.toString() || '')
  const [availabilityHoursPerWeek, setAvailabilityHoursPerWeek] = useState(expert.availabilityHoursPerWeek?.toString() || '')
  const [availabilityNotes, setAvailabilityNotes] = useState(expert.availabilityNotes || '')
  const [whyPlatform, setWhyPlatform] = useState(expert.whyPlatform || '')
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isDirty = 
    yearsExperience !== (expert.yearsExperience?.toString() || '') ||
    availabilityHoursPerWeek !== (expert.availabilityHoursPerWeek?.toString() || '') ||
    availabilityNotes !== (expert.availabilityNotes || '') ||
    whyPlatform !== (expert.whyPlatform || '')

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    const payload: any = {}
    if (yearsExperience) payload.yearsExperience = parseInt(yearsExperience, 10)
    if (availabilityHoursPerWeek) payload.availabilityHoursPerWeek = parseInt(availabilityHoursPerWeek, 10)
    payload.availabilityNotes = availabilityNotes
    payload.whyPlatform = whyPlatform

    const resActual = await updateProfile(payload)
    
    setSaving(false)
    if (resActual.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(resActual.error?.message || 'Failed to update experience details')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#181d27]">Experience & Availability</h2>
        <p className="mt-1 text-[14px] text-[#535862]">Update your professional metrics and availability.</p>
        
        {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Experience details saved successfully.</div>}

        <div className="mt-6 flex flex-col gap-5">
          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[14px] font-medium text-[#414651]">Years of Experience</span>
              <input 
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[14px] font-medium text-[#414651]">Availability (Hours/week)</span>
              <input 
                type="number"
                value={availabilityHoursPerWeek}
                onChange={(e) => setAvailabilityHoursPerWeek(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
              />
            </label>
          </div>
          
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Availability Notes</span>
            <textarea 
              value={availabilityNotes}
              onChange={(e) => setAvailabilityNotes(e.target.value)}
              rows={3}
              className="w-full rounded-[8px] border border-[#d5d7da] bg-white p-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Why Proploy?</span>
            <textarea 
              value={whyPlatform}
              onChange={(e) => setWhyPlatform(e.target.value)}
              rows={4}
              className="w-full rounded-[8px] border border-[#d5d7da] bg-white p-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" 
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
