import { useEffect, useMemo, useState } from 'react';
import seedrandom from 'seedrandom';
import { logAction } from '~/services';
import { countTokens } from './sentence-utils';

const STORAGE_KEY = 'sentence-selection';
const TOKEN_LIMIT = 100;
const RANDOM_SELECTION_SEED = 12345;

const rng = seedrandom(RANDOM_SELECTION_SEED);

export function useSentenceSelection(sentences: string[]) {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    setSelected((previous) =>
      previous.filter((index) => index >= 0 && index < sentences.length)
    );
  }, [sentences.length]);

  const selectedSentences = useMemo(
    () =>
      [...selected]
        .sort((a, b) => a - b)
        .map((index) => ({
          index,
          text: sentences[index],
        }))
        .filter((item) => item.text !== undefined),
    [selected, sentences]
  );

  function toggleSentence(index: number) {
    const wasSelected = selected.includes(index);

    logAction('sentence_toggled', {
      index,
      text: sentences[index],
      selected: !wasSelected,
    });

    setSelected((previous) =>
      wasSelected
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  }

  function removeSentence(index: number) {
    logAction('sentence_removed', {
      index,
      text: sentences[index],
    });

    setSelected((previous) => previous.filter((item) => item !== index));
  }

  function clearAll() {
    logAction('selected_sentences_cleared', {
      count: selected.length,
    });

    setSelected([]);
  }

  function selectFirstTokens() {
    let tokenCount = 0;
    const indexes: number[] = [];

    for (let index = 0; index < sentences.length; index++) {
      const tokens = countTokens(sentences[index]);

      if (tokenCount + tokens > TOKEN_LIMIT) {
        break;
      }

      indexes.push(index);
      tokenCount += tokens;
    }

    logAction('first_tokens_selected', {
      token_count: tokenCount,
      sentence_count: indexes.length,
    });

    setSelected(indexes);
  }

  function selectRandomTokens() {
    const indexes = sentences.map((_, index) => index);

    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));

      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }

    let tokenCount = 0;
    const selectedIndexes: number[] = [];

    for (const index of indexes) {
      const tokens = countTokens(sentences[index]);

      if (tokens > TOKEN_LIMIT) {
        continue;
      }

      if (tokenCount + tokens <= TOKEN_LIMIT) {
        selectedIndexes.push(index);
        tokenCount += tokens;
      }

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

  return {
    selected,
    selectedSentences,
    toggleSentence,
    removeSentence,
    clearAll,
    selectFirstTokens,
    selectRandomTokens,
  };
}
