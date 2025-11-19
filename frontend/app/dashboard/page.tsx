'use client';

import AuthGuard from '../../components/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <section className='mt-8'>
        <h1 className='text-3xl font-semibold'>Dashboard</h1>
        <p className='mt-2 text-slate-600'>
          This is the dashboard shell. We'll add widgets, Zustand store and
          persistence in Hour 4–5.
        </p>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white p-4 rounded shadow'>Widget area 1</div>
          <div className='bg-white p-4 rounded shadow'>Widget area 2</div>
        </div>
      </section>
    </AuthGuard>
  );
}
