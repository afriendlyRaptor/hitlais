import type { DocumentSentence } from '~/types';

/** Groups the flat sentence list back into paragraphs of sentence texts. */
export function groupByParagraph(sentences: DocumentSentence[]): string[][] {
  const paragraphs: string[][] = [];

  for (const { paragraph, text } of sentences) {
    (paragraphs[paragraph] ??= []).push(text);
  }

  return paragraphs;
}
