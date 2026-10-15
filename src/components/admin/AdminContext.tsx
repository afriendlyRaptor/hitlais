import { createContext, useContext } from 'react';

export type AdminControls = {
  isAdmin: boolean;
  /** Returns true if the password was correct. */
  unlock: (password: string) => boolean;
  lock: () => void;
  /** Labels of all study steps, in order. */
  steps: string[];
  currentIndex: number;
  jumpTo: (index: number) => void;
};

const AdminContext = createContext<AdminControls | null>(null);

export const AdminProvider = AdminContext.Provider;

/** Null outside the study, where there is nothing to administer. */
export const useAdmin = () => useContext(AdminContext);
