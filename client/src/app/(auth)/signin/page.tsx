/**
 * /signin — canonical sign-in route alias.
 * Redirects immediately to /login where all auth logic lives.
 * Keeps both /signin and /login working without duplication.
 */
import { redirect } from 'next/navigation';

export default function SignInPage() {
  redirect('/login');
}
