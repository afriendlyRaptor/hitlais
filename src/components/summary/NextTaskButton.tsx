import { useState } from 'react';
import { Button } from '@mui/material';
import { ConfirmDialog, largePillSx } from '~/components/common';
import { logAction } from '~/services';

type Props = {
  disabled?: boolean;
  onConfirm: () => void;
};

/** Floating "Next" button: asks for confirmation, then calls `onConfirm`. */
export function NextTaskButton({ disabled = false, onConfirm }: Props) {
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
    onConfirm();
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
        Weiter
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        id="submit-dialog"
        title="Einreichen"
        description="Sind Sie mit der Zusammenfassung zufrieden? Nach dem Einreichen können Sie keine Änderungen mehr vornehmen."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
