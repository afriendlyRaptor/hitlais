export type QuestionnaireItem =
  | {
      id: string;
      type: 'likert';
      question: string;
      lowLabel?: string;
      highLabel?: string;
    }
  | {
      id: string;
      type: 'text';
      question: string;
      /** Open questions are optional unless set. */
      required?: boolean;
    };

export interface Questionnaire {
  title: string;
  description: string;
  items: QuestionnaireItem[];
}

export type Answers = Record<string, number | string>;
