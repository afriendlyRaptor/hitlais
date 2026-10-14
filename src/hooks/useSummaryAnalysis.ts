import { useState } from 'react';
import { Alertify, analyzeSentences, logAction } from '~/services';
import type { HistoryEntry, SelectedSentence } from '~/types';

/** Rates a selection via the API and hands the resulting version to `onResult`. */
export function useSummaryAnalysis(
  taskId: string,
  onResult: (entry: HistoryEntry) => void
) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async (
    selectedSentences: SelectedSentence[],
    referenceSummary: string
  ) => {
    if (isAnalyzing) {
      return;
    }

    if (selectedSentences.length === 0) {
      Alertify.info('Please select at least one sentence.');
      return;
    }

    if (!referenceSummary) {
      Alertify.error('No dataset summary is available for comparison.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const { result } = await analyzeSentences(
        selectedSentences,
        referenceSummary
      );

      onResult({
        id: Date.now(),
        // RougeL as the main score, upscaled to 0-100
        score: result.rougeL * 100,
        summary: result.summary,
        selected: selectedSentences.map(({ index }) => index),
      });

      logAction('rate_summary', {
        task_id: taskId,
        summary_length: result.summary.length,
        generated_summary: result.summary,
        reference_summary: referenceSummary,
        response_time_seconds: result.response_time_seconds,
      });

      logAction('summary_scores', {
        summary_length: result.summary.length,
        bert_score: result.bertscore_f1,
        rouge1: result.rouge1,
        rouge2: result.rouge2,
        rougeL: result.rougeL,
        generated_summary: result.summary,
      });
    } catch (error) {
      console.error('Analysis failed:', error);

      Alertify.error('Failed to generate or compare summary.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyze, isAnalyzing };
}
