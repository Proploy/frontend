'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { UserProfile } from '@/components/profile/UserProfile'
import { ExpertProfileDashboard } from '@/features/experts/components/dashboard/ExpertProfileDashboard'
import { Loader2 } from 'lucide-react'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'

export default function ProfilePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="font-inter overflow-x-clip bg-[#f7f9fc] text-[#181d27]">
        <Nav />
        <main className="flex min-h-screen items-center justify-center bg-[#fafafa] pt-[80px]">
          <Loader2 className="size-8 animate-spin text-[#155eef]" />
        </main>
        <Footer />
      </div>
    )
  }

  if (user?.role === 'expert') {
    return <ExpertProfileDashboard />
  }

  return <UserProfile />
}
