import { useEffect, useMemo } from 'react';
import { useSentenceSelection } from '~/hooks';
import { flattenSentences, splitIntoParagraphs } from '~/lib/sentence-utils';
import type { SelectedSentence } from '~/types';
import { SelectionControls } from './SelectionControls';
import { SentenceText } from './SentenceText';

type Props = {
  text: string;
  taskId: string;
  onSelectionChange: (sentences: SelectedSentence[]) => void;
};

/** Splits the text into sentences, owns the selection and reports it upwards. */
export function SentenceSelector({ text, taskId, onSelectionChange }: Props) {
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
    <>
      <SentenceText
        paragraphs={paragraphs}
        selected={selected}
        onToggle={toggleSentence}
      />

      <SelectionControls
        canClear={selected.length > 0}
        canSelect={sentences.length > 0}
        onClear={clearAll}
        onSelectFirst={selectFirstTokens}
        onSelectRandom={selectRandomTokens}
      />
    </>
  );
}
