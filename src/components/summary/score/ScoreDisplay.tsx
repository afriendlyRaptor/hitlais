import { Box, Typography } from '@mui/material';

type Props = {
  score?: number;
};

export function ScoreDisplay({ score }: Props) {
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
        {score !== undefined ? Math.round(score) : '--'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        / 100
      </Typography>
    </Box>
  );
}
