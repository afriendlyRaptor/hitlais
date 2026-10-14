import {
  Divider,
  Drawer,
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
};

type Props = HistoryPanel & {
  open: boolean;
  onClose: () => void;
};

const DRAWER_WIDTH = 280;

/** All summary versions of the current task; click one to return to it. */
export function HistoryDrawer({
  open,
  onClose,
  entries,
  activeId,
  onRestore,
}: Props) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Verlauf
      </Typography>
      <Divider />

      {entries.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Noch keine Versionen.
        </Typography>
      ) : (
        <List>
          {entries.map((entry, index) => (
            <ListItem key={entry.id} disablePadding>
              <ListItemButton
                selected={entry.id === activeId}
                onClick={() => onRestore(entry)}
              >
                <ListItemText
                  primary={`Version ${index + 1} – ${Math.round(entry.score)} Punkte`}
                  secondary={new Date(entry.id).toLocaleTimeString('de-DE')}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
}
