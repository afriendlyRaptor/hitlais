export type StudyTaskConfig = {
  /** A fixed id from VALID_DOCUMENT_IDS, or 'random' to draw one per participant. */
  documentId: number | 'random';
  /** Heading of the instruction screen, so a new task is noticed. */
  title: string;
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
    title: 'Task A',
    documentId: 69198,
    description: '',
    instructions: `
Sie dürfen in den nächsten ca. 50min eine neue Herangehensweise an das erstellen
von Zusammenfassungen testen. Ihre Rückmeldungen und Ihre Erfahrungen sind für
die Weiterentwicklung dieses Projektes äusserst wertvoll.

Auf den folgenden Seiten werden Sie drei Aufgaben bewältigen und danach
die Effektivität und den Nutzen der Ihnen zur Verfügung gestellten Mittel bewerten.

Während den Aufgaben wird Ihnen in der linken Hälfte ein Text präsentiert aus welchem
Sie mit Klicken Sätze auswählen können. Aus den ausgewählten Sätze wird danach 
automatisch eine Zusammenfassung generiert. Diese Zusammenfassung wird Ihnen auf 
der rechten Seite angezeigt.

Unterhalb der Zusammenfassung gibt es die Möglichkeit mit dem Verlauf zu einer
früheren Version zurückzukehren.

Am unteren Rand der Seite gibt es Knöpfe für die automatische Selektion der Sätze.
Auch kann hier die Auswahl aufgehoben werden.

Ihre Aufgabe besteht darin, die Qualität der generierten Zusammenfassung
zu verbessern, indem Sie gezielt wichtige Sätze aus dem Text auswählen.
Sie können Ihre Satzauswahl beliebig oft verändern. 

Versuchen Sie, innerhalb des Zeitlimits eine möglichst gute
Zusammenfassung zu erstellen. Sobald Sie mit dem Ergebnis zufrieden sind, können
Sie Ihre Zusammenfassung jederzeit einreichen.
`,
    showScore: false,
    timeLimitSeconds: 1200, // 20 min
  },

  taskB: {
    title: 'Task B',
    documentId: 69828,
    description: ``,

    instructions: `
In Ihrer nächsten Aufgabe wird Ihnen zusätzlich zur Zusammenfassung auch eine
Punktzahl angezeigt welche die generierte Zusammenfassung bewertet.
Die verschiedenen Versionen werden ausserdem in einem Graph dargestellt. Durch
klicken auf einen Punkt im Graph kann direkt diese Version aufgerufen werden.

Nutzen Sie diesen Score als zusätzliche Orientierung, um Ihre Satzauswahl und 
damit die Zusammenfassung schrittweise zu verbessern.

Versuchen Sie, innerhalb des Zeitlimits eine möglichst gute Zusammenfassung 
zu erstellen. Sobald Sie mit dem Ergebnis zufrieden sind, können Sie Ihre 
Zusammenfassung jederzeit einreichen.
    `,

    showScore: true,
    timeLimitSeconds: 1200, // 20 min
  },

  taskC: {
    title: 'Task C',
    documentId: 61082,
    description: ``,
    instructions: `
Sie haben es fast geschafft! In Ihrer letzten Aufgabe wird ihnen eine 
Reduzierte Zeit zur Verfügung stehen. 

Verbessern Sie die angezeigte Zusammenfassung durch die gezielte Auswahl wichtiger
Sätze aus dem Originaldokument. 

Versuchen Sie, innerhalb des Zeitlimits eine möglichst gute Zusammenfassung 
zu erstellen. Sobald Sie mit dem Ergebnis zufrieden sind, können Sie Ihre 
Zusammenfassung jederzeit einreichen.
`,
    showScore: false,
    timeLimitSeconds: 300, // 5 min
  },
};

export function getStudyTask(taskId: string): StudyTaskConfig {
  const task = studyTasks[taskId];

  if (!task) {
    throw new Error(`Unknown study task "${taskId}"`);
  }

  return task;
}
