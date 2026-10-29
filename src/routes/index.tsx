import { Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { routes } from './routes';
import { RouteLoading } from './RouteLoading';

/**
 * Application router using Wouter
 * - Lightweight (2KB) alternative to React Router
 * - Supports lazy loading with React.Suspense
 * - Simple API with <Route> and <Switch>
 */
export function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<RouteLoading />}>
        <Switch>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path}>
              <Component />
            </Route>
          ))}
        </Switch>
      </Suspense>
    </Router>
  );
}

export { routes } from './routes';
export { ROUTES } from './paths';
