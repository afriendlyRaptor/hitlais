import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useBlockBackNavigation, useStudyProgress } from '~/hooks';
import { buildStudyPlan, stepId } from '~/lib/studyPlan';
import { logAction, setLogContext } from '~/services';
import { FinishedStep } from './steps/FinishedStep';
import { InstructionsStep } from './steps/InstructionsStep';
import { QuestionnaireStep } from './steps/QuestionnaireStep';
import { ComparisonStep } from './steps/comparison/ComparisonStep';
import { TaskStep } from './steps/task/TaskStep';

type Props = {
  userId: string;
};

/** Walks the participant through the study plan, one step at a time. */
export function StudyFlow({ userId }: Props) {
  const plan = useMemo(() => buildStudyPlan(userId), [userId]);
  const [stepIndex, advance] = useStudyProgress(plan.steps.length);
  const step = plan.steps[stepIndex];

  useBlockBackNavigation();

  // Layout effect: runs before the new step's own effects log anything.
  useLayoutEffect(() => {
    setLogContext({
      step: step ? stepId(step) : 'finished',
      taskId: step?.taskId ?? null,
      documentId: step ? plan.documentIds[step.taskId] : null,
    });
  }, [step, plan]);

  useEffect(() => {
    if (stepIndex === 0) {
      logAction('study_plan', {
        steps: plan.steps.map(stepId),
        document_ids: plan.documentIds,
      });
    }
    logAction('step_entered', { index: stepIndex });
  }, [stepIndex, plan]);

  if (!step) {
    return <FinishedStep />;
  }

  const documentId = plan.documentIds[step.taskId];

  switch (step.kind) {
    case 'instructions':
      return (
        <InstructionsStep
          key={stepIndex}
          taskId={step.taskId}
          onContinue={advance}
        />
      );
    case 'task':
      return (
        <TaskStep
          key={stepIndex}
          taskId={step.taskId}
          documentId={documentId}
          onFinish={advance}
        />
      );
    case 'questionnaire':
      return (
        <QuestionnaireStep
          key={stepIndex}
          questionnaireId={step.questionnaireId}
          onFinish={advance}
        />
      );
    case 'comparison':
      return (
        <ComparisonStep
          key={stepIndex}
          userId={userId}
          documentId={documentId}
          onFinish={advance}
        />
      );
  }
}
