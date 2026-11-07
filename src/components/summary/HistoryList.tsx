import { useEffect, useRef } from 'react';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import type { HistoryEntry } from '~/types';

export type HistoryPanel = {
  entries: HistoryEntry[];
  activeId: number | null;
  onRestore: (entry: HistoryEntry) => void;
  showScore?: boolean;
};

type Props = HistoryPanel & {
  open: boolean;
};

/** All summary versions of the current task; click one to return to it. */
export function HistoryList({
  open,
  entries,
  activeId,
  onRestore,
  showScore,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Newest version is last: scroll to it when the list opens or a version is added.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, entries.length]);

  return (
    <Collapse in={open}>
      <Box
        ref={scrollRef}
        sx={{
          mt: 1,
          maxHeight: 320,
          overflowY: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
      >
        {entries.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            Noch keine Versionen.
          </Typography>
        ) : (
          <List disablePadding>
            {entries.map((entry, index) => (
              <ListItem key={entry.id} disablePadding>
                <ListItemButton
                  selected={entry.id === activeId}
                  onClick={() => onRestore(entry)}
                >
                  <ListItemText
                    primary={`Version ${index + 1}${showScore ? ` – ${Math.round(entry.score)} Punkte` : ''}`}
                    secondary={new Date(entry.id).toLocaleTimeString('de-DE')}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Collapse>
  );
}
