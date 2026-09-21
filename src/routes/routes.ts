import { lazy } from 'react';

// Lazy-loaded screens
const Home = lazy(() => import('~/screens/home'));
const NotFound = lazy(() => import('~/screens/not-found'));
const About = lazy(() => import('~/screens/about'));
const Login = lazy(() => import('~/screens/user-login'));
const Survey = lazy(() => import('~/screens/likert-survey'));

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
    component: Login,
    title: 'User Login',
  },
  {
    path: '/home',
    component: Home,
    title: 'Home',
  },

  {
    path: '/about',
    component: About,
    title: 'About',
  },

  {
    path: '/login',
    component: Login,
    title: 'User Login',
  },

  {
    path: '/survey',
    component: Survey,
    title: 'Survey',
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
