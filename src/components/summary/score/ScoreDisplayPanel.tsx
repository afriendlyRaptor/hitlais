import { Box, Typography } from '@mui/material';
import type { ScoreEntry } from '~/types';
import { ScoreDisplay } from './ScoreDisplay';
import { ScoreLineChart } from './ScoreLineChart';

type Props = {
  scoreHistory?: ScoreEntry[];
  scoreDisplayEnabled?: boolean;
};

const CHART_WIDTH = 220;
const MAX_VISIBLE_POINTS = 5;

/** Floating panel (bottom centre) with the score trend and the latest score. */
export function ScoreDisplayPanel({
  scoreHistory = [],
  scoreDisplayEnabled = true,
}: Props) {
  if (!scoreDisplayEnabled) {
    return null;
  }

  const latestScore =
    scoreHistory.length > 0
      ? scoreHistory[scoreHistory.length - 1].score
      : undefined;

  // Only show the five most recent scores.
  const visibleScoreHistory = scoreHistory.slice(-MAX_VISIBLE_POINTS);

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
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            lineHeight: 1,
          }}
        >
          Punkte:
        </Typography>

        <ScoreLineChart history={visibleScoreHistory} width={CHART_WIDTH} />
      </Box>

      <ScoreDisplay latestScore={latestScore} />
    </Box>
  );
}
