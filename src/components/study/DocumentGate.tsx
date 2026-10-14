import { type ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LoggedButton } from '~/components/common';

type Props = {
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  children: ReactNode;
};

/** Shows a spinner while loading and an error with retry if loading failed. */
export function DocumentGate({ isLoading, error, onRetry, children }: Props) {
  if (isLoading) {
    return (
      <Box sx={centeredSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ ...centeredSx, flexDirection: 'column', gap: 2 }}>
        <Typography color="error">
          Das Dokument konnte nicht geladen werden.
        </Typography>
        <LoggedButton
          logId="document_retry"
          variant="outlined"
          onClick={onRetry}
        >
          Erneut versuchen
        </LoggedButton>
      </Box>
    );
  }

  return <>{children}</>;
}

const centeredSx = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 300,
} as const;
