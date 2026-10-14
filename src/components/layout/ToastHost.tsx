import { useSyncExternalStore } from 'react';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { Alertify, toastStore, type ToastPosition } from '~/services';

const TOAST_DURATION_MS = 4000;

function toAnchorOrigin(position: ToastPosition) {
  const [vertical, horizontal] = position.split('-') as [
    'top' | 'bottom',
    'left' | 'center' | 'right',
  ];

  return { vertical, horizontal };
}

/** Renders the toast managed by `Alertify` (see services/alertify-services.ts). */
export function ToastHost() {
  const toast = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot
  );

  if (!toast) {
    return null;
  }

  const isLoading = toast.severity === 'loading';

  return (
    <Snackbar
      key={toast.id}
      open
      anchorOrigin={toAnchorOrigin(toast.position)}
      autoHideDuration={isLoading ? null : TOAST_DURATION_MS}
      onClose={(_event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        Alertify.dismiss(toast.id);
      }}
    >
      <Alert
        variant="outlined"
        severity={isLoading ? 'info' : toast.severity}
        icon={isLoading ? <CircularProgress size={20} /> : undefined}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderColor: 'divider',
          boxShadow: 4,
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
