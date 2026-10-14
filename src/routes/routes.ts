import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { ROUTES } from './paths';

// Lazy-loaded screens
const Summarizer = lazy(() => import('~/screens/summarizer'));
const NotFound = lazy(() => import('~/screens/not-found'));
const About = lazy(() => import('~/screens/about'));
const Login = lazy(() => import('~/screens/user-login'));
const Survey1 = lazy(() => import('~/screens/likert-survey'));
const Survey2 = lazy(() => import('~/screens/summary-comparison'));

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
  { path: ROUTES.summarizer, component: Summarizer, title: 'Home' },
  { path: ROUTES.about, component: About, title: 'About' },
  { path: ROUTES.login, component: Login, title: 'User Login' },
  { path: ROUTES.survey1, component: Survey1, title: 'Survey' },
  { path: ROUTES.survey2, component: Survey2, title: 'Comparison' },
  { path: '*', component: NotFound, title: 'Not Found' },
];

/**
 * Get route by path
 */
export function getRouteByPath(path: string): RouteConfig | undefined {
  return routes.find((route) => route.path === path);
}
