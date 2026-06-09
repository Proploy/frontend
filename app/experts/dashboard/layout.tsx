import type { ReactNode } from 'react'
import { ClientsProvider } from '@/lib/clients/clients-store'

// Mounted once for all dashboard pages so Clients and Earnings share the same
// invoice/project state (Earnings derives transactions from Clients invoices).
export default function ExpertDashboardLayout({ children }: { children: ReactNode }) {
  return <ClientsProvider>{children}</ClientsProvider>
}
