export type StudyTaskConfig = {
  documentId: number;
  components: {
    score_display: boolean;
    task_timer: boolean;
  };
};

export const studyTasks: Record<string, StudyTaskConfig> = {
  taskA: {
    documentId: 40404,
    components: {
      score_display: true,
      task_timer: true,
    },
  },

  taskB: {
    documentId: 40405,
    components: {
      score_display: false,
      task_timer: true,
    },
  },

  taskC: {
    documentId: 40406,
    components: {
      score_display: true,
      task_timer: false,
    },
  },
};

export const DEFAULT_TASK_ID = 'taskA';

export function getStudyTask(taskId: string | null): StudyTaskConfig {
  return studyTasks[taskId ?? DEFAULT_TASK_ID] ?? studyTasks[DEFAULT_TASK_ID];
}
