import type { ReactNode } from 'react'
import { ClientsProvider } from '@/lib/clients/clients-store'
import { ContractsProvider } from '@/lib/contracts/contracts-store'
import { ProposalsProvider } from '@/lib/proposals/proposals-store'

// Mounted once for all dashboard pages so Clients/Earnings/Invoices share the
// same invoice/project state, and Contracts + Proposals persist across every
// dashboard route (all via localStorage-backed providers).
export default function ExpertDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ClientsProvider>
      <ContractsProvider>
        <ProposalsProvider>{children}</ProposalsProvider>
      </ContractsProvider>
    </ClientsProvider>
  )
}
