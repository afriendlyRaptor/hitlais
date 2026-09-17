import { postApi } from './api';

export interface CompareResult {
  bert_score: {
    precision: number;
    recall: number;
    f1: number;
  };
  rouge: {
    rouge1: number;
    rouge2: number;
    rougeL: number;
    average: number;
  };
}

export interface CompareResponse {
  result: CompareResult;
}

export async function compareTexts(
  reference: string,
  candidate: string
): Promise<CompareResponse> {
  const response = await postApi<CompareResponse>('/run-script', {
    scriptId: 'compare',
    args: {
      reference,
      candidate,
    },
  });

  return response.data;
}
