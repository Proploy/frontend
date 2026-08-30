'use client'

import { useState } from 'react'
import type { ExpertMe } from '@/features/experts/types'
import { useExpertDashboard } from '@/features/experts/use-expert-dashboard'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { Loader2, UploadCloud } from 'lucide-react'

export function DocumentsTab({ expert }: { expert: ExpertMe }) {
  const { uploadApplicationDocument } = useExpertDashboard()
  
  const [docType, setDocType] = useState('portfolio')
  const [file, setFile] = useState<File | null>(null)
  
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    setSuccess(false)
    
    const res = await uploadApplicationDocument(docType, file)
    
    setUploading(false)
    if (res.ok) {
      setSuccess(true)
      setFile(null)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(res.error?.message || 'Failed to upload document')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#181d27]">Upload Documents</h2>
        <p className="mt-1 text-[14px] text-[#535862]">Upload your resume, portfolio, or certifications. Files upload immediately.</p>
        
        {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Document uploaded successfully.</div>}

        <div className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">Document Type</span>
            <select 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20"
            >
              <option value="portfolio">Portfolio</option>
              <option value="resume">Resume / CV</option>
              <option value="certification">Certification</option>
              <option value="case_study">Case Study</option>
              <option value="other">Other</option>
            </select>
          </label>
          
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-[#414651]">File</span>
            <input 
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-[14px] text-[#535862]" 
            />
          </label>
          
          <div className="mt-4 flex justify-end border-t border-[#e9eaeb] pt-5">
            <button 
              type="button" 
              disabled={!file || uploading}
              onClick={handleUpload}
              className={`inline-flex h-10 items-center justify-center rounded-[8px] bg-[#155eef] px-4 text-[14px] font-semibold text-white transition-colors disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              {uploading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <UploadCloud size={16} className="mr-2" />}
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
