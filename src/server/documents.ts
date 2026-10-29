'use server';

import fs from 'fs/promises';
import path from 'path';
import type { DocumentResult } from '~/types';

/** Reads a document prepared by preprocess/prepare-documents.mjs. */
export async function getDocument(id: number): Promise<DocumentResult> {
  if (!Number.isInteger(id)) {
    throw new Error('Document ID must be numeric');
  }

  const file = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    'data',
    'documents',
    `${id}.json`
  );

  return JSON.parse(await fs.readFile(file, 'utf8'));
}
