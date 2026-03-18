'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2, ExternalLink, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminExpertsPage() {
  const { isLoaded, user } = useUser()
  const [experts, setExperts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExperts() {
      try {
        const res = await fetch('/api/admin/experts')
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized: Admin access required')
          throw new Error('Failed to fetch experts')
        }
        const data = await res.json()
        setExperts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    if (isLoaded) {
      fetchExperts()
    }
  }, [isLoaded])

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0466E7]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-red-50 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-red-600 mb-2">Access Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={18} />
      case 'rejected': return <XCircle className="text-red-500" size={18} />
      case 'submitted': return <Clock className="text-blue-500" size={18} />
      default: return <Clock className="text-gray-400" size={18} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD] pt-[120px] pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#011127] font-dm-sans mb-2">Expert Applications</h1>
            <p className="text-gray-500 font-medium tracking-tight">Manage and review incoming expert applications.</p>
          </div>
          <div className="px-5 py-2.5 bg-white border border-blue-100 rounded-full text-sm font-semibold text-[#0466E7] shadow-sm">
            {experts.length} Total Applicants
          </div>
        </div>

        <div className="grid gap-6">
          {experts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
               <p className="text-gray-400 font-medium">No applications found in the system.</p>
            </div>
          ) : (
            experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-blue-50/50 hover:shadow-md transition-all group">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#0466E7]/5 flex items-center justify-center text-[#0466E7] font-bold text-xl shrink-0 group-hover:bg-[#0466E7] group-hover:text-white transition-all duration-300">
                    {expert.displayName?.charAt(0) || 'E'}
                  </div>
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-[#011127] truncate">{expert.displayName}</h2>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-500 border border-gray-100">
                        {getStatusIcon(expert.status)}
                        {expert.status}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm truncate font-medium">{expert.headline || 'No headline'}</p>
                    <p className="text-gray-400 text-xs mt-1.5 font-medium">{expert.regionCity}, {expert.regionCountry} • {expert.yearsExperience} yrs exp</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                  <Link 
                    href={`/admin/experts/${expert.id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#011127] text-white rounded-full font-bold text-sm hover:bg-[#022a5e] transition-all"
                  >
                    Review Application
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
