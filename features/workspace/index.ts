// Public surface of the workspace features module.
//
// Workspace UI imports from here only. Do not import from
// features/experts/* in workspace pages — that data source stays for the
// public /experts/[id] profile.

export * from '@/features/workspace/types'
export { useDashboard } from '@/features/workspace/use-dashboard'
export { useCurrentUserRole } from '@/features/workspace/use-current-user-role'
