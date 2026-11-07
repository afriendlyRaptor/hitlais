import { Box, Typography } from '@mui/material';
import { useElementWidth } from '~/hooks';
import type { HistoryEntry } from '~/types';
import { ScoreDisplay } from './ScoreDisplay';
import { ScoreLineChart } from './ScoreLineChart';

type Props = {
  history: HistoryEntry[];
  activeId: number | null;
  onSelect: (entry: HistoryEntry) => void;
};

/** Panel below the history button: clickable score trend and the shown score. */
export function ScoreDisplayPanel({ history, activeId, onSelect }: Props) {
  const shown = history.find((entry) => entry.id === activeId);

  // The chart fills the free width and shows as many recent versions as fit.
  const { ref, width: chartWidth } = useElementWidth<HTMLDivElement>();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,

        mt: 2,
        px: 2,
        py: 1.5,

        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,

        backgroundColor: 'background.paper',
        boxShadow: 4,
        boxSizing: 'border-box',
      }}
    >
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          gap: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '0.7rem', lineHeight: 1 }}
          >
            Punkt anklicken, um die Version zu laden.
          </Typography>

          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1 }}
          >
            Score:
          </Typography>
        </Box>

        <ScoreLineChart
          history={history}
          activeId={activeId}
          onSelect={onSelect}
          width={chartWidth}
        />
      </Box>

      <ScoreDisplay score={shown?.score} />
    </Box>
  );
}
