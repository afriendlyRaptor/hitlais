'use server';

import fs from 'fs/promises';
import path from 'path';
import { DATASET } from '~/config';
import type { DocumentResult } from '~/types';

/** Reads a document prepared by preprocess/prepare-documents.mjs. */
export async function getDocument(id: string): Promise<DocumentResult> {
  if (!/^[\w-]+$/.test(id)) {
    throw new Error('Invalid document ID');
  }

  const file = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    'data',
    DATASET.folder,
    `${id}.json`
  );

  return JSON.parse(await fs.readFile(file, 'utf8'));
}
