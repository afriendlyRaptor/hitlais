import { VALID_DOCUMENT_IDS, studyTasks } from '~/config';
import { shuffle } from './random';

/**
 * Maps each task to a document id.
 * Fixed ids are validated; 'random' tasks draw distinct, still unused ids.
 */
export function assignDocuments(
  taskIds: string[],
  rng: () => number
): Record<string, number> {
  const assigned: Record<string, number> = {};
  const randomTaskIds: string[] = [];

  for (const taskId of taskIds) {
    const { documentId } = studyTasks[taskId];

    if (documentId === 'random') {
      randomTaskIds.push(taskId);
      continue;
    }

    if (!VALID_DOCUMENT_IDS.includes(documentId)) {
      throw new Error(
        `Task "${taskId}": document ${documentId} is not in VALID_DOCUMENT_IDS`
      );
    }

    assigned[taskId] = documentId;
  }

  const taken = new Set(Object.values(assigned));
  const pool = shuffle(
    VALID_DOCUMENT_IDS.filter((id) => !taken.has(id)),
    rng
  );

  for (const taskId of randomTaskIds) {
    const id = pool.pop();

    if (id === undefined) {
      throw new Error('Not enough unused ids in VALID_DOCUMENT_IDS');
    }

    assigned[taskId] = id;
  }

  return assigned;
}
