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
  /*  { taskId: 'taskB', questionnaireId: 'scoreTaskQuestionnaire' },
  { taskId: 'taskC', questionnaireId: 'taskQuestionnaire' },*/
];

export type ComparisonConfig = {
  /** Task whose final summary is compared with the reference summary. */
  taskId: string;
  /** Key in `questionnaires` shown with the comparison. */
  questionnaireId: string;
};

/**
 * Final steps, always last and in this order: each compares the participant's
 * final summary of `taskId` with the reference summary of that task's document.
 * Add one entry per comparison.
 */
export const COMPARISONS: ComparisonConfig[] = [
  { taskId: 'taskA', questionnaireId: 'comparisonQuestionnaire' },
  /*  { taskId: 'taskB', questionnaireId: 'comparisonQuestionnaire' },
  { taskId: 'taskC', questionnaireId: 'comparisonQuestionnaire' }, */
];
