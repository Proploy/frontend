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
  Loader2,
  Mail,
  MapPin,
  PlayCircle,
} from 'lucide-react'
import Footer from '@/components/Footer'
import { ProjectDocumentViewer } from '@/components/experts/ProjectDocumentViewer'
import { useExpertProfile } from '@/hooks/use-expert-profile'
import type { ExpertLinkResponse, ExpertProjectResponse, ExpertPublic } from '@/hooks/types/expert-contracts'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function getExpertise(profile: ExpertPublic) {
  return unique([
    ...profile.primaryPlatforms,
    ...profile.secondaryPlatforms,
    ...profile.industryExpertise,
    ...profile.preferredProjectTypes,
    ...profile.toolsStack,
    ...profile.tags.map((tag) => tag.tagValue),
  ])
}

function isSocialLink(link: ExpertLinkResponse) {
  return ['linkedin', 'github', 'x', 'twitter'].includes(link.linkType.toLowerCase())
}

function labelForLinkType(linkType: string) {
  return linkType.replace(/_/g, ' ')
}

function firstPortfolioLink(links: ExpertLinkResponse[]) {
  return links.find((link) => ['portfolio', 'case_study'].includes(link.linkType))
}

export default function ExpertProfilePage() {
  const params = useParams()
  const id = params.id as string
  const { getExpertProfile } = useExpertProfile()
  const [profile, setProfile] = useState<ExpertPublic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchExpert() {
      setLoading(true)
      setError(null)
      const result = await getExpertProfile(id)
      if (cancelled) return
      if (result.ok) {
        setProfile(result.data)
      } else {
        setProfile(null)
        setError(result.error.message)
      }
      setLoading(false)
    }

    if (id) void fetchExpert()

    return () => {
      cancelled = true
    }
  }, [getExpertProfile, id])

  const derived = useMemo(() => {
    if (!profile) return null
    const expertise = getExpertise(profile)
    const socialLinks = profile.links.filter(isSocialLink)
    const professionalLinks = profile.links.filter((link) => !isSocialLink(link))
    const portfolioLink = firstPortfolioLink(profile.links)
    return { expertise, socialLinks, professionalLinks, portfolioLink }
  }, [profile])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex items-center justify-center font-[family-name:var(--font-dm-sans)]">
        <Loader2 className="size-[32px] animate-spin text-[#155eef]" />
      </div>
    )
  }

  if (!profile || !derived) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
        <main className="max-w-[720px] mx-auto w-full px-[32px] py-[80px] flex flex-col gap-[12px]">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Expert not found</h1>
          <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
            {error ?? 'This expert profile is unavailable.'}
          </p>
          <Link href="/experts" className="font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
            Back to experts
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
      <main className="max-w-[1180px] mx-auto w-full px-[24px] md:px-[48px] py-[40px] flex flex-col gap-[40px]">
        <header className="flex flex-col gap-[24px] md:flex-row md:items-center">
          <div className="size-[144px] rounded-full bg-[#e9eaeb] overflow-hidden relative shrink-0">
            {profile.profilePictureUrl ? (
              <Image src={profile.profilePictureUrl} alt={profile.displayName} fill className="object-cover" />
            ) : (
              <div className="size-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] flex items-center justify-center text-white font-bold text-[48px]">
                {profile.displayName.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-[6px] right-[6px] size-[30px] rounded-full bg-white flex items-center justify-center">
              <BadgeCheck size={24} className="text-[#155eef]" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-[30px] leading-[38px] text-[#181d27]">{profile.displayName}</h1>
            {profile.headline ? (
              <p className="mt-[4px] font-normal text-[18px] leading-[28px] text-[#535862]">{profile.headline}</p>
            ) : null}
            <div className="mt-[16px] flex flex-wrap gap-[12px] text-[14px] leading-[20px] text-[#414651]">
              <span className="inline-flex items-center gap-[6px]">
                <MapPin size={16} className="text-[#717680]" />
                {[profile.regionCity, profile.regionCountry].filter(Boolean).join(', ') || 'Location not set'}
              </span>
              {profile.timezone ? (
                <span className="inline-flex items-center gap-[6px]">
                  <Clock size={16} className="text-[#717680]" />
                  {profile.timezone}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-[12px]">
            {derived.portfolioLink ? (
              <a
                href={derived.portfolioLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
              >
                View portfolio
              </a>
            ) : null}
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className={`inline-flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO_SHADOW}`}
              >
                <Mail size={16} />
                Contact
              </a>
            ) : null}
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <StatCard label="Years experience" value={profile.yearsExperience ?? 0} />
          <StatCard label="Projects completed" value={profile.projectsCompletedTotal ?? 0} />
          <StatCard label="Portfolio projects" value={profile.projects.length} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-[32px]">
          <div className="flex flex-col gap-[32px]">
            <ProfileSection title="About">
              <AboutGrid profile={profile} />
            </ProfileSection>

            <ProfileSection title="Expertise">
              {derived.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-[8px]">
                  {derived.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-[6px] bg-[#eff4ff] border border-[#b2ccff] rounded-full px-[10px] py-[2px] font-medium text-[14px] leading-[20px] text-[#004eeb]"
                    >
                      <span className="size-[6px] rounded-full bg-[#004eeb]" />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyText>No expertise tags returned by service-apis.</EmptyText>
              )}
            </ProfileSection>

            <ProfileSection title="Projects">
              {profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  {profile.projects.map((project) => (
                    <ProjectCard key={project.id} expertId={profile.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyText>No projects returned by service-apis.</EmptyText>
              )}
            </ProfileSection>
          </div>

          <aside className="flex flex-col gap-[24px]">
            <ProfileSection title="Contact">
              <div className="flex flex-col gap-[14px]">
                {profile.email ? (
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
                    <Mail size={16} />
                    {profile.email}
                  </a>
                ) : (
                  <EmptyText>Email is not returned by service-apis.</EmptyText>
                )}
                {profile.schedulingLink && profile.schedulingLinkEnabled ? (
                  <a href={profile.schedulingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
                    <ArrowUpRight size={16} />
                    Scheduling link
                  </a>
                ) : null}
                {profile.introVideoLink ? (
                  <a href={profile.introVideoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
                    <PlayCircle size={16} />
                    Intro video
                  </a>
                ) : null}
              </div>
            </ProfileSection>

            <ProfileSection title="Links">
              {profile.links.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
                  {[...derived.socialLinks, ...derived.professionalLinks].map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-white px-[14px] py-[12px] hover:border-[#b2ccff]"
                    >
                      <span className="truncate text-[14px] leading-[20px] font-medium text-[#414651] capitalize">
                        {labelForLinkType(link.linkType)}
                      </span>
                      <ExternalLink size={16} className="shrink-0 text-[#717680]" />
                    </a>
                  ))}
                </div>
              ) : (
                <EmptyText>No links returned by service-apis.</EmptyText>
              )}
            </ProfileSection>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px]">
      <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{title}</h2>
      <div className="mt-[16px]">{children}</div>
    </section>
  )
}

function AboutGrid({ profile }: { profile: ExpertPublic }) {
  const rows = [
    { label: 'Why Proploy', value: profile.whyPlatform },
    { label: 'Unique strength', value: profile.uniqueStrength },
    { label: 'Ideal clients', value: profile.idealClients },
    { label: 'Biggest win', value: profile.biggestWin },
    { label: 'Availability notes', value: profile.availabilityNotes },
  ].filter((row) => row.value)

  if (rows.length === 0) return <EmptyText>No about fields returned by service-apis.</EmptyText>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      {rows.map((row) => (
        <div key={row.label} className="rounded-[12px] bg-[#fafafa] p-[16px]">
          <p className="text-[13px] leading-[18px] font-medium text-[#717680]">{row.label}</p>
          <p className="mt-[6px] whitespace-pre-line text-[15px] leading-[22px] text-[#414651]">{row.value}</p>
        </div>
      ))}
    </div>
  )
}

function ProjectCard({ expertId, project }: { expertId: string; project: ExpertProjectResponse }) {
  const { getProjectFileDownloadUrl } = useExpertProfile()

  return (
    <article className="rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[18px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{project.title}</p>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">{project.summary}</p>
        </div>
        <Briefcase size={18} className="shrink-0 text-[#717680]" />
      </div>
      {project.outcomes ? (
        <p className="mt-[12px] text-[14px] leading-[20px] text-[#414651]">{project.outcomes}</p>
      ) : null}
      {project.link ? (
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-[12px] inline-flex items-center gap-[6px] text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
          Project link
          <ArrowUpRight size={16} />
        </a>
      ) : null}
      <ProjectDocumentViewer
        project={project}
        getDownloadUrl={(projectId) => getProjectFileDownloadUrl(expertId, projectId)}
        compact
      />
    </article>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[16px] border border-[#e9eaeb] bg-white p-[20px]">
      <p className="text-[14px] leading-[20px] font-medium text-[#535862]">{label}</p>
      <p className="mt-[8px] text-[30px] leading-[38px] font-semibold text-[#181d27]">{value}</p>
    </div>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[20px] text-[#717680]">{children}</p>
  )
}
