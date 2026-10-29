import { createHash, timingSafeEqual } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { LOG_EXPORT_TOKEN_SHA256 } from '~/config/logExport';

export const dynamic = 'force-dynamic';

const LOG_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'logs');

// Same names writeLog creates: <userId>_<YYYY-MM-DD>.jsonl
const LOG_FILE = /^[a-zA-Z0-9_-]+_\d{4}-\d{2}-\d{2}\.jsonl$/;

/** The request must carry `Authorization: Bearer <token>` matching the stored hash. */
function isAuthorized(request: Request) {
  if (!LOG_EXPORT_TOKEN_SHA256) {
    return false;
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  const given = createHash('sha256').update(token).digest();
  const wanted = Buffer.from(LOG_EXPORT_TOKEN_SHA256, 'hex');

  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/**
 * GET /api/logs              -> log file names, one per line
 * GET /api/logs?file=<name>  -> content of that log file
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new Response('Not found', { status: 404 });
  }

  const file = new URL(request.url).searchParams.get('file');

  if (file === null) {
    const names = await fs.readdir(LOG_DIR).catch(() => []);

    return new Response(names.filter((name) => LOG_FILE.test(name)).join('\n'));
  }

  if (!LOG_FILE.test(file)) {
    return new Response('Invalid file name', { status: 400 });
  }

  try {
    return new Response(await fs.readFile(path.join(LOG_DIR, file), 'utf8'), {
      headers: { 'Content-Type': 'application/x-ndjson' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
