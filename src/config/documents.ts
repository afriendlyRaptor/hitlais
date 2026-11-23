type DatasetConfig = {
  /** Model name sent to the summary API. */
  model: string;
  /** Folder in data/ that holds the document json files. */
  folder: string;
  /** Document ids a participant may be assigned. */
  validIds: number[];
  /** Tasks that always get the same document. All other tasks draw a random one. */
  fixedIds: Record<string, number>;
};

const DATASETS: Record<string, DatasetConfig> = {
  dodis: {
    model: 'dodis',
    folder: 'documents',
    /* validIds: [61434, 64550, 62138], */
    validIds: [
      50508, 63487, 64974, 69187, 68792, 54716, 61409, 58863, 60727, 57584,
      64897, 67984, 61082, 64468, 65195, 69198, 69828, 64813, 64382, 68195,
      60393, 57794, 62136, 69602, 62450, 61327, 69300, 67953, 60931, 62292,
      59534, 62472,
    ],
    fixedIds: { taskA: 69198, taskB: 69828, taskC: 61082 },
  },
  gov_report: {
    model: 'gov_report',
    folder: 'documents_gov_report',
    validIds: [],
    fixedIds: {},
  },
};

/** Picked with NEXT_PUBLIC_DATASET in .env (default: dodis). Needs a restart after a change. */
const datasetName = process.env.NEXT_PUBLIC_DATASET ?? 'dodis';

if (!(datasetName in DATASETS)) {
  throw new Error(`Unknown NEXT_PUBLIC_DATASET "${datasetName}"`);
}

export const DATASET = DATASETS[datasetName];
