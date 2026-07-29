import type { ReactNode } from 'react'
import { WorkspaceRoleProvider } from '@/features/workspace'
import { WorkspaceExperienceProvider } from '@/features/workspace/workspace-experience'

// The workspace subtree uses the WorkspaceShell (which renders the Sidebar
// internally) and does not need a provider layer. Future iterations may
// mount a WorkspaceContext here (e.g. for optimistic mutations across the
// dashboard) but for Phase 0 the shell is self-contained.
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceRoleProvider>
      <WorkspaceExperienceProvider>{children}</WorkspaceExperienceProvider>
    </WorkspaceRoleProvider>
  )
}
