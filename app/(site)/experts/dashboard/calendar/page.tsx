'use client'

import { DashboardShell } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { CalendarView } from '@/components/workspace/calendar/CalendarView'

// Scheduling module inside the expert portal. Reuses the shared CalendarView
// (padded={true}: this shell renders children without its own container, like
// the other expert dashboard pages).
export default function ExpertCalendarPage() {
  return (
    <DashboardShell>
      <CalendarView />
    </DashboardShell>
  )
}
