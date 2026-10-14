import { Box, Typography } from '@mui/material';

type Props = {
  latestScore?: number;
};

export function ScoreDisplay({ latestScore }: Props) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        width: 90,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1 }}>
        {latestScore !== undefined ? Math.round(latestScore) : '--'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        / 100
      </Typography>
    </Box>
  );
}
