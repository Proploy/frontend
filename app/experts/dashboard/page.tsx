'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  BadgeCheck,
  Briefcase,
  Camera,
  ChevronsUpDown,
  Clock,
  ExternalLink,
  FileText,
  FolderClosed,
  Home,
  Inbox,
  LayoutGrid,
  LifeBuoy,
  Loader2,
  Mail,
  MapPin,
  User,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import ProjectDocumentsSection from '@/components/onboarding/ProjectDocumentsSection'
import { useExpertDashboard } from '@/hooks/use-expert-dashboard'
import type {
  ExpertDashboardResponse,
  ExpertLinkResponse,
  ExpertMe,
  ExpertProjectResponse,
  ExpertTagResponse,
} from '@/hooks/types/expert-contracts'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
const CARD_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

type DashboardSection = 'home' | 'projects'
type NavItem = {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  section?: DashboardSection
  badge?: string
  disabled?: boolean
}

const NAV_PRIMARY: NavItem[] = [
  { label: 'Home', icon: Home, section: 'home' },
  { label: 'Workspace', icon: LayoutGrid, disabled: true },
  { label: 'Projects', icon: FolderClosed, section: 'projects' },
  { label: 'Leads', icon: Inbox, disabled: true },
  { label: 'Earnings', icon: Wallet, disabled: true },
  { label: 'Clients', icon: User, disabled: true },
]

const NAV_SECONDARY: NavItem[] = [
  { label: 'Support', icon: LifeBuoy, disabled: true },
]

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

function getTagValues(tags: ExpertTagResponse[], type: string) {
  return tags.filter((tag) => tag.tagType === type).map((tag) => tag.tagValue)
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function getLocation(expert: ExpertMe) {
  return [expert.regionCity, expert.regionCountry].filter(Boolean).join(', ') || 'Not provided'
}

export default function ExpertsDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { getDashboard } = useExpertDashboard()
  const [dashboardData, setDashboardData] = useState<ExpertDashboardResponse | null>(null)
  const [activeSection, setActiveSection] = useState<DashboardSection>('home')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      if (isAuthLoading) return
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      const result = await getDashboard()
      if (cancelled) return

      if (!result.ok) {
        setDashboardData(null)
        setError(result.status === 403 ? 'Only an approved expert can access this dashboard.' : result.error.message)
        setIsLoading(false)
        return
      }

      setDashboardData(result.data)
      setIsLoading(false)
    }

    void loadDashboard()
    return () => {
      cancelled = true
    }
  }, [getDashboard, isAuthLoading, user?.id])

  const expert = dashboardData?.expert ?? null

  if (isAuthLoading || isLoading) {
    return (
      <DashboardShell userEmail={user?.email} userName={user?.name} activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#155eef]" />
        </div>
      </DashboardShell>
    )
  }

  if (!user) {
    return (
      <DashboardShell activeSection={activeSection} onSectionChange={setActiveSection}>
        <EmptyState
          title="Sign in required"
          body="Use your Proploy account to access your expert dashboard."
          actionHref="/sign-in?redirect=/experts/dashboard"
          actionLabel="Sign in"
        />
      </DashboardShell>
    )
  }

  if (!expert) {
    return (
      <DashboardShell userEmail={user.email} userName={user.name} activeSection={activeSection} onSectionChange={setActiveSection}>
        <EmptyState
          title="Expert dashboard unavailable"
          body={error ?? 'No approved expert profile was found for this account.'}
          actionHref="/become-expert"
          actionLabel="Complete expert onboarding"
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      userEmail={user.email}
      userName={user.name}
      expert={expert}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'home' ? (
        <DashboardHome
          expert={expert}
          email={user.email ?? ''}
          dashboardData={dashboardData}
          onExpertChange={(nextExpert) => {
            setDashboardData((previous) => previous ? { ...previous, expert: nextExpert } : previous)
          }}
          onOpenProjects={() => setActiveSection('projects')}
        />
      ) : (
        <ProjectsSection expert={expert} />
      )}
    </DashboardShell>
  )
}

