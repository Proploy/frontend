'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { ArrowRight, Camera, Download, Eye, GitCompareArrows, Heart, Loader2, Package2, Trash2, UserRound } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { useProductDetail } from '@/features/catalog'
import { useExpertProfile } from '@/features/experts'
import {
  deleteUserProfilePicture,
  deleteSavedReport,
  exportAiReport,
  getPersonalizationProfile,
  getUserProfilePicture,
  notifyUserProfilePictureChanged,
  removeFavorite,
  uploadUserProfilePicture,
  updateUserProfile,
  canUsePersonalization,
  type PersonalizationProfile,
  type SavedAiReport,
} from '@/features/users'

const BUTTON_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

function formatDate(value?: string | null) {
  if (!value) return 'Not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canAccessProfile = canUsePersonalization(user?.role)

  const loadProfile = useCallback(async () => {
    if (!user || !canAccessProfile) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const result = await getPersonalizationProfile()
    if (result.ok) {
      setProfile(result.data)
      setError(null)
    } else {
      setError(result.error.message)
    }
    setLoading(false)
  }, [canAccessProfile, user])

  useEffect(() => {
    if (authLoading) return
    const timer = window.setTimeout(() => void loadProfile(), 0)
    return () => window.clearTimeout(timer)
  }, [authLoading, loadProfile])

  if (authLoading || (user && loading && !profile)) {
    return <LoadingState />
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-6 pt-[132px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <EmptyState title="Sign in required" body="Sign in to manage saved products and research reports." actionHref="/sign-in?redirect=/profile" actionLabel="Sign in" />
      </main>
    )
  }

  if (!canAccessProfile) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-6 pt-[132px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <EmptyState title="Profile unavailable" body="Personalization profiles are available to user and expert accounts." actionHref="/" actionLabel="Go home" />
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-6 pt-[132px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <EmptyState title="Profile unavailable" body={error ?? 'Your profile could not be loaded.'} actionHref="/" actionLabel="Go home" />
      </main>
    )
  }

  const savedProducts = profile.favorites.filter((favorite) => favorite.targetType === 'product')
  const recentlyViewed = profile.recentlyViewed ?? []
  const savedComparisons = profile.reports.filter(isSavedComparisonReport)
  const researchReports = profile.reports.filter((report) => !isSavedComparisonReport(report))

  const handleSave = async (name: string) => {
    setSaving(true)
    setMessage(null)
    setError(null)
    const result = await updateUserProfile({ name: name.trim() || null })
    if (result.ok) {
      setProfile((current) => current ? { ...current, ...result.data } : current)
      setMessage('Profile saved.')
    } else {
      setError(result.error.message)
    }
    setSaving(false)
  }

  const handleProfilePictureUpload = async (file: File): Promise<boolean> => {
    setMessage(null)
    setError(null)
    const result = await uploadUserProfilePicture(file)
    if (result.ok) {
      setProfile((current) => current ? { ...current, ...result.data } : current)
      notifyUserProfilePictureChanged()
      setMessage('Profile picture updated.')
      return true
    }
    setError(result.error.message)
    return false
  }

  const handleProfilePictureRemove = async (): Promise<boolean> => {
    setMessage(null)
    setError(null)
    const result = await deleteUserProfilePicture()
    if (result.ok) {
      setProfile((current) => current ? { ...current, ...result.data } : current)
      notifyUserProfilePictureChanged()
      setMessage('Profile picture removed.')
      return true
    }
    setError(result.error.message)
    return false
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    const result = await removeFavorite(favoriteId)
    if (result.ok) {
      setProfile((current) => current
        ? { ...current, favorites: current.favorites.filter((favorite) => favorite.id !== favoriteId) }
        : current)
    } else {
      setError(result.error.message)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    const result = await deleteSavedReport(reportId)
    if (result.ok) {
      setProfile((current) => current
        ? { ...current, reports: current.reports.filter((report) => report.id !== reportId) }
        : current)
    } else {
      setError(result.error.message)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 pb-20 pt-[120px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[#155eef]">Your account</p>
            <h1 className="mt-2 text-[34px] font-semibold leading-[42px] tracking-[-0.5px]">Profile</h1>
            <p className="mt-2 max-w-[640px] text-[16px] leading-[24px] text-[#535862]">
              Saved products and AI research are kept together to personalize your Proploy experience.
            </p>
          </div>
          <Link href="/AI_workspace" className={`inline-flex h-[42px] items-center gap-2 rounded-[8px] bg-[#155eef] px-4 text-[14px] font-semibold text-white ${BUTTON_SHADOW}`}>
            Open AI_workspace
            <ArrowRight size={16} />
          </Link>
        </header>

        {error ? <p className="rounded-[8px] border border-[#fecdca] bg-[#fef3f2] px-3 py-2 text-[14px] text-[#b42318]">{error}</p> : null}
        {message ? <p className="rounded-[8px] border border-[#abefc6] bg-[#ecfdf3] px-3 py-2 text-[14px] text-[#067647]">{message}</p> : null}

        <ProfileIdentityCard
          key={profile.name ?? profile.email}
          profile={profile}
          saving={saving}
          onSave={handleSave}
          onUploadPicture={handleProfilePictureUpload}
          onRemovePicture={handleProfilePictureRemove}
        />

        <section className="rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
          <SectionHeader icon={<Heart size={18} />} title="Saved products" body="Products you want to revisit." />
          {savedProducts.length === 0 ? (
            <EmptyPanel body="Use the heart on a product card or product page to save it here." actionHref="/products" actionLabel="Explore products" />
          ) : (
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {savedProducts.map((favorite) => (
                <SavedProductCard
                  key={favorite.id}
                  productId={favorite.targetId}
                  savedAt={favorite.createdAt}
                  onRemove={() => void handleRemoveFavorite(favorite.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
          <SectionHeader icon={<GitCompareArrows size={18} />} title="Saved comparisons" body="Product comparison views you saved." />
          {savedComparisons.length === 0 ? (
            <EmptyPanel body="Save a product comparison and it will appear here." actionHref="/compare" actionLabel="Compare products" />
          ) : (
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {savedComparisons.map((report) => (
                <SavedComparisonCard key={report.id} report={report} onDelete={handleDeleteReport} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
          <SectionHeader icon={<Eye size={18} />} title="Recently viewed" body="Your recent product and expert activity." />
          {recentlyViewed.length === 0 ? (
            <EmptyPanel body="Products and experts you open will appear here." actionHref="/products" actionLabel="Explore products" />
          ) : (
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {recentlyViewed.map((item) => (
                <RecentlyViewedCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
          <SectionHeader icon={<Download size={18} />} title="Reports & exports" body="AI research saved to your profile." />
          {researchReports.length === 0 ? (
            <EmptyPanel body="Save a report from AI_workspace and it will appear here for export." actionHref="/AI_workspace" actionLabel="Start research" />
          ) : (
            <div className="flex flex-col gap-3 p-5">
              {researchReports.map((report) => (
                <ReportRow key={report.id} report={report} onDelete={handleDeleteReport} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function recentlyViewedHref(targetType: string, targetId: string) {
  const encodedId = encodeURIComponent(targetId)
  return targetType === 'expert' ? `/experts/${encodedId}` : `/products/${encodedId}`
}

function SavedProductCard({
  productId,
  savedAt,
  onRemove,
}: {
  productId: string
  savedAt: string
  onRemove: () => void
}) {
  const { product, loading, error } = useProductDetail({ productId })
  const productName = product?.product_name ?? (loading || !error ? 'Loading product…' : 'Product unavailable')

  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-4 py-3">
      <Link href={`/products/${encodeURIComponent(productId)}`} className="flex min-w-0 items-center gap-3 text-[15px] font-semibold text-[#181d27] hover:text-[#155eef]">
        <ProductLogo productName={productName} logoUrl={product?.product_logo ?? null} />
        <span className="min-w-0">
          <span className="block truncate">{productName}</span>
          <span className="mt-1 block text-[12px] font-normal text-[#717680]">Saved {formatDate(savedAt)}</span>
        </span>
      </Link>
      <button type="button" onClick={onRemove} className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[#717680] hover:bg-white hover:text-[#b42318]" aria-label={`Remove ${productName} from saved products`}>
        <Trash2 size={15} />
      </button>
    </div>
  )
}

function RecentlyViewedCard({ item }: { item: PersonalizationProfile['recentlyViewed'][number] }) {
  if (item.targetType === 'expert') {
    return <RecentlyViewedExpertCard expertId={item.targetId} viewedAt={item.viewedAt} />
  }

  return <RecentlyViewedProductCard productId={item.targetId} viewedAt={item.viewedAt} />
}

function RecentlyViewedProductCard({ productId, viewedAt }: { productId: string; viewedAt: string }) {
  const { product, loading, error } = useProductDetail({ productId })
  const productName = product?.product_name ?? (loading || !error ? 'Loading product…' : 'Product unavailable')

  return (
    <Link href={recentlyViewedHref('product', productId)} className="flex min-w-0 items-center gap-3 rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-4 py-3 hover:border-[#b2ccff]">
      <ProductLogo productName={productName} logoUrl={product?.product_logo ?? null} />
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold text-[#181d27]">{productName}</span>
        <span className="mt-1 block text-[12px] text-[#717680]">Viewed {formatDate(viewedAt)}</span>
      </span>
    </Link>
  )
}

function RecentlyViewedExpertCard({ expertId, viewedAt }: { expertId: string; viewedAt: string }) {
  const { getExpertProfile } = useExpertProfile()
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void getExpertProfile(expertId).then((result) => {
      if (!active) return
      if (result.ok) {
        setDisplayName(result.data.displayName)
        setProfilePictureUrl(result.data.profilePictureUrl ?? null)
      } else {
        setDisplayName(null)
        setProfilePictureUrl(null)
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [expertId, getExpertProfile])

  const name = displayName ?? (loading ? 'Loading expert…' : 'Expert unavailable')

  return (
    <Link href={recentlyViewedHref('expert', expertId)} className="flex min-w-0 items-center gap-3 rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] px-4 py-3 hover:border-[#b2ccff]">
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#dbeafe] to-[#c084fc] text-[15px] font-semibold text-white">
        {profilePictureUrl ? <CatalogImage src={profilePictureUrl} alt={name} className="size-full object-cover" fallback={name.charAt(0).toUpperCase()} /> : name.charAt(0).toUpperCase()}
      </div>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold text-[#181d27]">{name}</span>
        <span className="mt-1 block text-[12px] text-[#717680]">Viewed {formatDate(viewedAt)} · Expert</span>
      </span>
    </Link>
  )
}

function ProductLogo({ productName, logoUrl }: { productName: string; logoUrl: string | null }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white">
      {logoUrl ? <CatalogImage src={logoUrl} alt={`${productName} logo`} className="size-8 object-contain" fallback={<Package2 size={19} className="text-[#98a2b3]" />} /> : <Package2 size={19} className="text-[#98a2b3]" />}
    </div>
  )
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function readString(record: Record<string, unknown> | null | undefined, key: string): string | null {
  const value = record?.[key]
  return typeof value === 'string' && value.trim() ? value : null
}

function readStringArray(record: Record<string, unknown> | null | undefined, key: string): string[] {
  const value = record?.[key]
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []
}

function isSavedComparisonReport(report: SavedAiReport): boolean {
  const profile = asRecord(report.profile)
  const document = asRecord(report.document)
  return readString(profile, 'type') === 'comparison' || readString(document, 'type') === 'comparison'
}

function getSavedComparisonHref(report: SavedAiReport): string {
  const profile = asRecord(report.profile)
  const document = asRecord(report.document)
  const explicitUrl = readString(document, 'url') ?? readString(profile, 'url')
  if (explicitUrl?.startsWith('/compare')) return explicitUrl

  const ids = readStringArray(document, 'productIds')
  const fallbackIds = ids.length > 0 ? ids : readStringArray(profile, 'productIds')
  if (fallbackIds.length > 0) {
    return `/compare?products=${fallbackIds.map((id) => encodeURIComponent(id)).join(',')}`
  }
  return '/compare'
}

function getSavedComparisonProducts(report: SavedAiReport): string[] {
  const document = asRecord(report.document)
  const products = document?.products
  if (Array.isArray(products)) {
    const names = products
      .map((item) => readString(asRecord(item), 'name') ?? readString(asRecord(item), 'product_name'))
      .filter((name): name is string => Boolean(name))
    if (names.length > 0) return names
  }

  const recommendations = report.recommendations
  if (Array.isArray(recommendations)) {
    const names = recommendations
      .map((item) => readString(asRecord(item), 'name') ?? readString(asRecord(item), 'product_name'))
      .filter((name): name is string => Boolean(name))
    if (names.length > 0) return names
  }

  const profile = asRecord(report.profile)
  return readStringArray(document, 'productIds').concat(readStringArray(profile, 'productIds')).slice(0, 4)
}

function SavedComparisonCard({ report, onDelete }: { report: SavedAiReport; onDelete: (id: string) => Promise<void> }) {
  const href = getSavedComparisonHref(report)
  const products = getSavedComparisonProducts(report)
  const productSummary = products.length > 0 ? products.join(' vs ') : 'Open comparison'

  return (
    <article className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-4 hover:border-[#b2ccff]">
      <div className="flex items-start justify-between gap-3">
        <Link href={href} className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#155eef]">
            <GitCompareArrows size={15} />
            Comparison
          </div>
          <h3 className="mt-2 truncate text-[16px] font-semibold leading-[24px] text-[#181d27]">{report.title}</h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-[19px] text-[#535862]">{productSummary}</p>
          <p className="mt-3 text-[12px] text-[#717680]">Saved {formatDate(report.createdAt)}</p>
        </Link>
        <button type="button" onClick={() => void onDelete(report.id)} className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[#717680] hover:bg-white hover:text-[#b42318]" aria-label={`Delete ${report.title}`}>
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  )
}

function ProfileIdentityCard({
  profile,
  saving,
  onSave,
  onUploadPicture,
  onRemovePicture,
}: {
  profile: PersonalizationProfile
  saving: boolean
  onSave: (name: string) => Promise<void>
  onUploadPicture: (file: File) => Promise<boolean>
  onRemovePicture: () => Promise<boolean>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(profile.name ?? '')
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [pictureAction, setPictureAction] = useState<'upload' | 'remove' | null>(null)
  const [pictureLoading, setPictureLoading] = useState(false)
  const avatar = localPreviewUrl ?? profilePictureUrl ?? profile.avatarUrl ?? null
  const displayInitial = (profile.name ?? profile.email).charAt(0).toUpperCase()
  const hasStoredPicture = Boolean(profile.profilePictureKey || profile.profilePictureUrl)

  useEffect(() => {
    let active = true
    if (!profile.profilePictureKey) {
      void Promise.resolve().then(() => {
        if (active) setProfilePictureUrl(null)
      })
      return () => {
        active = false
      }
    }

    void Promise.resolve()
      .then(() => {
        if (active) setPictureLoading(true)
        return getUserProfilePicture()
      })
      .then((result) => {
        if (!active) return
        if (result.ok) {
          const objectUrl = URL.createObjectURL(result.data)
          setProfilePictureUrl(objectUrl)
          setLocalPreviewUrl((current) => {
            if (current) URL.revokeObjectURL(current)
            return null
          })
        }
      })
      .finally(() => {
        if (active) setPictureLoading(false)
      })

    return () => {
      active = false
    }
  }, [profile.profilePictureKey])

  useEffect(() => {
    return () => {
      if (profilePictureUrl) URL.revokeObjectURL(profilePictureUrl)
    }
  }, [profilePictureUrl])

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setLocalPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return previewUrl
    })
    setPictureAction('upload')
    const uploaded = await onUploadPicture(file)
    if (!uploaded) {
      setLocalPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
    }
    setPictureAction(null)
  }

  const handleRemovePicture = async () => {
    setPictureAction('remove')
    const removed = await onRemovePicture()
    if (removed) {
      setProfilePictureUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
      setLocalPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
    }
    setPictureAction(null)
  }

  return (
    <section className="rounded-[12px] border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#dbeafe] to-[#c084fc] text-[24px] font-semibold text-white">
            {avatar ? <img src={avatar} alt={profile.name ?? 'Profile'} className="size-full object-cover" /> : displayInitial}
            {pictureLoading ? (
              <span className="absolute inset-0 flex items-center justify-center bg-[#181d27]/40">
                <Loader2 size={18} className="animate-spin" />
              </span>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            aria-label="Upload profile photo"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => void handlePictureChange(event)}
          />
          <div>
            <p className="text-[20px] font-semibold leading-[28px]">{profile.name || 'Your profile'}</p>
            <p className="mt-1 text-[14px] leading-[20px] text-[#535862]">{profile.email} · {profile.role}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={Boolean(pictureAction)}
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[13px] font-semibold text-[#414651] hover:bg-[#f5f8ff] disabled:opacity-60"
              >
                {pictureAction === 'upload' ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                {hasStoredPicture || avatar ? 'Change photo' : 'Add photo'}
              </button>
              {hasStoredPicture ? (
                <button
                  type="button"
                  onClick={() => void handleRemovePicture()}
                  disabled={Boolean(pictureAction)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#fecdca] bg-white px-3 text-[13px] font-semibold text-[#b42318] hover:bg-[#fef3f2] disabled:opacity-60"
                >
                  {pictureAction === 'remove' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
          <Stat value={String(profile.favorites.length)} label="Saved" />
          <Stat value={String(profile.reports.length)} label="Reports" />
          <Stat value={String(profile.interests.industries.length + profile.interests.platforms.length)} label="Interests" />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-[14px] font-medium text-[#414651]">
          Display name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-11 w-full rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20" />
        </label>
        <button type="button" onClick={() => void onSave(name)} disabled={saving} className={`inline-flex h-11 items-center justify-center rounded-[8px] bg-[#155eef] px-4 text-[14px] font-semibold text-white disabled:opacity-60 ${BUTTON_SHADOW}`}>
          {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </section>
  )
}

function ReportRow({ report, onDelete }: { report: SavedAiReport; onDelete: (id: string) => Promise<void> }) {
  return (
    <article className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold leading-[24px] text-[#181d27]">{report.title}</h3>
          <p className="mt-1 text-[12px] leading-[18px] text-[#717680]">Saved {formatDate(report.createdAt)}</p>
          {report.summary ? <p className="mt-3 line-clamp-3 text-[14px] leading-[21px] text-[#535862]">{report.summary}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => exportAiReport(report, `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'proploy-report'}.json`)} className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[13px] font-semibold text-[#414651] hover:bg-[#f5f8ff]">
            <Download size={14} /> Export
          </button>
          <button type="button" onClick={() => void onDelete(report.id)} className="inline-flex size-9 items-center justify-center rounded-[8px] text-[#717680] hover:bg-white hover:text-[#b42318]" aria-label={`Delete ${report.title}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

function SectionHeader({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="flex items-center gap-3 border-b border-[#e9eaeb] px-5 py-4"><span className="flex size-9 items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">{icon}</span><div><h2 className="text-[17px] font-semibold leading-[24px]">{title}</h2><p className="text-[13px] leading-[18px] text-[#717680]">{body}</p></div></div>
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="min-w-[72px] rounded-[8px] bg-[#fafafa] px-3 py-2"><p className="text-[18px] font-semibold">{value}</p><p className="text-[12px] text-[#717680]">{label}</p></div>
}

function LoadingState() {
  return <main className="flex min-h-screen items-center justify-center bg-[#fafafa] pt-[80px]"><Loader2 className="size-8 animate-spin text-[#155eef]" /></main>
}

function EmptyState({ title, body, actionHref, actionLabel }: { title: string; body: string; actionHref: string; actionLabel: string }) {
  return <div className="mx-auto max-w-[520px] rounded-[12px] border border-[#e9eaeb] bg-white p-8 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eff4ff] text-[#155eef]"><UserRound size={22} /></span><h1 className="mt-4 text-[24px] font-semibold">{title}</h1><p className="mt-2 text-[15px] leading-[22px] text-[#535862]">{body}</p><Link href={actionHref} className={`mt-6 inline-flex rounded-[8px] bg-[#155eef] px-4 py-2.5 text-[14px] font-semibold text-white ${BUTTON_SHADOW}`}>{actionLabel}</Link></div>
}

function EmptyPanel({ body, actionHref, actionLabel }: { body: string; actionHref: string; actionLabel: string }) {
  return <div className="flex flex-col items-center gap-3 px-5 py-10 text-center"><p className="text-[14px] leading-[20px] text-[#717680]">{body}</p><Link href={actionHref} className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#155eef] hover:underline">{actionLabel}<ArrowRight size={15} /></Link></div>
}
