import seedrandom from 'seedrandom';

/** Deterministic random numbers per participant, so reloads never reshuffle. */
export function seededRng(seed: string, salt: string) {
  return seedrandom(`${seed}:${salt}`);
}

/** Fisher–Yates shuffle; returns a copy. */
export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
