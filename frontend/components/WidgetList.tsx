'use client';

import { useState } from 'react';
import {
  useDashboardStore,
  Widget,
  WidgetType,
} from '../store/useDashboardStore';
import ClockWidget from './widgets/ClockWidget';
import NotesWidget from './widgets/NotesWidget';
import TodoWidget from './widgets/TodoWidget';

export default function WidgetList() {
  const widgets = useDashboardStore((s) => s.widgets);
  const addWidget = useDashboardStore((s) => s.addWidget);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const updateWidget = useDashboardStore((s) => s.updateWidget);

  const [newType, setNewType] = useState<WidgetType>('clock');

  function add() {
    addWidget(newType);
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-3'>
        <label className='text-sm font-medium'>Add widget</label>
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as WidgetType)}
          className='border px-2 py-1 rounded'
        >
          <option value='clock'>Clock</option>
          <option value='notes'>Notes</option>
          <option value='todo'>Todo</option>
        </select>
        <button
          onClick={add}
          className='px-3 py-1 bg-sky-600 text-white rounded'
        >
          Add
        </button>
        <button
          onClick={() => useDashboardStore.getState().clear()}
          className='px-3 py-1 ml-auto text-sm border rounded'
        >
          Clear all
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {widgets.length === 0 && (
          <div className='col-span-full p-6 bg-white rounded shadow text-center text-slate-500'>
            No widgets yet. Add one above.
          </div>
        )}

        {widgets.map((w: Widget) => {
          const common = {
            widget: w,
            onUpdate: (id: string, patch: Partial<Widget>) =>
              updateWidget(id, patch),
            onRemove: (id: string) => removeWidget(id),
          };
          if (w.type === 'clock') return <ClockWidget key={w.id} {...common} />;
          if (w.type === 'notes') return <NotesWidget key={w.id} {...common} />;
          if (w.type === 'todo') return <TodoWidget key={w.id} {...common} />;
          return null;
        })}
      </div>
    </div>
  );
}
