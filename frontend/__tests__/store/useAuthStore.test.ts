import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true });
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
  });

  it('should set user', () => {
    const testUser = { id: '1', name: 'Test User', email: 'test@example.com' };

    useAuthStore.getState().setUser(testUser);
    const state = useAuthStore.getState();

    expect(state.user).toEqual(testUser);
    expect(state.loading).toBe(false);
  });

  it('should clear user', () => {
    const testUser = { id: '1', name: 'Test User', email: 'test@example.com' };

    useAuthStore.getState().setUser(testUser);
    useAuthStore.getState().clearUser();
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should set loading state', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);

    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().loading).toBe(true);
  });
});
