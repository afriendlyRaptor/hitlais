import { useState } from 'react';
import { Button } from '@mui/material';
import { useLocation } from 'wouter';
import { ConfirmDialog, largePillSx } from '~/components/common';
import { useStudyTask } from '~/hooks';
import { summarizerPath } from '~/routes/paths';
import { logAction } from '~/services';

type Props = {
  disabled?: boolean;
};

/** Floating "Next" button: asks for confirmation, then moves on to the next task. */
export function NextTaskButton({ disabled = false }: Props) {
  const [, navigate] = useLocation();
  const { nextTaskId } = useStudyTask();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    setConfirmOpen(true);
    logAction('submit_dialog', { open: true });
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    logAction('submit_dialog_cancel', { open: false });
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    logAction('submit_dialog_confirm', { open: false });

    if (nextTaskId) {
      navigate(summarizerPath(nextTaskId));
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={disabled}
        sx={{
          ...largePillSx,
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 1100,
        }}
      >
        Next
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        id="submit-dialog"
        title="Submit"
        description="Are you satisfied with the summary? You will not be able to make any changes after submitting."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
