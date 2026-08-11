// Public surface of the workspace features module.
//
// Workspace UI imports from here only. Do not import from
// features/experts/* in workspace pages — that data source stays for the
// public /experts/[id] profile.

export * from '@/features/workspace/types'
export * from '@/features/workspace/request-rows'
export {
  useCurrentUserRole,
  useStandaloneCurrentUserRole,
  WorkspaceRoleProvider,
} from '@/features/workspace/use-current-user-role'
export { useWorkspace } from '@/features/workspace/use-workspace'
export { useDashboard } from '@/features/workspace/use-dashboard'
export { useMeetings } from '@/features/workspace/use-meetings'
export {
  useWorkspaceProjectDetail,
  listMilestones,
  addMilestone,
  decideMilestone,
  completeMilestone,
} from '@/features/workspace/use-workspace-project-detail'
export type {
  Milestone,
  MilestoneAcceptance,
  MilestoneCreateInput,
  MilestoneDecisionInput,
  ProjectSubItem,
  SubItemCreateInput,
  SubItemReorderInput,
  SubItemUpdateInput,
  SubItemStatus,
  TimeEntry,
  TimeSummary,
} from '@/features/workspace/use-workspace-project-detail'
export { useWorkspaceHome } from '@/features/workspace/use-workspace-home'
export {
  useWorkspaceExperience,
  WorkspaceExperienceProvider,
} from '@/features/workspace/workspace-experience'
export type {
  WorkspaceContract,
  WorkspaceContractDocumentUploadResponse,
  WorkspaceContractListResponse,
  ContractStatus,
  WorkspaceHomeActivity,
  WorkspaceHomeError,
  WorkspaceHomeKpis,
  WorkspaceHomeSnapshot,
  WorkspaceInvoice,
  WorkspaceInvoiceListResponse,
  InvoiceStatus,
  WorkspaceProposal,
  WorkspaceProposalCreateRequest,
  WorkspaceProposalListResponse,
  ProposalStatus,
} from '@/features/workspace/home-types'
export {
  useWorkspaceSettings,
  NOTIFICATION_TEMPLATES,
  NOTIFICATION_TEMPLATE_LABELS,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '@/features/workspace/use-workspace-settings'
export type {
  NotificationTemplate,
  NotificationPreferences,
  ProfileSettings,
  ProfileSettingsUpdate,
  ProfileUpdateResult,
  NotificationPreferencesResult,
  SchedulingProfileResult,
  SettingsHookState,
} from '@/features/workspace/use-workspace-settings'
