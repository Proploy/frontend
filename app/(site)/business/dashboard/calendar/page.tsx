'use client'

import { BusinessPage } from '@/components/business/dashboard/BusinessDashboardFrame'
import { CalendarView } from '@/components/workspace/calendar/CalendarView'

// Scheduling module inside the business portal. BusinessPage already provides
// the centered max-width container + padding, so CalendarView renders without
// its own (padded={false}).
export default function BusinessCalendarPage() {
  return (
    <BusinessPage>
      <CalendarView padded={false} />
    </BusinessPage>
  )
}
