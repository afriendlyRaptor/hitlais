import { useEffect, useState } from 'react';
import { getUserId, USER_ID_CHANGED_EVENT } from '~/services';

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(() => getUserId());

  useEffect(() => {
    const handleUserIdChange = () => {
      setUserId(getUserId());
    };

    window.addEventListener(USER_ID_CHANGED_EVENT, handleUserIdChange);

    return () => {
      window.removeEventListener(USER_ID_CHANGED_EVENT, handleUserIdChange);
    };
  }, []);

  return userId;
}
