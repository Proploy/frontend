'use client'

import { useState } from 'react'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { useExpertDashboardData } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { ProfileTab } from './tabs/ProfileTab'
import { ExperienceTab } from './tabs/ExperienceTab'
import { ExpertiseTab } from './tabs/ExpertiseTab'
import { PortfolioTab } from './tabs/PortfolioTab'
import { DocumentsTab } from './tabs/DocumentsTab'
import { ActivityTab } from './tabs/ActivityTab'
import Link from 'next/link'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const TABS = [
  'Profile',
  'Experience',
  'Expertise',
  'Portfolio',
  'Documents',
  'Activity',
] as const

type Tab = typeof TABS[number]

export function ExpertProfileDashboard() {
  const state = useExpertDashboardData()
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  if (state.isPending) {
    return (
      <div className="font-inter overflow-x-clip bg-[#fafafa] text-[#181d27]">
        <Nav />
        <main className="flex min-h-screen items-center justify-center bg-[#fafafa] pt-[80px]">
          <Loader2 className="size-8 animate-spin text-[#155eef]" />
        </main>
        <Footer />
      </div>
    )
  }

  if (state.dashboardError || !state.dashboard) {
    return (
      <div className="font-inter overflow-x-clip bg-[#fafafa] text-[#181d27]">
        <Nav />
        <main className="flex min-h-screen items-center justify-center bg-[#fafafa] pt-[80px]">
          <div className="text-center text-[#535862]">
            {state.dashboardError ? 'Failed to load dashboard. Please try again.' : 'Dashboard unavailable.'}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { expert, recentlyViewed } = state.dashboard
  const interests = state.dashboard.interests || []
  
  // Calculate completeness (mocked simple logic for now)
  const fields = [
    expert.displayName, expert.headline, expert.regionCountry, expert.timezone,
    expert.yearsExperience, expert.availabilityHoursPerWeek, expert.whyPlatform,
    expert.primaryPlatforms?.length, expert.industryExpertise?.length,
    expert.profilePictureUrl
  ]
  const filled = fields.filter(Boolean).length
  const completeness = Math.round((filled / fields.length) * 100)

  return (
    <div className="font-inter overflow-x-clip bg-[#fafafa] text-[#181d27]">
      <Nav />
      <main className="min-h-screen px-[32px] py-[32px] pt-[120px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <div className="mx-auto flex w-full max-w-[1144px] flex-col gap-[20px]">
          
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-wrap items-start justify-between gap-[16px] min-h-[40px]">
              <div>
                <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">
                  Expert Dashboard
                </h1>
                <div className="mt-2 flex items-center gap-4 text-[14px] text-[#535862]">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-[#e9eaeb]">
                      <div className="h-full bg-[#155eef]" style={{ width: `${completeness}%` }} />
                    </div>
                    Profile completion: {completeness}%
                  </span>
                  <Link href={`/experts/${encodeURIComponent(expert.id)}`} className="inline-flex items-center gap-1 text-[#155eef] hover:underline">
                    Preview Public Profile <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Horizontal tabs */}
            <div className="border-b border-[#e9eaeb]">
              <div className="flex items-center gap-[12px] overflow-x-auto">
                {TABS.map((tab) => {
                  const active = activeTab === tab
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-[4px] py-[8px] -mb-px font-semibold text-[14px] leading-[20px] whitespace-nowrap transition-colors flex items-center gap-[8px] ${
                        active
                          ? 'text-[#155eef]'
                          : 'text-[#535862] hover:text-[#181d27]'
                      }`}
                    >
                      {tab}
                      {active && (
                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#155eef] rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-2 pb-20">
            {activeTab === 'Profile' && <ProfileTab expert={expert} />}
            {activeTab === 'Experience' && <ExperienceTab expert={expert} />}
            {activeTab === 'Expertise' && <ExpertiseTab expert={expert} />}
            {activeTab === 'Portfolio' && <PortfolioTab expert={expert} />}
            {activeTab === 'Documents' && <DocumentsTab expert={expert} />}
            {activeTab === 'Activity' && <ActivityTab recentlyViewed={recentlyViewed} interests={interests} />}
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  )
}
