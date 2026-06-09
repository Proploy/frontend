'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import { InvoiceDocument } from './InvoiceDocument'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import type { Client, Invoice } from '@/hooks/types/clients-contracts'

export default function InvoiceDownload({
  invoice, client, expertName,
}: {
  invoice: Invoice
  client: Client
  expertName: string
}) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument invoice={invoice} client={client} expertName={expertName} />}
      fileName={`${invoice.number}.pdf`}
      className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}
    >
      {({ loading }) => (
        <>
          <Download size={18} />
          {loading ? 'Preparing…' : 'Download PDF'}
        </>
      )}
    </PDFDownloadLink>
  )
}
