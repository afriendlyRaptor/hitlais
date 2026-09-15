import { Box, Typography } from '@mui/material';

type SummaryProps = {
  summary: string;
  isLoading: boolean;
};

export default function Summary({ summary, isLoading }: SummaryProps) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h5">Summary</Typography>

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          p: 2,
          minHeight: 300,
          mt: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
      >
        {isLoading ? (
          <Typography color="text.secondary">Generating summary...</Typography>
        ) : (
          <Typography
            color={summary ? 'text.primary' : 'text.secondary'}
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {summary || 'Your summary will appear here...'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
