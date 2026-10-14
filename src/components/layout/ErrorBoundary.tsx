import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoggedButton } from '~/components/common';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minHeight: 400,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
          }}
        >
          <WarningAmberIcon color="error" sx={{ fontSize: 32 }} />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, lineHeight: 1.4 }}
          >
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
        </Box>

        <LoggedButton
          logId="error_boundary_retry"
          variant="outlined"
          onClick={this.handleRetry}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Try again
        </LoggedButton>
      </Box>
    );
  }
}
