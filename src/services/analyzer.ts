
import { postApi } from './api';

export interface AnalyzeResult {
  received_args: {
    sentences: string[];
  };
  message: string;
}

export interface AnalyzeResponse {
  result: AnalyzeResult;
}

export async function analyzeSentences(
  selectedSentences: SelectedSentence[],
): Promise<AnalyzeResponse> {
  const text = selectedSentences
    .map(({ text }) => text)
    .join(' ');

  const response = await postApi<AnalyzeResponse>(
    '/run-script',
    {
      scriptId: 'analyze',
      args: text,
    },
  );

  return response.data;
}

