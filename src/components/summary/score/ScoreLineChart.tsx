import { Box, useTheme } from '@mui/material';
import { CartesianGrid, Line, LineChart, YAxis } from 'recharts';
import type { HistoryEntry } from '~/types';
import { HistoryDot } from './HistoryDot';

type DotProps = { cx?: number; cy?: number; payload?: HistoryEntry };

type Props = {
  history?: HistoryEntry[];
  activeId: number | null;
  onSelect: (entry: HistoryEntry) => void;
  width: number;
};

const CHART_HEIGHT = 72;
const POINT_SLOT = 16;
const CHART_PADDING = 16;
const MARGIN = { top: 12, right: 12, bottom: 12, left: 12 };

/** Keeps the line off the edges without ever leaving the 0-100 range. */
const paddedDomain: [(min: number) => number, (max: number) => number] = [
  (min) => Math.max(0, Math.floor(min - 5)),
  (max) => Math.min(100, Math.ceil(max + 5)),
];

export function ScoreLineChart({
  history = [],
  activeId,
  onSelect,
  width,
}: Props) {
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
          height: CHART_HEIGHT,
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

  const renderDot = ({ cx, cy, payload }: DotProps) =>
    cx === undefined || cy === undefined || !payload ? (
      <g key={payload?.id} />
    ) : (
      <HistoryDot
        key={payload.id}
        cx={cx}
        cy={cy}
        entry={payload}
        active={payload.id === activeId}
        onSelect={onSelect}
      />
    );

  return (
    <Box sx={{ width, flexShrink: 0, px: 2 }}>
      <LineChart
        width={chartWidth}
        height={CHART_HEIGHT}
        data={visible}
        margin={MARGIN}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke={theme.palette.divider}
        />
        <YAxis hide domain={paddedDomain} />
        <Line
          type="monotone"
          dataKey="score"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          strokeOpacity={0.5}
          dot={renderDot}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </Box>
  );
}
