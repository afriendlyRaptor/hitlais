import { analyzeText } from '~/server/analyze';
import type { SelectedSentence } from '~/types';

export type { AnalyzeResult } from '~/server/analyze';

export async function analyzeSentences(
  selectedSentences: SelectedSentence[],
  referenceSummary: string
) {
  const text = selectedSentences.map(({ text }) => text).join(' ');

  return analyzeText(text, referenceSummary);
}
