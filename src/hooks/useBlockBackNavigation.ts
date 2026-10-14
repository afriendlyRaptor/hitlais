import { useEffect } from 'react';

/** Swallows the browser's back button so earlier steps can't be revisited. */
export function useBlockBackNavigation() {
  useEffect(() => {
    const stay = () => window.history.pushState(null, '', window.location.href);

    stay();
    window.addEventListener('popstate', stay);

    return () => window.removeEventListener('popstate', stay);
  }, []);
}
