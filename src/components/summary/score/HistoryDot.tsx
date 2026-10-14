import { useTheme } from '@mui/material';
import type { HistoryEntry } from '~/types';

type Props = {
  cx: number;
  cy: number;
  entry: HistoryEntry;
  active: boolean;
  onSelect: (entry: HistoryEntry) => void;
};

/** A clickable point of the score chart; click to return to that version. */
export function HistoryDot({ cx, cy, entry, active, onSelect }: Props) {
  const theme = useTheme();

  return (
    <g onClick={() => onSelect(entry)} style={{ cursor: 'pointer' }}>
      <title>{`${Math.round(entry.score)} Punkte – zu dieser Version zurückkehren`}</title>
      {/* larger invisible target, easier to hit */}
      <circle cx={cx} cy={cy} r={10} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={active ? 5 : 3}
        fill={theme.palette.primary.main}
        stroke={active ? theme.palette.background.paper : 'none'}
        strokeWidth={active ? 2 : 0}
      />
    </g>
  );
}
