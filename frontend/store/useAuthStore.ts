'use client';

import { create } from 'zustand';

type User = { id: string; name: string; email: string } | null;

type AuthState = {
  user: User;
  loading: boolean;
  setUser: (u: User) => void;
  clearUser: () => void;
  setLoading: (b: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (u) => set({ user: u, loading: false }),
  clearUser: () => set({ user: null, loading: false }),
  setLoading: (b) => set({ loading: b }),
}));
