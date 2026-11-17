'use server';

const TIMEOUT_MS = 15_000;
const MAX_TEXT_LENGTH = 20_000;

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

function checkText(name: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} must be a non-empty string`);
  }

  if (value.length > MAX_TEXT_LENGTH) {
    throw new Error(`${name} must be at most ${MAX_TEXT_LENGTH} characters`);
  }

  return value;
}

async function callApi<T>(
  path: string,
  signal: AbortSignal,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${process.env.API_URL}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Summary API ${path} failed with ${response.status}`);
  }

  return response.json();
}

/** Generates a summary of `text` on the remote server and scores it against `reference`. */
export async function analyzeText(
  text: string,
  reference: string
): Promise<{ result: AnalyzeResult }> {
  checkText('text', text);
  checkText('reference', reference);

  if (!process.env.API_URL) {
    throw new Error('API_URL is not set');
  }

  const start = Date.now();
  const signal = AbortSignal.timeout(TIMEOUT_MS);

  // Create job
  const { job_id } = await callApi<{ job_id: string }>('/submit', signal, {
    text,
  });

  if (typeof job_id !== 'string' || job_id === '') {
    throw new Error('Summary API returned no job_id');
  }

  // Wait for job
  while (true) {
    const { status } = await callApi<{ status: string }>(
      `/status/${encodeURIComponent(job_id)}`,
      signal
    );

    if (status === 'done') {
      break;
    }

    if (status === 'failed' || status === 'error') {
      throw new Error(`Job failed: ${status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const score = await callApi<Omit<AnalyzeResult, 'response_time_seconds'>>(
    `/score/${encodeURIComponent(job_id)}`,
    signal,
    { reference }
  );

  return {
    result: {
      ...score,
      response_time_seconds: Math.round((Date.now() - start) / 10) / 100,
    },
  };
}
