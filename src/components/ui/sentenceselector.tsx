import { useEffect, useState, useMemo } from 'react';
import SelectedSentencesBox from './selectedsentencesbox';
import { logAction } from '~/services';
import { Box, Button, Typography } from '@mui/material';

type Props = {
  text: string;
  onSelectionChange: (sentences: string[]) => void;
};

const STORAGE_KEY = 'sentence-selection';

const selectedSentences = [...selected]
  .sort((a, b) => a - b)
  .map((index) => ({
    index,
    text: sentences[index],
  }));

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

  return (
    <Box>
      {/* Selector header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5">Select sentences for summary</Typography>

        <Button
          size="small"
          variant="outlined"
          onClick={clearAllSentences}
          disabled={selected.length === 0}
        >
          Clear all
        </Button>
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
