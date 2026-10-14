import { postApi } from './api';
import { getUserId } from './user';
import { getStudyTask } from '~/config';
import { ROUTES } from '~/routes/paths';

export type LogPayload = Record<string, unknown>;

/**
 * Redirect to the login page.
 */
function redirectToLogin() {
  if (window.location.pathname !== ROUTES.login) {
    window.location.replace(ROUTES.login);
  }
}

/**
 * Every log entry contains the persisted user ID.
 * If there is no user ID, the user is redirected to the login page
 * and the log is not sent.
 */
export function logAction(type: string, payload?: LogPayload) {
  const userId = getUserId();

  if (!userId) {
    redirectToLogin();
    return;
  }

  const taskId = new URLSearchParams(window.location.search).get('task');

  postApi('/log', {
    userId,
    taskId: taskId ?? 'None',
    documentId: getStudyTask(taskId).documentId,
    type,
    timestamp: Date.now(),
    payload,
  }).catch((err) => {
    console.warn('Failed to log action:', type, err);
  });
}
