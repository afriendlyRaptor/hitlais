/** A sentence picked by the participant (index into the flattened sentence list). */
export interface SelectedSentence {
  index: number;
  text: string;
}

/** One generated summary with the selection that produced it. */
export interface HistoryEntry {
  /** Creation time in ms; also the unique id. */
  id: number;
  score: number;
  summary: string;
  selected: number[];
}
