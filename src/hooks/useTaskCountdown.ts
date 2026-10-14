import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { logAction } from '~/services';

type Options = {
  seconds: number;
  onExpire?: () => void;
  redirectTo?: string;
};

/**
 * Counts down from `seconds` to 0 and returns the remaining seconds.
 * Logs start/expiry; on expiry calls `onExpire` and navigates to `redirectTo`.
 */
export function useTaskCountdown({ seconds, onExpire, redirectTo }: Options) {
  const [remaining, setRemaining] = useState(seconds);
  const [, navigate] = useLocation();
  const hasExpiredRef = useRef(false);

  // (Re)start when the configured duration changes (e.g. switching tasks).
  useEffect(() => {
    setRemaining(seconds);
    hasExpiredRef.current = false;
    logAction('task_timer_start', { seconds });
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        logAction('task_timer_expired', { seconds });
        onExpire?.();
        if (redirectTo) {
          navigate(redirectTo);
        }
      }
      return;
    }

    const timeout = setTimeout(() => {
      setRemaining((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [remaining, seconds, onExpire, redirectTo, navigate]);

  return remaining;
}
