import { WorkspacePlaceholderPage } from '@/components/workspace/WorkspacePlaceholderPage'

export default function WorkspaceProjectsPage() {
  return (
    <WorkspacePlaceholderPage
      title="Projects"
      eyebrow="Agreed work"
      description="Workspace projects are not portfolio projects. They represent the work both sides have agreed to do after an engagement exists."
      icon="folder"
      primaryLabel="View engagements"
      primaryHref="/workspace/engagements"
      notes={[
        'Projects should be visible only when there is an accepted engagement.',
        'Drafts, submissions, acceptances, declines, and withdrawals use workspace project endpoints.',
        'Profile portfolio projects belong in settings, not this section.',
      ]}
    />
  )
}
