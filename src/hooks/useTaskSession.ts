import { useCallback, useEffect, useMemo, useRef } from 'react';
import { flattenSentences, splitIntoParagraphs } from '~/lib/sentence-utils';
import { logAction } from '~/services';
import type { HistoryEntry } from '~/types';
import { useDocument } from './useDocument';
import { useSentenceSelection } from './useSentenceSelection';
import { useSummaryAnalysis } from './useSummaryAnalysis';
import { useTaskHistory } from './useTaskHistory';

/**
 * Everything a summarizing task needs: the document, the sentence selection,
 * the summary history and the actions on them.
 *
 * On first visit the first sentences are selected and summarized, so there is
 * always a starting summary and score.
 */
export function useTaskSession(taskId: string, documentId: number) {
  const { document, isLoading, error, loadDocument } = useDocument();

  const reload = useCallback(
    () => loadDocument(documentId),
    [documentId, loadDocument]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  const paragraphs = useMemo(
    () => splitIntoParagraphs(document?.transcript ?? ''),
    [document]
  );
  const sentences = useMemo(() => flattenSentences(paragraphs), [paragraphs]);

  const selection = useSentenceSelection(sentences, taskId);
  const history = useTaskHistory(taskId);
  const { analyze, isAnalyzing } = useSummaryAnalysis(taskId, history.push);

  const initialSummaryStarted = useRef(false);

  useEffect(() => {
    if (
      initialSummaryStarted.current ||
      !document ||
      sentences.length === 0 ||
      history.entries.length > 0
    ) {
      return;
    }

    initialSummaryStarted.current = true;

    const indexes = selection.selectFirstTokens();

    analyze(
      indexes.map((index) => ({ index, text: sentences[index] })),
      document.summary
    );
  }, [document, sentences, history.entries.length, selection, analyze]);

  const generate = () => {
    if (!document) {
      return;
    }

    logAction('summary_button', {
      selected_sentences: selection.selectedSentences,
      reference_summary: document.summary,
    });
    analyze(selection.selectedSentences, document.summary);
  };

  const restore = (entry: HistoryEntry) => {
    if (isAnalyzing) {
      return;
    }

    logAction('history_restored', {
      entry_id: entry.id,
      score: entry.score,
      selected_count: entry.selected.length,
    });
    history.activate(entry.id);
    selection.replaceSelection(entry.selected);
  };

  return {
    isLoading,
    error,
    reload,
    paragraphs,
    selection,
    history,
    summary: history.active?.summary ?? '',
    isAnalyzing,
    generate,
    restore,
  };
}
