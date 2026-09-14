import { type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { MuiThemeBridge } from './mui-theme-bridge';
import { RootLayout, ErrorBoundary } from '~/components/layout';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application providers composition
 * Wraps the app with all necessary context providers
 *
 * Order matters! Providers at the top are available to all children.
 * Add new providers here when needed (e.g., Redux, Auth, etc.)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <MuiThemeBridge>
          <RootLayout>{children}</RootLayout>
        </MuiThemeBridge>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export { ThemeProvider, useTheme } from './theme-provider';
