import { WorkspacePlaceholderPage } from '@/components/workspace/WorkspacePlaceholderPage'

export default function WorkspaceConversationsPage() {
  return (
    <WorkspacePlaceholderPage
      title="Conversations"
      eyebrow="Shared messages"
      description="Messages are shared between buyers and experts inside accepted engagements, with polling and signed attachment URLs."
      icon="message"
      notes={[
        'Conversation threads become active after an engagement exists.',
        'Messages use client-generated nonces so retries are idempotent.',
        'Attachments upload and render through signed URLs only.',
      ]}
    />
  )
}
