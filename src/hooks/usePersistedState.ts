import { useCallback, useEffect, useState } from 'react';
import type { StorageCodec } from '~/lib/storage';

function load<T>(key: string, codec: StorageCodec<T>): T {
  return codec.parse(localStorage.getItem(key));
}

/**
 * useState that mirrors its value into localStorage under `key`.
 *
 * - The initial value is read from storage.
 * - When `key` changes (e.g. the participant moves to another task) the value
 *   stored under the new key is loaded, and the old value is never written
 *   under the new key.
 *
 * Pass a module-level `codec` (see lib/storage.ts) so its identity is stable.
 */
export function usePersistedState<T>(key: string, codec: StorageCodec<T>) {
  const [entry, setEntry] = useState(() => ({ key, value: load(key, codec) }));

  // Adjust state while rendering when the key changed:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  let current = entry;

  if (entry.key !== key) {
    current = { key, value: load(key, codec) };
    setEntry(current);
  }

  useEffect(() => {
    localStorage.setItem(current.key, codec.stringify(current.value));
  }, [codec, current.key, current.value]);

  const setValue = useCallback((next: T | ((previous: T) => T)) => {
    setEntry((previous) => ({
      key: previous.key,
      value:
        typeof next === 'function'
          ? (next as (previous: T) => T)(previous.value)
          : next,
    }));
  }, []);

  return [current.value, setValue] as const;
}
