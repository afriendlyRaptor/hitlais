import { Box, Typography } from '@mui/material';
import { useTaskCountdown } from '~/hooks';
import { formatClock } from '~/lib/time';

type TaskTimerProps = {
  seconds: number;
  onExpire?: () => void;
  redirectTo?: string;
};

const LOW_TIME_THRESHOLD_SECONDS = 30;

/** Floating countdown pill; turns red when little time is left. */
export function TaskTimer({ seconds, onExpire, redirectTo }: TaskTimerProps) {
  const remaining = useTaskCountdown({ seconds, onExpire, redirectTo });
  const isLow = remaining <= LOW_TIME_THRESHOLD_SECONDS;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 200,
        bottom: 27,
        zIndex: 1100,

        display: 'flex',
        alignItems: 'center',

        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: isLow ? 'error.main' : 'divider',
        borderRadius: '999px',

        px: 2,
        py: 1.25,

        boxShadow: 4,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          color: isLow ? 'error.main' : 'text.primary',
        }}
      >
        {formatClock(remaining)}
      </Typography>
    </Box>
  );
}
