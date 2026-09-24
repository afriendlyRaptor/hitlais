// ~/components/ui/LikertScale.tsx
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  useTheme,
} from '@mui/material';

type LikertScaleProps = {
  id: string;
  question: string;
  value: number | null;
  onChange: (id: string, value: number) => void;
  lowLabel?: string;
  highLabel?: string;
  disabled?: boolean;
};

const SCALE = [1, 2, 3, 4];

export function LikertScale({
  id,
  question,
  value,
  onChange,
  lowLabel = 'Strongly disagree',
  highLabel = 'Strongly agree',
  disabled = false,
}: LikertScaleProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 2.5,
        px: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        mb: 1,
      }}
    >
      <FormControl fullWidth disabled={disabled}>
        <FormLabel
          id={`${id}-label`}
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            mb: 1.5,
            '&.Mui-focused': { color: theme.palette.text.primary },
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
                  color: theme.palette.text.secondary,
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
      </FormControl>
    </Box>
  );
}
