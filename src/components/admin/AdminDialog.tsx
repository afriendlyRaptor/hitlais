import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import { useAdmin } from './AdminContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Password prompt; once unlocked, a list of steps to jump to. */
export function AdminDialog({ open, onClose }: Props) {
  const admin = useAdmin();
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);

  if (!admin) {
    return null;
  }

  const handleUnlock = (event: FormEvent) => {
    event.preventDefault();
    setFailed(!admin.unlock(password));
    setPassword('');
  };

  if (!admin.isAdmin) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleUnlock}>
          <DialogTitle>Admin</DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              type="password"
              label="Passwort"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={failed}
              helperText={failed ? 'Falsches Passwort' : ' '}
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Abbrechen</Button>
            <Button type="submit" variant="contained">
              Entsperren
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Admin: Schritt wählen</DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <List disablePadding>
          {admin.steps.map((label, index) => (
            <ListItemButton
              key={index}
              selected={index === admin.currentIndex}
              onClick={() => {
                admin.jumpTo(index);
                onClose();
              }}
            >
              <ListItemText primary={`${index + 1}. ${label}`} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            admin.lock();
            onClose();
          }}
        >
          Sperren
        </Button>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}
