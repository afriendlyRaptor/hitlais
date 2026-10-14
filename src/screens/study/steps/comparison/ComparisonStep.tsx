import { useCallback, useEffect } from 'react';
import { DrawerAppBar } from '~/components/app-bar';
import { DocumentGate } from '~/components/study';
import { COMPARISON } from '~/config';
import { useDocument, useTaskHistory } from '~/hooks';
import { ComparisonForm } from './ComparisonForm';

type Props = {
  userId: string;
  /** Document of the compared task; its reference summary is the second candidate. */
  documentId: number;
  onFinish: () => void;
};

/** Loads both candidates (final generated summary, reference summary), then shows the form. */
export function ComparisonStep({ userId, documentId, onFinish }: Props) {
  const { document, isLoading, error, loadDocument } = useDocument();
  const { active } = useTaskHistory(COMPARISON.taskId);

  const reload = useCallback(
    () => loadDocument(documentId),
    [documentId, loadDocument]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  if (!document) {
    return (
      <>
        <DrawerAppBar />
        <DocumentGate isLoading={isLoading} error={error} onRetry={reload}>
          {null}
        </DocumentGate>
      </>
    );
  }

  return (
    <ComparisonForm
      userId={userId}
      generatedSummary={active?.summary ?? ''}
      referenceSummary={document.summary}
      onFinish={onFinish}
    />
  );
}
