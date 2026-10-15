import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

export type TaskInfo = {
  description: string;
  instructions: string;
};

type Props = TaskInfo & {
  open: boolean;
  onClose: () => void;
};

/** Reminder of the current task, opened from the info icon in the app bar. */
export function TaskInfoDialog({
  open,
  onClose,
  description,
  instructions,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Aufgabe</DialogTitle>

      <DialogContent>
        <Typography
          sx={{ mb: 2, color: 'primary.main', fontWeight: 700, lineHeight: 1.7 }}
        >
          {description}
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
          {instructions}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}
