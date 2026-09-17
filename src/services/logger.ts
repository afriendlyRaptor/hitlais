import { postApi } from './api';

export type LogPayload = Record<string, unknown>;

const USER_ID_KEY = 'study_user_id';
const LOGIN_PATH = '/login';

/**
 * Store the user ID persistently.
 */
export function setUserId(id: string) {
  const trimmedId = id.trim();

  if (!trimmedId) {
    return;
  }

  localStorage.clear();
  localStorage.setItem(USER_ID_KEY, trimmedId);
}

/**
 * Get the currently logged-in user ID.
 */
export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Remove the current user ID.
 */
export function clearUserId() {
  localStorage.removeItem(USER_ID_KEY);
}

export function getDocumentId(): number | null {
  const value = new URLSearchParams(window.location.search).get('documentId');

  if (!value) {
    return null;
  }

  const documentId = Number.parseInt(value, 10);

  return Number.isNaN(documentId) ? null : documentId;
} /**
 * Redirect to the login page.
 */
function redirectToLogin() {
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH);
  }
}

/**
 * Every log entry contains the persisted user ID.
 * If there is no user ID, the user is redirected to the login page
 * and the log is not sent.
 */
export function logAction(type: string, payload?: LogPayload) {
  const userId = getUserId();
  const documentId = getDocumentId();

  if (!userId) {
    redirectToLogin();
    return;
  }

  postApi('/log', {
    userId,
    documentId,
    type,
    timestamp: Date.now(),
    payload,
  }).catch((err) => {
    console.warn('Failed to log action:', type, err);
  });
}
