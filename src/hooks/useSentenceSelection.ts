import { useEffect, useMemo } from 'react';
import seedrandom from 'seedrandom';
import { RANDOM_SELECTION_SEED, TOKEN_LIMIT, storageKeys } from '~/config';
import { jsonArrayCodec } from '~/lib/storage';
import {
  pickFirstWithinLimit,
  pickRandomWithinLimit,
  sumTokens,
} from '~/lib/token-budget';
import { Alertify, logAction } from '~/services';
import type { SelectedSentence } from '~/types';
import { usePersistedState } from './usePersistedState';

const selectionCodec = jsonArrayCodec<number>();

// Shared by every hook instance, so repeated "select random" clicks walk one
// deterministic sequence.
// seedrandom is typed for string seeds; the number is passed unchanged so the
// sequence stays identical to the one used so far.
const rng = seedrandom(RANDOM_SELECTION_SEED as unknown as string);

/** `sentenceTokenCounts[i]` is the token count of `sentences[i]`. */
export function useSentenceSelection(
  sentences: string[],
  sentenceTokenCounts: number[],
  taskId: string
) {
  const [selected, setSelected] = usePersistedState(
    storageKeys.selection(taskId),
    selectionCodec
  );

  // Drop stored indexes that don't exist in the loaded document.
  useEffect(() => {
    if (sentences.length === 0) {
      return;
    }

    setSelected((previous) =>
      previous.filter((index) => index >= 0 && index < sentences.length)
    );
  }, [sentences.length, setSelected]);

  const selectedSentences = useMemo<SelectedSentence[]>(
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

    if (!wasSelected) {
      const currentTokenCount = sumTokens(selected, sentenceTokenCounts);

      if (currentTokenCount + sentenceTokenCounts[index] > TOKEN_LIMIT) {
        Alertify.error('Die maximale Textmenge wurde erreicht.');
        return;
      }
    }

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
      task_id: taskId,
      count: selected.length,
      text: selectedSentences,
    });

    setSelected([]);
  }

  function replaceSelection(indexes: number[]) {
    setSelected(indexes);
  }

  /** Selects sentences from the start of the text; returns the chosen indexes. */
  function selectFirstTokens() {
    const { indexes, tokenCount } = pickFirstWithinLimit(
      sentenceTokenCounts,
      TOKEN_LIMIT
    );

    logAction('first_tokens_selected', {
      token_count: tokenCount,
      sentence_count: indexes.length,
    });

    setSelected(indexes);

    return indexes;
  }

  function selectRandomTokens() {
    const { indexes, tokenCount } = pickRandomWithinLimit(
      sentenceTokenCounts,
      TOKEN_LIMIT,
      rng
    );

    logAction('random_tokens_selected', {
      token_count: tokenCount,
      sentence_count: indexes.length,
      seed: RANDOM_SELECTION_SEED,
    });

    setSelected(indexes);
  }

  return {
    selected,
    selectedSentences,
    toggleSentence,
    removeSentence,
    clearAll,
    replaceSelection,
    selectFirstTokens,
    selectRandomTokens,
  };
}
