// ~/components/ui/TaskTimer.tsx
import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'wouter';

type TaskTimerProps = {
  seconds: number;
  onExpire?: () => void;
  redirectTo?: string;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TaskTimer({ seconds, onExpire, redirectTo }: TaskTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [, navigate] = useLocation();
  const hasExpiredRef = useRef(false);

  // Reset if the configured duration changes (e.g. switching tasks)
  useEffect(() => {
    setRemaining(seconds);
    hasExpiredRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire?.();
        if (redirectTo) {
          navigate(redirectTo);
        }
      }
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, onExpire, redirectTo, navigate]);

  const isLow = remaining <= 30;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 70,
        right: 5,
        zIndex: (theme) => theme.zIndex.drawer + 10,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: isLow ? 'error.main' : 'divider',
        borderRadius: 2,
        px: 2,
        py: 0.75,
        boxShadow: 3,
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
        {formatTime(remaining)}
      </Typography>
    </Box>
  );
}
