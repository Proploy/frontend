'use client'

import { useState } from 'react'
import { Download, FileText, Receipt, ScrollText, ShieldCheck } from 'lucide-react'
import { BusinessPage, BusinessPageHeader } from '@/components/business/dashboard/BusinessDashboardFrame'
import { SectionCard, formatDate } from '@/components/business/dashboard/ui'
import { MOCK_DOCUMENTS } from '@/lib/service-apis/business-dashboard-mock'
import type { DocCategory } from '@/lib/service-apis/business-dashboard-mock'

const FILTERS: (DocCategory | 'All')[] = ['All', 'Contract', 'Tax form', 'Deliverable', 'Invoice']

const ICON: Record<DocCategory, React.ReactNode> = {
  Contract: <ScrollText size={18} />,
  'Tax form': <ShieldCheck size={18} />,
  Deliverable: <FileText size={18} />,
  Invoice: <Receipt size={18} />,
}

export default function BusinessDocumentsPage() {
  const [filter, setFilter] = useState<DocCategory | 'All'>('All')
  const docs = filter === 'All' ? MOCK_DOCUMENTS : MOCK_DOCUMENTS.filter((d) => d.category === filter)

  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Documents"
        subtitle="Every contract, tax form, deliverable, and invoice across your engagements — in one searchable vault."
      />

      <div className="mt-[20px] flex flex-wrap gap-[8px]">
        {FILTERS.map((f) => {
          const active = f === filter
          const count = f === 'All' ? MOCK_DOCUMENTS.length : MOCK_DOCUMENTS.filter((d) => d.category === f).length
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] transition-colors ${
                active ? 'border-[#155eef] bg-[#eff4ff] text-[#004eeb]' : 'border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa]'
              }`}
            >
              {f} · {count}
            </button>
          )
        })}
      </div>

      <div className="mt-[20px]">
        <SectionCard title={`${docs.length} document${docs.length === 1 ? '' : 's'}`}>
          <ul className="divide-y divide-[#f0f0f1]">
            {docs.map((doc) => (
              <li key={doc.id} className="flex items-center gap-[12px] px-[20px] py-[14px]">
                <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
                  {ICON[doc.category]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{doc.name}</p>
                  <p className="text-[12px] leading-[18px] text-[#717680]">
                    {doc.category} · {doc.owner} · {formatDate(doc.date)} · {doc.size}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Download ${doc.name}`}
                  className="inline-flex size-[36px] items-center justify-center rounded-[8px] text-[#414651] transition-colors hover:bg-[#fafafa]"
                >
                  <Download size={18} />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}
