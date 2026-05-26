'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, ExternalLink, MapPin, Clock, Briefcase, Award, Star, MessageSquare, CheckCircle, Globe, Code, Folder, User } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

type TagGroup = {
  platform: string[]
  industry: string[]
  project_type: string[]
  tool: string[]
}

export default function ExpertDashboardPage() {
  const { user, expert } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!expert?.id) return

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/experts/dashboard')
        if (res.ok) {
          const json = await res.json()
          setDashboardData(json.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [expert?.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0466E7]" />
      </div>
    )
  }

  if (!dashboardData?.expert) {
    return (
      <div className="min-h-screen bg-[#F4F8FD] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Unable to load dashboard.</p>
          <Link href="/become-expert" className="text-[#0466E7] font-medium hover:underline">
            Complete your application
          </Link>
        </div>
      </div>
    )
  }

  const exp = dashboardData.expert

  // Group tags by type
  const tagGroups: TagGroup = {
    platform: [],
    industry: [],
    project_type: [],
    tool: [],
  }
  ;(exp.tags || []).forEach((tag: any) => {
    if (tag.tagType in tagGroups) {
      tagGroups[tag.tagType as keyof TagGroup].push(tag.tagValue)
    }
  })

  const tagTypeLabels: Record<keyof TagGroup, string> = {
    platform: 'Platforms',
    industry: 'Industries',
    project_type: 'Project Types',
    tool: 'Tools & Stack',
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD] pt-[120px] pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-blue-50">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-3xl bg-[#0466E7]/10 flex items-center justify-center text-[#0466E7] font-bold text-4xl shrink-0">
              {exp.displayName?.charAt(0) || 'E'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[#011127] font-dm-sans">{exp.displayName}</h1>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> Approved Expert
                </span>
              </div>
              <p className="text-xl text-gray-500 font-medium mb-3">{exp.headline}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin size={14} />{exp.regionCity}, {exp.regionCountry}</span>
                <span className="flex items-center gap-1.5"><Globe size={14} />{exp.timezone}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} />{exp.availabilityHoursPerWeek} hrs/week</span>
              </div>
            </div>
            <Link
              href="/expert/edit"
              className="hidden md:flex px-6 py-3 bg-[#0466E7] text-white font-semibold text-sm rounded-full hover:bg-[#0355c0] transition-colors shrink-0"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Identity & Availability */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-blue-50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <User size={14} /> Identity & Availability
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">Entity Type</p>
                <p className="text-gray-700 font-medium">{exp.entityType || 'Individual'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">Availability</p>
                <p className="text-gray-700 font-medium">{exp.availabilityHoursPerWeek} hours/week — {exp.availabilityNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-blue-50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Briefcase size={14} /> Experience
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <Award size={20} className="text-[#0466E7]" />
                <div>
                  <p className="text-2xl font-bold text-[#011127]">{exp.yearsExperience}</p>
                  <p className="text-sm text-gray-500">Years Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <Star size={20} className="text-[#0466E7]" />
                <div>
                  <p className="text-2xl font-bold text-[#011127]">{exp.projectsCompletedTotal}</p>
                  <p className="text-sm text-gray-500">Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-blue-50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
            <Code size={14} /> Expertise & Specialization
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(Object.keys(tagGroups) as Array<keyof TagGroup>).map(tagType => (
              tagGroups[tagType].length > 0 && (
                <div key={tagType}>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{tagTypeLabels[tagType]}</p>
                  <div className="flex flex-wrap gap-2">
                    {tagGroups[tagType].map((val, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#0466E7]/8 text-[#0466E7] rounded-full text-xs font-bold">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Portfolio Links */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-blue-50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
            <Folder size={14} /> Portfolio & Credentials
          </h2>
          {exp.links && exp.links.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {exp.links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#0466E7] hover:bg-white transition-all group"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 capitalize">
                      {link.linkType.replace('_', ' ')}
                    </p>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{link.url}</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-[#0466E7] shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No portfolio links added.</p>
          )}

          {exp.introVideoLink && (
            <div className="mt-6">
              <a
                href={exp.introVideoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-[#0466E7]/5 rounded-2xl border border-[#0466E7]/20 hover:border-[#0466E7] transition-all group"
              >
                <div>
                  <p className="text-xs text-[#0466E7] font-bold uppercase tracking-wider mb-1">Intro Video</p>
                  <p className="text-sm font-medium text-[#0466E7]">Watch my introduction video</p>
                </div>
                <ExternalLink size={16} className="text-[#0466E7]" />
              </a>
            </div>
          )}
        </div>

        {/* Featured Projects */}
        {exp.projects && exp.projects.length > 0 && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-blue-50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
              <Briefcase size={14} /> Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {exp.projects.map((project: any, idx: number) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-[#011127] text-lg">{project.title}</h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0466E7] shrink-0">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{project.summary}</p>
                  {project.outcomes && (
                    <p className="text-sm text-[#0466E7] font-medium italic">→ {project.outcomes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fit Answers */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-blue-50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
            <MessageSquare size={14} /> About You
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Why Proploy?</p>
              <p className="text-gray-700 leading-relaxed italic">"{exp.whyPlatform}"</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Unique Strength</p>
              <p className="text-gray-700 leading-relaxed italic">"{exp.uniqueStrength}"</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Ideal Clients</p>
              <p className="text-gray-700 leading-relaxed italic">"{exp.idealClients}"</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Biggest Win</p>
              <p className="text-gray-700 leading-relaxed italic">"{exp.biggestWin}"</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
