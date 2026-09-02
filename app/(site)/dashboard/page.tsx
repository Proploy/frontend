import { redirect } from 'next/navigation'

// Generic dashboard entry point. Every account role — user, business and
// expert — is served by /workspace, which scopes what it shows to the caller's
// role. `business` is an alias of `user` (a buyer), not a separate surface;
// the old redirect sent those accounts to /business/dashboard, which is a
// design reference gated out of production.
export default async function DashboardRedirect() {
  redirect('/workspace')
}
