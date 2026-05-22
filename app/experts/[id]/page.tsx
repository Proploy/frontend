'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
} from 'lucide-react'
import Footer from '@/components/Footer'
import { useExpertProfile } from '@/hooks/use-expert-profile'
import type { ExpertLinkResponse, ExpertProjectResponse, ExpertPublic, ExpertTagResponse } from '@/hooks/types/expert-contracts'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function getTagValues(tags: ExpertTagResponse[], type: string) {
  return tags.filter((tag) => tag.tagType === type).map((tag) => tag.tagValue)
}

function getGroupedLinks(links: ExpertLinkResponse[]) {
  return links.reduce<Record<string, ExpertLinkResponse[]>>((acc, link) => {
    acc[link.linkType] = acc[link.linkType] ?? []
    acc[link.linkType].push(link)
    return acc
  }, {})
}

const LINK_LABELS: Record<string, string> = {
  portfolio: 'Portfolio',
  case_study: 'Case study',
  certification: 'Certification',
  testimonial: 'Testimonial',
  social_linkedin: 'LinkedIn',
  social_x: 'X',
  social_website: 'Website',
  social_github: 'GitHub',
}

function getLinkLabel(linkType: string) {
  return LINK_LABELS[linkType] ?? linkType.replace(/_/g, ' ')
}

function isSocialLink(link: ExpertLinkResponse) {
  return link.linkType.startsWith('social_')
}

