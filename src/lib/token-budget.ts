import { shuffle } from './random';

/**
 * Pure helpers for picking sentences under a token budget.
 * `counts[i]` is the token count of sentence `i`.
 */

export function sumTokens(indexes: number[], counts: number[]): number {
  return indexes.reduce((total, index) => total + counts[index], 0);
}

/** Take sentences from the start until the next one would exceed `limit`. */
export function pickFirstWithinLimit(counts: number[], limit: number) {
  let tokenCount = 0;
  const indexes: number[] = [];

  for (let index = 0; index < counts.length; index++) {
    const tokens = counts[index];

    if (tokenCount + tokens > limit) {
      break;
    }

    indexes.push(index);
    tokenCount += tokens;
  }

  return { indexes, tokenCount };
}

/** Shuffle (driven by `rng`) and greedily fill up to `limit`. */
export function pickRandomWithinLimit(
  counts: number[],
  limit: number,
  rng: () => number
) {
  const order = shuffle(
    counts.map((_, index) => index),
    rng
  );

  let tokenCount = 0;
  const indexes: number[] = [];

  for (const index of order) {
    const tokens = counts[index];

    if (tokens > limit) {
      continue;
    }

    if (tokenCount + tokens <= limit) {
      indexes.push(index);
      tokenCount += tokens;
    }

    if (tokenCount === limit) {
      break;
    }
  }

  return { indexes, tokenCount };
}
