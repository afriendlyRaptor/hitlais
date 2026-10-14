import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { DEFAULT_TASK_ID } from '~/config';
import { useStudyTask } from '~/hooks';
import { SummarizerTask } from './SummarizerTask';

/** Route entry: makes sure the URL carries a task, then renders it. */
export default function Summarizer() {
  const { taskId } = useStudyTask();
  const [, navigate] = useLocation();

  // If there is no task, redirect to the default task.
  useEffect(() => {
    if (!taskId) {
      navigate(`?task=${DEFAULT_TASK_ID}`, { replace: true });
    }
  }, [taskId, navigate]);

  if (!taskId) {
    return null;
  }

  return <SummarizerTask taskId={taskId} />;
}
