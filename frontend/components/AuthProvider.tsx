'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      setLoading(true);
      try {
        const res = await getCurrentUser();
        if (!cancelled) setUser(res?.user ?? null);
      } catch (err) {
        if (!cancelled) clearUser();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
