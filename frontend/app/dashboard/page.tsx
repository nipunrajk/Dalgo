'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchDashboard, saveDashboard } from '../../lib/dashboardApi';
import { useDashboardStore, Widget } from '../../store/useDashboardStore';
import AuthGuard from '../../components/AuthGuard';
import WidgetList from '../../components/WidgetList';

export default function DashboardPage() {
  const setWidgets = useDashboardStore((s) => s.setWidgets);
  const widgets = useDashboardStore((s) => s.widgets);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedRef = useRef<string>('');

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => fetchDashboard(),
    refetchOnWindowFocus: false,
  });

  function normalizeWidgets(list: any[] = []): Widget[] {
    const hasPositions =
      list.length && list.every((w) => typeof w.position === 'number');

    const ordered = hasPositions
      ? [...list].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      : [...list];

    return ordered.map((w, i) => ({
      ...w,
      position: i,
      createdAt: w.createdAt || new Date().toISOString(),
    }));
  }

  function snapshotFromWidgets(list: Widget[]) {
    try {
      return JSON.stringify(list);
    } catch {
      return '';
    }
  }

  useEffect(() => {
    if (!query.data) return;

    const data = query.data as any;
    const serverWidgets: Widget[] = Array.isArray(data?.widgets)
      ? data.widgets
      : [];

    const normalized = normalizeWidgets(serverWidgets);
    setWidgets(normalized);

    lastSavedRef.current = snapshotFromWidgets(normalized);
    setHasUnsavedChanges(false);
  }, [query.data, setWidgets]);

  const currentSnapshot = useMemo(() => {
    return snapshotFromWidgets(normalizeWidgets(widgets));
  }, [widgets]);

  useEffect(() => {
    setHasUnsavedChanges(currentSnapshot !== lastSavedRef.current);
  }, [currentSnapshot]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { widgets: Widget[] }) =>
      saveDashboard(payload),
  });

  const onSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      const payloadWidgets = normalizeWidgets(widgets);

      await saveMutation.mutateAsync({ widgets: payloadWidgets });

      lastSavedRef.current = snapshotFromWidgets(payloadWidgets);
      setHasUnsavedChanges(false);

      query.refetch();
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, [hasUnsavedChanges, widgets, saveMutation, query]);

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

          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            className={`w-full md:w-auto px-4 py-2 rounded text-white
              ${
                hasUnsavedChanges
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-slate-400 cursor-not-allowed'
              }
            `}
          >
            {hasUnsavedChanges ? 'Save Dashboard (Unsaved)' : 'Save Dashboard'}
          </button>
        </div>

        {hasUnsavedChanges && (
          <div className='mt-4 rounded border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-800 text-sm'>
            You have unsaved changes — click <strong>Save Dashboard</strong> to
            persist them.
          </div>
        )}

        <div className='mt-6'>
          <WidgetList />
        </div>
      </section>
    </AuthGuard>
  );
}
