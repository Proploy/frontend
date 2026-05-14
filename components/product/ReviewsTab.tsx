'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react'

export interface ProductReview {
  authorName: string
  authorHandle?: string
  authorAvatar?: string
  verified?: boolean
  title: string
  rating: number
  content: string
}

interface ReviewsTabProps {
  reviews: ProductReview[]
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <section className="flex flex-col gap-[16px] px-[32px] w-full font-[family-name:var(--font-dm-sans)]">
      {reviews.map((review, i) => (
        <ReviewCard key={i} review={review} />
      ))}
    </section>
  )
}

function ReviewCard({ review }: { review: ProductReview }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <article className="bg-[#fafafa] border border-[#e9eaeb] rounded-[16px] p-[24px] flex flex-col gap-[16px]">
      <header className="flex items-center gap-[12px]">
        {review.authorAvatar ? (
          <Image
            src={review.authorAvatar}
            alt={review.authorName}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="size-[40px] rounded-full bg-[#155eef] text-white font-bold flex items-center justify-center">
            {review.authorName.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-[4px] font-semibold text-[14px] leading-[20px] text-[#181d27]">
            {review.authorName}
            {review.verified && <BadgeCheck size={16} className="text-[#155eef]" />}
          </span>
          {review.authorHandle && (
            <a href="#" className="font-normal text-[12px] leading-[18px] text-[#535862] underline">
              {review.authorHandle}
            </a>
          )}
        </div>
      </header>

      <h3 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
        &ldquo;{review.title}&rdquo;
      </h3>

      <div className="flex items-center gap-[4px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={i < review.rating ? 'fill-[#facc15] text-[#facc15]' : 'text-[#e9eaeb]'}
          />
        ))}
      </div>

      <p
        className={`font-normal text-[14px] leading-[22px] text-[#414651] ${
          expanded ? '' : 'line-clamp-4'
        }`}
      >
        {review.content}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="self-start inline-flex items-center gap-[4px] font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline"
      >
        {expanded ? 'Show Less' : 'Show More'}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </article>
  )
}
