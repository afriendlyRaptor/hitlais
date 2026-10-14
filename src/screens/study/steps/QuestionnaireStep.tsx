import {
  QuestionnaireItems,
  StepHeader,
  StepLayout,
  ValidationMessage,
} from '~/components/study';
import { getQuestionnaire } from '~/config';
import { useQuestionnaireForm } from '~/hooks';
import { logAction } from '~/services';

type Props = {
  questionnaireId: string;
  onFinish: () => void;
};

export function QuestionnaireStep({ questionnaireId, onFinish }: Props) {
  const { title, description, items } = getQuestionnaire(questionnaireId);

  const form = useQuestionnaireForm({
    items,
    onSubmit: (answers) => {
      logAction('questionnaire_submit', {
        questionnaire_id: questionnaireId,
        answers,
      });
      onFinish();
    },
  });

  return (
    <StepLayout onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting}>
      <StepHeader title={title} description={description} />

      <QuestionnaireItems
        items={items}
        answers={form.answers}
        onChange={form.setAnswer}
      />

      {form.submitAttempted && !form.isComplete && (
        <ValidationMessage>
          Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.
        </ValidationMessage>
      )}
    </StepLayout>
  );
}
