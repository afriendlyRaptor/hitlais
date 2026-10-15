import { useCallback } from 'react';
import { storageKeys } from '~/config';
import { numberCodec } from '~/lib/storage';
import { usePersistedState } from './usePersistedState';

/**
 * Index of the current study step, kept in localStorage so a reload resumes
 * where the participant was. Participants only `advance`; `jumpTo` is for admins.
 */
export function useStudyProgress(stepCount: number) {
  const [index, setIndex] = usePersistedState(
    storageKeys.progress,
    numberCodec
  );

  const advance = useCallback(
    () => setIndex((previous) => Math.min(previous + 1, stepCount)),
    [setIndex, stepCount]
  );

  const jumpTo = useCallback(
    (target: number) => setIndex(Math.max(0, Math.min(target, stepCount))),
    [setIndex, stepCount]
  );

  return { index: Math.min(index, stepCount), advance, jumpTo };
}
