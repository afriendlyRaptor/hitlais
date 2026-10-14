import { useMemo, useState } from 'react';

type Question = { id: string };

type Options = {
  questions: Question[];
  /** Extra condition (besides all questions answered) for the form to be complete. */
  isExtraComplete?: boolean;
  /** Called with the answers once the form is complete. */
  onSubmit: (answers: Record<string, number>) => void | Promise<void>;
};

/**
 * Shared state for the Likert-style survey screens:
 * answers, "tried to submit" flag for validation messages, and a guarded submit.
 */
export function useSurveyForm({
  questions,
  isExtraComplete = true,
  onSubmit,
}: Options) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = useMemo(
    () => isExtraComplete && questions.every((q) => answers[q.id] != null),
    [isExtraComplete, questions, answers]
  );

  const setAnswer = (id: string, value: number) => {
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
      console.error('Survey submit failed', err);
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
