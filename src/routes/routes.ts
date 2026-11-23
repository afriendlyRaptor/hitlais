import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { ROUTES } from './paths';

// Lazy-loaded screens
const Study = lazy(() => import('~/screens/study'));
const NotFound = lazy(() => import('~/screens/not-found'));
const About = lazy(() => import('~/screens/about'));
const Login = lazy(() => import('~/screens/user-login'));

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType>;
  title: string;
  isPrivate?: boolean;
}

/**
 * Application routes configuration
 * Add new routes here - they'll automatically be registered in the router
 */
export const routes: RouteConfig[] = [
  { path: ROUTES.root, component: Login, title: 'User Login' },
  { path: ROUTES.study, component: Study, title: 'Study' },
  { path: ROUTES.about, component: About, title: 'About' },
  { path: ROUTES.login, component: Login, title: 'User Login' },
  { path: '*', component: NotFound, title: 'Not Found' },
];

/**
 * Get route by path
 */
export function getRouteByPath(path: string): RouteConfig | undefined {
  return routes.find((route) => route.path === path);
}
