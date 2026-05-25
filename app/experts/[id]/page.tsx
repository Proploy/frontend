'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  MoreHorizontal,
  Clock,
  ArrowUpRight,
  BadgeCheck,
  Star,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import Footer from '@/components/Footer'
import { useExpertProfile } from '@/hooks/use-expert-profile'
import type { ExpertPublic } from '@/hooks/types/expert-contracts'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

interface ExpertProfile {
  id: string
  displayName: string
  headline?: string | null
  bio?: string | null
  avatarUrl?: string | null
  regionCity?: string | null
  regionCountry?: string | null
  regionCountryCode?: string | null
  email?: string | null
  timezone?: string | null
  socials?: Array<{ kind: string; href: string }>
  specializations?: string[]
  softwares?: Array<{ name: string; description?: string }>
  projects?: Array<{
    role: string
    company: string
    period: string
    stars?: number
    category?: 'web-design' | 'product-design' | 'branding'
    avatarColor?: string
  }>
  verified?: boolean
}

const PROJECT_TABS = [
  { key: 'all' as const, label: 'View all' },
  { key: 'web-design' as const, label: 'Web design' },
  { key: 'product-design' as const, label: 'Product design' },
  { key: 'branding' as const, label: 'Branding' },
]

type ExpertPublicWithOptionalProfileFields = ExpertPublic & {
  bio?: string | null
  email?: string | null
  avatarUrl?: string | null
  socials?: Array<{ kind: string; href: string }>
}

type ProjectCategory = NonNullable<ExpertProfile['projects']>[number]['category']

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function stringArray(values: string[] | null | undefined) {
  return Array.isArray(values) ? values : []
}

function getProjectCategory(): ProjectCategory {
  return undefined
}

function mapExpertProfile(data: ExpertPublic): ExpertProfile {
  const profile = data as ExpertPublicWithOptionalProfileFields
  const tagValues = Array.isArray(profile.tags) ? profile.tags.map((tag) => tag.tagValue) : []
  const specializations = unique([
    ...stringArray(profile.primaryPlatforms),
    ...stringArray(profile.industryExpertise),
    ...stringArray(profile.preferredProjectTypes),
    ...tagValues,
  ])

  return {
    id: profile.id,
    displayName: profile.displayName,
    headline: profile.headline,
    bio: profile.bio ?? profile.headline,
    avatarUrl: profile.profilePictureUrl ?? profile.avatarUrl,
    regionCity: profile.regionCity,
    regionCountry: profile.regionCountry,
    email: profile.email,
    timezone: profile.timezone,
    socials: profile.socials,
    specializations,
    softwares: stringArray(profile.toolsStack).map((name) => ({ name })),
    projects: (Array.isArray(profile.projects) ? profile.projects : []).map((project) => ({
      role: project.title,
      company: project.summary || 'Project',
      period: project.outcomes,
      stars: 0,
      category: getProjectCategory(),
    })),
    verified: true,
  }
}

