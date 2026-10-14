import { seededRng } from './random';

export type SummarySource = 'generated' | 'reference';

export interface ComparisonOption {
  /** A is shown left, B right. */
  position: 'A' | 'B';
  source: SummarySource;
  text: string;
}

/** Puts the two summaries on a random (but per-participant fixed) side. */
export function arrangeSummaries(
  userId: string,
  generated: string,
  reference: string
): ComparisonOption[] {
  const generatedFirst = seededRng(userId, 'comparison')() < 0.5;

  const generatedOption = { source: 'generated', text: generated } as const;
  const referenceOption = { source: 'reference', text: reference } as const;
  const [first, second] = generatedFirst
    ? [generatedOption, referenceOption]
    : [referenceOption, generatedOption];

  return [
    { position: 'A', ...first },
    { position: 'B', ...second },
  ];
}
