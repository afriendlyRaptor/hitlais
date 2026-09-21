import { postApi } from './api';
import { DEFAULT_TASK_ID, getStudyTask } from '~/config';

export type LogPayload = Record<string, unknown>;

const USER_ID_KEY = 'study_user_id';
const LOGIN_PATH = '/login';
export const USER_ID_CHANGED_EVENT = 'study-user-id-changed';

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

  window.dispatchEvent(new Event(USER_ID_CHANGED_EVENT));
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

export function getTaskId(): string | null {
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get('task') ?? DEFAULT_TASK_ID;
  return taskId;
}

export function getTask(): StudyTaskConfig | null {
  const taskId = getTaskId();
  const task = getStudyTask(taskId);
  return task ?? null;
}

/**
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
  const task = getTask();
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get('task') ?? 'None';

  if (!userId) {
    redirectToLogin();
    return;
  }

  postApi('/log', {
    userId,
    taskId: taskId,
    documentId: task.documentId,
    type,
    timestamp: Date.now(),
    payload,
  }).catch((err) => {
    console.warn('Failed to log action:', type, err);
  });
}
