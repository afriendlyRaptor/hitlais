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
      id: 'satisfied',
      type: 'likert',
      question: 'Ich bin mit meiner finalen Zusammenfassung zufrieden.',
    },
    {
      id: 'betterThanAi',
      type: 'likert',
      question: 'Ich kann besser zusammenfassen als eine KI.',
    },
    {
      id: 'humanHelps',
      type: 'likert',
      question: 'Mit menschlicher Hilfe werden KI-Zusammenfassungen besser.',
    },
    {
      id: 'uiDisturbed',
      type: 'likert',
      question: 'Die Benutzeroberfläche hat mich gestört.',
    },
    {
      id: 'strategy',
      type: 'text',
      question: 'Wie sind Sie bei der Auswahl der Sätze vorgegangen?',
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
      id: 'scoreInfluenced',
      type: 'likert',
      question: 'Der Score hat meine Satzauswahl beeinflusst.',
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
        'Ich bin mir sicher, welche der beiden Zusammenfassungen besser ist.',
    },
    {
      id: 'oneWrittenByAi',
      type: 'likert',
      question:
        'Ich gehe davon aus, dass eine der beiden Zusammenfassungen von KI geschrieben wurde.',
    },
    {
      id: 'bothWrittenByAi',
      type: 'likert',
      question:
        'Ich gehe davon aus, dass beide Zusammenfassungen von KI geschrieben wurden.',
    },
    {
      id: 'chooseMoreHuman',
      type: 'likert',
      question:
        'Ich wähle aus Prinzip die Zusammenfassung, welche auf mich menschlicher wirkt.',
    },
    {
      id: 'equalQuality',
      type: 'likert',
      question: 'Ich finde die beiden Zusammenfassungen sind gleichwertig.',
    },
    {
      id: 'bothBad',
      type: 'likert',
      question: 'Ich finde beide Zusammenfassungen schlecht.',
    },
    {
      id: 'reason',
      type: 'text',
      question: 'Warum haben Sie sich für diese Zusammenfassung entschieden?',
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
