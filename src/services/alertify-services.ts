/**
 * Alertify - imperative toast API (usable outside React components).
 *
 * This file only holds the state; the <ToastHost /> component (rendered once in
 * RootLayout) subscribes to it and draws the toast with MUI.
 * Only one toast is visible at a time: showing a new one replaces the old one.
 *
 * @example
 * Alertify.success('User created successfully');
 * Alertify.error('Failed to save changes');
 * Alertify.info('Please wait...');
 */

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastSeverity = 'success' | 'error' | 'info' | 'loading';

export interface ToastState {
  id: string;
  message: string;
  severity: ToastSeverity;
  position: ToastPosition;
}

let current: ToastState | null = null;
let nextId = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Subscription interface consumed by <ToastHost /> via useSyncExternalStore. */
export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => current,
};

function show(
  severity: ToastSeverity,
  message: string,
  position: ToastPosition
): string {
  nextId += 1;
  const id = `toast-${nextId}`;

  current = { id, message, severity, position };
  emit();

  return id;
}

function update(id: string, severity: ToastSeverity, message: string) {
  if (current?.id !== id) {
    return;
  }

  current = { ...current, severity, message };
  emit();
}

function dismiss(toastId?: string) {
  if (!current || (toastId && toastId !== current.id)) {
    return;
  }

  current = null;
  emit();
}

export const Alertify = {
  success(message: string, position: ToastPosition = 'bottom-right') {
    return show('success', message, position);
  },

  error(message: string, position: ToastPosition = 'bottom-right') {
    return show('error', message, position);
  },

  info(message: string, position: ToastPosition = 'bottom-right') {
    return show('info', message, position);
  },

  /**
   * Show a loading toast (returns handles to update/dismiss it)
   */
  loading(message: string, position: ToastPosition = 'bottom-right') {
    const id = show('loading', message, position);

    return {
      id,
      success: (successMessage: string) =>
        update(id, 'success', successMessage),
      error: (errorMessage: string) => update(id, 'error', errorMessage),
      dismiss: () => dismiss(id),
    };
  },

  /**
   * Dismiss a specific toast (defaults to the current one)
   */
  dismiss,

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    dismiss();
  },
};

export default Alertify;
