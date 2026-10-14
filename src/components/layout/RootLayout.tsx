import { type ReactNode } from 'react';
import { Box } from '@mui/material';
import { ToastHost } from './ToastHost';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <Box
        component="main"
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>

      <ToastHost />
    </Box>
  );
}
