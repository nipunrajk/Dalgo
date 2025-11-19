import { describe, it, expect, beforeEach } from 'vitest';
import { useToastStore } from '../../store/useToastStore';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('should have empty toasts initially', () => {
    const state = useToastStore.getState();
    expect(state.toasts).toEqual([]);
  });

  it('should push a toast', () => {
    useToastStore.getState().push('Test message', 'success', 0);
    const state = useToastStore.getState();

    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].message).toBe('Test message');
    expect(state.toasts[0].type).toBe('success');
    expect(state.toasts[0].id).toBeDefined();
  });

  it('should remove a toast by id', () => {
    useToastStore.getState().push('Test message', 'info', 0);
    const toastId = useToastStore.getState().toasts[0].id;

    useToastStore.getState().remove(toastId);
    const state = useToastStore.getState();

    expect(state.toasts).toHaveLength(0);
  });

  it('should push multiple toasts', () => {
    useToastStore.getState().push('Message 1', 'success', 0);
    useToastStore.getState().push('Message 2', 'error', 0);
    useToastStore.getState().push('Message 3', 'info', 0);

    const state = useToastStore.getState();
    expect(state.toasts).toHaveLength(3);
  });

  it('should clear all toasts', () => {
    useToastStore.getState().push('Message 1', 'success', 0);
    useToastStore.getState().push('Message 2', 'error', 0);

    useToastStore.getState().clear();
    const state = useToastStore.getState();

    expect(state.toasts).toHaveLength(0);
  });
});
