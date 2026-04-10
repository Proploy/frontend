'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Loader2, ExternalLink, CheckCircle, XCircle, Clock, AlertCircle, Users, UserCheck, UserX, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

type ExpertStatus = 'submitted' | 'approved' | 'rejected' | 'draft' | 'changes_requested'

type Stats = {
  total: number
  submitted: number
  approved: number
  rejected: number
  draft: number
}

function AdminExpertsContent() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [experts, setExperts] = useState<any[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('status') || 'all')

  useEffect(() => {
    async function fetchData() {
      try {
        const [expertsRes, statsRes] = await Promise.all([
          fetch(`/api/admin/experts${activeTab !== 'all' ? `?status=${activeTab}` : ''}`),
          fetch('/api/admin/experts/stats')
        ])

        if (!expertsRes.ok) {
          if (expertsRes.status === 401) {
            router.push('/sign-in')
            return
          }
          throw new Error('Failed to fetch experts')
        }

        const expertsData = await expertsRes.json()
        const statsData = await statsRes.json()

        setExperts(expertsData.data?.data || expertsData.data || [])
        setStats(statsData.data || null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (!isAuthLoading) {
      fetchData()
    }
  }, [isAuthLoading, activeTab, router])

  const tabs = [
    { id: 'all', label: 'All', count: stats?.total || 0, icon: Users },
    { id: 'submitted', label: 'Pending', count: stats?.submitted || 0, icon: Clock },
    { id: 'approved', label: 'Approved', count: stats?.approved || 0, icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', count: stats?.rejected || 0, icon: XCircle },
    { id: 'draft', label: 'Draft', count: stats?.draft || 0, icon: FileText },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-600 border-green-100'
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100'
      case 'submitted': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'changes_requested': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={18} />
      case 'rejected': return <XCircle className="text-red-500" size={18} />
      case 'submitted': return <Clock className="text-blue-500" size={18} />
      default: return <Clock className="text-gray-400" size={18} />
    }
  }

  if (isAuthLoading || isLoading) {
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

  return (
    <div className="min-h-screen bg-[#F4F8FD] pt-[120px] pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#011127] font-dm-sans mb-2">Expert Applications</h1>
            <p className="text-gray-500 font-medium tracking-tight">Manage and review incoming expert applications.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-blue-50/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#0466E7] text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
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
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(expert.status)}`}>
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

export default function AdminExpertsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0466E7]" />
      </div>
    }>
      <AdminExpertsContent />
    </Suspense>
  )
}
