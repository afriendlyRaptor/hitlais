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
    documentId: 'random',
    description: '',
    instructions: `
Sie sehen ein Originaldokument und eine daraus automatisch generierte
Zusammenfassung.
Ihre Aufgabe besteht darin, die Qualität dieser Zusammenfassung
zu verbessern, indem Sie gezielt wichtige Sätze aus dem Originaldokument auswählen.
Auf Basis Ihrer Auswahl können Sie eine neue Zusammenfassung generiert lassen. 
Sie können Ihre Satzauswahl beliebig oft verändern und die Zusammenfassungen
beliebig oft generieren lassen.

Versuchen Sie, innerhalb des Zeitlimits eine möglichst gute
Zusammenfassung zu erstellen. Sobald Sie mit dem Ergebnis zufrieden sind, können
Sie Ihre ﬁnale Zusammenfassung jederzeit einreichen.
`,
    showScore: false,
    timeLimitSeconds: 1200, // 20 min
  },

  taskB: {
    documentId: 'random',
    description: ``,

    instructions: `
Wie in der vorherigen Aufgabe können Sie durch die Auswahl relevanter Sätze aus
dem Originaldokument eine automatisch generierte Zusammenfassung verbessern.

Zusätzlich wird Ihnen nun ein Score angezeigt, der die Qualität der aktuell generierten
Zusammenfassung bewertet. Nutzen Sie diesen Score als zusätzliche Orientierung, um
Ihre Satzauswahl und damit die Zusammenfassung schrittweise zu verbessern.

Versuchen Sie, innerhalb des Zeitlimits eine möglichst gute Zusammenfassung 
zu erreichen. Sobald Sie mit dem Ergebnis zufrieden sind, können Sie Ihre Zusammenfassung einreichen.
    `,

    showScore: true,
    timeLimitSeconds: 1200, // 20 min
  },

  taskC: {
    documentId: 'random',
    description: ``,
    instructions: `
Verbessern Sie die angezeigte Zusammenfassung durch die gezielte Auswahl wichtiger
Sätze aus dem Originaldokument. Für diese Aufgabe steht Ihnen weinger Zeit zur Verfügung.
Versuchen Sie, innerhalb dieser Zeit eine möglichst gute Zusammenfassung zu
erstellen. Überlegen Sie, welche Sätze besonders relevant sind, und konzentrieren Sie
sich auf diese. Sie können Ihre Zusammenfassung jederzeit vor Ablauf der Zeit
einreichen.`,
    showScore: false,
    timeLimitSeconds: 900, // 15 min
  },
};

export function getStudyTask(taskId: string): StudyTaskConfig {
  const task = studyTasks[taskId];

  if (!task) {
    throw new Error(`Unknown study task "${taskId}"`);
  }

  return task;
}
