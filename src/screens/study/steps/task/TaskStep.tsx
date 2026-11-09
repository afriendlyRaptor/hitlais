import { Box } from '@mui/material';
import { DrawerAppBar } from '~/components/app-bar';
import {
  HistoryButton,
  NextTaskButton,
  ScoreDisplayPanel,
  SelectionControls,
  SentenceText,
  SummaryBox,
  TaskTimer,
} from '~/components/summary';
import { DocumentGate } from '~/components/study';
import {
  getStudyTask,
  STUDY_BLOCKS,
  TOKEN_LIMIT,
  type StudyTaskConfig,
} from '~/config';
import { useTaskSession } from '~/hooks';
import { GenerateSummaryButton } from './GenerateSummaryButton';
import { useEffect, useRef } from 'react';
import type { HistoryEntry } from '~/types';

type Props = {
  taskId: string;
  documentId: number;
  onFinish: () => void;
};

/** One summarizing task: pick sentences on the left, see the summary on the right. */
export function TaskStep({ taskId, documentId, onFinish }: Props) {
  const { description, instructions, showScore, timeLimitSeconds } =
    getStudyTask(taskId);
  const session = useTaskSession(taskId, documentId);
  const { selection, history } = session;

  const tasks: Record<string, StudyTaskConfig> = Object.fromEntries(
    STUDY_BLOCKS.map(({ taskId }) => [taskId, getStudyTask(taskId)])
  );

  const generatedFor = useRef(selection.selected);

  const generate = () => {
    generatedFor.current = selection.selected;
    session.generate();
  };

  const restore = (entry: HistoryEntry) => {
    if (session.isAnalyzing) {
      return;
    }
    // a restored version is not a new selection, so it must not auto-generate
    generatedFor.current = entry.selected;
    session.restore(entry);
  };

  const historyPanel = {
    entries: history.entries,
    activeId: history.activeId,
    onRestore: restore,
    showScore,
  };

  // generate shortly after the selection stops changing
  useEffect(() => {
    const changed = selection.selected !== generatedFor.current;
    if (!changed || session.isAnalyzing || selection.selected.length === 0) {
      return;
    }
    const timer = setTimeout(generate, 1000);
    return () => clearTimeout(timer);
  }, [selection.selected, session.isAnalyzing]);

  return (
    <>
      <DrawerAppBar taskInfo={{ description, instructions }} />{' '}
      {timeLimitSeconds != null && (
        <TaskTimer seconds={timeLimitSeconds} onExpire={onFinish} />
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
          <Box sx={{ display: 'block', mb: 3, fontWeight: 700 }}>
            Sätze können mit klicken Ausgewählt werden:
          </Box>

          <DocumentGate
            isLoading={session.isLoading}
            error={session.error}
            onRetry={session.reload}
          >
            <SentenceText
              paragraphs={session.paragraphs}
              selected={selection.selected}
              onToggle={selection.toggleSentence}
            />
            <SelectionControls
              canClear={selection.selected.length > 0}
              canSelect={session.paragraphs.length > 0}
              tokensUsed={selection.selectedTokenCount}
              tokenLimit={TOKEN_LIMIT}
              onClear={selection.clearAll}
              onSelectFirst={selection.selectFirstTokens}
              onSelectRandom={selection.selectRandomTokens}
            />
          </DocumentGate>
        </Box>

        {/* Reserved middle column */}
        <Box sx={{ width: 80 }} />

        {/* Summary */}
        <Box
          sx={{
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',

            // Scrolls on its own and stays clear of the floating bottom controls
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
            p: 0.5,
          }}
        >
          <SummaryBox
            summary={session.summary}
            isLoading={session.isAnalyzing}
          />
          <HistoryButton {...historyPanel} />
          {showScore && (
            <ScoreDisplayPanel
              history={history.entries}
              activeId={history.activeId}
              onSelect={restore}
            />
          )}
        </Box>
      </Box>
      <GenerateSummaryButton
        isAnalyzing={session.isAnalyzing}
        onClick={generate}
      />{' '}
      <NextTaskButton
        disabled={!session.summary.trim() || session.isAnalyzing}
        onConfirm={onFinish}
      />
    </>
  );
}
