import type { LikertQuestion } from '~/components/survey';

export const QUESTIONS: LikertQuestion[] = [
  { id: 'q1', question: 'Ich kann besser zusammenfassen als eine KI.' },
  { id: 'q2', question: 'Der Score hat meine Satzauswahl beeinflusst.' },
  {
    id: 'q3',
    question: 'Zusammenfassungen von Menschen sind besser als die einer KI',
  },
  {
    id: 'q4',
    question: 'Mit menschlicher Hilfe werden KI-Zusammenfassungen besser.',
  },
  { id: 'q5', question: 'Die Benutzeroberfläche hat mich gestört.' },
];
