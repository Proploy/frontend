import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth'

// Generic dashboard entry point — routes to the workspace for the user's role.
// Business accounts land on the business dashboard; everyone else (experts and
// users completing an application) lands on the expert workspace.
export default async function DashboardRedirect() {
  const role = await getUserRole()
  if (role === 'business') redirect('/business/dashboard')
  redirect('/workspace')
}
