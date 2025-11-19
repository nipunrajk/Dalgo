'use client';

import { useState } from 'react';
import { Widget } from '../../store/useDashboardStore';

export default function NotesWidget({
  widget,
  onUpdate,
  onRemove,
}: {
  widget: Widget;
  onUpdate: (id: string, patch: Partial<Widget>) => void;
  onRemove: (id: string) => void;
}) {
  const initialText = (widget.data?.text as string) ?? '';
  const [text, setText] = useState<string>(initialText);
  const [editing, setEditing] = useState(false);

  function save() {
    onUpdate(widget.id, { data: { ...widget.data, text } });
    setEditing(false);
  }

  return (
    <div className='p-4 bg-white rounded shadow flex flex-col'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>{widget.title}</h3>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setEditing((s) => !s)}
            className='px-2 py-1 text-sm border rounded'
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className='px-2 py-1 text-sm bg-rose-500 text-white rounded'
          >
            Remove
          </button>
        </div>
      </div>

      {editing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className='mt-3 p-2 border rounded resize-y'
          />
          <div className='mt-2 flex justify-end'>
            <button
              onClick={save}
              className='px-3 py-1 bg-sky-600 text-white rounded text-sm'
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <div className='mt-3 text-sm text-slate-700 whitespace-pre-wrap'>
          {initialText || (
            <span className='text-slate-400'>
              No notes yet. Click Edit to add.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
