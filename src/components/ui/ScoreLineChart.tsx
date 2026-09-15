// ScoreLineChart.tsx
import { Box, useTheme } from '@mui/material';
import { LineChart, Line } from 'recharts';

type ScoreEntry = {
  timestamp: number;
  score: number;
};

type Props = {
  history?: ScoreEntry[];
  width: number;
};

const POINT_SLOT = 16;
const CHART_PADDING = 16;

export default function ScoreLineChart({ history = [], width }: Props) {
  const theme = useTheme();

  const chartWidth = Math.max(width - CHART_PADDING, 40);
  const pointsVisible = Math.max(1, Math.floor(chartWidth / POINT_SLOT));

  const visible = history.slice(-pointsVisible);

  if (visible.length === 0) {
    return (
      <Box
        sx={{
          width,
          flexShrink: 0,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          No scores yet
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width, flexShrink: 0, px: 2 }}>
      <LineChart width={chartWidth} height={60} data={visible}>
        <Line
          type="monotone"
          dataKey="score"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{ r: 3, fill: theme.palette.primary.main }}
          isAnimationActive={false}
        />
      </LineChart>
    </Box>
  );
}
