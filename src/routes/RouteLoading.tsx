import { Box, Skeleton } from '@mui/material';

/** Suspense fallback shown while a lazy route is loading. */
export function RouteLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="rounded" width={128} height={16} />
      </Box>
    </Box>
  );
}
