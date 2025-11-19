'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { logoutUser } from '../lib/api';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  async function onLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('logout error', err);
    } finally {
      clearUser();
      router.push('/login');
    }
  }

  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-5xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold'>
          My Dashboard
        </Link>
        <nav className='space-x-4 flex items-center'>
          <Link href='/dashboard' className='text-sm'>
            Dashboard
          </Link>
          {!user && (
            <>
              <Link href='/login' className='text-sm'>
                Login
              </Link>
              <Link href='/register' className='text-sm'>
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <span className='text-sm text-slate-600'>Hi, {user.name}</span>
              <button
                onClick={onLogout}
                className='ml-2 px-3 py-1 bg-rose-500 text-white rounded text-sm'
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
