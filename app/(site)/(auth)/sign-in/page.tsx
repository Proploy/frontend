import { AuthShell } from '../auth-shell'
import { resolveAuthPanelVariant } from '../auth-panel-variant'
import { readRedirectParam, withRedirect } from '../auth-redirect'
import { SignInForm } from './sign-in-form'

/**
 * Server component so the brand panel matching the user's origin route is in
 * the first paint. Reading `redirectTo` here rather than with
 * `useSearchParams` in the form also keeps the page out of a client-side
 * rendering bailout.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const redirectTo = readRedirectParam(params)
  const errorParam = typeof params.error === 'string' ? params.error : null

  return (
    <AuthShell variant={resolveAuthPanelVariant(redirectTo)}>
      <SignInForm
        redirectTo={redirectTo ?? '/'}
        errorParam={errorParam}
        signUpHref={withRedirect('/sign-up', redirectTo)}
      />
    </AuthShell>
  )
}
