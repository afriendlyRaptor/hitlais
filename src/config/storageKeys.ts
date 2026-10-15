/** Every localStorage key the app uses, in one place. */
export const storageKeys = {
  userId: 'study_user_id',
  progress: 'study-progress',
  admin: 'study-admin',
  selection: (taskId: string) => `sentence-selection-${taskId}`,
  history: (taskId: string) => `summary-history-${taskId}`,
  activeEntry: (taskId: string) => `summary-active-entry-${taskId}`,
} as const;
