'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Integration {
  name: string
  description?: string
  logo?: string | null
}

interface IntegrationsTabProps {
  integrations: Integration[]
  pageSize?: number
}

export default function IntegrationsTab({ integrations, pageSize = 22 }: IntegrationsTabProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(integrations.length / pageSize))
  const start = (page - 1) * pageSize
  const visible = integrations.slice(start, start + pageSize)

  const renderPageButton = (p: number | '…', key: string) => {
    if (p === '…') {
      return (
        <span key={key} className="size-[40px] flex items-center justify-center font-medium text-[14px] text-[#717680]">
          …
        </span>
      )
    }
    const active = p === page
    return (
      <button
        key={key}
        type="button"
        onClick={() => setPage(p)}
        className={`size-[40px] rounded-[8px] flex items-center justify-center font-medium text-[14px] ${
          active ? 'bg-[#fafafa] text-[#414651]' : 'text-[#717680] hover:bg-gray-50'
        }`}
      >
        {p}
      </button>
    )
  }

  const pageItems: Array<number | '…'> = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const items: Array<number | '…'> = [1, 2, 3, '…']
    items.push(totalPages - 2, totalPages - 1, totalPages)
    return items
  })()

  return (
    <section className="flex flex-col gap-[24px] px-[32px] w-full font-[family-name:var(--font-dm-sans)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {visible.map((integration, i) => (
          <div
            key={`${integration.id ?? integration.name}-${i}`}
            className="flex items-center gap-[12px] bg-white border border-[#e9eaeb] rounded-[12px] px-[16px] py-[12px]"
          >
            <div className="size-[40px] rounded-[8px] bg-[#155eef] flex items-center justify-center overflow-hidden shrink-0">
              {integration.logo ? (
                <Image src={integration.logo} alt={integration.name} width={28} height={28} />
              ) : (
                <span className="text-white font-bold text-[16px]">{integration.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">
                {integration.name}
              </p>
              <p className="font-normal text-[12px] leading-[18px] text-[#535862] truncate">
                {integration.description || 'Streamline software projects'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="border-t border-[#e9eaeb] pt-[16px] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="inline-flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] disabled:opacity-40 hover:underline"
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        <div className="flex items-center gap-[2px]">
          {pageItems.map((p, i) => renderPageButton(p, `${p}-${i}`))}
        </div>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="inline-flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] disabled:opacity-40 hover:underline"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  )
}
