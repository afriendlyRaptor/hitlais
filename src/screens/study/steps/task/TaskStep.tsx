import { Box } from '@mui/material';
import { DrawerAppBar } from '~/components/app-bar';
import {
  NextTaskButton,
  ScoreDisplayPanel,
  SelectionControls,
  SentenceText,
  SummaryBox,
  TaskTimer,
} from '~/components/summary';
import { DocumentGate } from '~/components/study';
import { getStudyTask } from '~/config';
import { useTaskSession } from '~/hooks';
import { GenerateSummaryButton } from './GenerateSummaryButton';
import { TaskHeader } from './TaskHeader';

type Props = {
  taskId: string;
  documentId: number;
  onFinish: () => void;
};

/** One summarizing task: pick sentences on the left, see the summary on the right. */
export function TaskStep({ taskId, documentId, onFinish }: Props) {
  const { description, showScore, timeLimitSeconds } = getStudyTask(taskId);
  const session = useTaskSession(taskId, documentId);
  const { selection, history } = session;

  const historyPanel = {
    entries: history.entries,
    activeId: history.activeId,
    onRestore: session.restore,
  };

  return (
    <>
      <DrawerAppBar history={showScore ? historyPanel : undefined} />

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
          <TaskHeader description={description} />

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
              onClear={selection.clearAll}
              onSelectFirst={selection.selectFirstTokens}
              onSelectRandom={selection.selectRandomTokens}
            />
            {showScore && (
              <ScoreDisplayPanel
                history={history.entries}
                activeId={history.activeId}
                onSelect={session.restore}
              />
            )}
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
          }}
        >
          <SummaryBox
            summary={session.summary}
            isLoading={session.isAnalyzing}
          />
        </Box>
      </Box>

      <GenerateSummaryButton
        isAnalyzing={session.isAnalyzing}
        onClick={session.generate}
      />

      <NextTaskButton
        disabled={!session.summary.trim() || session.isAnalyzing}
        onConfirm={onFinish}
      />
    </>
  );
}
