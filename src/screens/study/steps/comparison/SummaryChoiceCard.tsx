import { FormControlLabel, Paper, Radio, Typography } from '@mui/material';
import type { ComparisonOption } from '~/lib/comparison';

type Props = {
  option: ComparisonOption;
  selected: boolean;
};

/** One selectable summary. Must be rendered inside a RadioGroup. */
export function SummaryChoiceCard({ option, selected }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        borderColor: selected ? 'primary.main' : 'divider',
        borderWidth: selected ? 2 : 1,
        transition: 'border-color 0.2s',
        height: '100%',
      }}
    >
      <FormControlLabel
        value={option.position}
        control={<Radio />}
        label={
          <Typography sx={{ fontWeight: 600 }}>
            Zusammenfassung {option.position}
          </Typography>
        }
        sx={{
          alignItems: 'flex-start',
          m: 0,
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1.5,
          ml: 4.5,
          whiteSpace: 'pre-line',
          lineHeight: 1.7,
        }}
      >
        {option.text}
      </Typography>
    </Paper>
  );
}
