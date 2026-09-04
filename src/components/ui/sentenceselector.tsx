import { useState } from 'react';
import SelectedSentencesBox from './selectedsentencesbox';

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
    if (selected.includes(index)) {
      setSelected(selected.filter((item) => item !== index));
    } else {
      setSelected([...selected, index]);
    }
  }

  function removeSentence(index: number) {
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
