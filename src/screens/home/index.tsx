import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DrawerAppBar, SentenceSelector, Button } from '~/components/ui';
import { logAction } from '~/services';
import { useSummaryAnalysis } from '~/hooks/useSummaryAnalysis';
import { useDocument } from '~/hooks/useDocument';

type ScoreEntry = {
  timestamp: number;
  score: number;
};

export default function Home() {
  const [selectedSentences, setSelectedSentences] = useState<
    SelectedSentence[]
  >([]);
  const {
    document,
    isLoading: isDocumentLoading,
    loadDocument,
  } = useDocument();

  const { summary, isAnalyzing, scoreHistory, handleAnalyze } =
    useSummaryAnalysis();

  const text = document?.transcript ?? '';

  useEffect(() => {
    loadDocument(40404);
  }, []);

  return (
    <>
      <DrawerAppBar />

      <Box
        sx={{
          display: 'grid',

          // Left content | button space | right content
          gridTemplateColumns: 'minmax(0, 1fr) 20px minmax(0, 1fr)',

          columnGap: 3,
          alignItems: 'start',
          p: 4,
        }}
      >
        {/* Sentence selection */}
        <Box sx={{ minWidth: 0 }}>
          {isDocumentLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <SentenceSelector
              text={document?.transcript ?? ''}
              onSelectionChange={setSelectedSentences}
              scoreHistory={scoreHistory}
            />
          )}{' '}
        </Box>

        {/* Reserved middle column */}
        <Box
          sx={{
            width: 80,
          }}
        />

        {/* Summary */}
        <Box sx={{ minWidth: 0 }}>
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
            <Typography
              color={summary ? 'text.primary' : 'text.secondary'}
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {summary || 'Your summary will appear here...'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Generate summary button */}
      <Box
        sx={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Button
          logId="request_summary"
          variant="default"
          size="icon"
          onClick={() => {
            if (!document) {
              return;
            }

            handleAnalyze(selectedSentences, document.id);
          }}
          disabled={isAnalyzing}
          aria-label={isAnalyzing ? 'Generating summary' : 'Generate summary'}
          className="h-20 w-12 rounded-full"
        >
          {isAnalyzing ? (
            <CircularProgress size={22} color="primary.main" />
          ) : (
            <ArrowForwardIcon />
          )}
        </Button>
      </Box>
    </>
  );
}
