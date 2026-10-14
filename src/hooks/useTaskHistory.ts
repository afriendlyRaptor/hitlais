import { useCallback } from 'react';
import { storageKeys } from '~/config';
import {
  jsonArrayCodec,
  nullableNumberCodec,
  type StorageCodec,
} from '~/lib/storage';
import type { HistoryEntry } from '~/types';
import { usePersistedState } from './usePersistedState';

const entriesCodec: StorageCodec<HistoryEntry[]> = jsonArrayCodec();

/**
 * Every summary generated in a task, plus which one is currently shown.
 * The shown summary is always read from here, never regenerated.
 */
export function useTaskHistory(taskId: string) {
  const [entries, setEntries] = usePersistedState(
    storageKeys.history(taskId),
    entriesCodec
  );
  const [activeId, setActiveId] = usePersistedState(
    storageKeys.activeEntry(taskId),
    nullableNumberCodec
  );

  const active = entries.find((entry) => entry.id === activeId) ?? null;

  const push = useCallback(
    (entry: HistoryEntry) => {
      setEntries((previous) => [...previous, entry]);
      setActiveId(entry.id);
    },
    [setEntries, setActiveId]
  );

  return { entries, active, activeId, push, activate: setActiveId };
}
