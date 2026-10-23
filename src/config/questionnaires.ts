import type { Questionnaire } from '~/types';

export const LIKERT_POINTS = 5;
export const LIKERT_LOW_LABEL = 'Stimme überhaupt nicht zu';
export const LIKERT_HIGH_LABEL = 'Stimme voll und ganz zu';

const likertHint = `Bitte bewerten Sie die folgenden Aussagen von 1 (${LIKERT_LOW_LABEL.toLowerCase()}) bis ${LIKERT_POINTS} (${LIKERT_HIGH_LABEL.toLowerCase()}).`;

const taskQuestionnaire: Questionnaire = {
  title: 'Fragen zur Aufgabe',
  description: likertHint,
  items: [
    {
      id: 'startSummaryQuality',
      type: 'likert',
      question:
        'Die zu Beginn angezeigte Zusammenfassung war bereits von guter Qualität.',
    },
    {
      id: 'controlledImprovement',
      type: 'likert',
      question:
        'Durch die gezielte Auswahl wichtiger Sätze konnte ich die Qualität der Zusammenfassung verbessern.',
    },
    {
      id: 'easeOfSelection',
      type: 'likert',
      question:
        'Es ﬁel mir leicht, relevante Sätze im Originaldokument zu identiﬁzieren.',
    },
    //    {
    //      id: 'easeOfUse',
    //      type: 'likert',
    //      question: 'Die Auswahl und Abwahl von Sätzen war einfach und intuitiv.',
    //    },
    {
      id: 'coherantGeneration',
      type: 'likert',
      question:
        'Ich konnte gut nachvollziehen, wie sich meine Satzauswahl auf die generierte Zusammenfassung auswirkte.',
    },

    {
      id: 'feelingInControll',
      type: 'likert',
      question:
        'Ich hatte das Gefühl, die generierte Zusammenfassung durch meine Satzauswahl gezielt beeinﬂussen zu können.',
    },

    {
      id: 'betterWriteMyself',
      type: 'likert',
      question:
        'Es wäre für mich einfacher gewesen, direkt selbst eine Zusammenfassung zu schreiben.',
    },
    {
      id: 'summarySatisfaction',
      type: 'likert',
      question:
        'Ich bin mit der Qualität meiner ﬁnalen Zusammenfassung zufrieden.',
    },
    {
      id: 'troubles',
      type: 'text',
      question:
        'Was hat Ihnen bei der Verbesserung der Zusammenfassung besonders viel Mühe bereitet?',
      required: true,
    },
    {
      id: 'comments',
      type: 'text',
      question: 'Weitere Anmerkungen zur Aufgabe',
    },
  ],
};

const scoreTaskQuestionnaire: Questionnaire = {
  ...taskQuestionnaire,
  items: [
    ...taskQuestionnaire.items.slice(0, 4),
    {
      id: 'scoreHelped',
      type: 'likert',
      question:
        ' Der angezeigte Score hat mir geholfen, die Qualität der generierten Zusammenfassungen einzuschätzen.',
    },
    {
      id: 'scoreSpeed',
      type: 'likert',
      question:
        'Mithilfe des Scores konnte ich schneller eine gute Zusammenfassung erstellen.',
    },
    {
      id: 'scoreInfluence',
      type: 'likert',
      question:
        'Der Score hat meine Entscheidung beeinﬂusst, welche Sätze ich auswähle.',
    },
    {
      id: 'scoreCoherant',
      type: 'likert',
      question:
        'Die Veränderungen des Scores nach einer Anpassung meiner Satzauswahl waren für mich nachvollziehbar.',
    },
    {
      id: 'scoreMaximized',
      type: 'likert',
      question:
        'Ich habe gezielt verschiedene Satzauswahlen ausprobiert, um einen möglichst hohen Score zu erreichen.',
    },
    {
      id: 'scoreSensible',
      type: 'likert',
      question:
        'Ich hatte den Eindruck, dass eine höhere Punktzahl tatsächlich einer besseren Zusammenfassung entsprach.',
    },
    {
      id: 'scoreWanted',
      type: 'likert',
      question:
        'Ich würde es bevorzugen, auch bei zukünftigen Zusammenfassungsaufgaben einen solchen Score angezeigt zu bekommen.',
    },

    ...taskQuestionnaire.items.slice(4),
  ],
};

const comparisonQuestionnaire: Questionnaire = {
  title: 'Zusammenfassungen vergleichen',
  description:
    'Lesen Sie beide Zusammenfassungen und wählen Sie anschließend die Zusammenfassung aus, die Sie für besser halten.',
  items: [
    {
      id: 'sureWhichIsBetter',
      type: 'likert',
      question:
        'Ich konnte klar erkennen, welche der beiden Zusammenfassungen die bessere Qualität aufweist.',
    },
    {
      id: 'oneWrittenByAi',
      type: 'likert',
      question:
        'Ich vermute, dass mindestens eine der beiden Zusammenfassungen mithilfe einer KI erstellt wurde.',
    },
    {
      id: 'bothWrittenByAi',
      type: 'likert',
      question:
        'Ich vermute, dass beide Zusammenfassungen mithilfe einer KI erstellt wurden.',
    },
    {
      id: 'chooseMoreHuman',
      type: 'likert',
      question:
        'Bei meiner Entscheidung habe ich besonders darauf geachtet, wie natürlich und menschlich die Zusammenfassungen formuliert sind.',
    },
    {
      id: 'equalQuality',
      type: 'likert',
      question:
        'Ich empﬁnde die beiden Zusammenfassungen hinsichtlich ihrer Qualität als weitgehend gleichwertig.',
    },
    {
      id: 'bothBad',
      type: 'likert',
      question:
        'Ich bin mit der Qualität keiner der beiden Zusammenfassungen zufrieden.',
    },
    {
      id: 'reason',
      type: 'text',
      question:
        'Was waren die wichtigsten Gründe dafür, dass Sie diese Zusammenfassung bevorzugt haben?',
      required: true,
    },
    {
      id: 'comments',
      type: 'text',
      question:
        'Gibt es noch etwas, das Sie zu Ihrer Entscheidung oder zu den beiden Zusammenfassungen anmerken möchten?',
    },
  ],
};

export const questionnaires: Record<string, Questionnaire> = {
  taskQuestionnaire,
  scoreTaskQuestionnaire,
  comparisonQuestionnaire,
};

export function getQuestionnaire(id: string): Questionnaire {
  const questionnaire = questionnaires[id];

  if (!questionnaire) {
    throw new Error(`Unknown questionnaire "${id}"`);
  }

  return questionnaire;
}
