import { useState } from 'react';
import { storageKeys } from '~/config';
import { jsonArrayCodec, stringCodec } from '~/lib/storage';
import { Alertify, analyzeSentences, logAction } from '~/services';
import type { ScoreEntry, SelectedSentence } from '~/types';
import { usePersistedState } from './usePersistedState';

const scoreHistoryCodec = jsonArrayCodec<ScoreEntry>();

export function useSummaryAnalysis(taskId: string) {
  const [summary, setSummary] = usePersistedState(
    storageKeys.summary(taskId),
    stringCodec
  );

  const [scoreHistory, setScoreHistory] = usePersistedState(
    storageKeys.scoreHistory(taskId),
    scoreHistoryCodec
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (
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
      const analyzeResponse = await analyzeSentences(
        selectedSentences,
        referenceSummary
      );

      const result = analyzeResponse.result;
      const generatedSummary = result.summary;

      setSummary(generatedSummary);

      logAction('rate_summary', {
        task_id: taskId,
        summary_length: generatedSummary.length,
        generated_summary: generatedSummary,
        reference_summary: referenceSummary,
        response_time_seconds: result.response_time_seconds,
      });

      // Use RougeL as the main score for the history.
      // Upscaled to 0-100
      const score = result.rougeL * 100;

      setScoreHistory((previous) => [
        ...previous,
        {
          timestamp: Date.now(),
          score,
        },
      ]);

      logAction('summary_scores', {
        summary_length: generatedSummary.length,
        bert_score: result.bertscore_f1,
        rouge1: result.rouge1,
        rouge2: result.rouge2,
        rougeL: result.rougeL,
        generated_summary: generatedSummary,
      });
    } catch (error) {
      console.error('Analysis failed:', error);

      Alertify.error('Failed to generate or compare summary.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    logAction('analysis_cleared', {
      task_id: taskId,
      generated_summary: summary,
      score_history: scoreHistory,
    });

    setSummary('');
    setScoreHistory([]);
  };

  return {
    summary,
    isAnalyzing,
    scoreHistory,
    handleAnalyze,
    clearAnalysis,
  };
}
