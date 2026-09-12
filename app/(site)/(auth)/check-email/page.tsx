import { AuthShell } from '../auth-shell'
import { resolveAuthPanelVariant } from '../auth-panel-variant'
import { readRedirectParam, withRedirect } from '../auth-redirect'
import { CheckEmailForm } from './check-email-form'

export default async function CheckEmailPage({
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
        <CheckEmailForm
          email={email}
          enterCodeHref={withRedirect('/verify-email', redirectTo, { email })}
          signInHref={withRedirect('/sign-in', redirectTo)}
        />
      </div>
    </AuthShell>
  )
}
