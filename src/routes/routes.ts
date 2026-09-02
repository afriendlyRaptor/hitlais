import { lazy } from 'react';

// Lazy-loaded screens
const Home = lazy(() => import('~/screens/home'));
const NotFound = lazy(() => import('~/screens/not-found'));
const About = lazy(() => import('~/screens/about'));

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  title: string;
  isPrivate?: boolean;
}

/**
 * Application routes configuration
 * Add new routes here - they'll automatically be registered in the router
 */
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Home,
    title: 'Home',
  },
  {
    path: '/about',
    component: About,
    title: 'About',
  },

  {
    path: '*',
    component: NotFound,
    title: 'Not Found',
  },
];

/**
 * Get route by path
 */
export function getRouteByPath(path: string): RouteConfig | undefined {
  return routes.find((route) => route.path === path);
}
