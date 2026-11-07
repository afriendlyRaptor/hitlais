import { useState } from 'react';
import { Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { logAction } from '~/services';
import { HistoryList, type HistoryPanel } from './HistoryList';

/** Button below the summary that unfolds the version history beneath it. */
export function HistoryButton(history: HistoryPanel) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    logAction('history_drawer_toggled', { open: !open });
    setOpen((previous) => !previous);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="large"
        fullWidth
        startIcon={<HistoryIcon />}
        onClick={handleToggle}
        sx={{ mt: 2 }}
      >
        Verlauf
      </Button>

      <HistoryList open={open} {...history} />
    </>
  );
}
