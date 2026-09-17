'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowUpRight,
  Award,
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
import { useAuth } from '@/components/providers/auth-provider'
import { ProjectDocumentViewer } from '@/components/experts/ProjectDocumentViewer'
import FavoriteToggle from '@/components/personalization/FavoriteToggle'
import { Nav } from '@/components/site/Nav'
import { Avatar } from '@/components/ui/Avatar'
import { InlineVideo } from '@/components/media/InlineVideo'
import { useExpertProfile } from '@/features/experts/use-expert-profile'
import type {
  ExpertLinkResponse,
  ExpertProductExpertiseResponse,
  ExpertProjectResponse,
  ExpertPublic,
} from '@/features/experts/types'
import { useRecentlyViewed } from '@/features/users'
import { useStandaloneCurrentUserRole, useWorkspace } from '@/features/workspace'
import { resolveExpertPublicResourceUrl } from '@/features/experts/public-resource'
import { socialRuleFor } from '@/features/experts/social-links'
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
    // Credentials render as their own section below, so they are excluded here
    // rather than flattened into the expertise cloud.
    ...profile.tags.filter((tag) => tag.tagType !== 'certification').map((tag) => tag.tagValue),
  ])
}

function getCertifications(profile: ExpertPublic) {
  return unique(
    profile.tags.filter((tag) => tag.tagType === 'certification').map((tag) => tag.tagValue),
  )
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
      try {
        const result = await getExpertProfile(id)
        if (cancelled) return
        if (result.ok) {
          setProfile(result.data)
        } else {
          setProfile(null)
          setError(result.error.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) void fetchExpert()

    return () => {
      cancelled = true
    }
  }, [getExpertProfile, id])

  const derived = useMemo(() => {
    if (!profile) return null
    const expertise = getExpertise(profile)
    const certifications = getCertifications(profile)
    const visibleLinks = profile.links.filter((link) => Boolean(resolveExpertPublicResourceUrl(link.url)))
    const socialLinks = visibleLinks.filter(isSocialLink)
    const certificateFiles = visibleLinks.filter((link) => link.linkType === 'certification')
    const professionalLinks = visibleLinks.filter(
      (link) => !isSocialLink(link) && link.linkType !== 'certification',
    )
    const portfolioLink = firstPortfolioLink(profile.links)
    // The wizard writes socials to the socialLinks JSONB; expert_link rows are
    // the legacy path and still carry professional links. Merge both, keyed by
    // URL so a link saved through either route is listed once.
    const publicLinks: { key: string; url: string; label: string }[] = []
    const seen = new Set<string>()
    for (const social of profile.socialLinks ?? []) {
      const url = resolveExpertPublicResourceUrl(social.url)
      if (!url || seen.has(url)) continue
      seen.add(url)
      publicLinks.push({ key: url, url, label: socialRuleFor(social.platform).label })
    }
    for (const link of [...socialLinks, ...professionalLinks]) {
      const url = resolveExpertPublicResourceUrl(link.url)
      if (!url || seen.has(url)) continue
      seen.add(url)
      publicLinks.push({ key: link.id, url, label: labelForLinkType(link.linkType) })
    }
    return { expertise, certifications, certificateFiles, publicLinks, portfolioLink }
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
    try {
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
    } finally {
      setRequestBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex items-center justify-center font-[family-name:var(--font-dm-sans)]">
        <Loader2 className="size-[32px] animate-spin text-cobalt" />
      </div>
    )
  }

  if (!profile || !derived) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
        <main className="max-w-[720px] mx-auto w-full px-[32px] py-[80px] flex flex-col gap-[12px]">
          <h1 className="pf-title">Expert not found</h1>
          <p className="font-normal text-[16px] leading-[24px] text-ink-soft">
            {error ?? 'This expert profile is unavailable.'}
          </p>
          <Link href="/experts" className="font-semibold text-[14px] leading-[20px] text-cobalt-deep hover:underline">
            Back to experts
          </Link>
        </main>
      </div>
    )
  }

  const currentProfile = profile
  const profilePictureUrl = resolveExpertPublicResourceUrl(currentProfile.profilePictureUrl)
  const introVideoUrl = resolveExpertPublicResourceUrl(currentProfile.introVideoLink)
  const schedulingUrl = resolveExpertPublicResourceUrl(currentProfile.schedulingLink)

  return (
    <div className="min-h-screen bg-white flex flex-col font-[family-name:var(--font-dm-sans)]">
      <Nav />
      <main className="max-w-[1180px] mx-auto w-full px-[24px] md:px-[48px] pt-[120px] pb-[40px] flex flex-col gap-[40px]">
        <header className="flex flex-col gap-[24px] md:flex-row md:items-center">
          <div className="relative shrink-0">
            {profilePictureUrl ? (
              <span className="pf-ava pf-ava--2xl">
                <Image src={profilePictureUrl} alt={profile.displayName} fill sizes="144px" className="object-cover" />
              </span>
            ) : (
              <Avatar name={profile.displayName} size="2xl" />
            )}
            <span className="absolute bottom-[6px] right-[6px] flex size-[30px] items-center justify-center rounded-full bg-white">
              <BadgeCheck size={24} className="text-cobalt" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h1 className="pf-title">{profile.displayName}</h1>
              {profile.entityType ? (
                <span className="inline-flex items-center rounded-full border border-line bg-surface-sunken px-[10px] py-[2px] text-[13px] leading-[20px] font-medium text-ink-soft">
                  {profile.entityType}
                </span>
              ) : null}
            </div>
            {profile.headline ? (
              <p className="mt-[4px] font-normal text-[18px] leading-[28px] text-ink-soft">{profile.headline}</p>
            ) : null}
            <div className="mt-[16px] flex flex-wrap gap-[12px] text-[14px] leading-[20px] text-ink-soft">
              <span className="inline-flex items-center gap-[6px]">
                <MapPin size={16} className="text-ink-muted" />
                {[profile.regionCity, profile.regionCountry].filter(Boolean).join(', ') || 'Location not set'}
              </span>
              {profile.timezone ? (
                <span className="inline-flex items-center gap-[6px]">
                  <Clock size={16} className="text-ink-muted" />
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
                className={`bg-white border border-line rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-ink-soft ${BUTTON_SKEUO_SHADOW}`}
              >
                View portfolio
              </a>
            ) : null}
            {!isOwnProfile ? (
              <button
                type="button"
                onClick={openConnectionRequest}
                disabled={authLoading || currentUser.isPending}
                className={`inline-flex items-center gap-[6px] rounded-[8px] bg-cobalt px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_SKEUO_SHADOW}`}
              >
                {user ? <Send size={16} /> : <LogIn size={16} />}
                Request a connection
              </button>
            ) : null}
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className={`inline-flex items-center gap-[6px] bg-cobalt border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO_SHADOW}`}
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
                <div className="aspect-video overflow-hidden rounded-[12px] bg-ink">
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

            <ProfileSection title="Products & certifications">
              {profile.productExpertise && profile.productExpertise.length > 0 ? (
                <div className="grid grid-cols-1 gap-[14px]">
                  {profile.productExpertise.map((product) => (
                    <ProductExpertiseCard key={product.id ?? product.productName} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyText>No products shared yet.</EmptyText>
              )}
            </ProfileSection>

            <ProfileSection title="Expertise">
              {derived.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-[8px]">
                  {derived.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-[6px] bg-cobalt-soft border border-cobalt-soft rounded-full px-[10px] py-[2px] font-medium text-[14px] leading-[20px] text-cobalt-deep"
                    >
                      <span className="size-[6px] rounded-full bg-cobalt-deep" />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyText>{profile.displayName} hasn’t listed their areas of expertise yet.</EmptyText>
              )}
            </ProfileSection>

            {derived.certifications.length > 0 || derived.certificateFiles.length > 0 ? (
              <ProfileSection title="Credentials">
                <div className="flex flex-col gap-[14px]">
                  {derived.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-[8px]">
                      {derived.certifications.map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center gap-[6px] rounded-[8px] border border-line bg-surface-sunken px-[10px] py-[6px] font-medium text-[14px] leading-[20px] text-ink-soft"
                        >
                          <Award size={15} className="text-ink-muted" />
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {derived.certificateFiles.map((link) => (
                    <a
                      key={link.id}
                      href={resolveExpertPublicResourceUrl(link.url) ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-[12px] rounded-[10px] border border-line bg-white px-[14px] py-[12px] hover:border-cobalt-soft"
                    >
                      <span className="inline-flex min-w-0 items-center gap-[8px]">
                        <BadgeCheck size={16} className="shrink-0 text-ink-muted" />
                        <span className="truncate text-[14px] leading-[20px] font-medium text-ink-soft">
                          {link.fileName ?? 'Certificate'}
                        </span>
                      </span>
                      <ExternalLink size={16} className="shrink-0 text-ink-muted" />
                    </a>
                  ))}

                  {derived.certifications.length > 0 ? (
                    <p className="text-[13px] leading-[18px] text-ink-muted">
                      Credentials listed by {profile.displayName} and not yet verified by Proploy.
                    </p>
                  ) : null}
                </div>
              </ProfileSection>
            ) : null}
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
                <EmptyText>No portfolio projects shared yet.</EmptyText>
              )}
            </ProfileSection>

            <ProfileSection title="Availability">
              <AvailabilityGrid profile={profile} />
            </ProfileSection>

            <ProfileSection title="Contact">
              <div className="flex flex-col gap-[14px]">
                {profile.email ? (
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] font-semibold text-cobalt-deep hover:underline">
                    <Mail size={16} />
                    {profile.email}
                  </a>
                ) : null}
                {schedulingUrl && profile.schedulingLinkEnabled ? (
                  <a href={schedulingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] font-semibold text-cobalt-deep hover:underline">
                    <ArrowUpRight size={16} />
                    Scheduling link
                  </a>
                ) : null}
              </div>
            </ProfileSection>

            <ProfileSection title="Links">
              {derived.publicLinks.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
                  {derived.publicLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-[12px] rounded-[10px] border border-line bg-white px-[14px] py-[12px] hover:border-cobalt-soft"
                    >
                      <span className="truncate text-[14px] leading-[20px] font-medium text-ink-soft capitalize">
                        {link.label}
                      </span>
                      <ExternalLink size={16} className="shrink-0 text-ink-muted" />
                    </a>
                  ))}
                </div>
              ) : (
                <EmptyText>No public links shared yet.</EmptyText>
              )}
            </ProfileSection>
          </aside>
        </section>
      </main>

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
      <div className="w-full max-w-[520px] rounded-[18px] border border-line bg-white p-[24px] shadow-[0_24px_70px_rgba(10,13,18,0.22)]">
        <div className="flex items-start justify-between gap-[16px]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-cobalt">Connect with an expert</p>
            <h2 id="connection-request-title" className="mt-[6px] text-[22px] font-semibold leading-[30px] text-ink">
              Request a connection with {expert.displayName}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="flex size-[34px] items-center justify-center rounded-full text-ink-muted hover:bg-surface-hover hover:text-ink" aria-label="Close connection request">
            <X size={18} />
          </button>
        </div>

        {requestSent ? (
          <div className="mt-[24px] rounded-[12px] border border-ok-line bg-ok-soft p-[16px]">
            <div className="flex items-start gap-[10px]">
              <CheckCircle2 size={20} className="mt-[1px] shrink-0 text-ok" />
              <div>
                <p className="font-semibold text-[15px] leading-[22px] text-ok">Request sent</p>
                <p className="mt-[4px] text-[14px] leading-[20px] text-[#05603a]">
                  {expert.displayName} will review your request. You can track its status in your workspace.
                </p>
              </div>
            </div>
            <div className="mt-[16px] flex flex-wrap justify-end gap-[10px]">
              <button type="button" onClick={onClose} className="rounded-[8px] border border-line bg-white px-[14px] py-[10px] text-[14px] font-semibold text-ink-soft">
                Close
              </button>
              <button type="button" onClick={onOpenRequests} className={`rounded-[8px] bg-cobalt px-[14px] py-[10px] text-[14px] font-semibold text-white ${BUTTON_SKEUO_SHADOW}`}>
                View my requests
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-[24px] flex flex-col gap-[16px]">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-semibold leading-[20px] text-ink-soft">What would you like help with?</span>
              <textarea
                required
                value={requestScope}
                onChange={(event) => onScopeChange(event.target.value)}
                rows={5}
                maxLength={4000}
                placeholder="Describe your project, the outcome you need, and where you are in the process."
                className="w-full resize-y rounded-[8px] border border-line bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-cobalt/30"
              />
            </label>
            <label className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-semibold leading-[20px] text-ink-soft">Preferred times <span className="font-normal text-ink-muted">(optional)</span></span>
              <input
                value={preferredTimes}
                onChange={(event) => onPreferredTimesChange(event.target.value)}
                placeholder="For example, Tuesday or Wednesday afternoon"
                className="w-full rounded-[8px] border border-line bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-cobalt/30"
              />
            </label>
            {requestError ? <p className="text-[13px] leading-[18px] text-danger">{requestError.error.message || 'Unable to send this request.'}</p> : null}
            <div className="flex flex-wrap justify-end gap-[10px]">
              <button type="button" onClick={onClose} className="rounded-[8px] border border-line bg-white px-[14px] py-[10px] text-[14px] font-semibold text-ink-soft">
                Cancel
              </button>
              <button type="submit" disabled={requestBusy || !requestScope.trim()} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-cobalt px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO_SHADOW}`}>
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
    <section className="rounded-[16px] border border-line bg-white p-[24px]">
      <h2 className="pf-h2">{title}</h2>
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
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      {rows.map((row) => (
        <div key={row.label} className="rounded-[12px] bg-surface-sunken p-[16px]">
          <p className="text-[13px] leading-[18px] font-medium text-ink-muted">{row.label}</p>
          {row.value ? (
            <p className="mt-[6px] whitespace-pre-line text-[15px] leading-[22px] text-ink-soft">{row.value}</p>
          ) : (
            <p className="mt-[6px]">
              <NotSharedYet />
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function ProductExpertiseCard({ product }: { product: ExpertProductExpertiseResponse }) {
  const stats = [
    { label: 'Years', value: product.yearsExperience },
    { label: 'Projects', value: product.projectsCompleted },
  ]

  return (
    <article className="rounded-[12px] border border-line bg-surface-sunken p-[18px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <p className="font-semibold text-[16px] leading-[24px] text-ink">{product.productName}</p>
        <span
          className={`inline-flex items-center rounded-full border px-[8px] py-[1px] text-[12px] leading-[18px] font-medium ${
            product.isPrimary
              ? 'border-cobalt-soft bg-cobalt-soft text-cobalt-deep'
              : 'border-line bg-white text-ink-muted'
          }`}
        >
          {product.isPrimary ? 'Primary' : 'Secondary'}
        </span>
      </div>

      <div className="mt-[12px] flex flex-wrap gap-[24px]">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-[13px] leading-[18px] font-medium text-ink-muted">{stat.label}</p>
            {typeof stat.value === 'number' ? (
              <p className="mt-[2px] text-[15px] leading-[22px] font-semibold text-ink">{stat.value}</p>
            ) : (
              <p className="mt-[2px]">
                <NotSharedYet />
              </p>
            )}
          </div>
        ))}
      </div>

      {product.industryFit && product.industryFit.length > 0 && (
        <div className="mt-[14px]">
          <p className="text-[13px] leading-[18px] font-medium text-ink-muted">Industries served</p>
          <div className="mt-[6px] flex flex-wrap gap-[4px]">
            {product.industryFit.map((industry) => (
              <span
                key={industry}
                className="inline-flex items-center rounded-md border border-line bg-white px-[8px] py-[2px] text-[12px] leading-[18px] font-medium text-ink-soft"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-[14px]">
        <p className="text-[13px] leading-[18px] font-medium text-ink-muted">Certifications</p>
        {product.certifications.length > 0 ? (
          <ul className="mt-[6px] flex flex-col gap-[6px]">
            {product.certifications.map((certification, index) => (
              <li key={`${certification.name}-${index}`} className="text-[14px] leading-[20px] text-ink-soft">
                <span className="font-medium text-ink">{certification.name}</span>
                {certification.issuer ? <span> · {certification.issuer}</span> : null}
                {certification.year ? <span> · {certification.year}</span> : null}
                {certification.credentialUrl ? (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-[6px] inline-flex items-center gap-[4px] font-semibold text-cobalt-deep hover:underline"
                  >
                    Verify
                    <ExternalLink size={13} />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-[4px]">
            <NotSharedYet />
          </p>
        )}
      </div>
    </article>
  )
}

function AvailabilityGrid({ profile }: { profile: ExpertPublic }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Timezone', value: profile.timezone },
    {
      label: 'Regions served',
      value: profile.regionsServed?.length ? profile.regionsServed.join(', ') : null,
    },
    { label: 'Remote only', value: profile.remoteOnly ? 'Yes' : null },
    {
      label: 'Weekly availability',
      value: profile.availabilityHoursPerWeek ? `${profile.availabilityHoursPerWeek} hours` : null,
    },
    { label: 'Earliest start', value: profile.earliestStartDate },
  ]

  return (
    <dl className="flex flex-col gap-[12px]">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-[12px]">
          <dt className="text-[13px] leading-[18px] font-medium text-ink-muted">{row.label}</dt>
          <dd className="text-right text-[15px] leading-[22px] text-ink-soft">{row.value || <NotSharedYet />}</dd>
        </div>
      ))}
    </dl>
  )
}

function ProjectCard({ expertId, project }: { expertId: string; project: ExpertProjectResponse }) {
  const { getProjectFileDownloadUrl } = useExpertProfile()

  return (
    <article className="rounded-[12px] border border-line bg-surface-sunken p-[18px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <p className="font-semibold text-[16px] leading-[24px] text-ink">{project.title}</p>
          <p className="mt-[4px] text-[14px] leading-[20px] text-ink-soft">{project.summary}</p>
        </div>
        <Briefcase size={18} className="shrink-0 text-ink-muted" />
      </div>
      {project.outcomes ? (
        <p className="mt-[12px] text-[14px] leading-[20px] text-ink-soft">{project.outcomes}</p>
      ) : null}
      {resolveExpertPublicResourceUrl(project.link) ? (
        <a href={resolveExpertPublicResourceUrl(project.link) ?? undefined} target="_blank" rel="noopener noreferrer" className="mt-[12px] inline-flex items-center gap-[6px] text-[14px] leading-[20px] font-semibold text-cobalt-deep hover:underline">
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
    <div className="rounded-[16px] border border-line bg-white p-[20px]">
      <p className="text-[14px] leading-[20px] font-medium text-ink-soft">{label}</p>
      <p className="mt-[8px] text-[30px] leading-[38px] font-semibold text-ink">{value}</p>
    </div>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[20px] text-ink-muted">{children}</p>
  )
}

/**
 * Field-level counterpart to EmptyText. A profile shows every question the
 * onboarding asks, so a blank answer reads as "not shared yet" rather than
 * vanishing — a buyer can tell an unanswered question from one with no answer.
 */
function NotSharedYet() {
  return <span className="text-[15px] leading-[22px] italic text-ink-faint">Not shared yet</span>
}
