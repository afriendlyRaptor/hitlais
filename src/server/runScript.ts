'use server';

import { execFile } from 'child_process';
import path from 'path';

const PROJECT_ROOT = process.cwd();

// The venv is built into the Docker image (see Dockerfile).
const PYTHON_BIN = path.join(PROJECT_ROOT, 'venv', 'bin', 'python');

const TIMEOUT_MS = 15_000;

// Only scripts listed here can be run.
const ALLOWED_SCRIPTS: Record<string, string> = {
  analyze: 'scripts/analyze.py',
  compare: 'scripts/compare.py',
  getDocument: 'scripts/get_document.py',
  countToken: 'scripts/countToken.py',
};

// A batch (e.g. counting every sentence) must not start hundreds of Pythons at once.
const MAX_PARALLEL_SCRIPTS = 8;
let runningScripts = 0;
const waitingScripts: Array<() => void> = [];

async function acquireSlot() {
  if (runningScripts < MAX_PARALLEL_SCRIPTS) {
    runningScripts++;
    return;
  }

  // The slot is handed over by releaseSlot, so the counter stays unchanged.
  await new Promise<void>((resolve) => waitingScripts.push(resolve));
}

function releaseSlot() {
  const next = waitingScripts.shift();

  if (next) {
    next();
  } else {
    runningScripts--;
  }
}

function execScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      /*turbopackIgnore: true*/ PYTHON_BIN,
      [path.resolve(/*turbopackIgnore: true*/ PROJECT_ROOT, scriptPath), ...args],
      { timeout: TIMEOUT_MS, cwd: PROJECT_ROOT },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(err.killed ? 'script timed out' : stderr || err.message));
          return;
        }

        resolve(stdout);
      }
    );
  });
}

/** Runs one of the allowed Python scripts and returns its parsed output. */
export async function runScript<T = unknown>(
  scriptId: string,
  args: string[] = []
): Promise<{ result: T }> {
  const scriptPath = ALLOWED_SCRIPTS[scriptId];

  if (!scriptPath) {
    throw new Error(`unknown scriptId "${scriptId}"`);
  }

  await acquireSlot();

  try {
    const stdout = await execScript(scriptPath, Array.isArray(args) ? args : []);

    try {
      return { result: JSON.parse(stdout) };
    } catch {
      return { result: stdout.trim() as T };
    }
  } finally {
    releaseSlot();
  }
}

/** Runs the same script once per argument list, in one round trip. */
export async function runScriptBatch<T = unknown>(
  scriptId: string,
  argsList: string[][]
): Promise<{ result: T[] }> {
  const results = await Promise.all(
    argsList.map((args) => runScript<T>(scriptId, args))
  );

  return { result: results.map(({ result }) => result) };
}
