import { WorkspacePlaceholderPage } from '@/components/workspace/WorkspacePlaceholderPage'

export default function WorkspaceSettingsPage() {
  return (
    <WorkspacePlaceholderPage
      title="Settings"
      eyebrow="Profile and scheduling"
      description="Settings will absorb account/profile controls and expert scheduling configuration from the legacy dashboard."
      icon="settings"
      notes={[
        'Expert profile editing moves here from the legacy expert dashboard.',
        'Scheduling profile setup lives here for experts.',
        'Profile portfolio projects are settings/profile data, separate from engagement projects.',
      ]}
    />
  )
}
