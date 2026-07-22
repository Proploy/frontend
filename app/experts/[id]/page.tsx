'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  LogIn,
  Mail,
  MapPin,
  Send,
  X,
} from 'lucide-react'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/providers/auth-provider'
import { ProjectDocumentViewer } from '@/components/experts/ProjectDocumentViewer'
import FavoriteToggle from '@/components/personalization/FavoriteToggle'
import { InlineVideo } from '@/components/media/InlineVideo'
import { useExpertProfile } from '@/features/experts/use-expert-profile'
import type { ExpertLinkResponse, ExpertProjectResponse, ExpertPublic } from '@/features/experts/types'
import { useRecentlyViewed } from '@/features/users'
import { useStandaloneCurrentUserRole, useWorkspace } from '@/features/workspace'
import { resolveExpertPublicResourceUrl } from '@/features/experts/public-resource'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(
    (value): value is string => typeof value === 'string' && value.length > 0 && value.length <= 64,
  )))
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
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const currentUser = useStandaloneCurrentUserRole()
  const workspace = useWorkspace()
  const { getExpertProfile } = useExpertProfile()
  const { track: trackRecentlyViewed } = useRecentlyViewed()
  const [profile, setProfile] = useState<ExpertPublic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)
  const [requestScope, setRequestScope] = useState('')
  const [preferredTimes, setPreferredTimes] = useState('')
  const [requestBusy, setRequestBusy] = useState(false)
  const [requestError, setRequestError] = useState<NormalizedError | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  useEffect(() => {
    if (id) void trackRecentlyViewed(id, 'expert')
  }, [id, trackRecentlyViewed])

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
    const visibleLinks = profile.links.filter((link) => Boolean(resolveExpertPublicResourceUrl(link.url)))
    const socialLinks = visibleLinks.filter(isSocialLink)
    const professionalLinks = visibleLinks.filter((link) => !isSocialLink(link))
    const portfolioLink = firstPortfolioLink(profile.links)
    return { expertise, socialLinks, professionalLinks, portfolioLink }
  }, [profile])

  const isOwnProfile = Boolean(profile && currentUser.expert?.id === profile.id)

  function openConnectionRequest() {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/experts/${id}`)}`)
      return
    }
    setRequestError(null)
    setRequestSent(false)
    setRequestOpen(true)
  }

  async function submitConnectionRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const scope = requestScope.trim()
    if (!scope || requestBusy || !profile) return
    setRequestBusy(true)
    setRequestError(null)
    const result = await workspace.createMeetingIntent(profile.id, {
      projectScope: scope,
      preferredTimes: preferredTimes.trim() || undefined,
    })
    if (result.ok) {
      setRequestSent(true)
      setRequestScope('')
      setPreferredTimes('')
    } else {
      setRequestError(result)
    }
    setRequestBusy(false)
  }

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

  const currentProfile = profile
  const profilePictureUrl = resolveExpertPublicResourceUrl(currentProfile.profilePictureUrl)
  const introVideoUrl = resolveExpertPublicResourceUrl(currentProfile.introVideoLink)
  const schedulingUrl = resolveExpertPublicResourceUrl(currentProfile.schedulingLink)

  return (
    <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
      <main className="max-w-[1180px] mx-auto w-full px-[24px] md:px-[48px] py-[40px] flex flex-col gap-[40px]">
        <header className="flex flex-col gap-[24px] md:flex-row md:items-center">
          <div className="size-[144px] rounded-full bg-[#e9eaeb] overflow-hidden relative shrink-0">
            {profilePictureUrl ? (
              <Image src={profilePictureUrl} alt={profile.displayName} fill className="object-cover" />
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
            <FavoriteToggle targetId={profile.id} targetType="expert" label={profile.displayName} />
            {derived.portfolioLink && resolveExpertPublicResourceUrl(derived.portfolioLink.url) ? (
              <a
                href={resolveExpertPublicResourceUrl(derived.portfolioLink.url) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
              >
                View portfolio
              </a>
            ) : null}
            {!isOwnProfile ? (
              <button
                type="button"
                onClick={openConnectionRequest}
                disabled={authLoading || currentUser.isPending}
                className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_SKEUO_SHADOW}`}
              >
                {user ? <Send size={16} /> : <LogIn size={16} />}
                Request a connection
              </button>
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

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-[32px]">
          <div className="flex flex-col gap-[32px]">
            {introVideoUrl ? (
              <ProfileSection title="Intro Video">
                <div className="aspect-video overflow-hidden rounded-[12px] bg-[#101828]">
                  <InlineVideo
                    url={introVideoUrl}
                    title={`${profile.displayName} intro video`}
                  />
                </div>
              </ProfileSection>
            ) : null}

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
          </div>

          <aside className="flex flex-col gap-[24px]">
            <ProfileSection title="Projects">
              {profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-[14px]">
                  {profile.projects.map((project) => (
                    <ProjectCard key={project.id} expertId={profile.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyText>No projects returned by service-apis.</EmptyText>
              )}
            </ProfileSection>

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
                {schedulingUrl && profile.schedulingLinkEnabled ? (
                  <a href={schedulingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
                    <ArrowUpRight size={16} />
                    Scheduling link
                  </a>
                ) : null}
              </div>
            </ProfileSection>

            <ProfileSection title="Links">
              {derived.socialLinks.length + derived.professionalLinks.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
                  {[...derived.socialLinks, ...derived.professionalLinks].map((link) => (
                    <a
                      key={link.id}
                      href={resolveExpertPublicResourceUrl(link.url) ?? undefined}
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
      {requestOpen && profile ? (
        <ConnectionRequestDialog
          expert={profile}
          requestScope={requestScope}
          preferredTimes={preferredTimes}
          requestBusy={requestBusy}
          requestError={requestError}
          requestSent={requestSent}
          onScopeChange={setRequestScope}
          onPreferredTimesChange={setPreferredTimes}
          onSubmit={submitConnectionRequest}
          onClose={() => setRequestOpen(false)}
          onOpenRequests={() => router.push('/workspace/requests')}
        />
      ) : null}
    </div>
  )
}

function ConnectionRequestDialog({
  expert,
  requestScope,
  preferredTimes,
  requestBusy,
  requestError,
  requestSent,
  onScopeChange,
  onPreferredTimesChange,
  onSubmit,
  onClose,
  onOpenRequests,
}: {
  expert: ExpertPublic
  requestScope: string
  preferredTimes: string
  requestBusy: boolean
  requestError: NormalizedError | null
  requestSent: boolean
  onScopeChange: (value: string) => void
  onPreferredTimesChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
  onOpenRequests: () => void
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0c111d]/45 px-[16px] backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="connection-request-title">
      <div className="w-full max-w-[520px] rounded-[18px] border border-[#e9eaeb] bg-white p-[24px] shadow-[0_24px_70px_rgba(10,13,18,0.22)]">
        <div className="flex items-start justify-between gap-[16px]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#155eef]">Connect with an expert</p>
            <h2 id="connection-request-title" className="mt-[6px] text-[22px] font-semibold leading-[30px] text-[#181d27]">
              Request a connection with {expert.displayName}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="flex size-[34px] items-center justify-center rounded-full text-[#717680] hover:bg-[#f5f5f5] hover:text-[#181d27]" aria-label="Close connection request">
            <X size={18} />
          </button>
        </div>

        {requestSent ? (
          <div className="mt-[24px] rounded-[12px] border border-[#abefc6] bg-[#ecfdf3] p-[16px]">
            <div className="flex items-start gap-[10px]">
              <CheckCircle2 size={20} className="mt-[1px] shrink-0 text-[#067647]" />
              <div>
                <p className="font-semibold text-[15px] leading-[22px] text-[#067647]">Request sent</p>
                <p className="mt-[4px] text-[14px] leading-[20px] text-[#05603a]">
                  {expert.displayName} will review your request. You can track its status in your workspace.
                </p>
              </div>
            </div>
            <div className="mt-[16px] flex flex-wrap justify-end gap-[10px]">
              <button type="button" onClick={onClose} className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651]">
                Close
              </button>
              <button type="button" onClick={onOpenRequests} className={`rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white ${BUTTON_SKEUO_SHADOW}`}>
                View my requests
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-[24px] flex flex-col gap-[16px]">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-semibold leading-[20px] text-[#414651]">What would you like help with?</span>
              <textarea
                required
                value={requestScope}
                onChange={(event) => onScopeChange(event.target.value)}
                rows={5}
                maxLength={4000}
                placeholder="Describe your project, the outcome you need, and where you are in the process."
                className="w-full resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
              />
            </label>
            <label className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-semibold leading-[20px] text-[#414651]">Preferred times <span className="font-normal text-[#717680]">(optional)</span></span>
              <input
                value={preferredTimes}
                onChange={(event) => onPreferredTimesChange(event.target.value)}
                placeholder="For example, Tuesday or Wednesday afternoon"
                className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
              />
            </label>
            {requestError ? <p className="text-[13px] leading-[18px] text-[#b42318]">{requestError.error.message || 'Unable to send this request.'}</p> : null}
            <div className="flex flex-wrap justify-end gap-[10px]">
              <button type="button" onClick={onClose} className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651]">
                Cancel
              </button>
              <button type="submit" disabled={requestBusy || !requestScope.trim()} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO_SHADOW}`}>
                <Send size={16} />
                {requestBusy ? 'Sending…' : 'Send request'}
              </button>
            </div>
          </form>
        )}
      </div>
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
      {resolveExpertPublicResourceUrl(project.link) ? (
        <a href={resolveExpertPublicResourceUrl(project.link) ?? undefined} target="_blank" rel="noopener noreferrer" className="mt-[12px] inline-flex items-center gap-[6px] text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
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
