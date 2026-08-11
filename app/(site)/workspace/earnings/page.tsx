import { WorkspaceModuleGap } from '../_components/WorkspaceModuleGap'

export default function WorkspaceEarningsPage() {
  return (
    <WorkspaceModuleGap
      title="Earnings"
      body="Payout, escrow, transaction, platform fee, and export data need a registered workspace earnings module before this page can be wired to live data."
      endpoint="/api/v1/workspace/earnings"
      expertOnly
    />
  )
}
