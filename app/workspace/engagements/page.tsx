import { WorkspacePlaceholderPage } from '@/components/workspace/WorkspacePlaceholderPage'

export default function WorkspaceEngagementsPage() {
  return (
    <WorkspacePlaceholderPage
      title="Engagements"
      eyebrow="Accepted workspaces"
      description="Engagements are created only after an expert accepts a buyer request. This is the shared workspace between the buyer and expert."
      icon="users"
      primaryLabel="View requests"
      primaryHref="/workspace/requests"
      notes={[
        'Both buyer and expert see the same accepted engagement from their own role context.',
        'Messages, meetings, and agreed projects hang off the engagement.',
        'This replaces the old expert-dashboard Clients concept.',
      ]}
    />
  )
}
