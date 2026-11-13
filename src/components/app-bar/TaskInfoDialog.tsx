import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { InstructionText } from '~/components/common';

export type TaskInfo = {
  description: string;
  instructions: string;
};

type Props = TaskInfo & {
  open: boolean;
  onClose: () => void;
};

/** Reminder of the current task, opened from the info icon in the app bar. */
export function TaskInfoDialog({ open, onClose, instructions }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Aufgabe</DialogTitle>

      <DialogContent>
        <InstructionText text={instructions} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}
