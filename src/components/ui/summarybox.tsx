import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useSearch } from 'wouter';

import { logAction } from '~/services';
import { getNextTaskId } from '~/config';

type SummaryProps = {
  summary: string;
  isLoading: boolean;
};

export default function SummaryBox({ summary, isLoading }: SummaryProps) {
  const [, navigate] = useLocation();
  const search = useSearch();

  const taskId = new URLSearchParams(search).get('task');

  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasSummary = Boolean(summary.trim());

  const handleSubmit = () => {
    if (!hasSummary) {
      return;
    }

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

    const nextTaskId = getNextTaskId(taskId);

    if (nextTaskId) {
      navigate(`/home?task=${nextTaskId}`);
    }
  };

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">Summary</Typography>

        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            p: 2,
            minHeight: 300,
            mt: 1,
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          {isLoading ? (
            <Typography color="text.secondary">
              Generating summary...
            </Typography>
          ) : (
            <Typography
              color={summary ? 'text.primary' : 'text.secondary'}
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {summary || 'Your summary will appear here...'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Floating submit button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={!hasSummary || isLoading}
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 1100,

          minWidth: 160,
          px: 4,
          py: 1.75,

          borderRadius: '999px',
          boxShadow: 4,

          fontSize: '1.05rem',
          fontWeight: 600,
          textTransform: 'none',
        }}
      >
        Next
      </Button>

      <Dialog
        open={confirmOpen}
        onClose={handleCancel}
        aria-labelledby="submit-dialog-title"
        aria-describedby="submit-dialog-description"
      >
        <DialogTitle id="submit-dialog-title">Submit</DialogTitle>

        <DialogContent>
          <DialogContentText id="submit-dialog-description">
            Are you satisfied with the summary? You will not be able to make any
            changes after submitting.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>

          <Button onClick={handleConfirm} variant="contained" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
