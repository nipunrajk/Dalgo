'use client';

import { useEffect } from 'react';
import { useToastStore } from '../store/useToastStore';

export default function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && toasts.length) {
        remove(toasts[toasts.length - 1].id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toasts, remove]);

  return (
    <div className='fixed right-4 top-4 z-50 flex flex-col gap-2'>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full p-3 rounded shadow text-sm ${
            t.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-100'
              : t.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
              : 'bg-white text-slate-800 border border-slate-100'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
