import { useState } from 'react';
import { Alertify, analyzeSentences, logAction } from '~/services';

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

  const handleAnalyze = async (selectedSentences: SelectedSentence[]) => {
    if (isAnalyzing) {
      return;
    }

    if (selectedSentences.length === 0) {
      Alertify.info('Please select at least one sentence.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await analyzeSentences(selectedSentences);

      const newSummary = response.result.summary;

      setSummary(newSummary);

      localStorage.setItem('generated-summary', newSummary);

      const rawScore = response.result.score;

      const score =
        typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;

      if (Number.isNaN(score)) {
        console.error('Invalid score received from API:', rawScore);
      } else {
        setScoreHistory((prev) => [
          ...prev,
          {
            timestamp: Date.now(),
            score,
          },
        ]);
      }

      setSummary(newSummary);

      logAction('summary_generated', {
        summary_length: newSummary.length,
        score: response.result.score,
        summary: newSummary,
      });
    } catch (error) {
      console.error('Analysis failed:', error);

      Alertify.error('Failed to generate summary.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    summary,
    isAnalyzing,
    scoreHistory,
    handleAnalyze,
  };
}
