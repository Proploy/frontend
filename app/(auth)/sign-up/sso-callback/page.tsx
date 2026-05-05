import { redirect } from 'next/navigation'

export default function SignUpSsoCallbackPage() {
  redirect('/auth/callback')
}
