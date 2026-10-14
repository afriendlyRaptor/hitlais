import { useSearch } from 'wouter';
import { getNextTaskId, getStudyTask } from '~/config';

/**
 * Reads the current task from the `?task=` query parameter.
 * `taskId` is null when the URL has no task (the summarizer then redirects to
 * the default one).
 */
export function useStudyTask() {
  const search = useSearch();
  const taskId = new URLSearchParams(search).get('task');

  return {
    taskId,
    task: getStudyTask(taskId),
    nextTaskId: getNextTaskId(taskId),
  };
}
