'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Star } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import {
  Avatar,
  ProgressBar,
  SectionCard,
  STATUS_STYLES,
  StatusPill,
  formatDate,
  usd,
} from '@/components/business/dashboard/ui'
import { ReviewModal } from '@/components/business/dashboard/ReviewModal'
import { MOCK_BUSINESS_DASHBOARD } from '@/lib/service-apis/business-dashboard-mock'
import { BUSINESS_REVIEWABLE } from '@/lib/service-apis/reviews-mock'
import { addReview, notify, DEMO_BUSINESS } from '@/lib/demo/demo-store'

const CAPACITY_COLOR: Record<string, string> = {
  'Has room': '#067647',
  Balanced: '#004eeb',
  'At capacity': '#b54708',
}

export default function BusinessProjectsPage() {
  const d = MOCK_BUSINESS_DASHBOARD
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [review, setReview] = useState<{ id: string; expert: string; project: string } | null>(null)
  const pendingReviews = BUSINESS_REVIEWABLE.filter((r) => !reviewed.has(r.id))

  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Projects"
        subtitle="Every software rollout in one portfolio — owners, status, spend, and what needs attention."
        actions={
          <Link
            href="/business/dashboard/hire"
            className={`flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
          >
            <Plus size={16} />
            New project
          </Link>
        }
      />

      {/* Portfolio table */}
      <div className="mt-[24px]">
        <SectionCard title="Portfolio">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#f0f0f1] text-[12px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                  <th className="px-[20px] py-[12px]">Project</th>
                  <th className="px-[20px] py-[12px]">Owner</th>
                  <th className="px-[20px] py-[12px]">Status</th>
                  <th className="px-[20px] py-[12px] w-[180px]">Progress</th>
                  <th className="px-[20px] py-[12px]">Budget</th>
                  <th className="px-[20px] py-[12px]">Due</th>
                </tr>
              </thead>
              <tbody>
                {d.projects.map((p) => (
                  <tr key={p.id} className="border-b border-[#f0f0f1] last:border-0 hover:bg-[#fafafa]">
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-[12px]">
                        <Avatar initial={p.expertInitial} color={STATUS_STYLES[p.status].dot} />
                        <div>
                          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{p.name}</p>
                          <p className="text-[13px] leading-[18px] text-[#717680]">{p.expert}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-[20px] py-[16px] text-[14px] text-[#414651]">{p.owner}</td>
                    <td className="px-[20px] py-[16px]"><StatusPill status={p.status} /></td>
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-[10px]">
                        <ProgressBar value={p.progress} color={STATUS_STYLES[p.status].dot} />
                        <span className="w-[34px] shrink-0 text-right text-[13px] font-medium text-[#414651]">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-[20px] py-[16px] text-[14px] text-[#414651]">
                      {usd(p.spentCents)} <span className="text-[#717680]">/ {usd(p.budgetCents)}</span>
                    </td>
                    <td className="px-[20px] py-[16px] text-[14px] text-[#414651]">{formatDate(p.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-[#f0f0f1] md:hidden">
            {d.projects.map((p) => (
              <li key={p.id} className="flex flex-col gap-[12px] px-[20px] py-[16px]">
                <div className="flex items-start justify-between gap-[8px]">
                  <div className="flex min-w-0 items-center gap-[12px]">
                    <Avatar initial={p.expertInitial} color={STATUS_STYLES[p.status].dot} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{p.name}</p>
                      <p className="text-[13px] leading-[18px] text-[#717680]">{p.expert} · {p.owner}</p>
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <ProgressBar value={p.progress} color={STATUS_STYLES[p.status].dot} />
                <div className="flex items-center justify-between text-[12px] leading-[18px] text-[#717680]">
                  <span>{usd(p.spentCents)} / {usd(p.budgetCents)}</span>
                  <span>{p.progress}% · due {formatDate(p.dueDate)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-2">
        {/* Workload */}
        <SectionCard title="Owner workload">
          <ul className="flex flex-col gap-[16px] p-[20px]">
            {d.workload.map((w) => (
              <li key={w.name} className="flex items-center justify-between gap-[12px]">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{w.name}</p>
                  <p className="text-[12px] leading-[18px] text-[#717680]">{w.role}</p>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[13px] font-medium text-[#414651]">{w.activeProjects} active</span>
                  <span
                    className="rounded-full px-[8px] py-[2px] text-[12px] font-semibold leading-[18px]"
                    style={{ color: CAPACITY_COLOR[w.capacity], background: `${CAPACITY_COLOR[w.capacity]}14` }}
                  >
                    {w.capacity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Risk feed */}
        <SectionCard title="Needs attention">
          <ul className="divide-y divide-[#f0f0f1]">
            {d.attention.map((a) => (
              <li key={a.id} className="flex flex-col gap-[2px] px-[20px] py-[14px]">
                <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{a.title}</p>
                <p className="text-[13px] leading-[18px] text-[#717680]">{a.detail}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
      {pendingReviews.length > 0 && (
        <div className="mt-[24px]">
          <SectionCard title="Completed — leave a review">
            <ul className="divide-y divide-[#f0f0f1]">
              {pendingReviews.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-[12px] px-[20px] py-[16px]">
                  <Avatar initial={r.expertInitial} color="#7f56d9" size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{r.project}</p>
                    <p className="text-[13px] leading-[18px] text-[#717680]">
                      {r.expert} · completed {formatDate(r.completedDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReview({ id: r.id, expert: r.expert, project: r.project })}
                    className={`inline-flex items-center gap-[5px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[8px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                  >
                    <Star size={15} className="text-[#f79009]" />
                    Leave review
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {review && (
        <ReviewModal
          expert={review.expert}
          project={review.project}
          onClose={() => setReview(null)}
          onSubmit={(data) => {
            addReview({
              author: 'Jordan Avery',
              company: DEMO_BUSINESS,
              project: review.project,
              rating: data.rating,
              title: data.title,
              body: data.body,
            })
            notify({
              role: 'expert',
              kind: 'review',
              title: `New ${data.rating}★ review`,
              body: `${DEMO_BUSINESS}: “${data.title}”`,
              href: '/experts/dashboard',
            })
            setReviewed((prev) => new Set(prev).add(review.id))
            setReview(null)
          }}
        />
      )}
    </BusinessPage>
  )
}