export default function ExpertProfilePage() {
  const params = useParams()
  const id = params.id as string
  const { getExpertProfile } = useExpertProfile()
  const [profile, setProfile] = useState<ExpertPublic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadExpert() {
      setIsLoading(true)
      setError(null)
      const result = await getExpertProfile(id)
      if (cancelled) return

      if (!result.ok) {
        setProfile(null)
        setError(result.status === 404 ? 'Expert profile not found.' : result.error.message)
        setIsLoading(false)
        return
      }

      setProfile(result.data)
      setIsLoading(false)
    }

    void loadExpert()
    return () => {
      cancelled = true
    }
  }, [getExpertProfile, id])

  const profileModel = useMemo(() => {
    if (!profile) return null
    const groupedLinks = getGroupedLinks(profile.links ?? [])
    const specializations = uniqueValues([
      ...getTagValues(profile.tags ?? [], 'industry'),
      ...getTagValues(profile.tags ?? [], 'project_type'),
      ...(profile.industryExpertise ?? []),
      ...(profile.preferredProjectTypes ?? []),
    ])
    const tools = uniqueValues([
      ...getTagValues(profile.tags ?? [], 'tool'),
      ...getTagValues(profile.tags ?? [], 'platform'),
      ...(profile.toolsStack ?? []),
      ...(profile.primaryPlatforms ?? []),
      ...(profile.secondaryPlatforms ?? []),
    ])
    const primaryPortfolioUrl = groupedLinks.portfolio?.[0]?.url ?? profile.projects?.find((project) => project.link)?.link ?? null
    const contactUrl = profile.schedulingLinkEnabled && profile.schedulingLink ? profile.schedulingLink : null
    const socialLinks = (profile.links ?? []).filter(isSocialLink)
    const credentialLinks = (profile.links ?? []).filter((link) => !isSocialLink(link))

    return {
      groupedLinks,
      specializations,
      tools,
      primaryPortfolioUrl,
      contactUrl,
      socialLinks,
      credentialLinks,
      location: [profile.regionCity, profile.regionCountry].filter(Boolean).join(', '),
      aboutLines: [
        profile.headline,
        profile.yearsExperience != null ? `${profile.yearsExperience} years of experience` : null,
        profile.projectsCompletedTotal != null ? `${profile.projectsCompletedTotal} completed projects` : null,
      ].filter(Boolean),
    }
  }, [profile])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#155eef]" />
      </div>
    )
  }

  if (!profile || !profileModel) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
        <div className="max-w-[720px] mx-auto w-full px-6 py-20 text-center">
          <h1 className="text-[28px] leading-[36px] font-semibold text-[#181d27]">Expert unavailable</h1>
          <p className="mt-3 text-[16px] leading-[24px] text-[#535862]">
            {error ?? 'This expert profile is not available.'}
          </p>
          <Link href="/experts" className="mt-6 inline-flex text-[#004eeb] font-semibold hover:underline">
            Back to experts
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
      <div className="max-w-[1180px] mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">
        <header className="flex flex-col md:flex-row items-start gap-6">
          <div className="size-[128px] md:size-[160px] rounded-full bg-[#e9eaeb] overflow-hidden relative shrink-0">
            {profile.profilePictureUrl ? (
              <Image src={profile.profilePictureUrl} alt={profile.displayName} fill className="object-cover" />
            ) : (
              <div className="size-full bg-gradient-to-br from-[#dbeafe] to-[#c084fc] flex items-center justify-center text-white font-bold text-[48px]">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-[6px] right-[6px] size-[28px] rounded-full bg-white flex items-center justify-center">
              <BadgeCheck size={24} className="text-[#155eef]" />
            </span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-[28px] leading-[36px] text-[#181d27]">
                {profile.displayName}
              </h1>
              {profile.headline && (
                <p className="font-normal text-[16px] leading-[24px] text-[#535862] max-w-[680px]">
                  {profile.headline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profileModel.primaryPortfolioUrl && (
                <Link
                  href={profileModel.primaryPortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] inline-flex items-center gap-2 font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
                >
                  View portfolio
                  <ExternalLink size={16} />
                </Link>
              )}
              {profileModel.contactUrl ? (
                <Link
                  href={profileModel.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] inline-flex items-center gap-2 font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO_SHADOW}`}
                >
                  Book a call
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`bg-[#f5f5f5] border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#717680] ${BUTTON_SKEUO_SHADOW}`}
                >
                  Contact unavailable
                </button>
              )}
            </div>

            {profileModel.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profileModel.socialLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#d5d7da] px-3 py-1.5 text-[13px] leading-[18px] font-medium text-[#414651] hover:border-[#155eef] hover:text-[#004eeb]"
                  >
                    {getLinkLabel(link.linkType)}
                    <ExternalLink size={13} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="flex flex-col gap-8">
            <Panel title="About">
              <div className="space-y-3 text-[16px] leading-[24px] text-[#535862]">
                {profileModel.aboutLines.length > 0 ? (
                  profileModel.aboutLines.map((line) => <p key={line}>{line}</p>)
                ) : (
                  <p>No profile summary has been added yet.</p>
                )}
              </div>
            </Panel>

            <Panel title="Featured Projects">
              {profile.projects?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <p className="text-[14px] leading-[20px] text-[#717680]">No projects have been published yet.</p>
              )}
            </Panel>

            <Panel title="Links And Credentials">
              {profileModel.credentialLinks.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profileModel.credentialLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 border border-[#e9eaeb] rounded-[12px] p-4 hover:border-[#155eef] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[12px] leading-[18px] font-semibold uppercase tracking-wide text-[#717680]">
                          {getLinkLabel(link.linkType)}
                        </p>
                        <p className="text-[14px] leading-[20px] font-medium text-[#181d27] truncate">{link.url}</p>
                      </div>
                      <ExternalLink size={16} className="text-[#717680] shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] leading-[20px] text-[#717680]">No external links have been published yet.</p>
              )}
            </Panel>
          </div>

          <aside className="flex flex-col gap-6">
            <Panel title="Details">
              <div className="grid gap-5">
                <Detail label="Location" icon={<MapPin size={18} />}>
                  {profileModel.location || 'Not provided'}
                </Detail>
                <Detail label="Timezone" icon={<Clock size={18} />}>
                  {profile.timezone || 'Not provided'}
                </Detail>
                <Detail label="Experience" icon={<Briefcase size={18} />}>
                  {profile.yearsExperience != null ? `${profile.yearsExperience} years` : 'Not provided'}
                </Detail>
              </div>
            </Panel>

            <Panel title="Specialization">
              <TagList values={profileModel.specializations} empty="No specializations added." />
            </Panel>

            <Panel title="Tools And Platforms">
              <TagList values={profileModel.tools} empty="No tools or platforms added." />
            </Panel>
          </aside>
        </section>
      </div>

      <Footer />
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-[#e9eaeb] rounded-[16px] p-6 flex flex-col gap-5">
      <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{title}</h2>
      {children}
    </section>
  )
}

function Detail({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#717680]">{icon}</span>
      <div className="min-w-0">
        <p className="font-medium text-[14px] leading-[20px] text-[#181d27]">{label}</p>
        <p className="font-normal text-[14px] leading-[20px] text-[#535862]">{children}</p>
      </div>
    </div>
  )
}

function TagList({ values, empty }: { values: string[]; empty: string }) {
  if (!values.length) {
    return <p className="text-[14px] leading-[20px] text-[#717680]">{empty}</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="inline-flex items-center gap-[6px] bg-[#eff4ff] border border-[#b2ccff] rounded-full px-[10px] py-[2px] font-medium text-[14px] leading-[20px] text-[#004eeb]"
        >
          <span className="size-[6px] rounded-full bg-[#004eeb]" />
          {value}
        </span>
      ))}
    </div>
  )
}

function ProjectCard({ project }: { project: ExpertProjectResponse }) {
  return (
    <article className="border border-[#e9eaeb] rounded-[14px] p-5 flex flex-col gap-4">
      <div>
        <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{project.title}</p>
        <p className="mt-1 font-normal text-[14px] leading-[20px] text-[#535862]">{project.summary}</p>
      </div>
      {project.outcomes && (
        <p className="font-normal text-[14px] leading-[20px] text-[#414651]">{project.outcomes}</p>
      )}
      <div className="flex flex-wrap gap-3 mt-auto">
        {project.link && (
          <Link href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#004eeb] font-semibold text-[14px] leading-[20px] hover:underline">
            View project
            <ExternalLink size={14} />
          </Link>
        )}
        {project.fileName && (
          <span className="inline-flex items-center gap-1 text-[#535862] text-[14px] leading-[20px]">
            <FileText size={14} />
            {project.fileName}
          </span>
        )}
      </div>
    </article>
  )
}
