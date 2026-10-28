import { postApi } from './api';

export async function countTokens(text: string): Promise<number> {
  const response = await postApi<{ result: number }>('/run-script', {
    scriptId: 'countToken',
    args: [text],
  });

  return response.data.result;
}
