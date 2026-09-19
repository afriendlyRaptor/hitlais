import { useEffect, useState } from 'react';
import {
  Alertify,
  analyzeSentences,
  compareTexts,
  logAction,
  type CompareResult,
} from '~/services';

type ScoreEntry = {
  timestamp: number;
  score: number;
};

const getSummaryKey = (taskId: string) => `generated-summary-${taskId}`;

const getScoreHistoryKey = (taskId: string) => `score-history-${taskId}`;

export function useSummaryAnalysis(taskId: string) {
  const [summary, setSummary] = useState<string>(() => {
    return localStorage.getItem(getSummaryKey(taskId)) ?? '';
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>(() => {
    const stored = localStorage.getItem(getScoreHistoryKey(taskId));

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  const [comparison, setComparison] = useState<CompareResult | null>(null);

  useEffect(() => {
    const storedSummary = localStorage.getItem(getSummaryKey(taskId)) ?? '';

    const storedScoreHistory = localStorage.getItem(getScoreHistoryKey(taskId));

    setSummary(storedSummary);

    if (storedScoreHistory) {
      try {
        setScoreHistory(JSON.parse(storedScoreHistory));
      } catch {
        setScoreHistory([]);
      }
    } else {
      setScoreHistory([]);
    }

    // Comparison is not persisted, so reset it when changing tasks.
    setComparison(null);
  }, [taskId]);

  // Persist summary
  useEffect(() => {
    localStorage.setItem(getSummaryKey(taskId), summary);
  }, [taskId, summary]);

  // Persist score history
  useEffect(() => {
    localStorage.setItem(
      getScoreHistoryKey(taskId),
      JSON.stringify(scoreHistory)
    );
  }, [taskId, scoreHistory]);

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
      // Generate summary

      const analyzeResponse = await analyzeSentences(selectedSentences);

      const generatedSummary = analyzeResponse.result.summary;

      setSummary(generatedSummary);

      localStorage.setItem(getSummaryKey(taskId), generatedSummary);

      // Compare generated summary with dataset summary

      logAction('rate_summary', {
        task_id: taskId,
        summary_length: generatedSummary.length,
        generated_summary: generatedSummary,
        reference_summary: referenceSummary,
      });

      const compareResponse = await compareTexts(
        referenceSummary,
        generatedSummary
      );

      const result = compareResponse.result;

      setComparison(result);

      // Use BERTScore F1 as the main score for the history.
      const score = result.bert_score.f1;

      setScoreHistory((prev) => [
        ...prev,
        {
          timestamp: Date.now(),
          score,
        },
      ]);
      // ---------------------------------------------------
      // 3. Logging
      // ---------------------------------------------------

      logAction('summary_scores', {
        summary_length: generatedSummary.length,
        bert_score: result.bert_score.f1,
        rouge1: result.rouge.rouge1,
        rouge2: result.rouge.rouge2,
        rougeL: result.rouge.rougeL,
        summary: generatedSummary,
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
      summary: summary,
      score_history: scoreHistory,
      comparison,
    });
    localStorage.removeItem(getSummaryKey(taskId));
    localStorage.removeItem(getScoreHistoryKey(taskId));

    setSummary('');
    setScoreHistory([]);
    setComparison(null);
  };

  return {
    summary,
    comparison,
    isAnalyzing,
    scoreHistory,
    handleAnalyze,
    clearAnalysis,
  };
}
