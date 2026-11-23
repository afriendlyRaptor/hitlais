import { DATASET } from '~/config';
import { shuffle } from './random';

/**
 * Maps each task to a document id.
 * Fixed ids of the active dataset are validated; all other tasks draw distinct, still unused ids.
 */
export function assignDocuments(
  taskIds: string[],
  rng: () => number
): Record<string, number> {
  const assigned: Record<string, number> = {};
  const randomTaskIds: string[] = [];

  for (const taskId of taskIds) {
    const documentId = DATASET.fixedIds[taskId];

    if (documentId === undefined) {
      randomTaskIds.push(taskId);
      continue;
    }

    if (!DATASET.validIds.includes(documentId)) {
      throw new Error(
        `Task "${taskId}": document ${documentId} is not in the valid ids of the dataset`
      );
    }

    assigned[taskId] = documentId;
  }

  const taken = new Set(Object.values(assigned));
  const pool = shuffle(
    DATASET.validIds.filter((id) => !taken.has(id)),
    rng
  );

  for (const taskId of randomTaskIds) {
    const id = pool.pop();

    if (id === undefined) {
      throw new Error('Not enough unused document ids in the dataset');
    }

    assigned[taskId] = id;
  }

  return assigned;
}
