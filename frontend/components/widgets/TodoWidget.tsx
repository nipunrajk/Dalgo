'use client';

import { useState } from 'react';
import { Widget } from '../../store/useDashboardStore';

type Todo = { id: string; text: string; done?: boolean };

export default function TodoWidget({
  widget,
  onUpdate,
  onRemove,
}: {
  widget: Widget;
  onUpdate: (id: string, patch: Partial<Widget>) => void;
  onRemove: (id: string) => void;
}) {
  const initialTodos: Todo[] = (widget.data?.todos as Todo[]) ?? [];
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [text, setText] = useState('');

  function persist(newTodos: Todo[]) {
    setTodos(newTodos);
    onUpdate(widget.id, { data: { ...widget.data, todos: newTodos } });
  }

  function addTodo() {
    if (!text.trim()) return;
    const t = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: text.trim(),
      done: false,
    };
    persist([...todos, t]);
    setText('');
  }

  function toggleDone(id: string) {
    persist(todos.map((td) => (td.id === id ? { ...td, done: !td.done } : td)));
  }

  function remove(id: string) {
    persist(todos.filter((td) => td.id !== id));
  }

  return (
    <div className='p-4 bg-white rounded shadow'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='font-semibold'>{widget.title}</h3>
          <div className='mt-3 space-y-2'>
            {todos.length === 0 && (
              <div className='text-sm text-slate-400'>No todos yet.</div>
            )}
            {todos.map((t) => (
              <div key={t.id} className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  checked={!!t.done}
                  onChange={() => toggleDone(t.id)}
                />
                <div
                  className={`flex-1 text-sm ${
                    t.done ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {t.text}
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className='text-sm text-rose-500'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col items-end gap-2'>
          <button
            onClick={() => onRemove(widget.id)}
            className='px-2 py-1 text-sm bg-rose-500 text-white rounded'
          >
            Remove
          </button>
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='New todo'
          className='flex-1 px-2 py-1 border rounded'
        />
        <button
          onClick={addTodo}
          className='px-3 py-1 bg-sky-600 text-white rounded'
        >
          Add
        </button>
      </div>
    </div>
  );
}
