import { useEffect, useState, useMemo } from 'react';
import seedrandom from 'seedrandom';
import SelectedSentencesBox from './selectedsentencesbox';
import { logAction } from '~/services';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

type Props = {
  text: string;
  onSelectionChange: (sentences: string[]) => void;
};

const STORAGE_KEY = 'sentence-selection';
const TOKEN_LIMIT = 1024;
const RANDOM_SELECTION_SEED = 12345;
const rng = seedrandom(RANDOM_SELECTION_SEED);

export default function SentenceSelector({ text, onSelectionChange }: Props) {
  const sentences = useMemo(() => text.split(/(?<=[.!?])\s+/), [text]);

  const [selected, setSelected] = useState<number[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  const selectedSentences = [...selected]
    .sort((a, b) => a - b)
    .map((index) => ({
      index,
      text: sentences[index],
    }));

  const [boxHeight, setBoxHeight] = useState(120);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    onSelectionChange(selectedSentences);
  }, [selected, sentences, onSelectionChange]);

  function handleClick(index: number) {
    const wasSelected = selected.includes(index);

    // logging sentences being clicked
    logAction('sentence_toggled', {
      index,
      text: sentences[index],
      selected: !wasSelected,
    });

    if (wasSelected) {
      setSelected(selected.filter((item) => item !== index));
    } else {
      setSelected([...selected, index]);
    }
  }

  function removeSentence(index: number) {
    logAction('sentence_removed', { index, text: sentences[index] });
    setSelected((prev) => prev.filter((item) => item !== index));
  }

  function clearAllSentences() {
    logAction('selected_sentences_cleared', {
      count: selected.length,
    });

    setSelected([]);
  }

  function selectFirstTokens() {
    let tokenCount = 0;
    const selectedIndexes: number[] = [];

    for (let index = 0; index < sentences.length; index++) {
      const sentence = sentences[index];

      // Approximate token count using whitespace-separated words.
      const sentenceTokens = sentence.trim().split(/\s+/).length;

      if (tokenCount + sentenceTokens > TOKEN_LIMIT) {
        break;
      }

      selectedIndexes.push(index);
      tokenCount += sentenceTokens;
    }

    logAction('first_tokens_selected', {
      token_count: tokenCount,
      sentence_count: selectedIndexes.length,
    });

    setSelected(selectedIndexes);
  }

  function selectRandomTokens() {
    // Start with every sentence index.
    const indexes = sentences.map((_, index) => index);

    // Fisher-Yates shuffle using the seeded RNG.
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }

    let tokenCount = 0;
    const selectedIndexes: number[] = [];

    // Walk through the shuffled sentences and add sentences
    for (const index of indexes) {
      const sentence = sentences[index];
      const sentenceTokens = sentence.trim().split(/\s+/).length;

      if (sentenceTokens > TOKEN_LIMIT) {
        continue;
      }

      if (tokenCount + sentenceTokens <= TOKEN_LIMIT) {
        selectedIndexes.push(index);
        tokenCount += sentenceTokens;
      }

      // We can stop once we've hit the limit exactly.
      if (tokenCount === TOKEN_LIMIT) {
        break;
      }
    }

    logAction('random__tokens_selected', {
      token_count: tokenCount,
      sentence_count: selectedIndexes.length,
      seed: RANDOM_SELECTION_SEED,
    });

    setSelected(selectedIndexes);
  }

  return (
    <Box>
      {/* Selector header */}
      
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
    mb: 2,
  }}
>
{/* <Typography variant="h5">Select sentences</Typography>*/}

  <ButtonGroup variant="outlined" aria-label="Sentence selection actions">
    <Button
      size="sm"
      variant="outline"
      logId="clear_all_sentences"
      onClick={clearAllSentences}
      disabled={selected.length === 0}
    >
      Clear all
    </Button>

    <Button
      size="sm"
      variant="outline"
      logId="select_first__tokens"
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
      {/* Text */}
      <Box
        sx={{
          paddingBottom: `${boxHeight + 20}px`,
        }}
      >
        <Box>
          {sentences.map((sentence, index) => (
            <Box
              component="span"
              key={index}
              onClick={() => handleClick(index)}
              sx={{
                backgroundColor: selected.includes(index)
                  ? 'secondary.main'
                  : 'transparent',
                cursor: 'pointer',
              }}
            >
              {sentence}{' '}
            </Box>
          ))}
        </Box>

        <SelectedSentencesBox
          sentences={selectedSentences}
          height={boxHeight}
          setHeight={setBoxHeight}
          onRemove={removeSentence}
        />
      </Box>
    </Box>
  );
}
