/**
 * The business dashboard's UI primitives now live in
 * `@/components/dashboard/ui` so the workspace surfaces share one
 * implementation. Re-exported here so existing imports keep working.
 */
export {
  Avatar,
  KpiCard,
  ProgressBar,
  SectionCard,
  STATUS_STYLES,
  StatusPill,
  formatDate,
  usd,
} from '@/components/dashboard/ui'
export type { EngagementStatus } from '@/components/dashboard/ui'
