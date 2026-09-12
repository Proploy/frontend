import { AuthShell } from '../auth-shell'
import { resolveAuthPanelVariant } from '../auth-panel-variant'
import { readRedirectParam, withRedirect } from '../auth-redirect'
import { VerifyEmailForm } from './verify-email-form'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const redirectTo = readRedirectParam(params)
  const email = typeof params.email === 'string' ? params.email : ''

  return (
    <AuthShell variant={resolveAuthPanelVariant(redirectTo)}>
      <div className="pp-stack pp-gap-8" style={{ width: '100%', maxWidth: 400 }}>
        <VerifyEmailForm
          email={email}
          redirectTo={redirectTo ?? '/'}
          signInHref={withRedirect('/sign-in', redirectTo)}
        />
      </div>
    </AuthShell>
  )
}
