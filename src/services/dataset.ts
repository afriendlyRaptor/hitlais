import { runScript } from '~/server/runScript';

export interface DocumentResult {
  id: number;
  transcript: string;
  summary: string;
}

export interface DocumentResponse {
  result: DocumentResult;
}

export async function getDocument(id: number): Promise<DocumentResponse> {
  return runScript<DocumentResult>('getDocument', [String(id)]);
}
