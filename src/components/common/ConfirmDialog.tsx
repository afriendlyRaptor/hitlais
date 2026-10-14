import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  /** Prefix for the aria ids: `${id}-title` / `${id}-description`. */
  id: string;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  id,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Submit',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <DialogTitle id={`${id}-title`}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id={`${id}-description`}>
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>

        <Button onClick={onConfirm} variant="contained" autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
