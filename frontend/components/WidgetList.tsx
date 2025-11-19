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
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useToastStore } from '../store/useToastStore';

export default function WidgetList() {
  const widgets = useDashboardStore((s) => s.widgets);
  const addWidget = useDashboardStore((s) => s.addWidget);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const updateWidget = useDashboardStore((s) => s.updateWidget);
  const setWidgets = useDashboardStore((s) => s.setWidgets);
  const pushToast = useToastStore((s) => s.push);

  const [newType, setNewType] = useState<WidgetType>('clock');

  function add() {
    const w = addWidget(newType);
    pushToast(`${w.title} added`, 'success', 2000);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const src = result.source.index;
    const dest = result.destination.index;
    if (src === dest) return;
    const copied = widgets.slice();
    const [moved] = copied.splice(src, 1);
    copied.splice(dest, 0, moved);

    const withPos = copied.map((w, i) => ({ ...w, position: i }));
    setWidgets(withPos);

    pushToast('Widget order updated', 'info', 1500);
  }

  return (
    <div>
      <div className='mb-4 flex flex-col sm:flex-row sm:items-center gap-3'>
        <div className='flex items-center gap-3 flex-1'>
          <label className='text-sm font-medium whitespace-nowrap'>
            Add widget
          </label>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as WidgetType)}
            className='border px-2 py-2 rounded flex-1 sm:flex-initial'
          >
            <option value='clock'>Clock</option>
            <option value='notes'>Notes</option>
            <option value='todo'>Todo</option>
          </select>
          <button
            onClick={add}
            className='px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 active:bg-sky-800'
          >
            Add
          </button>
        </div>
        <button
          onClick={() => {
            setWidgets([]);
            pushToast('Cleared widgets', 'info');
          }}
          className='px-3 py-2 text-sm border rounded hover:bg-gray-50 active:bg-gray-100 sm:ml-auto'
        >
          Clear
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='widgets-droppable'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4'
            >
              {widgets.length === 0 && (
                <div className='col-span-full p-6 bg-white rounded shadow text-center text-slate-500'>
                  No widgets yet. Add one above.
                </div>
              )}

              {widgets.map((w: Widget, idx: number) => {
                const common = {
                  widget: w,
                  onUpdate: (id: string, patch: Partial<Widget>) =>
                    updateWidget(id, patch),
                  onRemove: (id: string) => removeWidget(id),
                };
                return (
                  <Draggable key={w.id} draggableId={w.id} index={idx}>
                    {(dr) => (
                      <div
                        ref={dr.innerRef}
                        {...dr.draggableProps}
                        {...dr.dragHandleProps}
                      >
                        {w.type === 'clock' && <ClockWidget {...common} />}
                        {w.type === 'notes' && <NotesWidget {...common} />}
                        {w.type === 'todo' && <TodoWidget {...common} />}
                      </div>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
