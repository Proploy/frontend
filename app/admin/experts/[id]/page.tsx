'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, ArrowLeft, CheckCircle, XCircle, Clock, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import TextAreaField from '@/components/ui/TextAreaField'
import Tag from '@/components/ui/Tag'

type TagGroup = {
  platform: string[]
  industry: string[]
  project_type: string[]
  tool: string[]
}

const TAG_GROUP_LABELS: Record<string, string> = {
  platform: 'Platform',
  industry: 'Industry',
  project_type: 'Project Type',
  tool: 'Tool',
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

  useEffect(() => {
    if (!expert?.tags) return
    const grouped: TagGroup = { platform: [], industry: [], project_type: [], tool: [] }
    expert.tags.forEach((tag: any) => {
      if (tag.tagType in grouped) grouped[tag.tagType as keyof TagGroup].push(tag.tagValue)
    })
    setEditedTags(grouped)
  }, [expert])

  useEffect(() => {
    if (!expertId) return
    async function fetchExpert() {
      try {
        const res = await fetch(`/api/admin/experts/${expertId}`)
        const json = await res.json()
        if (json.data) setExpert(json.data)
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
      if (res.ok) { router.push('/admin/experts'); router.refresh() }
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
      setEditedTags((prev) => ({ ...prev, [tagType]: [...prev[tagType], value] }))
    }
    setNewTagInputs((prev) => ({ ...prev, [tagType]: '' }))
  }

  const removeTag = (tagType: keyof TagGroup, tagValue: string) => {
    setEditedTags((prev) => ({ ...prev, [tagType]: prev[tagType].filter((v) => v !== tagValue) }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8ff]">
        <Loader2 className="w-8 h-8 animate-spin text-[#155eef]" />
      </div>
    )
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8ff]">
        <p className="font-[family-name:var(--font-dm-sans)] text-[#535862]">Expert not found.</p>
      </div>
    )
  }

  const statusConfig = {
    approved:  { icon: <CheckCircle size={16} className="text-[#079455]" />, label: 'Approved',  bg: 'bg-[#ecfdf3] text-[#067647] border-[#a9efc5]' },
    rejected:  { icon: <XCircle size={16} className="text-[#d92d20]" />,    label: 'Rejected',  bg: 'bg-[#fef3f2] text-[#b42318] border-[#fecdca]' },
    submitted: { icon: <Clock size={16} className="text-[#155eef]" />,       label: 'Submitted', bg: 'bg-[#eff4ff] text-[#004eeb] border-[#b2ccff]' },
  }
  const status = statusConfig[expert.status as keyof typeof statusConfig] ?? {
    icon: null,
    label: expert.status,
    bg: 'bg-[#fafafa] text-[#414651] border-[#d5d7da]',
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] pt-[104px] pb-20 px-4 md:px-8 w-full flex flex-col">
      <div className="w-full max-w-[896px] mx-auto">
        {/* Back link */}
        <Link
          href="/admin/experts"
          className="inline-flex items-center gap-[8px] font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-[#535862] hover:text-[#004eeb] mb-8 transition-colors group"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </Link>

        {/* Main card */}
        <div className="bg-white border border-[#e9eaeb] rounded-[20px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-8 border-b border-[#e9eaeb]">
            <div className="flex gap-[16px] items-center w-full sm:w-auto">
              {/* Avatar */}
              <div className="shrink-0 size-[64px] rounded-[12px] bg-[#eff4ff] flex items-center justify-center font-[family-name:var(--font-dm-sans)] font-semibold text-[24px] text-[#004eeb]">
                {expert.displayName?.charAt(0) || 'E'}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[24px] leading-[32px] text-[#181d27]">
                  {expert.displayName}
                </h1>
                <p className="font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] text-[#535862] mt-[2px]">
                  {expert.headline}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[8px] items-start sm:items-end shrink-0">
              {/* Status badge */}
              <span className={`inline-flex items-center gap-[6px] h-[28px] px-[10px] rounded-[6px] border font-[family-name:var(--font-dm-sans)] font-medium text-[14px] ${status.bg}`}>
                {status.icon}
                {status.label}
              </span>
              {/* Admin Review badge */}
              <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-[6px] bg-[#eff4ff] border border-[#b2ccff] font-[family-name:var(--font-dm-sans)] font-medium text-[12px] text-[#004eeb]">
                <ShieldCheck size={12} />
                Admin Review Mode
              </span>
            </div>
          </div>

          {/* Two-col detail grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left */}
            <div className="flex flex-col gap-[24px] w-full">
              <section>
                <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] leading-[18px] text-[#717680] uppercase tracking-[0.08em] mb-[8px]">
                  Location & Logistics
                </p>
                <div className="flex flex-col gap-[4px] w-full">
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-[#181d27] break-words">
                    {expert.regionCity}, {expert.regionCountry}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#535862] break-words">Timezone: {expert.timezone}</p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#535862] break-words">{expert.availabilityHoursPerWeek} hrs/week available</p>
                </div>
              </section>

              <section>
                <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] leading-[18px] text-[#717680] uppercase tracking-[0.08em] mb-[8px]">
                  Experience Metrics
                </p>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-[#181d27]">
                    {expert.yearsExperience} Years Professional Experience
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#535862]">
                    {expert.projectsCompletedTotal} Total Projects Completed
                  </p>
                </div>
              </section>

              <section>
                <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] leading-[18px] text-[#717680] uppercase tracking-[0.08em] mb-[8px]">
                  Identity & Intent
                </p>
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="w-full">
                    <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] text-[#717680] mb-[2px]">Entity Type</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#414651] break-words">{expert.entityType}</p>
                  </div>
                  <div className="w-full">
                    <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] text-[#717680] mb-[2px]">Why Proploy?</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#414651] italic leading-relaxed break-words">
                      &ldquo;{expert.whyPlatform}&rdquo;
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-[24px] w-full">
              <section>
                <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] leading-[18px] text-[#717680] uppercase tracking-[0.08em] mb-[8px]">
                  Professional Proof
                </p>
                <div className="flex flex-col gap-[6px]">
                  {expert.links?.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-[12px] py-[10px] bg-[#fafafa] border border-[#e9eaeb] rounded-[8px] hover:border-[#b2ccff] hover:bg-[#f5f8ff] transition-colors group"
                    >
                      <div className="flex items-center gap-[12px] w-full">
                        <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#414651] group-hover:text-[#004eeb] capitalize truncate">
                          {link.linkType.replace('_', ' ')}
                        </span>
                      </div>
                      <ExternalLink size={14} className="text-[#a4a7ae] group-hover:text-[#155eef] shrink-0 ml-[8px]" />
                    </a>
                  ))}
                  {expert.introVideoLink && (
                    <a
                      href={expert.introVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-[12px] py-[10px] bg-[#eff4ff] border border-[#b2ccff] rounded-[8px] hover:border-[#84adff] transition-colors group"
                    >
                      <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#004eeb]">Intro Video</span>
                      <ExternalLink size={14} className="text-[#155eef]" />
                    </a>
                  )}
                </div>
              </section>

              <section>
                <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] leading-[18px] text-[#717680] uppercase tracking-[0.08em] mb-[8px]">
                  Platform Expertise
                </p>
                <div className="flex flex-col gap-[16px]">
                  {(Object.keys(editedTags) as Array<keyof TagGroup>).map((tagType) => (
                    <div key={tagType}>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[12px] text-[#717680] mb-[6px]">
                        {TAG_GROUP_LABELS[tagType]}
                      </p>
                      <div className="flex flex-wrap gap-[6px] mb-[8px]">
                        {editedTags[tagType].map((val, idx) => (
                          <Tag
                            key={idx}
                            size="sm"
                            action="x-close"
                            onClose={() => removeTag(tagType, val)}
                            className="bg-[#eff4ff] border-[#b2ccff] text-[#004eeb]"
                          >
                            {val}
                          </Tag>
                        ))}
                      </div>
                      <div className="flex gap-[8px] w-full items-start">
                        <InputField
                          placeholder={`Add ${TAG_GROUP_LABELS[tagType].toLowerCase()}...`}
                          value={newTagInputs[tagType]}
                          onChange={(e) => setNewTagInputs((prev) => ({ ...prev, [tagType]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagType))}
                          className="flex-1"
                        />
                        <Button variant="secondary" size="sm" onClick={() => addTag(tagType)}>
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Reviewer Action */}
          <div className="border-t border-[#e9eaeb] pt-8">
            <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[18px] leading-[28px] text-[#181d27] mb-4">
              Reviewer Action
            </p>

            {/* Notes textarea */}
            <div className="mb-6">
              <TextAreaField
                placeholder="Internal review notes (e.g. why rejected, what changes needed...)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-[12px]">
              <Button
                variant="success"
                onClick={() => handleUpdateStatus('approved')}
                disabled={isUpdating}
                loading={isUpdating}
                className="flex-1 h-[44px]"
              >
                {!isUpdating && <CheckCircle size={18} />} Approve Expert
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateStatus('changes_requested')}
                disabled={isUpdating}
                loading={isUpdating}
                className="flex-1 h-[44px]"
              >
                Request Changes
              </Button>
              <Button
                variant="danger"
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isUpdating}
                loading={isUpdating}
                className="flex-1 h-[44px]"
              >
                {!isUpdating && <XCircle size={18} />} Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
