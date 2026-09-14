import { postApi } from './api';

export type LogPayload = Record<string, unknown>;

/**
 * Fire-and-forget log of a user action to the study backend.
 * `payload` is where anything dynamic goes — e.g. the actual sentence
 * text that was clicked, not a fixed label, since that changes per
 * element. Never throws: a logging failure shouldn't break the UI or
 * interrupt the participant's task.
 */
export function logAction(type: string, payload?: LogPayload) {
  postApi('/log', { type, timestamp: Date.now(), payload }).catch((err) => {
    console.warn('Failed to log action:', type, err);
  });
}
