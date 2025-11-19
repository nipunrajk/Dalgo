'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { logoutUser } from '../lib/api';
import { useToastStore } from '../store/useToastStore';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();
  const pushToast = useToastStore((s) => s.push);

  async function onLogout() {
    try {
      await logoutUser();
      clearUser();
      pushToast('Logged out', 'info');
      router.push('/login');
    } catch (err) {
      clearUser();
      pushToast('Logout failed (client)', 'error');
      router.push('/login');
    }
  }

  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-5xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold'>
          Customizable Dashboard Builder
        </Link>

        <nav className='hidden md:flex items-center gap-4'>
          {user && (
            <Link href='/dashboard' className='text-sm'>
              Dashboard
            </Link>
          )}
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

        {/* Mobile menu fallback */}
        <div className='md:hidden flex items-center gap-2'>
          {user && (
            <Link href='/dashboard' className='text-sm'>
              Dash
            </Link>
          )}
          {!user ? (
            <Link href='/login' className='text-sm'>
              Login
            </Link>
          ) : (
            <button
              onClick={onLogout}
              className='px-2 py-1 bg-rose-500 text-white rounded text-sm'
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
