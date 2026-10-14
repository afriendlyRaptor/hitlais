import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useLocation } from 'wouter';
import { DrawerAppBar } from '~/components/app-bar';
import {
  NextTaskButton,
  ScoreDisplayPanel,
  SentenceSelector,
  SummaryBox,
  TaskTimer,
} from '~/components/summary';
import { getNextTaskId, getStudyTask } from '~/config';
import { useDocument, useSummaryAnalysis } from '~/hooks';
import { ROUTES, summarizerPath } from '~/routes/paths';
import { logAction } from '~/services';
import type { SelectedSentence } from '~/types';
import { GenerateSummaryButton } from './GenerateSummaryButton';
import { TaskInstructions } from './TaskInstructions';

type Props = {
  taskId: string;
};

/** One study task: pick sentences on the left, see the generated summary on the right. */
export function SummarizerTask({ taskId }: Props) {
  const [, navigate] = useLocation();

  const { documentId, components, redirectTo, description } =
    getStudyTask(taskId);
  const nextTaskId = getNextTaskId(taskId);

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

  // If the task config says so, skip straight to another page.
  useEffect(() => {
    if (redirectTo) {
      logAction('task_redirect', { taskId, redirectTo });
      navigate(redirectTo, { replace: true });
    }
  }, [taskId, redirectTo, navigate]);

  useEffect(() => {
    if (documentId !== null) {
      loadDocument(documentId);
    }
  }, [taskId, documentId, loadDocument]);

  const handleGenerateSummary = () => {
    if (!document) return;

    logAction('summary_button', {
      selected_sentences: selectedSentences,
      reference_summary: document.summary,
    });
    handleAnalyze(selectedSentences, document.summary);
  };

  // Where the timer sends the participant when it runs out.
  const redirectToTimer = nextTaskId
    ? summarizerPath(nextTaskId)
    : ROUTES.about; // or wherever "done" should go

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
          <TaskInstructions description={description} />

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
            <>
              <SentenceSelector
                text={document?.transcript ?? ''}
                taskId={taskId}
                onSelectionChange={setSelectedSentences}
              />
              <ScoreDisplayPanel
                scoreHistory={scoreHistory}
                scoreDisplayEnabled={components.score_display}
              />
            </>
          )}
        </Box>

        {/* Reserved middle column */}
        <Box sx={{ width: 80 }} />

        {/* Summary */}
        <Box
          sx={{
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',
          }}
        >
          <SummaryBox summary={summary} isLoading={isAnalyzing} />
        </Box>
      </Box>

      <GenerateSummaryButton
        isAnalyzing={isAnalyzing}
        onClick={handleGenerateSummary}
      />

      <NextTaskButton disabled={!summary.trim() || isAnalyzing} />
    </>
  );
}
