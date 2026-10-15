import { useState } from 'react';
import { alpha, useTheme } from '@mui/material';
import type { HistoryEntry } from '~/types';

type Props = {
  cx: number;
  cy: number;
  entry: HistoryEntry;
  active: boolean;
  onSelect: (entry: HistoryEntry) => void;
};

/**
 * A clickable point of the score chart. The shown version is red with a halo;
 * other points grow on hover to signal they can be clicked.
 */
export function HistoryDot({ cx, cy, entry, active, onSelect }: Props) {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const color = active ? theme.palette.error.main : theme.palette.primary.main;
  const radius = active ? 6 : hovered ? 6 : 4;

  return (
    <g
      onClick={() => onSelect(entry)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <title>
        {active
          ? `${Math.round(entry.score)} Punkte (angezeigt)`
          : `${Math.round(entry.score)} Punkte – klicken, um zu dieser Version zurückzukehren`}
      </title>

      {/* larger invisible target, easier to hit */}
      <circle cx={cx} cy={cy} r={12} fill="transparent" />

      {(active || hovered) && (
        <circle cx={cx} cy={cy} r={10} fill={alpha(color, 0.2)} />
      )}

      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        stroke={theme.palette.background.paper}
        strokeWidth={2}
      />
    </g>
  );
}
