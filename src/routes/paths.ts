/**
 * Single source of truth for URL paths.
 * Kept free of imports so any module can use it without creating cycles.
 */
export const ROUTES = {
  root: '/',
  login: '/login',
  study: '/study',
  about: '/about',
} as const;
