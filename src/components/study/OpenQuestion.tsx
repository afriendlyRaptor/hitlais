import { Box, TextField, Typography } from '@mui/material';
import { ValidationMessage } from './ValidationMessage';

type Props = {
  id: string;
  question: string;
  value: string;
  required?: boolean;
  error?: boolean;
  onChange: (id: string, value: string) => void;
};

export function OpenQuestion({
  id,
  question,
  value,
  required = false,
  error = false,
  onChange,
}: Props) {
  return (
    <Box sx={{ mt: 3, mb: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        {question}
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={4}
        value={value}
        error={error}
        onChange={(event) => onChange(id, event.target.value)}
        placeholder={required ? 'Ihre Antwort' : 'Ihre Antwort (optional)'}
      />

      {error && (
        <ValidationMessage>
          Bitte beantworten Sie diese Frage.
        </ValidationMessage>
      )}
    </Box>
  );
}
