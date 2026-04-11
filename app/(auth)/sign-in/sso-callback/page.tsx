import { redirect } from 'next/navigation'

export default function SignInSsoCallbackPage() {
  redirect('/auth/callback')
}
