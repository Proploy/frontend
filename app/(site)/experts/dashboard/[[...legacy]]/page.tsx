import { redirect } from 'next/navigation'

export default function LegacyExpertDashboardRedirect() {
  redirect('/workspace')
}
