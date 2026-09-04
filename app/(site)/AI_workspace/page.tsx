import { redirect } from 'next/navigation'

import { SoftwareProcurementWorkspace } from '@/components/ai-workspace/SoftwareProcurementWorkspace'
import { isCurrentUserRestrictedFromSam } from '@/lib/auth/sam-access'

/**
 * Sam is a buyer tool, so approved experts are kept out of the workspace.
 *
 * The guard lives here rather than in navigation because hiding a link is not
 * a restriction: this route is reachable by typing the URL, by an old
 * bookmark, or from any CTA that still points at it. Middleware already
 * requires a session for `/AI_workspace`; this adds the role rule on top.
 *
 * A pending or rejected application is still a buyer, so only an `expert`
 * account role or an approved expert record is turned away.
 */
export default async function AIWorkspacePage() {
  if (await isCurrentUserRestrictedFromSam()) {
    redirect('/experts/dashboard')
  }

  return <SoftwareProcurementWorkspace />
}
