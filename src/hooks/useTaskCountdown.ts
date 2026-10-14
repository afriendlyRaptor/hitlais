import { useEffect, useRef, useState } from 'react';
import { logAction } from '~/services';

type Options = {
  seconds: number;
  onExpire: () => void;
};

/**
 * Counts down from `seconds` to 0 and returns the remaining seconds.
 * Logs start/expiry and calls `onExpire` once when time is up.
 */
export function useTaskCountdown({ seconds, onExpire }: Options) {
  const [remaining, setRemaining] = useState(seconds);
  const hasExpiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  // (Re)start when the configured duration changes.
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
        onExpireRef.current();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setRemaining((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [remaining, seconds]);

  return remaining;
}
