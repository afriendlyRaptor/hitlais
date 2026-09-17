import { postApi } from './api';

export interface DocumentResult {
  id: number;
  transcript: string;
  summary: string;
}

export interface DocumentResponse {
  result: DocumentResult;
}

export async function getDocument(id: number): Promise<DocumentResponse> {
  const response = await postApi<DocumentResponse>('/run-script', {
    scriptId: 'getDocument',
    args: id,
  });

  return response.data;
}
