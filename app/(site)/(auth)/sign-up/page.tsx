import { AuthShell } from '../auth-shell'
import { resolveAuthPanelVariant } from '../auth-panel-variant'
import { readRedirectParam, withRedirect } from '../auth-redirect'
import { SignUpForm } from './sign-up-form'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const redirectTo = readRedirectParam(await searchParams)

  return (
    <AuthShell variant={resolveAuthPanelVariant(redirectTo)}>
      <SignUpForm redirectTo={redirectTo} signInHref={withRedirect('/sign-in', redirectTo)} />
    </AuthShell>
  )
}
