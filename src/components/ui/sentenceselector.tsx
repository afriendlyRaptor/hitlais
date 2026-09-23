import { useMemo, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import ScoreDisplayPanel from './ScoreDisplayPanel';
import { splitIntoParagraphs, flattenSentences } from './sentence-utils';
import { useSentenceSelection } from './useSentenceSelection';

type Props = {
  text: string;
  onSelectionChange: (sentences: SelectedSentence[]) => void;
  scoreHistory?: ScoreEntry[];
  scoreDisplayEnabled?: boolean;
  taskId: string;
};

export default function SentenceSelector({
  text,
  onSelectionChange,
  scoreHistory = [],
  scoreDisplayEnabled = true,
  taskId,
}: Props) {
  const paragraphs = useMemo(() => splitIntoParagraphs(text), [text]);

  const sentences = useMemo(() => flattenSentences(paragraphs), [paragraphs]);

  const {
    selected,
    selectedSentences,
    toggleSentence,
    clearAll,
    selectFirstTokens,
    selectRandomTokens,
  } = useSentenceSelection(sentences, taskId);

  useEffect(() => {
    onSelectionChange(selectedSentences);
  }, [selectedSentences, onSelectionChange]);

  return (
    <Box>
      <Box
        sx={{
          paddingBottom: '100px',
        }}
      >
        <Box>
          {paragraphs.map((paragraph, paragraphIndex) => (
            <Box
              key={paragraphIndex}
              sx={{
                mb: 2,
              }}
            >
              {paragraph.map((sentence) => {
                const index = sentences.indexOf(sentence);

                return (
                  <Box
                    component="span"
                    key={index}
                    onClick={() => toggleSentence(index)}
                    sx={{
                      backgroundColor: selected.includes(index)
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
      </Box>

      {/* Fixed sentence-selection controls */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 1100,

          display: 'flex',
          alignItems: 'center',

          p: 0.75,
          borderRadius: '999px',

          backgroundColor: 'background.paper',
          boxShadow: 4,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ButtonGroup
          variant="outlined"
          aria-label="Sentence selection actions"
          sx={{
            '& .MuiButton-root': {
              minWidth: 120,
              px: 2,
              py: 1.25,
              border: 'none',
              borderRadius: '999px',
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
            },
          }}
        >
          <Button
            logId="clear_all_sentences"
            onClick={clearAll}
            disabled={selected.length === 0}
          >
            Clear all
          </Button>

          <Button
            logId="select_first_tokens"
            onClick={selectFirstTokens}
            disabled={sentences.length === 0}
          >
            Select first
          </Button>

          <Button
            logId="select_random_tokens"
            onClick={selectRandomTokens}
            disabled={sentences.length === 0}
          >
            Select random
          </Button>
        </ButtonGroup>
      </Box>

      <ScoreDisplayPanel
        scoreHistory={scoreHistory}
        scoreDisplayEnabled={scoreDisplayEnabled}
      />
    </Box>
  );
}
