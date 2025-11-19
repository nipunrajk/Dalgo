'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className='max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow text-center'>
        <p>Checking session…</p>
      </div>
    );
  }

  if (!user) return null; // redirecting

  return <>{children}</>;
}
