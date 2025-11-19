'use client';

import { create } from 'zustand';

export type WidgetType = 'clock' | 'notes' | 'todo';

export type Widget = {
  id: string;
  type: WidgetType;
  title?: string;
  data?: Record<string, any>;
  createdAt: string;
};

type DashboardState = {
  widgets: Widget[];
  addWidget: (type: WidgetType, initial?: Partial<Widget>) => Widget;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, patch: Partial<Widget>) => void;
  setWidgets: (widgets: Widget[]) => void;
  clear: () => void;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  widgets: [],

  addWidget(type, initial = {}) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const base: Widget = {
      id,
      type,
      title:
        initial.title ??
        (type === 'clock' ? 'Clock' : type === 'notes' ? 'Notes' : 'Todo'),
      data:
        initial.data ??
        (type === 'clock'
          ? {}
          : type === 'notes'
          ? { text: '' }
          : { todos: [] }),
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ widgets: [...s.widgets, base] }));
    return base;
  },

  removeWidget(id) {
    set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) }));
  },

  updateWidget(id, patch) {
    set((s) => ({
      widgets: s.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }));
  },

  setWidgets(widgets) {
    set(() => ({ widgets: widgets.slice() }));
  },

  clear() {
    set({ widgets: [] });
  },
}));
