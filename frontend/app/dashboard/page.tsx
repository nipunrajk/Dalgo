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
  if (!query.data) return;
  const d = query.data as any;
  let widgetsFromServer = d?.widgets ?? [];

  if (
    widgetsFromServer.length &&
    widgetsFromServer.every((w: any) => typeof w.position === 'number')
  ) {
    widgetsFromServer = widgetsFromServer
      .slice()
      .sort((a: any, b: any) => a.position - b.position);
  }

  setWidgets(widgetsFromServer);
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

    const payloadWidgets = widgets.map((w, i) => ({ ...w, position: i }));

    await saveDashboard({ widgets: payloadWidgets });

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
      <section className='mt-4 md:mt-8 px-4 md:px-0'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-semibold'>Dashboard</h1>
            <p className='mt-1 md:mt-2 text-sm md:text-base text-slate-600'>
              Widgets persist to the server (saved per user).
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2 md:gap-3'>
            <button
              onClick={() => addWidget('clock')}
              className='px-3 py-2 text-sm border rounded hover:bg-gray-50 active:bg-gray-100'
            >
              Add Clock
            </button>
            <button
              onClick={() => addWidget('notes')}
              className='px-3 py-2 text-sm border rounded hover:bg-gray-50 active:bg-gray-100'
            >
              Add Notes
            </button>
            <button
              onClick={() => addWidget('todo')}
              className='px-3 py-2 text-sm border rounded hover:bg-gray-50 active:bg-gray-100'
            >
              Add Todo
            </button>

            <button
              onClick={onSave}
              className='w-full md:w-auto md:ml-3 px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60 hover:bg-sky-700 active:bg-sky-800'
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Dashboard'}
            </button>
          </div>
        </div>

        <div className='mt-4 md:mt-6'>
          {isLoading && (
            <div className='p-4 bg-white rounded shadow text-sm md:text-base'>
              Loading dashboard…
            </div>
          )}

          {isError && (
            <div className='p-4 bg-rose-50 border border-rose-200 rounded text-rose-700 text-sm md:text-base'>
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
