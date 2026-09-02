import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { BusinessDashboardShell } from '@/components/business/dashboard/BusinessDashboardFrame'
import { MOCK_ENABLED } from '@/lib/service-apis/dashboard-mock'

/**
 * `/business/dashboard` is a design reference, not a product surface — its
 * pages render fixtures from `business-dashboard-mock` and there is no
 * `/api/v1/businesses/*` behind them. The shipped implementation lives at
 * `/workspace`, which is role-scoped and wired to real endpoints.
 *
 * The tree is therefore gated on the same flag as the other dashboard mocks:
 * browsable locally with `NEXT_PUBLIC_DASHBOARD_MOCK=1`, and absent in
 * production so nobody can reach fabricated data. `notFound()` rather than an
 * empty shell, so the route genuinely does not exist rather than looking broken.
 */
export default function BusinessDashboardLayout({ children }: { children: ReactNode }) {
  if (!MOCK_ENABLED) notFound()

  return <BusinessDashboardShell>{children}</BusinessDashboardShell>
}
