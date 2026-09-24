import { Link } from 'wouter';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@mui/material';
import { logAction } from '~/services';

export default function NotFound() {
  const handleGoBack = () => {
    logAction('not_found_go_back', { open: true });
    window.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-muted-foreground/20 text-9xl font-bold">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>

        <p className="text-muted-foreground mt-2">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            component={Link}
            href="/"
            variant="contained"
            onClick={() => logAction('not_found_go_home')}
            sx={{
              borderRadius: '999px',
              px: 4,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            Go home
          </Button>

          <Button
            variant="outlined"
            onClick={handleGoBack}
            sx={{
              borderRadius: '999px',
              px: 4,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
