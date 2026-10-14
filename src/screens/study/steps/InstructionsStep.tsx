import { Typography } from '@mui/material';
import { StepHeader, StepLayout } from '~/components/study';
import { getStudyTask } from '~/config';

type Props = {
  taskId: string;
  onContinue: () => void;
};

export function InstructionsStep({ taskId, onContinue }: Props) {
  const { instructions, timeLimitSeconds } = getStudyTask(taskId);

  return (
    <StepLayout onSubmit={onContinue}>
      <StepHeader title="Anleitung" />

      <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
        {instructions}
      </Typography>

      {timeLimitSeconds != null && (
        <Typography sx={{ mt: 3, fontWeight: 600 }}>
          Zeitlimit: {Math.round(timeLimitSeconds / 60)} Minuten
        </Typography>
      )}
    </StepLayout>
  );
}
