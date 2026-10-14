import { Box, Typography } from '@mui/material';
import { useRecentlyChanged } from '~/hooks';

type SummaryProps = {
  summary: string;
  isLoading: boolean;
};

const FLASH_COLOR = 'rgba(76, 175, 80, 0.5)';
const FLASH_DURATION_MS = 500;

/** Shows the generated summary and briefly flashes green when it changes. */
export function SummaryBox({ summary, isLoading }: SummaryProps) {
  const summaryUpdated = useRecentlyChanged(summary, FLASH_DURATION_MS);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h5">Zusammenfassung</Typography>

      <Box
        sx={{
          border: 1,
          borderColor: summaryUpdated ? FLASH_COLOR : 'divider',
          p: 2,
          height: 300,
          mt: 1,
          borderRadius: 1,
          bgcolor: summaryUpdated ? FLASH_COLOR : 'background.paper',
          overflowY: 'auto',
          boxSizing: 'border-box',
          transition: 'background-color 0.5s ease, border-color 0.5s ease',
        }}
      >
        <Typography
          color={isLoading ? 'text.secondary' : 'text.primary'}
          sx={{ whiteSpace: 'pre-wrap' }}
        >
          {summary || 'Your summary will appear here...'}
        </Typography>
      </Box>
    </Box>
  );
}
