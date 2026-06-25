import { WorkspacePlaceholderPage } from '@/components/workspace/WorkspacePlaceholderPage'

export default function WorkspaceRequestsPage() {
  return (
    <WorkspacePlaceholderPage
      title="Requests"
      eyebrow="Meeting intents"
      description="Requests are the pre-engagement stage. Buyers see outgoing expert requests and experts see incoming requests with accept or decline actions."
      icon="inbox"
      notes={[
        'Buyer view shows outgoing request status: pending, accepted, declined, or expired.',
        'Expert view shows incoming requests and decision actions.',
        'Accepted requests create engagements; declined or expired requests do not create projects.',
      ]}
    />
  )
}
