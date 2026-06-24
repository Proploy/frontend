'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import type { Contract } from '@/hooks/types/contracts-doc'
import { ContractDocument } from '@/lib/documents/contract-pdf'
import { safeFileName } from '@/lib/documents/contract-format'
import { BUTTON_SKEUO } from './ExpertDashboardFrame'

// Default export so it can be dynamically imported with ssr:false from ContractActions.
export default function ContractPdfDownload({ contract }: { contract: Contract }) {
  return (
    <PDFDownloadLink
      document={<ContractDocument contract={contract} />}
      fileName={`${safeFileName(contract.title)}.pdf`}
      className={`flex items-center gap-[6px] rounded-[8px] bg-[#155eef] border-2 border-white/[0.12] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
    >
      {({ loading }) => (
        <>
          <Download size={16} />
          {loading ? 'Preparing…' : 'Download PDF'}
        </>
      )}
    </PDFDownloadLink>
  )
}
