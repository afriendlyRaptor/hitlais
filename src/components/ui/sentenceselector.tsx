import { useMemo, useEffect, useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import SelectedSentencesBox from './selectedsentencesbox';
import { splitIntoParagraphs, flattenSentences } from './sentence-utils';
import { useSentenceSelection } from './useSentenceSelection';

type Props = {
  text: string;
  onSelectionChange: (sentences: SelectedSentence[]) => void;
  scoreHistory?: ScoreEntry[];
  scoreDisplayEnabled?: boolean;
};

export default function SentenceSelector({
  text,
  onSelectionChange,
  scoreHistory = [],
  scoreDisplayEnabled = true,
  taskId,
}: Props) {
  const [boxHeight, setBoxHeight] = useState(120);

  const paragraphs = useMemo(() => splitIntoParagraphs(text), [text]);

  const sentences = useMemo(() => flattenSentences(paragraphs), [paragraphs]);

  const {
    selected,
    selectedSentences,
    toggleSentence,
    removeSentence,
    clearAll,
    selectFirstTokens,
    selectRandomTokens,
  } = useSentenceSelection(sentences, taskId);

  const handleSelectionChange = (newSelection: SelectedSentence[]) => {
    onSelectionChange(newSelection);
  };

  useEffect(() => {
    onSelectionChange(selectedSentences);
  }, [selectedSentences, onSelectionChange]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
          mb: 2,
        }}
      >
        <ButtonGroup variant="outlined" aria-label="Sentence selection actions">
          <Button
            size="sm"
            variant="outline"
            logId="clear_all_sentences"
            onClick={clearAll}
            disabled={selected.length === 0}
          >
            Clear all
          </Button>

          <Button
            size="sm"
            variant="outline"
            logId="select_first_tokens"
            onClick={selectFirstTokens}
            disabled={sentences.length === 0}
          >
            Select first
          </Button>

          <Button
            size="sm"
            variant="outline"
            logId="select_random_tokens"
            onClick={selectRandomTokens}
            disabled={sentences.length === 0}
          >
            Select random
          </Button>
        </ButtonGroup>
      </Box>

      <Box
        sx={{
          paddingBottom: `${boxHeight + 20}px`,
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

        <SelectedSentencesBox
          sentences={selectedSentences}
          height={boxHeight}
          setHeight={setBoxHeight}
          onRemove={removeSentence}
          scoreHistory={scoreHistory}
          scoreDisplayEnabled={scoreDisplayEnabled}
        />
      </Box>
    </Box>
  );
}
