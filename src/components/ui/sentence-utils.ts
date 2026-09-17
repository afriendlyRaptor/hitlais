export function splitIntoParagraphs(text: string): string[][] {
  if (!text) {
    return [];
  }

  const segmenter = new Intl.Segmenter('de', {
    granularity: 'sentence',
  });

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) =>
      Array.from(segmenter.segment(paragraph), ({ segment }) =>
        segment.trim()
      ).filter(Boolean)
    );
}

export function flattenSentences(paragraphs: string[][]): string[] {
  return paragraphs.flat();
}

export function countTokens(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
