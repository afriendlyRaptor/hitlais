import { useEffect, useState } from 'react';

/**
 * True for `durationMs` after `value` changes to something truthy.
 * Handy for a short "flash" highlight when content updates.
 */
export function useRecentlyChanged(value: unknown, durationMs: number) {
  const [recentlyChanged, setRecentlyChanged] = useState(false);

  useEffect(() => {
    if (!value) {
      return;
    }

    setRecentlyChanged(true);

    const timer = setTimeout(() => {
      setRecentlyChanged(false);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [value, durationMs]);

  return recentlyChanged;
}
