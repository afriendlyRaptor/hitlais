import { useMemo, type ReactNode } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './theme-provider';
import { lightTheme, darkTheme } from './theme';

interface MuiThemeBridgeProps {
  children: ReactNode;
}

/**
 * This reads `resolvedTheme` from our ThemeProvider and feeds it into
 * MUI's `createTheme`, so both systems switch together.
 */

export function MuiThemeBridge({ children }: MuiThemeBridgeProps) {
  const { resolvedTheme } = useTheme();
  const muiTheme = useMemo(
    () => (resolvedTheme === 'dark' ? darkTheme : lightTheme),
    [resolvedTheme]
  );
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
