export type StudyTaskConfig = {
  /** A fixed id from VALID_DOCUMENT_IDS, or 'random' to draw one per participant. */
  documentId: number | 'random';
  /** Shown above the text while working on the task. */
  description: string;
  /** Shown on the instruction screen before the task starts. */
  instructions: string;
  /** Show the score chart and the version history. */
  showScore: boolean;
  timeLimitSeconds?: number;
};

export const studyTasks: Record<string, StudyTaskConfig> = {
  taskA: {
    documentId: 61434,
    description: 'Erstellen Sie die best mögliche Zusammenfassung.',
    instructions: `Sie sehen gleich einen Text. Klicken Sie auf Sätze, um sie auszuwählen. Aus den ausgewählten Sätzen erstellt eine KI eine Zusammenfassung.

Mit dem Pfeil in der Mitte erstellen Sie eine neue Zusammenfassung. Rechts sehen Sie das Ergebnis, unten Ihre bisherigen Punkte. Ein Klick auf einen Punkt bringt Sie zu dieser Version zurück.

Klicken Sie auf "Next", wenn Sie mit Ihrer Zusammenfassung zufrieden sind.`,
    showScore: true,
  },

  taskB: {
    documentId: 64550,
    description:
      'Erstellen Sie die die Zusammenfassung mit der höchsten Punktzahl.',
    instructions: `Auch in dieser Aufgabe wählen Sie Sätze aus, aus denen eine KI eine Zusammenfassung erstellt.

Ihr Ziel ist es, die höchstmögliche Punktzahl zu erreichen. Frühere Versionen erreichen Sie über die Punkte unten oder den Verlauf oben rechts.`,
    showScore: true,
  },

  taskC: {
    documentId: 62138,
    description:
      'Erstellen Sie die best mögliche Zusammenfassung in der vorgegebenen Zeit.',
    instructions: `In dieser Aufgabe erstellen Sie wieder eine Zusammenfassung, diesmal ohne Punktzahl und mit einem Zeitlimit.

Wenn die Zeit abgelaufen ist, geht es automatisch weiter.`,
    showScore: false,
    timeLimitSeconds: 300,
  },
};

export function getStudyTask(taskId: string): StudyTaskConfig {
  const task = studyTasks[taskId];

  if (!task) {
    throw new Error(`Unknown study task "${taskId}"`);
  }

  return task;
}