function DashboardShell({
  children,
  userEmail,
  userName,
  expert,
  activeSection,
  onSectionChange,
}: {
  children: React.ReactNode
  userEmail?: string
  userName?: string
  expert?: ExpertMe
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <Sidebar
          userEmail={userEmail}
          userName={userName}
          expert={expert}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <main className="flex-1 min-w-0">
          <div className="max-w-[1144px] mx-auto px-6 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardHome({
  expert,
  email,
  dashboardData,
  onExpertChange,
  onOpenProjects,
}: {
  expert: ExpertMe
  email: string
  dashboardData: ExpertDashboardResponse | null
  onExpertChange: (expert: ExpertMe) => void
  onOpenProjects: () => void
}) {
  const model = useMemo(() => {
    const platforms = uniqueValues([
      ...getTagValues(expert.tags ?? [], 'platform'),
      ...(expert.primaryPlatforms ?? []),
      ...(expert.secondaryPlatforms ?? []),
    ])
    const industries = uniqueValues([
      ...getTagValues(expert.tags ?? [], 'industry'),
      ...(expert.industryExpertise ?? []),
    ])
    const projectTypes = uniqueValues([
      ...getTagValues(expert.tags ?? [], 'project_type'),
      ...(expert.preferredProjectTypes ?? []),
    ])
    const tools = uniqueValues([
      ...getTagValues(expert.tags ?? [], 'tool'),
      ...(expert.toolsStack ?? []),
    ])

    return { platforms, industries, projectTypes, tools }
  }, [expert])

  const metrics = [
    { label: 'Featured projects', value: String(expert.projects?.length ?? 0), sub: 'From your approved expert record' },
    { label: 'Published links', value: String(expert.links?.length ?? 0), sub: 'Portfolio, credentials and socials' },
    { label: 'Recent views', value: String(dashboardData?.recentlyViewed?.length ?? 0), sub: 'Provided by service-apis dashboard' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-[24px] leading-[32px]">Expert dashboard</h1>
          <p className="mt-1 text-[16px] leading-[24px] text-[#535862]">
            Your home and projects are loaded from the authenticated expert dashboard endpoint.
          </p>
        </div>
        <Link
          href={`/experts/${expert.id}`}
          className={`inline-flex items-center gap-2 rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}
        >
          View public profile
          <ExternalLink size={16} />
        </Link>
      </div>

      <section className={`bg-white border border-[#e9eaeb] rounded-[16px] p-6 flex flex-col gap-6 ${CARD_SHADOW}`}>
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <ProfilePictureControl expert={expert} onExpertChange={onExpertChange} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-[22px] leading-[30px]">{expert.displayName}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[12px] leading-[18px] font-medium text-[#067647]">
                <BadgeCheck size={14} />
                {expert.status}
              </span>
            </div>
            <p className="mt-1 text-[15px] leading-[22px] text-[#535862]">{expert.headline || 'No headline added yet.'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<Mail size={18} />} label="Login email" value={email || 'Not available'} />
          <InfoItem icon={<MapPin size={18} />} label="Location" value={getLocation(expert)} />
          <InfoItem icon={<Clock size={18} />} label="Timezone" value={expert.timezone || 'Not provided'} />
          <InfoItem icon={<Briefcase size={18} />} label="Experience" value={expert.yearsExperience != null ? `${expert.yearsExperience} years` : 'Not provided'} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((metric) => (
          <div key={metric.label} className={`rounded-[12px] border border-[#e9eaeb] bg-white p-5 ${CARD_SHADOW}`}>
            <p className="text-[14px] leading-[20px] font-medium text-[#414651]">{metric.label}</p>
            <p className="mt-2 text-[30px] leading-[38px] font-semibold text-[#181d27]">{metric.value}</p>
            <p className="mt-1 text-[12px] leading-[18px] text-[#717680]">{metric.sub}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfilePanel title="Availability">
          <InfoLine label="Hours per week" value={expert.availabilityHoursPerWeek != null ? `${expert.availabilityHoursPerWeek}` : 'Not provided'} />
          <InfoLine label="Notes" value={expert.availabilityNotes || 'Not provided'} />
          <InfoLine label="Scheduling provider" value={expert.schedulingProvider || 'Not provided'} />
          <InfoLine label="Scheduling link" value={expert.schedulingLink || 'Not provided'} />
        </ProfilePanel>

        <ProfilePanel title="Positioning">
          <InfoLine label="Why Proploy" value={expert.whyPlatform || 'Not provided'} />
          <InfoLine label="Unique strength" value={expert.uniqueStrength || 'Not provided'} />
          <InfoLine label="Ideal clients" value={expert.idealClients || 'Not provided'} />
          <InfoLine label="Biggest win" value={expert.biggestWin || 'Not provided'} />
        </ProfilePanel>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfilePanel title="Expertise">
          <TagBlock label="Platforms" values={model.platforms} />
          <TagBlock label="Industries" values={model.industries} />
          <TagBlock label="Project types" values={model.projectTypes} />
          <TagBlock label="Tools" values={model.tools} />
        </ProfilePanel>

        <ProfilePanel title="Links">
          {expert.links.length ? (
            <div className="grid gap-3">
              {expert.links.map((link) => (
                <ExternalLinkCard key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <p className="text-[14px] leading-[20px] text-[#717680]">No links added yet.</p>
          )}
        </ProfilePanel>
      </section>

      <ProfilePanel title="Project Documents">
        {expert.projects.length ? (
          <div className="grid gap-5">
            <ProjectDocumentsSection projects={expert.projects} />
            <button
              type="button"
              onClick={onOpenProjects}
              className="self-start text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline"
            >
              View project details
            </button>
          </div>
        ) : (
          <p className="text-[14px] leading-[20px] text-[#717680]">No project documents have been saved yet.</p>
        )}
      </ProfilePanel>
    </div>
  )
}

function ProjectsSection({ expert }: { expert: ExpertMe }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-[24px] leading-[32px]">Projects</h1>
          <p className="mt-1 text-[16px] leading-[24px] text-[#535862]">
            Published projects and document metadata from your expert dashboard response.
          </p>
        </div>
        <Link
          href={`/experts/${expert.id}`}
          className={`inline-flex items-center gap-2 rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}
        >
          View public profile
          <ExternalLink size={16} />
        </Link>
      </div>

      {expert.projects.length ? (
        <div className="grid gap-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {expert.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>

          <ProfilePanel title="Documents">
            <ProjectDocumentsSection projects={expert.projects} />
          </ProfilePanel>
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          body="Projects will appear here once your onboarding projects are saved and returned by service-apis."
          actionHref="/experts"
          actionLabel="View public experts"
        />
      )}
    </div>
  )
}

function ProfilePictureControl({
  expert,
  onExpertChange,
}: {
  expert: ExpertMe
  onExpertChange: (expert: ExpertMe) => void
}) {
  const {
    getProfilePictureUploadUrl,
    getProfilePicturePublicUrl,
    saveProfilePicture,
    uploadProfilePictureToSignedUrl,
  } = useExpertDashboard()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const uploadUrlResult = await getProfilePictureUploadUrl(file.name, file.type || 'image/jpeg')
      if (!uploadUrlResult.ok) {
        setError(uploadUrlResult.error.message)
        return
      }

      await uploadProfilePictureToSignedUrl(uploadUrlResult.data.uploadUrl, file)
      const publicUrl = getProfilePicturePublicUrl(uploadUrlResult.data.storageKey)
      const saveResult = await saveProfilePicture({
        profilePictureUrl: publicUrl,
        profilePictureKey: uploadUrlResult.data.storageKey,
      })

      if (!saveResult.ok) {
        setError(saveResult.error.message)
        return
      }

      onExpertChange(saveResult.data)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Profile picture upload failed.')
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="grid gap-2 shrink-0">
      <div className="relative size-20 overflow-hidden rounded-full bg-gradient-to-br from-[#dbeafe] to-[#c084fc]">
        {expert.profilePictureUrl ? (
          <Image src={expert.profilePictureUrl} alt={expert.displayName} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-[28px] font-semibold text-white">
            {expert.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border border-white bg-[#155eef] text-white shadow-sm transition-colors hover:bg-[#004eeb] disabled:opacity-60"
          aria-label="Change profile picture"
        >
          {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
      </div>
      {error && (
        <p className="flex max-w-[180px] items-center gap-1 text-[12px] leading-[18px] text-[#d92d20]">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

function Sidebar({
  userEmail,
  userName,
  expert,
  activeSection,
  onSectionChange,
}: {
  userEmail?: string
  userName?: string
  expert?: ExpertMe
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}) {
  const displayName = expert?.displayName || userName || 'Expert'
  const email = userEmail || 'No email'

  return (
    <aside className="hidden lg:flex flex-col w-[296px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#e9eaeb] px-[16px] py-[24px] gap-[24px]">
      <Link href="/" className="px-[8px] flex items-center gap-[10px]">
        <div className="size-[32px] rounded-[8px] bg-[#155eef] flex items-center justify-center text-white font-bold text-[14px]">
          p
        </div>
        <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">proploy</span>
      </Link>

      <nav className="flex flex-col gap-[2px]">
        {NAV_PRIMARY.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            active={item.section === activeSection}
            onSectionChange={onSectionChange}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="flex flex-col gap-[2px]">
        {NAV_SECONDARY.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            active={false}
            onSectionChange={onSectionChange}
          />
        ))}
      </nav>

      <div className="flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-[#fafafa] transition-colors">
        <div className="relative size-[40px] overflow-hidden rounded-full bg-gradient-to-br from-[#dbeafe] to-[#c084fc] shrink-0">
          {expert?.profilePictureUrl ? (
            <Image src={expert.profilePictureUrl} alt={displayName} fill className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-white font-semibold text-[14px]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{displayName}</p>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">{email}</p>
        </div>
        <ChevronsUpDown size={16} className="text-[#717680] shrink-0" />
      </div>
    </aside>
  )
}

function NavButton({
  item,
  active,
  onSectionChange,
}: {
  item: NavItem
  active: boolean
  onSectionChange: (section: DashboardSection) => void
}) {
  const Icon = item.icon
  const disabled = item.disabled || !item.section

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (item.section) onSectionChange(item.section)
      }}
      className={`flex items-center gap-[12px] px-[12px] py-[8px] rounded-[6px] text-left font-semibold text-[14px] leading-[20px] transition-colors ${
        active ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651] hover:bg-[#fafafa]'
      } ${disabled ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''}`}
    >
      <Icon size={20} className="text-[#717680] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
          {item.badge}
        </span>
      )}
    </button>
  )
}

function ProjectCard({ project }: { project: ExpertProjectResponse }) {
  return (
    <article className={`rounded-[14px] border border-[#e9eaeb] bg-white p-5 flex flex-col gap-4 ${CARD_SHADOW}`}>
      <div>
        <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{project.title}</p>
        <p className="mt-1 text-[14px] leading-[20px] text-[#535862]">{project.summary}</p>
      </div>
      {project.outcomes && (
        <p className="text-[14px] leading-[20px] text-[#414651]">{project.outcomes}</p>
      )}
      <div className="mt-auto flex flex-wrap gap-3">
        {project.link && (
          <Link href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#004eeb] font-semibold text-[14px] leading-[20px] hover:underline">
            View project
            <ExternalLink size={14} />
          </Link>
        )}
        {project.fileName && (
          <span className="inline-flex min-w-0 items-center gap-1 text-[#535862] text-[14px] leading-[20px]">
            <FileText size={14} className="shrink-0" />
            <span className="truncate">{project.fileName}</span>
          </span>
        )}
      </div>
    </article>
  )
}

function ExternalLinkCard({ link }: { link: ExpertLinkResponse }) {
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-[10px] border border-[#e9eaeb] p-3 hover:border-[#155eef]"
    >
      <span className="min-w-0">
        <span className="block text-[12px] leading-[18px] font-semibold uppercase text-[#717680]">{getLinkLabel(link.linkType)}</span>
        <span className="block truncate text-[14px] leading-[20px] text-[#181d27]">{link.url}</span>
      </span>
      <ExternalLink size={16} className="text-[#717680] shrink-0" />
    </Link>
  )
}

function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string
  body: string
  actionHref: string
  actionLabel: string
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-[520px] rounded-[16px] border border-[#e9eaeb] bg-white p-8 text-center">
        <h1 className="font-semibold text-[24px] leading-[32px]">{title}</h1>
        <p className="mt-2 text-[15px] leading-[22px] text-[#535862]">{body}</p>
        <Link
          href={actionHref}
          className={`mt-6 inline-flex rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] leading-[20px] font-semibold text-white ${BUTTON_SKEUO}`}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}

function ProfilePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`bg-white border border-[#e9eaeb] rounded-[16px] p-6 flex flex-col gap-5 ${CARD_SHADOW}`}>
      <h2 className="font-semibold text-[18px] leading-[28px]">{title}</h2>
      {children}
    </section>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] bg-[#fafafa] p-4">
      <span className="mt-0.5 text-[#717680]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[13px] leading-[18px] font-medium text-[#717680]">{label}</p>
        <p className="text-[15px] leading-[22px] font-medium text-[#181d27] break-words">{value}</p>
      </div>
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-[13px] leading-[18px] font-medium text-[#717680]">{label}</p>
      <p className="text-[15px] leading-[22px] text-[#181d27] whitespace-pre-line break-words">{value}</p>
    </div>
  )
}

function TagBlock({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-[13px] leading-[18px] font-medium text-[#717680]">{label}</p>
      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={`${label}-${value}`} className="inline-flex rounded-full border border-[#b2ccff] bg-[#eff4ff] px-2.5 py-1 text-[13px] leading-[18px] font-medium text-[#004eeb]">
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[14px] leading-[20px] text-[#717680]">Not provided</p>
      )}
    </div>
  )
}
