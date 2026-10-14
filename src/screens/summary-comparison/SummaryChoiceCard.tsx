import { FormControlLabel, Paper, Radio, Typography } from '@mui/material';
import type { SummaryOption } from './content';

type Props = {
  option: SummaryOption;
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
        value={option.value}
        control={<Radio />}
        label={<Typography sx={{ fontWeight: 600 }}>{option.title}</Typography>}
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
