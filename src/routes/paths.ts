/**
 * Single source of truth for URL paths.
 * Kept free of imports so any module can use it without creating cycles.
 */
export const ROUTES = {
  root: '/',
  login: '/login',
  summarizer: '/summarizer',
  about: '/about',
  survey1: '/survey1',
  survey2: '/survey2',
} as const;

export const summarizerPath = (taskId: string) =>
  `${ROUTES.summarizer}?task=${taskId}`;
