import { type ReactNode } from 'react';
import { RootLayout, ErrorBoundary } from '~/components/layout';
import { AppThemeProvider } from './AppThemeProvider';

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
    <AppThemeProvider>
      <ErrorBoundary>
        <RootLayout>{children}</RootLayout>
      </ErrorBoundary>
    </AppThemeProvider>
  );
}
