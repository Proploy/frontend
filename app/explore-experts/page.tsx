'use client'

import { Loader2, MapPin, Briefcase, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useApprovedExperts } from '@/hooks/use-approved-experts'

export default function ExploreExpertsPage() {
  const { experts, loading } = useApprovedExperts()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0466E7]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD] pt-[140px] pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#011127] font-dm-sans mb-4 tracking-tight">Verified Implementation Experts</h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Connect with certified specialists to accelerate your digital transformation and tool implementation.
          </p>
          <div className="mt-10 flex justify-center">
            <Link 
              href="/become-expert" 
              className="px-8 py-4 bg-[#0466E7] text-white rounded-full font-bold hover:bg-[#0355c0] transition-all shadow-lg shadow-blue-200"
            >
              Join as an Expert
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.length === 0 ? (
            <div className="col-span-full py-20 text-center">
               <p className="text-gray-400 font-medium text-lg">No experts found yet. Check back soon!</p>
            </div>
          ) : (
            experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-[32px] overflow-hidden flex flex-col shadow-sm border border-blue-50/50 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                <div className="p-8 flex-1">
                   <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#0466E7]/5 flex items-center justify-center text-[#0466E7] font-bold text-2xl">
                        {expert.displayName?.charAt(0) || 'E'}
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100/50">
                        Verified
                      </div>
                   </div>
                   
                   <h2 className="text-2xl font-bold text-[#011127] mb-2 font-dm-sans">{expert.displayName}</h2>
                   <p className="text-[#0466E7] text-sm font-bold truncate mb-6">{expert.headline}</p>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                        <MapPin size={16} className="text-[#0466E7]" />
                        {expert.regionCity}, {expert.regionCountry}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                        <Briefcase size={16} className="text-[#0466E7]" />
                        {expert.yearsExperience}+ Years Experience
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-2 mb-8">
                      {expert.tags?.slice(0, 4).map((tag) => (
                        <span key={tag.id} className="px-3 py-1 bg-[#F4F8FD] text-gray-600 rounded-full text-[11px] font-bold uppercase tracking-wider border border-blue-50/50">
                          {tag.tagValue}
                        </span>
                      ))}
                      {expert.tags?.length > 4 && (
                        <span className="text-[11px] font-bold text-gray-400 self-center">+{expert.tags.length - 4} more</span>
                      )}
                   </div>
                </div>

                <div className="p-8 border-t border-gray-50 bg-gray-50/50">
                   <Link 
                     href={`/experts/${expert.id}`} // FUTURE: Detailed profile page
                     className="w-full flex items-center justify-between font-bold text-[#011127] hover:text-[#0466E7] transition-all group"
                   >
                     View Profile
                     <ChevronRight size={20} className="group-hover:translate-x-1 transition-all" />
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

