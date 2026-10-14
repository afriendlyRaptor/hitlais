import { ROUTES } from '~/routes/paths';

export type NavItem = {
  name: string;
  /** Items without a path are plain labels. */
  path?: string;
};

export const getNavItems = (userId: string | null): NavItem[] => [
  userId
    ? { name: `ID: ${userId}` }
    : { name: 'Login', path: ROUTES.login },
];
