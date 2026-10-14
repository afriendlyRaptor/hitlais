import { ROUTES } from '~/routes/paths';

export type NavItem = {
  name: string;
  path: string;
};

export const getNavItems = (userId: string | null): NavItem[] => [
  // { name: 'Home', path: '/home' },
  // { name: 'About', path: '/about' },
  {
    name: userId ? `ID: ${userId}` : 'Login',
    path: ROUTES.login,
  },
];
