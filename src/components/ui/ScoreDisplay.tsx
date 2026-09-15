// ScoreDisplay.tsx
import { Box, Typography } from '@mui/material';

type Props = {
  latestScore?: number;
  boxHeight: number;
};

export default function ScoreDisplay({ latestScore, boxHeight }: Props) {
  // scale font a little with the panel's height, clamped to a sane range
  const fontSize = Math.min(Math.max(boxHeight / 4, 24), 48);

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
      <Typography sx={{ fontSize, fontWeight: 600, lineHeight: 1 }}>
        {latestScore !== undefined ? Math.round(latestScore) : '--'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        / 100
      </Typography>
    </Box>
  );
}
