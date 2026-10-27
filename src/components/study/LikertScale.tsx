import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { LIKERT_HIGH_LABEL, LIKERT_LOW_LABEL, LIKERT_POINTS } from '~/config';
import { ValidationMessage } from './ValidationMessage';

type LikertScaleProps = {
  id: string;
  question: string;
  value: number | null;
  error?: boolean;
  onChange: (id: string, value: number) => void;
  lowLabel?: string;
  highLabel?: string;
};

const SCALE = Array.from({ length: LIKERT_POINTS }, (_, i) => i + 1);

export function LikertScale({
  id,
  question,
  value,
  error = false,
  onChange,
  lowLabel = LIKERT_LOW_LABEL,
  highLabel = LIKERT_HIGH_LABEL,
}: LikertScaleProps) {
  return (
    <Box
      sx={{
        py: 2.5,
        px: 3,
        borderRadius: 2,
        border: 1,
        borderColor: error ? 'error.main' : 'divider',
        mb: 1,
      }}
    >
      <FormControl fullWidth>
        <FormLabel
          id={`${id}-label`}
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            mb: 1.5,
            '&.Mui-focused': { color: 'text.primary' },
          }}
        >
          {question}
        </FormLabel>

        <RadioGroup
          row
          aria-labelledby={`${id}-label`}
          value={value ?? ''}
          onChange={(e) => onChange(id, Number(e.target.value))}
          sx={{
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
          }}
        >
          {SCALE.map((n) => (
            <FormControlLabel
              key={n}
              value={n}
              control={<Radio />}
              label={n}
              labelPlacement="bottom"
              sx={{
                m: 0,
                flex: 1,
                justifyContent: 'center',
                '& .MuiFormControlLabel-label': {
                  fontSize: 13,
                  color: 'text.secondary',
                },
              }}
            />
          ))}
        </RadioGroup>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {lowLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {highLabel}
          </Typography>
        </Box>

        {error && (
          <ValidationMessage>
            Bitte beantworten Sie diese Frage.
          </ValidationMessage>
        )}
      </FormControl>
    </Box>
  );
}
