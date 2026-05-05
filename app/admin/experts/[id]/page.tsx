'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, ArrowLeft, CheckCircle, XCircle, Clock, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

type TagGroup = {
  platform: string[]
  industry: string[]
  project_type: string[]
  tool: string[]
}

export default function ExpertReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [expert, setExpert] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [editedTags, setEditedTags] = useState<TagGroup>({
    platform: [],
    industry: [],
    project_type: [],
    tool: [],
  })
  const [newTagInputs, setNewTagInputs] = useState<Record<keyof TagGroup, string>>({
    platform: '',
    industry: '',
    project_type: '',
    tool: '',
  })

  const expertId = params?.id as string

  // Initialize editedTags when expert loads
  useEffect(() => {
    if (!expert?.tags) return
    const grouped: TagGroup = {
      platform: [],
      industry: [],
      project_type: [],
      tool: [],
    }
    expert.tags.forEach((tag: any) => {
      if (tag.tagType in grouped) {
        grouped[tag.tagType as keyof TagGroup].push(tag.tagValue)
      }
    })
    setEditedTags(grouped)
  }, [expert])

  useEffect(() => {
    if (!expertId) return
    
    async function fetchExpert() {
      try {
        const res = await fetch(`/api/admin/experts/${expertId}`)
        const json = await res.json()
        if (json.data) {
          setExpert(json.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExpert()
  }, [expertId])

  const handleUpdateStatus = async (status: string) => {
    if (!expertId) return
    setIsUpdating(true)
    try {
      const endpointStatus = status === 'changes_requested' ? 'request-changes' : status

      const res = await fetch(`/api/admin/experts/${expertId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: endpointStatus, notes: reviewNotes }),
      })
      if (res.ok) {
        router.push('/admin/experts')
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const addTag = (tagType: keyof TagGroup) => {
    const value = (newTagInputs[tagType] || '').trim()
    if (!value) return
    if (!editedTags[tagType].includes(value)) {
      setEditedTags(prev => ({ ...prev, [tagType]: [...prev[tagType], value] }))
    }
    setNewTagInputs(prev => ({ ...prev, [tagType]: '' }))
  }

  const removeTag = (tagType: keyof TagGroup, tagValue: string) => {
    setEditedTags(prev => ({
      ...prev,
      [tagType]: prev[tagType].filter(v => v !== tagValue),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0466E7]" />
      </div>
    )
  }

  if (!expert) {
    return <div>Expert not found.</div>
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD] pt-[120px] pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/experts" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0466E7] mb-8 font-bold transition-all group"
        >
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
            <ArrowLeft size={18} />
          </div>
          Back to Applications
        </Link>

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="px-4 py-2 bg-blue-50 rounded-full text-[#0466E7] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} />
                Admin Review Mode
             </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="flex-1">
              <div className="w-24 h-24 rounded-3xl bg-[#0466E7]/5 flex items-center justify-center text-[#0466E7] font-bold text-3xl mb-6">
                {expert.displayName?.charAt(0) || 'E'}
              </div>
              <h1 className="text-4xl font-bold text-[#011127] font-dm-sans mb-3">{expert.displayName}</h1>
              <p className="text-xl text-gray-500 font-medium">{expert.headline}</p>
            </div>
            <div className="flex flex-col gap-2 bg-[#F4F8FD] p-6 rounded-3xl border border-blue-50/50">
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Current Status</p>
               <div className="flex items-center gap-2 text-[#011127] font-bold text-lg">
                  {expert.status === 'approved' && <CheckCircle className="text-green-500" size={20} />}
                  {expert.status === 'rejected' && <XCircle className="text-red-500" size={20} />}
                  {expert.status === 'submitted' && <Clock className="text-blue-500" size={20} />}
                  <span className="capitalize">{expert.status}</span>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
            <section className="space-y-8">
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Location & Logistics</h3>
                <div className="space-y-3">
                  <p className="font-bold text-[#011127]">{expert.regionCity}, {expert.regionCountry}</p>
                  <p className="text-gray-600 font-medium">Timezone: {expert.timezone}</p>
                  <p className="text-gray-600 font-medium">{expert.availabilityHoursPerWeek} hrs/week available</p>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Experience Metrics</h3>
                <div className="space-y-3">
                  <p className="font-bold text-[#011127]">{expert.yearsExperience} Years Professional Experience</p>
                  <p className="text-gray-600 font-medium">{expert.projectsCompletedTotal} Total Projects Completed</p>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Identity & Intent</h3>
                <div className="space-y-4">
                   <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">Entity Type</p>
                    <p className="text-gray-700 font-medium">{expert.entityType}</p>
                   </div>
                   <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">Why Proploy?</p>
                    <p className="text-gray-700 font-medium leading-relaxed italic">"{expert.whyPlatform}"</p>
                   </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
               <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Professional Proof</h3>
                <div className="space-y-4">
                  {expert.links?.map((link: any, idx: number) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#0466E7] hover:bg-white transition-all group">
                      <span className="text-sm font-bold text-gray-600 group-hover:text-[#0466E7] capitalize">{link.linkType.replace('_', ' ')}</span>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                  ))}
                  {expert.introVideoLink && (
                    <a href={expert.introVideoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-[#0466E7]/5 rounded-2xl border border-[#0466E7]/10 hover:border-[#0466E7] transition-all group">
                      <span className="text-sm font-bold text-[#0466E7]">Intro Video</span>
                      <ExternalLink size={16} className="text-[#0466E7]" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Platform Expertise</h3>
                {(Object.keys(editedTags) as Array<keyof TagGroup>).map(tagType => (
                  <div key={tagType} className="mb-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 capitalize">{tagType.replace('_', ' ')}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedTags[tagType].map((val, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-[#0466E7]/10 text-[#0466E7] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          {val}
                          <button
                            type="button"
                            onClick={() => removeTag(tagType, val)}
                            className="ml-1 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Add ${tagType.replace('_', ' ')}...`}
                        value={newTagInputs[tagType]}
                        onChange={e => setNewTagInputs(prev => ({ ...prev, [tagType]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(tagType))}
                        className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#0466E7] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => addTag(tagType)}
                        className="px-3 py-1.5 text-xs font-bold bg-[#0466E7] text-white rounded-xl hover:bg-[#0356C7] transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-16 pt-12 border-t border-gray-100">
            <h3 className="text-xl font-bold text-[#011127] mb-6 font-dm-sans">Reviewer Action</h3>
            <textarea
              placeholder="Internal review notes (e.g. why rejected, what changes needed...)"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full p-6 rounded-3xl bg-[#F4F8FD] border border-blue-50 focus:border-[#0466E7] focus:outline-none transition-all mb-8 text-gray-700 min-h-[120px]"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleUpdateStatus('approved')}
                disabled={isUpdating}
                className="flex-1 py-4 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Approve Expert</>}
              </button>
              <button
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isUpdating}
                className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                 {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <><XCircle size={20} /> Reject</>}
              </button>
              <button
                onClick={() => handleUpdateStatus('changes_requested')}
                disabled={isUpdating}
                className="flex-1 py-4 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
              >
                 Request Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
