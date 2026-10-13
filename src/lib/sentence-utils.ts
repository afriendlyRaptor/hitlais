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
    .map((paragraph) => {
      // Protect dates such as "25. Januar" from sentence splitting.
      const protectedText = paragraph.replace(
        /\b(\d{1,2})\.\s+(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b/gi,
        '$1§ $2'
      );

      const sentences = Array.from(segmenter.segment(protectedText))
        .map(({ segment }) => segment.replace(/§/g, '.').trim())
        .filter((sentence) => sentence.length > 0);

      return sentences;
    });
}

export function flattenSentences(paragraphs: string[][]): string[] {
  return paragraphs.flat();
}

export function countTokens(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
