/** A sentence picked by the participant (index into the flattened sentence list). */
export interface SelectedSentence {
  index: number;
  text: string;
}

/** One point in the score history chart. */
export interface ScoreEntry {
  timestamp: number;
  score: number;
}
