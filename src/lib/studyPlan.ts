import { COMPARISONS, RANDOMIZE_BLOCK_ORDER, STUDY_BLOCKS } from '~/config';
import { assignDocuments } from './documentAssignment';
import { seededRng, shuffle } from './random';

export type StudyStep =
  | { kind: 'instructions'; taskId: string }
  | { kind: 'task'; taskId: string }
  | { kind: 'questionnaire'; taskId: string; questionnaireId: string }
  | { kind: 'comparison'; taskId: string; questionnaireId: string };

export interface StudyPlan {
  steps: StudyStep[];
  /** taskId -> document id */
  documentIds: Record<string, string>;
}

export const stepId = (step: StudyStep) => `${step.kind}:${step.taskId}`;

const STEP_LABELS: Record<StudyStep['kind'], string> = {
  instructions: 'Anleitung',
  task: 'Aufgabe',
  questionnaire: 'Fragebogen',
  comparison: 'Vergleich',
};

export const stepLabel = (step: StudyStep) =>
  `${STEP_LABELS[step.kind]} – ${step.taskId}`;

/** The complete, ordered list of screens one participant goes through. */
export function buildStudyPlan(userId: string): StudyPlan {
  const blocks = RANDOMIZE_BLOCK_ORDER
    ? shuffle(STUDY_BLOCKS, seededRng(userId, 'block-order'))
    : STUDY_BLOCKS;

  const steps: StudyStep[] = [
    ...blocks.flatMap(({ taskId, questionnaireId }): StudyStep[] => [
      { kind: 'instructions', taskId },
      { kind: 'task', taskId },
      { kind: 'questionnaire', taskId, questionnaireId },
    ]),
    ...COMPARISONS.map((comparison): StudyStep => ({
      kind: 'comparison',
      ...comparison,
    })),
  ];

  const taskIds = [
    ...new Set([
      ...STUDY_BLOCKS.map((b) => b.taskId),
      ...COMPARISONS.map((c) => c.taskId),
    ]),
  ];

  return {
    steps,
    documentIds: assignDocuments(taskIds, seededRng(userId, 'documents')),
  };
}
