export type StudyTaskConfig = {
  documentId: number;
  description?: string;
  components: {
    score_display: boolean;
    task_timer: boolean;
    time?: number; // seconds, required if task_timer is true
  };
  compare?: boolean;
  redirectTo?: string;
};

export const studyTasks: Record<string, StudyTaskConfig> = {
  taskA: {
    documentId: 67322,
    description: 'Erstellen Sie die best mögliche Zusammenfassung.',
    components: {
      score_display: true,
      task_timer: false,
      time: 3,
    },
  },

  taskB: {
    documentId: 65921,
    description:
      'Erstellen Sie die die Zusammenfassung mit der höchsten Punktzahl.',
    components: {
      score_display: true,
      task_timer: false,
    },
  },

  taskC: {
    description:
      'Erstellen Sie die best mögliche Zusammenfassung in der vorgegebenen Zeit.',
    documentId: 65438,
    components: {
      score_display: false,
      task_timer: true,
      time: 300, // 5 minutes
    },
  },
  taskD: {
    documentId: null,
    redirectTo: '/survey1',
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
