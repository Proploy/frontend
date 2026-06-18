'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FileText, Loader2 } from 'lucide-react'
import type { Contract } from '@/hooks/types/contracts-doc'
import { buildContractDocxBlob } from '@/lib/documents/contract-docx'
import { safeFileName } from '@/lib/documents/contract-format'
import { BUTTON_SKEUO } from './ExpertDashboardFrame'

// @react-pdf/renderer must stay client-only — load the download link without SSR.
const ContractPdfDownload = dynamic(() => import('./ContractPdfDownload'), {
  ssr: false,
  loading: () => (
    <span className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>
      <Loader2 size={16} className="animate-spin" /> PDF
    </span>
  ),
})

export function ContractActions({ contract }: { contract: Contract }) {
  const [busy, setBusy] = useState(false)

  const downloadDocx = async () => {
    setBusy(true)
    try {
      const blob = await buildContractDocxBlob(contract)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${safeFileName(contract.title)}.docx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-[8px]">
      <ContractPdfDownload contract={contract} />
      <button
        type="button"
        onClick={downloadDocx}
        disabled={busy}
        className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:opacity-50 ${BUTTON_SKEUO}`}
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
        {busy ? 'Preparing…' : 'Download DOCX'}
      </button>
    </div>
  )
}
