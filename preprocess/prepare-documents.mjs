// Prepares every document in VALID_DOCUMENT_IDS for the app.
// Run it from the project root, before building the Docker image:
//
//   node preprocess/prepare-documents.mjs
//
// Needs Node >= 22.18 and the Python venv + dataset the scripts use.
// Writes data/documents/<id>.json: the unaltered text, the reference summary
// and the text split into sentences, each with its index and token count.

import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { VALID_DOCUMENT_IDS } from '../src/config/documents.ts';

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'data', 'documents');
const PYTHON = process.env.PYTHON ?? path.join(ROOT, 'venv', 'bin', 'python');

// Token counts are requested one sentence at a time, a few at once.
const PARALLEL_TOKEN_COUNTS = 8;

/** Runs one of the existing scripts and returns its parsed JSON output. */
async function runScript(script, arg) {
  try {
    const { stdout } = await execFileAsync(
      PYTHON,
      [path.join(ROOT, 'scripts', script), arg],
      { maxBuffer: 64 * 1024 * 1024 }
    );

    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${script} failed: ${error.stdout || error.message}`);
  }
}

/** Text -> paragraphs -> sentences. */
function splitIntoParagraphs(text) {
  const segmenter = new Intl.Segmenter('de', { granularity: 'sentence' });

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      // Protect dates such as "25. Januar" from sentence splitting.
      const protectedText = paragraph.replace(
        /\b(\d{1,2})\.\s+(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b/gi,
        '$1§ $2'
      );

      return Array.from(segmenter.segment(protectedText))
        .map(({ segment }) => segment.replace(/§/g, '.').trim())
        .filter((sentence) => sentence.length > 0);
    });
}

/** Like Promise.all(items.map(fn)), but with at most `limit` calls running. */
async function mapWithLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));

  return results;
}

async function prepareDocument(id) {
  const source = await runScript('get_document.py', String(id));

  const flatSentences = splitIntoParagraphs(source.transcript).flatMap(
    (paragraph, paragraphIndex) =>
      paragraph.map((text) => ({ paragraph: paragraphIndex, text }))
  );

  const tokens = await mapWithLimit(
    flatSentences,
    PARALLEL_TOKEN_COUNTS,
    ({ text }) => runScript('countToken.py', text)
  );

  const sentences = flatSentences.map(({ paragraph, text }, index) => ({
    index,
    paragraph,
    text,
    tokens: tokens[index],
  }));

  await writeFile(
    path.join(OUTPUT_DIR, `${id}.json`),
    JSON.stringify({ ...source, sentences }, null, 2)
  );

  console.log(`${id}: ${sentences.length} sentences`);
}

await mkdir(OUTPUT_DIR, { recursive: true });

for (const id of VALID_DOCUMENT_IDS) {
  await prepareDocument(id);
}
