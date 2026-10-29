import { writeLog } from '~/server/log';
import { getLogContext } from './logContext';
import { getUserId } from './user';
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
 * Every log entry contains the persisted user ID and the current study step.
 * If there is no user ID, the user is redirected to the login page
 * and the log is not sent.
 */
export function logAction(type: string, payload?: LogPayload) {
  const userId = getUserId();

  if (!userId) {
    redirectToLogin();
    return;
  }

  const { step, taskId, documentId } = getLogContext();

  writeLog({
    userId,
    taskId: taskId ?? 'None',
    documentId,
    step,
    type,
    timestamp: Date.now(),
    payload,
  }).catch((err) => {
    console.warn('Failed to log action:', type, err);
  });
}
