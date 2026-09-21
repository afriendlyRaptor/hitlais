export type StudyTaskConfig = {
  documentId: number;
  components: {
    score_display: boolean;
    task_timer: boolean;
    time?: number; // seconds, required if task_timer is true
  };
  redirectTo?: string;
};

export const studyTasks: Record<string, StudyTaskConfig> = {
  taskA: {
    documentId: 40404,
    components: {
      score_display: false,
      task_timer: false,
    },
  },

  taskB: {
    documentId: 35813,
    components: {
      score_display: true,
      task_timer: false,
    },
  },

  taskC: {
    documentId: 43187,
    components: {
      score_display: false,
      task_timer: true,
      time: 300, // 5 minutes
    },
  },
  taskD: {
    documentId: null,
    redirectTo: '/about',
    components: {
      score_display: false,
      task_timer: false,
    },
  },
};

export const DEFAULT_TASK_ID = 'taskA';

export function getStudyTask(taskId: string | null): StudyTaskConfig {
  return studyTasks[taskId ?? DEFAULT_TASK_ID] ?? studyTasks[DEFAULT_TASK_ID];
}

export function getNextTaskId(taskId: string | null): string | null {
  const taskIds = Object.keys(studyTasks);
  const currentIndex = taskIds.indexOf(taskId ?? DEFAULT_TASK_ID);

  if (currentIndex === -1 || currentIndex === taskIds.length - 1) {
    return null;
  }

  return taskIds[currentIndex + 1];
}
