import type { LikertQuestion } from '~/components/survey';

export type SummaryOption = {
  /** Value that gets logged when this summary is chosen. */
  value: string;
  title: string;
  text: string;
};

export const SUMMARY_OPTIONS: SummaryOption[] = [
  { value: 'summary_a', title: 'Zusammenfassung A', text: 'Sample Text' },
  { value: 'summary_b', title: 'Zusammenfassung B', text: 'Sample Text' },
];

export const QUESTIONS: LikertQuestion[] = [
  {
    id: 'q1',
    question:
      'Ich bin mir sicher, welche der beiden Zusammenfassungen besser ist.',
  },
  {
    id: 'q2.1',
    question:
      'Ich gehe davon aus, dass eine der beiden Zusammenfassungen von KI geschrieben wurde.',
  },
  {
    id: 'q2.2',
    question:
      'Ich gehe davon aus, dass beide der beiden Zusammenfassungen von KI geschrieben wurde.',
  },

  {
    id: 'q3',
    question:
      'Ich wähle aus Prinzip die Zusammenfassung, welche auf mich menschlicher wirkt.',
  },
  {
    id: 'q4',
    question: 'Ich finde die beiden Zusammenfassungen sind gleichwertig.',
  },
  {
    id: 'q5',
    question: 'Ich finde beide Zusammenfassungen schlecht.',
  },
];
