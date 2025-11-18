'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-5xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold'>
          My Dashboard
        </Link>
        <nav className='space-x-4'>
          <Link href='/dashboard' className='text-sm'>
            Dashboard
          </Link>
          <Link href='/login' className='text-sm'>
            Login
          </Link>
          <Link href='/register' className='text-sm'>
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
