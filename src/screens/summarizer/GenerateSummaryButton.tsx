import { Box, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pillSx } from '~/components/common';

type Props = {
  isAnalyzing: boolean;
  onClick: () => void;
};

/** Round button in the middle of the screen that turns the selection into a summary. */
export function GenerateSummaryButton({ isAnalyzing, onClick }: Props) {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Button
        variant="contained"
        onClick={onClick}
        disabled={isAnalyzing}
        sx={{
          ...pillSx,
          width: 50,
          height: 80,
          minWidth: 40,
          padding: 0,
          boxShadow: 4,
          fontSize: '1.05rem',
        }}
        aria-label={isAnalyzing ? 'Generating summary' : 'Generate summary'}
      >
        {isAnalyzing ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          <ArrowForwardIcon />
        )}
      </Button>
    </Box>
  );
}
