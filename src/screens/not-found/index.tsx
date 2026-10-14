import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'wouter';
import { pillSx } from '~/components/common';
import { ROUTES } from '~/routes/paths';
import { logAction } from '~/services';

const buttonSx = { ...pillSx, px: 4, py: 1.25 };

export default function NotFound() {
  const handleGoBack = () => {
    logAction('not_found_go_back', { open: true });
    window.history.back();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box
          component="h1"
          sx={{
            m: 0,
            fontSize: '8rem',
            fontWeight: 700,
            lineHeight: 1,
            color: 'text.secondary',
            opacity: 0.2,
          }}
        >
          404
        </Box>

        <Box
          component="h2"
          sx={{
            mt: 2,
            mb: 0,
            fontSize: '1.5rem',
            lineHeight: '2rem',
            fontWeight: 600,
          }}
        >
          Page not found
        </Box>

        <Box component="p" sx={{ mt: 1, mb: 0, color: 'text.secondary' }}>
          Sorry, we couldn't find the page you're looking for.
        </Box>

        <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: { sm: 'center' },
            gap: 2,
          }}
        >
          <Button
            component={Link}
            href={ROUTES.root}
            variant="contained"
            onClick={() => logAction('not_found_go_home')}
            sx={buttonSx}
          >
            <HomeIcon sx={{ mr: 1, fontSize: 16 }} />
            Go home
          </Button>

          <Button variant="outlined" onClick={handleGoBack} sx={buttonSx}>
            <ArrowBackIcon sx={{ mr: 1, fontSize: 16 }} />
            Go back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
