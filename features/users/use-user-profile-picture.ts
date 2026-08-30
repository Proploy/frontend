'use client'

import { useEffect, useState } from 'react'
import { getUserProfile } from './client'
import type { UserProfile } from './types'
import { useAuth } from '@/components/providers/auth-provider'

export function useUserProfilePicture(): string | undefined | null {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [refreshBust, setRefreshBust] = useState(Date.now())

  useEffect(() => {
    if (user) {
      void getUserProfile().then((res) => {
        if (res.ok) setProfile(res.data)
      })

      const onPicChanged = () => {
        void getUserProfile().then((res) => {
          if (res.ok) {
            setProfile(res.data)
            setRefreshBust(Date.now())
          }
        })
      }
      window.addEventListener('proploy-profile-picture-changed', onPicChanged)
      return () => window.removeEventListener('proploy-profile-picture-changed', onPicChanged)
    }
  }, [user])

  if (!user) return undefined

  return profile?.profilePictureKey
    ? `/api/proxy/api/v1/users/me/profile-picture?t=${refreshBust}`
    : user.image
}
