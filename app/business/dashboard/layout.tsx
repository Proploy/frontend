import type { ReactNode } from 'react'
import { BusinessDashboardShell } from '@/components/business/dashboard/BusinessDashboardFrame'

export default function BusinessDashboardLayout({ children }: { children: ReactNode }) {
  return <BusinessDashboardShell>{children}</BusinessDashboardShell>
}
