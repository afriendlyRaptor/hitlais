import { ROUTES } from '~/routes/paths';

export type NavItem = {
  name: string;
  /** Link target. Items with `onClick` act as buttons, others as plain labels. */
  path?: string;
  onClick?: () => void;
};

type Options = {
  isAdmin: boolean;
  /** Makes the ID clickable (admin entry). */
  onIdClick?: () => void;
};

export const getNavItems = (
  userId: string | null,
  { isAdmin, onIdClick }: Options
): NavItem[] => [
  userId
    ? {
        name: `ID: ${userId}${isAdmin ? ' · Admin' : ''}`,
        onClick: onIdClick,
      }
    : { name: 'Login', path: ROUTES.login },
];
