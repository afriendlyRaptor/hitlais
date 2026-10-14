/** Every localStorage key the app uses, in one place. */
export const storageKeys = {
  userId: 'study_user_id',
  selection: (taskId: string) => `sentence-selection-${taskId}`,
  summary: (taskId: string) => `generated-summary-${taskId}`,
  scoreHistory: (taskId: string) => `score-history-${taskId}`,
} as const;
