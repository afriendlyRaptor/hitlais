import { Box, Typography } from '@mui/material';
import type { HistoryEntry } from '~/types';
import { ScoreDisplay } from './ScoreDisplay';
import { ScoreLineChart } from './ScoreLineChart';

type Props = {
  history: HistoryEntry[];
  activeId: number | null;
  onSelect: (entry: HistoryEntry) => void;
};

const CHART_WIDTH = 220;
const MAX_VISIBLE_POINTS = 5;

/** Floating panel (bottom centre): clickable score trend and the shown score. */
export function ScoreDisplayPanel({ history, activeId, onSelect }: Props) {
  const shown = history.find((entry) => entry.id === activeId);

  // Only show the five most recent versions.
  const visibleHistory = history.slice(-MAX_VISIBLE_POINTS);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,

        display: 'flex',
        alignItems: 'center',
        gap: 2,

        width: 'fit-content',
        maxWidth: 'calc(100vw - 40px)',

        px: 2,
        py: 1.5,

        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,

        backgroundColor: 'background.paper',
        boxShadow: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1 }}
          >
            Punkte:
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '0.7rem', lineHeight: 1 }}
          >
            Punkt anklicken, um die Version zu laden
          </Typography>
        </Box>

        <ScoreLineChart
          history={visibleHistory}
          activeId={activeId}
          onSelect={onSelect}
          width={CHART_WIDTH}
        />
      </Box>

      <ScoreDisplay score={shown?.score} />
    </Box>
  );
}
