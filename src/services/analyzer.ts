import { postApi } from './api';

export interface AnalyzeResult {
  job_id: string;
  rouge1: number;
  rouge2: number;
  rougeL: number;
  bertscore_precision: number;
  bertscore_recall: number;
  bertscore_f1: number;
  summary: string;
  response_time_seconds: number;
}

export interface AnalyzeResponse {
  result: AnalyzeResult;
}

export async function analyzeSentences(
  selectedSentences: SelectedSentence[],
  referenceSummary: string
): Promise<AnalyzeResponse> {
  const text = selectedSentences.map(({ text }) => text).join(' ');

  const response = await postApi<AnalyzeResponse>('/run-script', {
    scriptId: 'analyze',
    args: [text, referenceSummary],
  });

  return response.data;
}
