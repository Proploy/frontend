'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPersonalizationProfile, type PersonalizationProfile } from '@/features/users'
import { UserActivitySections } from '@/components/profile/UserProfile'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

export function ActivityTab({ recentlyViewed, interests }: { recentlyViewed?: Record<string, unknown>[], interests?: Record<string, unknown>[] }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await getPersonalizationProfile()
      if (result.ok) {
        setProfile(result.data)
        setError(null)
      } else {
        setError(result.error.message)
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#155eef]" /></div>
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>
  }

  if (!profile) {
    return <div className="py-20 text-center text-gray-500">Failed to load activity.</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <UserActivitySections profile={profile} onUpdateProfile={setProfile} />
    </div>
  )
}
