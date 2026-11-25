type DatasetConfig = {
  /** Model name sent to the summary API. */
  model: string;
  /** Folder in data/ that holds the document json files. */
  folder: string;
  /** Document ids a participant may be assigned. */
  validIds: string[];
  /** Tasks that always get the same document. All other tasks draw a random one. */
  fixedIds: Record<string, string>;
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
    ].map(String),
    fixedIds: { taskA: '69198', taskB: '69828', taskC: '61082' },
  },
  gov_report: {
    model: 'gov_report',
    folder: 'gov_documents',
    validIds: [
      '93-792', '98-756', 'R42846', 'R43849', 'R44097', 'R44297', 'R44484',
      'R44486', 'R44583', 'R44758', 'R44873', 'RL34667', 'RS20607', 'RS20792',
      'RS22246', 'RS22785', 'RS22897',
      'R41799', 'RS22877', 'RS22923',
    ],
  fixedIds: { taskB: 'R41799', taskC: '98-756' },
  },
};

/** Picked with NEXT_PUBLIC_DATASET in .env (default: dodis). Needs a restart after a change. */
const datasetName = process.env.NEXT_PUBLIC_DATASET ?? 'dodis';

if (!(datasetName in DATASETS)) {
  throw new Error(`Unknown NEXT_PUBLIC_DATASET "${datasetName}"`);
}

export const DATASET = DATASETS[datasetName];
