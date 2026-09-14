import { useState } from 'react';
import SelectedSentencesBox from './selectedsentencesbox';
import { logAction } from '~/services';

type Props = {
  text: string;
};

export default function SentenceSelector({ text }: Props) {
  const sentences = text.split(/(?<=[.!?])\s+/);

  const [selected, setSelected] = useState<number[]>([]);
  const [boxHeight, setBoxHeight] = useState(120);

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
            <span
              key={index}
              onClick={() => handleClick(index)}
              style={{
                backgroundColor: selected.includes(index)
                  ? '#d3d3d3'
                  : 'transparent',
                cursor: 'pointer',
              }}
            >
              {sentence}{' '}
            </span>
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
