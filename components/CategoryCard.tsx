'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  name: string
  description: string
  icon: LucideIcon
  slug: string
  growthPercent?: number
  className?: string
}

export default function CategoryCard({ 
  name, 
  description, 
  icon: Icon,
  slug,
  growthPercent = 0,
  className = '' 
}: CategoryCardProps) {
  return (
    <Link 
      href={`/products?category=${slug}`}
      className={`relative block rounded-[16px] bg-white p-6 overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}
    >
      {/* Top Row: Icon and Growth Badge */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon in Blue Square */}
        <div className="w-12 h-12 rounded-xl bg-[#197CFF] flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Growth Percentage Badge */}
        {growthPercent > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF3] border border-[#ABEFC6]">
            <span className="text-[12px] text-[#067647]">↗</span>
            <span className="text-[12px] font-medium text-[#067647]">
              +{growthPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Category Name */}
      <h3 className="text-[18px] font-bold text-text-primary font-dm-sans mb-2">
        {name}
      </h3>

      {/* Description */}
      <p className="text-[14px] text-gray-500 font-inter leading-relaxed line-clamp-2">
        {description}
      </p>
    </Link>
  )
}
