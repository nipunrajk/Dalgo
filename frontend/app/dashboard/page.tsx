'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchDashboard, saveDashboard } from '../../lib/dashboardApi';
import { useDashboardStore } from '../../store/useDashboardStore';
import AuthGuard from '../../components/AuthGuard';
import WidgetList from '../../components/WidgetList';

export default function DashboardPage() {
  const setWidgets = useDashboardStore((s) => s.setWidgets);
  const widgets = useDashboardStore((s) => s.widgets);
  const addWidget = useDashboardStore((s) => s.addWidget);

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const d = await fetchDashboard();
      return d;
    },
    refetchOnWindowFocus: false,
  });

  // hydrate Zustand when query.data arrives
  useEffect(() => {
    if (query.data && (query.data as any).widgets) {
      setWidgets((query.data as any).widgets);
    }
  }, [query.data, setWidgets]);

  // mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      return saveDashboard({ widgets });
    },
  });

  const [saving, setSaving] = useState(false);

  async function onSave() {
    try {
      setSaving(true);
      await saveMutation.mutateAsync();
      // refetch fresh data from server
      await query.refetch();
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  }

  const isLoading = query.isLoading;
  const isError = query.isError;
  const error = query.error;

  return (
    <AuthGuard>
      <section className='mt-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-semibold'>Dashboard</h1>
            <p className='mt-2 text-slate-600'>
              Widgets persist to the server (saved per user).
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => addWidget('clock')}
              className='px-3 py-1 border rounded'
            >
              Add Clock
            </button>
            <button
              onClick={() => addWidget('notes')}
              className='px-3 py-1 border rounded'
            >
              Add Notes
            </button>
            <button
              onClick={() => addWidget('todo')}
              className='px-3 py-1 border rounded'
            >
              Add Todo
            </button>

            <button
              onClick={onSave}
              className='ml-3 px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60'
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Dashboard'}
            </button>
          </div>
        </div>

        <div className='mt-6'>
          {isLoading && (
            <div className='p-4 bg-white rounded shadow'>
              Loading dashboard…
            </div>
          )}

          {isError && (
            <div className='p-4 bg-rose-50 border border-rose-200 rounded text-rose-700'>
              Error loading dashboard: {(error as any)?.message ?? 'Unknown'}
            </div>
          )}

          <div className='mt-4'>
            <WidgetList />
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}