export default function ExpertProfilePage() {
  const params = useParams()
  const id = params.id as string
  const { getExpertProfile } = useExpertProfile()
  const [profile, setProfile] = useState<ExpertProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<(typeof PROJECT_TABS)[number]['key']>('all')

  useEffect(() => {
    async function fetchExpert() {
      setLoading(true)
      setError(null)
      const result = await getExpertProfile(id)
      if (result.ok) {
        setProfile(mapExpertProfile(result.data))
      } else {
        setProfile(null)
        setError(result.error.message)
      }
      setLoading(false)
    }
    if (id) void fetchExpert()
  }, [getExpertProfile, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[120px] flex items-center justify-center font-[family-name:var(--font-dm-sans)]">
        <Loader2 className="size-[32px] animate-spin text-[#155eef]" />
      </div>
    )
  }

  if (!profile) {
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

  const visibleProjects = profile.projects?.filter(
    (p) => projectFilter === 'all' || p.category === projectFilter,
  ) ?? []

  return (
    <div className="min-h-screen bg-white pt-[120px] flex flex-col font-[family-name:var(--font-dm-sans)]">
      <div className="max-w-[1440px] mx-auto w-full px-[80px] py-[40px] flex flex-col gap-[40px]">
        {/* Page header */}
        <header className="flex flex-col gap-[24px] px-[32px]">
          <div className="flex items-center gap-[20px] w-full">
            <div className="size-[160px] rounded-full bg-[#e9eaeb] overflow-hidden relative shrink-0">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.displayName} fill className="object-cover" />
              ) : (
                <div className="size-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] flex items-center justify-center text-white font-bold text-[48px]">
                  {profile.displayName.charAt(0)}
                </div>
              )}
              {profile.verified && (
                <span className="absolute bottom-[6px] right-[6px] size-[28px] rounded-full bg-white flex items-center justify-center">
                  <BadgeCheck size={24} className="text-[#155eef]" />
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-[16px] min-w-0">
              <div className="flex flex-wrap items-start gap-[16px] w-full">
                <div className="flex-1 flex flex-col gap-[4px] min-w-[240px]">
                  <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">
                    {profile.displayName}
                  </h1>
                  {profile.headline && (
                    <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                      {profile.headline}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-[12px]">
                  <button
                    type="button"
                    aria-label="More actions"
                    className={`bg-white border border-[#d5d7da] rounded-[8px] p-[10px] ${BUTTON_SKEUO_SHADOW}`}
                  >
                    <MoreHorizontal size={20} className="text-[#414651]" />
                  </button>
                  <button
                    type="button"
                    className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
                  >
                    View portfolio
                  </button>
                  <button
                    type="button"
                    className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO_SHADOW}`}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* About + Details */}
        <section className="flex flex-wrap gap-[32px] px-[32px]">
          <div className="flex-1 min-w-[320px] max-w-[640px] flex flex-col gap-[16px]">
            <p className="font-medium text-[16px] leading-[24px] text-[#181d27]">About me</p>
            <p className="font-normal text-[16px] leading-[24px] text-[#535862] whitespace-pre-line">
              {profile.bio}
            </p>
            <button type="button" className="self-start font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
              Read more
            </button>
          </div>

          <div className="w-[400px] max-w-full flex flex-wrap gap-x-[24px] gap-y-[24px] items-start">
            <Detail label="Location">
              <span className="inline-flex items-center gap-[8px]">
                {profile.regionCountry && (
                  <span className="size-[20px] rounded-full bg-[#e0e7ff] text-[#3538cd] text-[10px] font-bold flex items-center justify-center">
                    {profile.regionCountry}
                  </span>
                )}
                <span className="font-normal text-[16px] leading-[24px] text-[#181d27]">
                  {profile.regionCity}, {profile.regionCountry}
                </span>
              </span>
            </Detail>

            <Detail label="Email">
              <a
                href={profile.email ? `mailto:${profile.email}` : '#'}
                className="inline-flex items-center gap-[4px] font-semibold text-[16px] leading-[24px] text-[#004eeb] hover:underline"
              >
                {profile.email}
                <ArrowUpRight size={16} />
              </a>
            </Detail>

            <Detail label="Timezone">
              <span className="inline-flex items-center gap-[6px] font-normal text-[14px] leading-[20px] text-[#414651]">
                <Clock size={20} className="text-[#717680]" />
                {profile.timezone}
              </span>
            </Detail>

            <Detail label="Socials">
              <div className="flex items-center gap-[16px]">
                {profile.socials?.map((s, i) => (
                  <a
                    key={`${s.kind}-${i}`}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.kind}
                    className="size-[20px] flex items-center justify-center text-[#717680] hover:text-[#414651]"
                  >
                    <SocialIcon kind={s.kind} />
                  </a>
                ))}
              </div>
            </Detail>

            <Detail label="Specialization" className="w-full">
              <div className="flex flex-wrap gap-[8px]">
                {profile.specializations?.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="inline-flex items-center gap-[6px] bg-[#eff4ff] border border-[#b2ccff] rounded-full px-[10px] py-[2px] font-medium text-[14px] leading-[20px] text-[#004eeb]"
                  >
                    <span className="size-[6px] rounded-full bg-[#004eeb]" />
                    {tag}
                  </span>
                ))}
              </div>
            </Detail>
          </div>
        </section>

        {/* Softwares */}
        <section className="flex flex-col gap-[16px] px-[32px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Softwares</p>
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              I specialise in UX/UI design, brand strategy, and Webflow development.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {profile.softwares?.map((soft, i) => (
              <div key={i} className="flex items-center gap-[12px] bg-white border border-[#e9eaeb] rounded-[12px] p-[20px]">
                <div className="size-[48px] rounded-[12px] bg-[#155eef] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                  {soft.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[16px] leading-[24px] text-[#181d27] truncate">{soft.name}</p>
                  <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">{soft.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Projects */}
        <section className="flex flex-col gap-[16px] px-[32px]">
          <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Past Projects</p>

          <div className="flex items-center gap-[4px] p-[4px] bg-[#fafafa] border border-[#e9eaeb] rounded-[10px] self-start">
            {PROJECT_TABS.map((tab) => {
              const active = tab.key === projectFilter
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setProjectFilter(tab.key)}
                  className={`h-[36px] px-[12px] rounded-[6px] font-semibold text-[14px] leading-[20px] transition-colors ${
                    active
                      ? 'bg-white text-[#414651] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]'
                      : 'text-[#717680] hover:text-[#414651]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {visibleProjects.map((p, i) => (
              <article key={i} className="bg-white border border-[#e9eaeb] rounded-[16px] overflow-hidden flex flex-col">
                <div className="p-[20px] flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[12px]">
                    <div
                      className="size-[48px] rounded-full flex items-center justify-center text-white font-bold text-[18px] shrink-0"
                      style={{ background: p.avatarColor || '#7c3aed' }}
                    >
                      {p.company.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[16px] leading-[24px] text-[#181d27] truncate">{p.role}</p>
                      <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">{p.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-normal text-[14px] leading-[20px] text-[#535862]">{p.period}</span>
                    <div className="flex items-center gap-[4px]">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          size={16}
                          className={k < (p.stars ?? 0) ? 'fill-[#facc15] text-[#facc15]' : 'text-[#e9eaeb]'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#e9eaeb] px-[20px] py-[14px]">
                  <Link href="#" className="inline-flex items-center gap-[4px] font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
                    View details
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

function Detail({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-[8px] ${className}`}>
      <p className="font-medium text-[14px] leading-[20px] text-[#181d27]">{label}</p>
      {children}
    </div>
  )
}

function SocialIcon({ kind }: { kind: string }) {
  if (kind === 'x') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-full" aria-hidden>
        <path d="M11.93 8.46 18.36 1h-1.52l-5.58 6.49L6.79 1H1.5l6.74 9.81L1.5 19h1.52l5.9-6.86L13.62 19h5.29l-7-10.54Zm-2.09 2.43-.68-.98L3.57 2.17h2.34l4.39 6.28.69.98 5.7 8.16h-2.34l-4.51-6.55Z" />
      </svg>
    )
  }
  if (kind === 'linkedin') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-full" aria-hidden>
        <path d="M16.34 16.34h-2.86v-4.48c0-1.07-.02-2.44-1.49-2.44-1.49 0-1.72 1.16-1.72 2.36v4.56H7.41V7.59h2.74v1.2h.04c.38-.72 1.31-1.49 2.7-1.49 2.89 0 3.43 1.9 3.43 4.38v4.66ZM4.21 6.39a1.66 1.66 0 1 1 0-3.32 1.66 1.66 0 0 1 0 3.32Zm-1.43 9.95h2.86V7.59H2.78v8.75Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-full" aria-hidden>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2 2.5 3 5 3 7.5s-1 5-3 7.5c-2-2.5-3-5-3-7.5s1-5 3-7.5Z" />
    </svg>
  )
}
