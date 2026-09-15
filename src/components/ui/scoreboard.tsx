// ScoreHistogram.tsx
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, Cell, YAxis } from 'recharts';

type ScoreEntry = {
  timestamp: number;
  score: number; // 0-100
};

type Props = {
  history?: ScoreEntry[];
  width: number; // px available for the whole panel
};

const BAR_SLOT = 14; // px per bar, including gap
const CHART_PADDING = 16;

export default function ScoreHistogram({ history = [], width }: Props) {
  const latest = history.length > 0 ? history[history.length - 1] : undefined;

  const chartWidth = Math.max(width - CHART_PADDING, 40);
  const barsVisible = Math.max(1, Math.floor(chartWidth / BAR_SLOT));

  const visible = history.slice(-barsVisible);

  return (
    <Box sx={{ width, flexShrink: 0, px: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Summary Score
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Typography variant="h4">
          {latest ? Math.round(latest.score) : '--'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          / 100
        </Typography>
      </Box>

      {visible.length > 0 ? (
        <BarChart
          width={chartWidth}
          height={60}
          data={visible}
          barCategoryGap={2}
        >
          <YAxis domain={[0, 100]} hide />
          <Bar dataKey="score" radius={[2, 2, 0, 0]} isAnimationActive={false}>
            {visible.map((entry, i) => {
              const prev = visible[i - 1]?.score;
              const isLast = i === visible.length - 1;
              const improved = prev !== undefined && entry.score >= prev;

              const color = isLast
                ? '#1976d2'
                : prev === undefined
                  ? '#9c27b0'
                  : improved
                    ? '#2e7d32'
                    : '#d32f2f';

              return <Cell key={entry.timestamp} fill={color} />;
            })}
          </Bar>
        </BarChart>
      ) : (
        <Box
          sx={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            No scores yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}
