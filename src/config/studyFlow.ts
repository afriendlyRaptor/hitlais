export type StudyBlock = {
  taskId: string;
  /** Key in `questionnaires` that follows the task. */
  questionnaireId: string;
};

/** Shuffle the blocks below once per participant (seeded by the user id). */
export const RANDOMIZE_BLOCK_ORDER = false;

/** A task is always followed by its questionnaire. */
export const STUDY_BLOCKS: StudyBlock[] = [
  { taskId: 'taskA', questionnaireId: 'taskQuestionnaire' },
  { taskId: 'taskB', questionnaireId: 'scoreTaskQuestionnaire' },
  { taskId: 'taskC', questionnaireId: 'taskQuestionnaire' },
];

/**
 * Final step, always last: compares the participant's final summary of
 * `taskId` with the reference summary of that task's document.
 */
export const COMPARISON = {
  taskId: 'taskA',
  questionnaireId: 'comparisonQuestionnaire',
} as const;
