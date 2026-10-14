import { useLocation } from 'wouter';
import {
  LikertScale,
  SurveyHeader,
  SurveyLayout,
  ValidationMessage,
} from '~/components/survey';
import { useSurveyForm } from '~/hooks';
import { ROUTES } from '~/routes/paths';
import { logAction } from '~/services';
import { QUESTIONS } from './questions';

export default function Survey() {
  const [, navigate] = useLocation();

  const {
    answers,
    setAnswer,
    isComplete,
    submitAttempted,
    isSubmitting,
    handleSubmit,
  } = useSurveyForm({
    questions: QUESTIONS,
    onSubmit: (submittedAnswers) => {
      logAction('survey_submit', { answers: submittedAnswers });
      navigate(ROUTES.survey2); // or wherever "done" should go
    },
  });

  return (
    <SurveyLayout isSubmitting={isSubmitting} onSubmit={handleSubmit}>
      <SurveyHeader
        title="Quick survey"
        description="Please rate the following statements from 1 (strongly disagree) to 5 (strongly agree)."
      />

      {QUESTIONS.map((q) => (
        <LikertScale
          key={q.id}
          id={q.id}
          question={q.question}
          value={answers[q.id] ?? null}
          onChange={setAnswer}
        />
      ))}

      {submitAttempted && !isComplete && (
        <ValidationMessage>
          Please answer every question before submitting.
        </ValidationMessage>
      )}
    </SurveyLayout>
  );
}
