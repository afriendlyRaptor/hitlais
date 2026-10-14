import { useMemo } from 'react';
import { Box } from '@mui/material';

type Props = {
  paragraphs: string[][];
  /** Indexes into the flattened sentence list. */
  selected: number[];
  onToggle: (index: number) => void;
};

/** The document text; every sentence is clickable and highlighted when selected. */
export function SentenceText({ paragraphs, selected, onToggle }: Props) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // Index of each paragraph's first sentence in the flattened list.
  const paragraphOffsets = useMemo(() => {
    let total = 0;

    return paragraphs.map((paragraph) => {
      const start = total;
      total += paragraph.length;
      return start;
    });
  }, [paragraphs]);

  return (
    <Box sx={{ paddingBottom: '100px' }}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <Box key={paragraphIndex} sx={{ mb: 2 }}>
          {paragraph.map((sentence, sentenceIndex) => {
            const index = paragraphOffsets[paragraphIndex] + sentenceIndex;

            return (
              <Box
                component="span"
                key={index}
                onClick={() => onToggle(index)}
                sx={{
                  backgroundColor: selectedSet.has(index)
                    ? 'secondary.main'
                    : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {sentence}{' '}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
