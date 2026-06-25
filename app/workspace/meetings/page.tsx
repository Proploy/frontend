import { WorkspacePlaceholderPage } from '@/components/workspace/WorkspacePlaceholderPage'

export default function WorkspaceMeetingsPage() {
  return (
    <WorkspacePlaceholderPage
      title="Meetings"
      eyebrow="Scheduled calls"
      description="Meetings belong to accepted engagements and connect the original request flow to booked calls."
      icon="calendar"
      notes={[
        'Upcoming meetings appear on the workspace home.',
        'Accepted meeting requests can become scheduled meetings.',
        'Experts manage availability from workspace settings.',
      ]}
    />
  )
}
