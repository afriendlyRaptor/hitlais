import { useCallback } from 'react';
import { ADMIN_PASSWORD, storageKeys } from '~/config';
import { booleanCodec } from '~/lib/storage';
import { logAction } from '~/services';
import { usePersistedState } from './usePersistedState';

/** Password-gated admin flag, remembered in localStorage. */
export function useAdminMode() {
  const [isAdmin, setIsAdmin] = usePersistedState(
    storageKeys.admin,
    booleanCodec
  );

  const unlock = useCallback(
    (password: string) => {
      const correct = password === ADMIN_PASSWORD;

      if (correct) {
        setIsAdmin(true);
        logAction('admin_unlocked');
      }

      return correct;
    },
    [setIsAdmin]
  );

  const lock = useCallback(() => setIsAdmin(false), [setIsAdmin]);

  return { isAdmin, unlock, lock };
}
