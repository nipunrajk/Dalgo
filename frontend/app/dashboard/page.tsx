'use client';

import AuthGuard from '../../components/AuthGuard';
import WidgetList from '../../components/WidgetList';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <section className='mt-8'>
        <h1 className='text-3xl font-semibold'>Dashboard</h1>
        <p className='mt-2 text-slate-600'>
          Add widgets and interact with them locally. These are stored in client
          Zustand store.
        </p>

        <div className='mt-6'>
          <WidgetList />
        </div>
      </section>
    </AuthGuard>
  );
}
