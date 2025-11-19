'use client';

import { create } from 'zustand';

type Toast = {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
  ttl?: number;
};

type ToastState = {
  toasts: Toast[];
  push: (message: string, type?: Toast['type'], ttl?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push(message, type = 'info', ttl = 3500) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: Toast = { id, message, type, ttl };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (ttl > 0) {
      setTimeout(
        () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
        ttl
      );
    }
  },
  remove(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
  clear() {
    set({ toasts: [] });
  },
}));
