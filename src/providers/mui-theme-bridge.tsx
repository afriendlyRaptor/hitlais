import { useMemo, type ReactNode } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './theme-provider';

interface MuiThemeBridgeProps {
  children: ReactNode;
}

/**
 * MUI components (Box, Typography, AppBar, ...) have their own theming
 * system, entirely separate from our Tailwind/shadcn CSS variables.
 * This reads `resolvedTheme` from our ThemeProvider and feeds it into
 * MUI's `createTheme`, so both systems switch together.
 */
export function MuiThemeBridge({ children }: MuiThemeBridgeProps) {
  const { resolvedTheme } = useTheme();

  const muiTheme = useMemo(
    () => createTheme({ palette: { mode: resolvedTheme } }),
    [resolvedTheme]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
