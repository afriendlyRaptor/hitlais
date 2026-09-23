import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  DrawerAppBar,
  SentenceSelector,
  SummaryBox,
  TaskTimer,
} from '~/components/ui';
import { logAction } from '~/services';
import { useSummaryAnalysis } from '~/hooks/useSummaryAnalysis';
import { useDocument } from '~/hooks/useDocument';
import { useSearch, useLocation } from 'wouter';
import { DEFAULT_TASK_ID, getStudyTask, getNextTaskId } from '~/config';

export default function Home() {
  const search = useSearch();

  const [, navigate] = useLocation();

  const params = new URLSearchParams(search);
  const taskId = params.get('task');

  // If there is no task, redirect to the default task.
  useEffect(() => {
    if (!taskId) {
      navigate(`?task=${DEFAULT_TASK_ID}`, {
        replace: true,
      });
    }
  }, [taskId, navigate]);

  const task = getStudyTask(taskId);
  const { documentId, components, redirectTo } = task;

  //if redirectTo is set in config it redirects
  useEffect(() => {
    if (taskId && redirectTo) {
      logAction('task_redirect', { taskId, redirectTo });
      navigate(redirectTo, { replace: true });
    }
  }, [taskId, redirectTo, navigate]);

  const [selectedSentences, setSelectedSentences] = useState<
    SelectedSentence[]
  >([]);

  const {
    document,
    isLoading: isDocumentLoading,
    loadDocument,
  } = useDocument();

  const { summary, isAnalyzing, scoreHistory, handleAnalyze } =
    useSummaryAnalysis(taskId);

  useEffect(() => {
    if (taskId) {
      loadDocument(documentId);
    }
  }, [taskId, documentId]);

  if (!taskId) {
    return null;
  }

  const nextTaskId = getNextTaskId(taskId);
  const redirectToTimer = nextTaskId ? `/home?task=${nextTaskId}` : '/about'; // or wherever "done" should go, e.g. '/home?task=complete'

  return (
    <>
      <DrawerAppBar />
      {components.task_timer && components.time != null && (
        <TaskTimer seconds={components.time} redirectTo={redirectToTimer} />
      )}

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
              scoreDisplayEnabled={components.score_display}
              taskId={taskId}
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
          <SummaryBox summary={summary} isLoading={isAnalyzing} />
        </Box>{' '}
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
          variant="contained"
          size="icon"
          onClick={() => {
            if (!document) {
              return;
            }

            handleAnalyze(selectedSentences, document.summary);
          }}
          disabled={isAnalyzing}

          sx={{

            minWidth: 30,
            px: 3,
            py: 3,

            borderRadius: '999px',
            boxShadow: 4,

            fontSize: '1.05rem',
            fontWeight: 600,
            textTransform: 'none',
          }}
          aria-label={isAnalyzing ? 'Generating summary' : 'Generate summary'}
          className="h-20 w-10 rounded-full"
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
