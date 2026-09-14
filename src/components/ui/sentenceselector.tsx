import { useEffect, useState } from 'react';
import SelectedSentencesBox from './selectedsentencesbox';
import { logAction } from '~/services';
import Box from '@mui/material/Box';

type Props = {
  text: string;
};

const STORAGE_KEY = 'sentence-selection';

export default function SentenceSelector({ text }: Props) {
  const sentences = text.split(/(?<=[.!?])\s+/);

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

  const selectedSentences = [...selected]
    .sort((a, b) => a - b)
    .map((index) => ({
      index,
      text: sentences[index],
    }));

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

  return (
    <div>
      {/* Text */}
      <div
        style={{
          paddingBottom: `${boxHeight + 20}px`,
        }}
      >
        <div>
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
        </div>
        <SelectedSentencesBox
          sentences={selectedSentences}
          height={boxHeight}
          setHeight={setBoxHeight}
          onRemove={removeSentence}
        />
      </div>
    </div>
  );
}
