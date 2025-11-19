'use client';

import { useEffect, useState } from 'react';
import { Widget } from '../../store/useDashboardStore';

export default function ClockWidget({
  widget,
  onUpdate,
  onRemove,
}: {
  widget: Widget;
  onUpdate: (id: string, patch: Partial<Widget>) => void;
  onRemove: (id: string) => void;
}) {
  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className='p-4 bg-white rounded shadow'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='font-semibold'>{widget.title}</h3>
          <div className='text-2xl mt-2'>{time}</div>
          <div className='text-sm text-slate-500 mt-1'>
            Time updates every second (client-side)
          </div>
        </div>

        <div className='flex flex-col items-end space-y-2'>
          <button
            onClick={() =>
              onUpdate(widget.id, {
                title: widget.title === 'Clock' ? 'My Clock' : 'Clock',
              })
            }
            className='px-2 py-1 text-sm border rounded'
          >
            Rename
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className='px-2 py-1 text-sm bg-rose-500 text-white rounded'
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
