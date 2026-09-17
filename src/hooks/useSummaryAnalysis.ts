import { useState } from 'react';
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

export function useSummaryAnalysis() {
  const [summary, setSummary] = useState<string>(() => {
    return localStorage.getItem('generated-summary') ?? '';
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [comparison, setComparison] = useState<CompareResult | null>(null);

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
      // ---------------------------------------------------
      // 1. Generate summary
      // ---------------------------------------------------

      const analyzeResponse = await analyzeSentences(selectedSentences);

      const generatedSummary = analyzeResponse.result.summary;

      setSummary(generatedSummary);

      localStorage.setItem('generated-summary', generatedSummary); // ---------------------------------------------------
      // 2. Compare generated summary with dataset summary
      // ---------------------------------------------------

      logAction('rate_summary', {
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

  return {
    summary,
    comparison,
    isAnalyzing,
    scoreHistory,
    handleAnalyze,
  };
}
