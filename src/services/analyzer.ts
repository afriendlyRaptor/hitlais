
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
  sentences: string[],
): Promise<AnalyzeResponse> {
  const response = await postApi<AnalyzeResponse>(
    '/run-script',
    {
      scriptId: 'analyze',
      args: {
        sentences,
      },
    },
  );

  return response.data;
}
