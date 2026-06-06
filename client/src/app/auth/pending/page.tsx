'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToVerificationPending() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/verification-pending');
  }, [router]);

  return null;
}
