'use client'

import { useState, useEffect } from 'react'
import { Loader2, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import ListingExplorer from '@/components/ListingExplorer'

interface Expert {
  id: string
  displayName: string
  headline?: string
  regionCity?: string
  regionCountry?: string
  yearsExperience?: number
  tags?: { id: string; name: string }[]
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experts/approved')
      .then((res) => res.json())
      .then((payload) => setExperts(payload?.data || []))
      .catch(() => setExperts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative bg-white min-h-screen">
      <ListingExplorer kind="experts" />
      {/* Hero */}
      <section className="relative pt-[96px] pb-[64px] bg-[#fafbfc] overflow-x-clip hidden">
        <div className="-translate-x-1/2 absolute h-[1440px] left-1/2 top-0 w-[1920px] pointer-events-none">
          <img
            alt=""
            className="absolute inset-0 max-w-none size-full object-cover opacity-80"
            src="/figma-assets/background-pattern.png"
          />
        </div>
        <div className="max-w-[1280px] mx-auto px-[32px] relative z-10">
          <div className="flex flex-col items-center gap-[24px] max-w-[768px] mx-auto text-center">
            <h1 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]">
              Verified Implementation Experts
            </h1>
            <p
              className="font-[family-name:var(--font-dm-sans)] font-normal text-[20px] leading-[30px] text-[#535862]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Connect with vetted professionals who can help you implement, customize, and optimize your software.
            </p>
            <Link
              href="/become-expert"
              className="inline-flex items-center gap-[8px] bg-[#155eef] hover:bg-[#004eeb] text-white font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] px-[20px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors"
            >
              Join as an Expert
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Expert Cards */}
      <section className="py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          {loading ? (
            <div className="flex items-center justify-center py-[96px]">
              <Loader2 size={40} className="animate-spin text-[#155eef]" />
            </div>
          ) : experts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[96px] gap-[16px]">
              <p
                className="font-[family-name:var(--font-dm-sans)] font-normal text-[18px] leading-[28px] text-[#535862]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                No experts found yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className="bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] hover:shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)] transition-shadow"
                >
                  {/* Avatar + Name */}
                  <div className="flex items-start gap-[16px]">
                    <div className="size-[48px] rounded-full bg-[#155eef] flex items-center justify-center shrink-0">
                      <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[20px] text-white">
                        {expert.displayName?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[4px] min-w-0">
                      <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[18px] leading-[28px] text-[#181d27] truncate">
                        {expert.displayName}
                      </h3>
                      {expert.headline && (
                        <p
                          className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862] line-clamp-2"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          {expert.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location + Experience */}
                  <div className="flex items-center gap-[16px] flex-wrap">
                    {(expert.regionCity || expert.regionCountry) && (
                      <div className="flex items-center gap-[4px]">
                        <MapPin size={16} className="text-[#717680] shrink-0" />
                        <span
                          className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          {[expert.regionCity, expert.regionCountry].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {expert.yearsExperience != null && (
                      <span
                        className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                      >
                        {expert.yearsExperience} yr{expert.yearsExperience !== 1 ? 's' : ''} exp
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {expert.tags && expert.tags.length > 0 && (
                    <div className="flex flex-wrap gap-[8px]">
                      {expert.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center bg-[#eff8ff] border border-[#b2ddff] rounded-full px-[10px] py-[2px] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#175cd3]"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View Profile */}
                  <Link
                    href={`/experts/${expert.id}`}
                    className="flex items-center gap-[4px] mt-auto"
                  >
                    <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#004eeb]">
                      View Profile
                    </span>
                    <ArrowRight size={20} className="text-[#004eeb]" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

