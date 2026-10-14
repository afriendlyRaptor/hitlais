import { Box, Typography } from '@mui/material';

type Props = {
  description?: string;
};

export function TaskInstructions({ description }: Props) {
  return (
    <>
      <Typography variant="h5">Aufgabe:</Typography>

      {description && (
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: 'primary.main',
            fontSize: '1.2rem',
            fontWeight: 700,
            lineHeight: 2,
            whiteSpace: 'pre-line',
          }}
        >
          {description}
        </Typography>
      )}

      <Box component="span" sx={{ display: 'block', mb: 3, fontWeight: 700 }}>
        Sätze können mit klicken Ausgewählt werden:
      </Box>
    </>
  );
}
