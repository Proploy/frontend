'use client'

import { useState } from 'react'
import { Check, ClipboardCheck, FileText, Receipt, X } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, SectionCard, usd } from '@/components/business/dashboard/ui'
import { ReviewModal } from '@/components/business/dashboard/ReviewModal'
import { MOCK_PENDING_APPROVALS } from '@/lib/service-apis/business-dashboard-mock'
import type { PendingApproval } from '@/lib/service-apis/business-dashboard-mock'
import { addPayout, addReview, notify, DEMO_BUSINESS } from '@/lib/demo/demo-store'

export default function BusinessApprovalsPage() {
  const [items, setItems] = useState<PendingApproval[]>(MOCK_PENDING_APPROVALS)
  const [review, setReview] = useState<{ expert: string; project: string } | null>(null)
  const [resolved, setResolved] = useState(0)

  const act = (item: PendingApproval, approved: boolean) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setResolved((n) => n + 1)
    if (approved) {
      addPayout({ milestone: item.title, project: item.project, amountCents: item.amountCents })
      notify({
        role: 'expert',
        kind: 'payment',
        title: 'Payout released',
        body: `${item.title} approved — funds released from escrow for ${item.project}.`,
        href: '/workspace/projects',
      })
      if (item.completesProject) {
        setReview({ expert: item.expert, project: item.project })
      }
    }
  }

  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Approvals"
        subtitle="Review milestones and invoices before funds move from escrow. Approving a final milestone closes the engagement."
      />

      <div className="mt-[24px]">
        <SectionCard title={`Pending · ${items.length}`}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-[12px] px-[24px] py-[48px] text-center">
              <span className="flex size-[56px] items-center justify-center rounded-full bg-[#dcfae6] text-[#067647]">
                <ClipboardCheck size={26} />
              </span>
              <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">You’re all caught up</p>
              <p className="max-w-[360px] text-[14px] leading-[20px] text-[#717680]">
                {resolved > 0 ? `${resolved} item${resolved > 1 ? 's' : ''} resolved this session. ` : ''}
                New milestones and invoices will appear here for approval.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f0f0f1]">
              {items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center gap-[12px] px-[20px] py-[16px]">
                  <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
                    {item.kind === 'invoice' ? <Receipt size={20} /> : <FileText size={20} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">{item.title}</p>
                      <span className="rounded-full bg-[#f5f5f5] px-[8px] py-[1px] text-[12px] font-semibold capitalize leading-[18px] text-[#414651]">
                        {item.kind}
                      </span>
                      {item.completesProject && (
                        <span className="rounded-full bg-[#f4f3ff] px-[8px] py-[1px] text-[12px] font-semibold leading-[18px] text-[#6941c6]">
                          Completes project
                        </span>
                      )}
                    </div>
                    <p className="flex items-center gap-[6px] text-[13px] leading-[18px] text-[#717680]">
                      <Avatar initial={item.expertInitial} color="#155eef" size={18} />
                      {item.expert} · {item.project}
                    </p>
                  </div>
                  <div className="flex items-center gap-[16px]">
                    <span className="font-semibold text-[16px] text-[#181d27]">{usd(item.amountCents)}</span>
                    <div className="flex items-center gap-[8px]">
                      <button
                        type="button"
                        onClick={() => act(item, false)}
                        className={`inline-flex items-center gap-[5px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[8px] text-[14px] font-semibold leading-[20px] text-[#b42318] ${BUTTON_SKEUO}`}
                      >
                        <X size={15} />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => act(item, true)}
                        className={`inline-flex items-center gap-[5px] rounded-[8px] bg-[#155eef] px-[12px] py-[8px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
                      >
                        <Check size={15} />
                        Approve
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

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
              href: '/workspace',
            })
            setReview(null)
          }}
        />
      )}
    </BusinessPage>
  )
}
