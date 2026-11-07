import { useState } from 'react';
import { Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { logAction } from '~/services';
import type { HistoryEntry } from '~/types';
import { HistoryDrawer, type HistoryPanel } from './HistoryDrawer';

/** Button below the summary that opens the version history. */
export function HistoryButton({
  entries,
  activeId,
  onRestore,
  showScore,
}: HistoryPanel) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    logAction('history_drawer_toggled', { open: !open });
    setOpen((previous) => !previous);
  };

  const handleRestore = (entry: HistoryEntry) => {
    onRestore(entry);
    setOpen(false);
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

      <HistoryDrawer
        open={open}
        onClose={handleToggle}
        entries={entries}
        activeId={activeId}
        onRestore={handleRestore}
        showScore={showScore}
      />
    </>
  );
}
