import { useCallback } from 'react';
import { storageKeys } from '~/config';
import { numberCodec } from '~/lib/storage';
import { usePersistedState } from './usePersistedState';

/**
 * Index of the current study step, kept in localStorage so a reload resumes
 * where the participant was. `advance` only ever moves forward.
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

  return [Math.min(index, stepCount), advance] as const;
}
