import { runScript } from '~/server/runScript';

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
  // compare.py reads one JSON string from argv[1]
  return runScript<CompareResult>('compare', [
    JSON.stringify({ reference, candidate }),
  ]);
}
