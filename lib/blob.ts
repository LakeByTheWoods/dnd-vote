import { list, put } from '@vercel/blob';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import type { Poll, Vote } from '@/lib/types';

const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

let sqliteDb: DatabaseSync | null = null;

function getSqliteDb(): DatabaseSync {
  if (sqliteDb) {
    return sqliteDb;
  }

  const dbPath = path.join(process.cwd(), 'data.sqlite');
  const db = new DatabaseSync(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )
  `);

  sqliteDb = db;
  return db;
}

async function savePollToBlob(id: string, data: Poll) {
  return put(`polls/${id}.json`, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

function savePollToSqlite(id: string, data: Poll) {
  const db = getSqliteDb();
  db.prepare(`
    INSERT INTO polls (id, data)
    VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET data = excluded.data
  `).run(id, JSON.stringify(data));
}

async function loadPollFromBlob(id: string): Promise<Poll | null> {
  const result = await list({ prefix: `polls/${id}.json` });
  const blob = result.blobs.find((item) => item.pathname === `polls/${id}.json`);

  if (!blob) {
    return null;
  }

  const res = await fetch(blob.url);
  return (await res.json()) as Poll;
}

function loadPollFromSqlite(id: string): Poll | null {
  const db = getSqliteDb();
  const row = db.prepare('SELECT data FROM polls WHERE id = ?').get(id) as
    | { data: string }
    | undefined;

  if (!row) {
    return null;
  }

  return JSON.parse(row.data) as Poll;
}

export async function savePoll(id: string, data: Poll) {
  if (useBlobStorage) {
    return savePollToBlob(id, data);
  }

  savePollToSqlite(id, data);
  return { pathname: `polls/${id}.json` };
}

export async function loadPoll(id: string): Promise<Poll | null> {
  if (useBlobStorage) {
    return loadPollFromBlob(id);
  }

  return loadPollFromSqlite(id);
}

export async function saveVote(id: string, vote: Vote) {
  const poll = await loadPoll(id);

  if (!poll) {
    return null;
  }

  poll.votes.push(vote);
  await savePoll(id, poll);

  return poll;
}
