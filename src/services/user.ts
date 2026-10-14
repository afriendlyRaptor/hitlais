import { storageKeys } from '~/config';

export const USER_ID_CHANGED_EVENT = 'study-user-id-changed';

/**
 * Store the user ID persistently.
 * Logging in wipes all other stored study data.
 */
export function setUserId(id: string) {
  const trimmedId = id.trim();

  if (!trimmedId) {
    return;
  }

  localStorage.clear();
  localStorage.setItem(storageKeys.userId, trimmedId);

  window.dispatchEvent(new Event(USER_ID_CHANGED_EVENT));
}

/**
 * Get the currently logged-in user ID.
 */
export function getUserId(): string | null {
  return localStorage.getItem(storageKeys.userId);
}

/**
 * Remove the current user ID.
 */
export function clearUserId() {
  localStorage.removeItem(storageKeys.userId);
}
