import { runScriptBatch } from '~/server/runScript';

/** Token count of every text, in the same order. */
export async function countTokens(texts: string[]): Promise<number[]> {
  const { result } = await runScriptBatch<number>(
    'countToken',
    texts.map((text) => [text])
  );

  return result;
}
