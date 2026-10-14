import { useMemo, useState } from 'react';
import type { Answers, QuestionnaireItem } from '~/types';

type Options = {
  items: QuestionnaireItem[];
  /** Extra condition (besides all required items answered) to be complete. */
  isExtraComplete?: boolean;
  onSubmit: (answers: Answers) => void | Promise<void>;
};

function isAnswered(item: QuestionnaireItem, answers: Answers) {
  const answer = answers[item.id];

  if (item.type === 'likert') {
    return typeof answer === 'number';
  }

  return !item.required || (typeof answer === 'string' && answer.trim() !== '');
}

/** Answers, validation and a guarded submit for a questionnaire. */
export function useQuestionnaireForm({
  items,
  isExtraComplete = true,
  onSubmit,
}: Options) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = useMemo(
    () => isExtraComplete && items.every((item) => isAnswered(item, answers)),
    [isExtraComplete, items, answers]
  );

  const setAnswer = (id: string, value: number | string) => {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (!isComplete || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(answers);
    } catch (err) {
      console.error('Questionnaire submit failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    setAnswer,
    isComplete,
    submitAttempted,
    isSubmitting,
    handleSubmit,
  };
}
