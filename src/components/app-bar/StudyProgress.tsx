import { createContext, Fragment, useContext } from 'react';
import { Box, Tooltip } from '@mui/material';
import { STUDY_BLOCKS, COMPARISON, studyTasks } from '~/config';

type Progress = {
  /** Task id (also on its instruction screen), or the comparison questionnaire id. */
  currentStep?: string;
  /** True while the questionnaire that follows `currentStep` is shown. */
  inQuestionnaire?: boolean;
};

/** Provided by StudyFlow, read by the app bar on every step. */
export const StudyProgressContext = createContext<Progress>({});

const QUESTIONNAIRE_TIME_SECONDS = 120;

export function StudyProgress() {
  const { currentStep, inQuestionnaire = false } =
    useContext(StudyProgressContext);

  const steps = STUDY_BLOCKS.flatMap((block) => [
    {
      id: block.taskId,
      label: `Task ${block.taskId}`,
      duration: studyTasks[block.taskId]?.timeLimitSeconds ?? 300,
    },
    {
      id: block.questionnaireId,
      label: 'Questionnaire',
      duration: QUESTIONNAIRE_TIME_SECONDS,
    },
  ]);

  steps.push({
    id: COMPARISON.questionnaireId,
    label: 'Final comparison',
    duration: QUESTIONNAIRE_TIME_SECONDS,
  });

  const stepIndex = steps.findIndex((step) => step.id === currentStep);
  const currentIndex =
    stepIndex >= 0 && inQuestionnaire ? stepIndex + 1 : stepIndex;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 'min(40vw, 560px)',
      }}
    >
      {steps.map((step, index) => {
        const completed = currentIndex >= index;

        return (
          <Fragment key={`${step.id}-${index}`}>
            <Tooltip title={step.label}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  flexShrink: 0,
                  borderRadius: '50%',
                  bgcolor: completed ? 'white' : 'transparent',
                  border: '2px solid',
                  borderColor: completed ? 'white' : 'rgba(255,255,255,0.5)',
                  boxSizing: 'border-box',
                  cursor: 'default',
                }}
              />
            </Tooltip>

            {index < steps.length - 1 && (
              <Tooltip title={`~${Math.ceil(step.duration / 60)} min`}>
                <Box
                  sx={{
                    flex: `${step.duration} 1 0`,
                    minWidth: 12,
                    height: 3,
                    mx: 0.5,
                    borderRadius: 2,
                    bgcolor:
                      index < currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                    cursor: 'default',
                  }}
                />
              </Tooltip>
            )}
          </Fragment>
        );
      })}
    </Box>
  );
}
