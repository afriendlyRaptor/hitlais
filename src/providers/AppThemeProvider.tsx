import { type ReactNode } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '~/theme';

interface AppThemeProviderProps {
  children: ReactNode;
}

/**
 * The one and only theme provider: picks the MUI light/dark theme from the
 * operating system's colour-scheme preference.
 */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });

  return (
    <ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
