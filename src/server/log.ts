'use server';

import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve('logs');

/** Appends one log entry to the user's JSONL file (one file per user per day). */
export async function writeLog(entry: Record<string, unknown>) {
  // Validate the minimum required fields.
  if (
    entry.userId == null ||
    String(entry.userId).trim() === '' ||
    !entry.type ||
    entry.timestamp == null
  ) {
    throw new Error('userId, type and timestamp are required');
  }

  // Record when the server received the event.
  const logEntry = {
    ...entry,
    receivedAt: Date.now(),
  };

  const date = new Date().toISOString().slice(0, 10);
  const userId = String(entry.userId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filePath = path.join(LOG_DIR, `${userId}_${date}.jsonl`);

  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });

    // Append one complete JSON object per line.
    fs.appendFileSync(filePath, JSON.stringify(logEntry) + '\n', 'utf8');
  } catch (error) {
    console.error('Failed to write log:', error);
    throw new Error('Failed to write log');
  }
}
