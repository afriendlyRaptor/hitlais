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

/** One sentence of a prepared document (see preprocess/prepare-documents.mjs). */
export interface DocumentSentence {
  /** Position in the document's flat sentence list. */
  index: number;
  /** Index of the paragraph the sentence belongs to. */
  paragraph: number;
  text: string;
  tokens: number;
}

/** A prepared document, as stored in data/documents/<id>.json. */
export interface DocumentResult {
  id: number;
  title: string | null;
  language: string | null;
  link: string | null;
  /** The whole unaltered text. */
  transcript: string;
  /** Reference summary. */
  summary: string;
  sentences: DocumentSentence[];
}
