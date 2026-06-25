import type { ReactNode } from 'react'

// The workspace subtree uses the WorkspaceShell (which renders the Sidebar
// internally) and does not need a provider layer. Future iterations may
// mount a WorkspaceContext here (e.g. for optimistic mutations across the
// dashboard) but for Phase 0 the shell is self-contained.
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
